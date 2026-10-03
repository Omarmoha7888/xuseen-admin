import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  AlertCircle,
  PlusCircle,
  History,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit,
  Download,
  Users,
  Briefcase,
  Calendar,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Order, Payment } from '../../types';

interface ARReportViewProps {
  onSelectOrder: (orderId: string) => void;
}

export const ARReportView: React.FC<ARReportViewProps> = ({ onSelectOrder }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [arData, setArData] = useState<{ summary: any; orders: any[] }>({
    summary: {},
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Unpaid' | 'Partially Paid' | 'Paid' | 'Recent' | 'Older'>('All');

  // Modals
  const [selectedOrderForPay, setSelectedOrderForPay] = useState<any | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Cash');
  const [payNote, setPayNote] = useState('');
  const [payError, setPayError] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);

  // Financial Adjustment Modal (Super Admin only)
  const [selectedOrderForAdj, setSelectedOrderForAdj] = useState<any | null>(null);
  const [adjReason, setAdjReason] = useState('');
  const [adjAmount, setAdjAmount] = useState('');
  const [adjLoading, setAdjLoading] = useState(false);

  useEffect(() => {
    loadAR();
  }, []);

  const loadAR = async () => {
    setLoading(true);
    try {
      const res = await api.getARReport();
      const rawOrders = Array.isArray(res?.orders)
        ? res.orders
        : Array.isArray((res as any)?.debtOrders)
        ? (res as any).debtOrders
        : [];

      const rawSummary = res?.summary || {
        total_debt_customers: new Set(rawOrders.map((o: any) => o.customer_id || o.customer_name)).size,
        total_debt_orders: rawOrders.length,
        total_amount_owed: rawOrders.reduce((sum: number, o: any) => sum + (Number(o.total_price) || 0), 0),
        total_amount_paid: rawOrders.reduce((sum: number, o: any) => sum + (Number(o.total_paid || o.amount_paid) || 0), 0),
        total_outstanding_debt: rawOrders.reduce((sum: number, o: any) => sum + (Number(o.outstanding_debt) || 0), 0),
      };

      setArData({
        summary: rawSummary,
        orders: rawOrders,
      });
    } catch (err) {
      console.warn('Notice loading AR report:', err);
      setArData({ summary: {}, orders: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForPay) return;
    const amount = Number(payAmount);
    if (!amount || amount <= 0) {
      setPayError('Please enter a valid payment amount.');
      return;
    }
    if (amount > selectedOrderForPay.outstanding_debt) {
      setPayError('Payment cannot be greater than the outstanding balance.');
      return;
    }

    setPayLoading(true);
    setPayError(null);
    try {
      await api.addPayment(selectedOrderForPay.internal_id, {
        amount,
        payment_method: payMethod,
        payment_note: payNote,
      });
      setSelectedOrderForPay(null);
      setPayAmount('');
      setPayNote('');
      await loadAR();
    } catch (err: any) {
      setPayError(err.message || 'Failed to record payment.');
    } finally {
      setPayLoading(false);
    }
  };

  const handleFinancialAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForAdj) return;
    if (!adjReason.trim()) return;

    setAdjLoading(true);
    try {
      await api.adjustFinancial(selectedOrderForAdj.internal_id, {
        reason: adjReason,
        adjustment_amount: Number(adjAmount) || 0,
      });
      showToast('Financial adjustment applied and audited successfully.', 'success');
      setSelectedOrderForAdj(null);
      setAdjReason('');
      setAdjAmount('');
      await loadAR();
    } catch (err: any) {
      showToast(err.message || 'Failed to adjust financial record.', 'error');
    } finally {
      setAdjLoading(false);
    }
  };

  const filteredOrders = (arData.orders || []).filter((ord) => {
    if (!ord) return false;
    const orderId = String(ord.order_id || ord.order_number || '');
    const custName = String(ord.customer_name || ord.customer?.full_name || '');
    const custPhone = String(ord.customer_phone || ord.customer?.phone || '');
    const createdBy = String(ord.created_by || '');
    const assignedEmp = String(ord.assigned_employee || ord.assigned_staff || '');
    const svcType = String(ord.service_type || '');
    const debtStatus = ord.debt_status || (Number(ord.outstanding_debt || 0) > 0 ? (Number(ord.total_paid || ord.amount_paid || 0) > 0 ? 'Partially Paid' : 'Unpaid') : 'Paid');
    const daysOutstanding = Number(ord.days_outstanding ?? 0);

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        orderId.toLowerCase().includes(q) ||
        custName.toLowerCase().includes(q) ||
        custPhone.includes(q) ||
        createdBy.toLowerCase().includes(q) ||
        assignedEmp.toLowerCase().includes(q) ||
        svcType.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Quick filter
    if (statusFilter === 'Unpaid') return debtStatus === 'Unpaid';
    if (statusFilter === 'Partially Paid') return debtStatus === 'Partially Paid';
    if (statusFilter === 'Paid') return debtStatus === 'Paid';
    if (statusFilter === 'Recent') return daysOutstanding <= 14;
    if (statusFilter === 'Older') return daysOutstanding > 14;

    return true;
  });

  const summary = arData.summary || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title & Quick Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-amber-400" />
              <span>{t('ar_report_title')}</span>
            </h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 font-bold">
              Debt Control
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Accounts receivable tracking for Balcad Travel Agency. All orders with debt automatically appear here.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards - Clickable Interactive Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('All')}
          className="bg-[#111726] border border-slate-800 hover:border-amber-500/40 rounded-xl p-3 shadow text-center cursor-pointer active:scale-95 duration-75 select-none transition"
        >
          <span className="text-[10px] text-slate-400 font-semibold block">{t('total_debt_customers')}</span>
          <span className="text-base font-bold text-white mt-1 block">{summary.total_debt_customers || 0}</span>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('All')}
          className="bg-[#111726] border border-slate-800 hover:border-amber-500/40 rounded-xl p-3 shadow text-center cursor-pointer active:scale-95 duration-75 select-none transition"
        >
          <span className="text-[10px] text-slate-400 font-semibold block">{t('total_debt_orders')}</span>
          <span className="text-base font-bold text-white mt-1 block">{summary.total_debt_orders || 0}</span>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('All')}
          className="bg-[#111726] border border-slate-800 hover:border-amber-500/40 rounded-xl p-3 shadow text-center cursor-pointer active:scale-95 duration-75 select-none transition"
        >
          <span className="text-[10px] text-slate-400 font-semibold block">{t('total_amount_owed')}</span>
          <span className="text-base font-mono font-bold text-slate-200 mt-1 block">
            ${(summary.total_amount_owed || 0).toLocaleString()}
          </span>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('Paid')}
          className="bg-[#111726] border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3 shadow text-center cursor-pointer active:scale-95 duration-75 select-none transition"
        >
          <span className="text-[10px] text-slate-400 font-semibold block">{t('total_amount_paid')}</span>
          <span className="text-base font-mono font-bold text-emerald-400 mt-1 block">
            ${(summary.total_amount_paid || 0).toLocaleString()}
          </span>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('All')}
          className="bg-[#161F33] border border-amber-500/40 hover:border-amber-400 rounded-xl p-3 shadow text-center cursor-pointer active:scale-95 duration-75 select-none transition"
        >
          <span className="text-[10px] text-amber-300 font-bold block">{t('total_outstanding_debt')}</span>
          <span className="text-base font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-100 mt-1 block">
            ${(summary.total_outstanding_debt || 0).toLocaleString()}
          </span>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('Unpaid')}
          className="bg-[#111726] border border-slate-800 hover:border-red-500/40 rounded-xl p-3 shadow text-center cursor-pointer active:scale-95 duration-75 select-none transition"
        >
          <span className="text-[10px] text-red-400 font-semibold block">Unpaid Orders</span>
          <span className="text-base font-bold text-red-400 mt-1 block">{summary.unpaid_orders || 0}</span>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('Partially Paid')}
          className="bg-[#111726] border border-slate-800 hover:border-amber-500/40 rounded-xl p-3 shadow text-center cursor-pointer active:scale-95 duration-75 select-none transition"
        >
          <span className="text-[10px] text-amber-400 font-semibold block">Partially Paid</span>
          <span className="text-base font-bold text-amber-400 mt-1 block">{summary.partially_paid_orders || 0}</span>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('Paid')}
          className="bg-[#111726] border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3 shadow text-center cursor-pointer active:scale-95 duration-75 select-none transition"
        >
          <span className="text-[10px] text-emerald-400 font-semibold block">Fully Paid</span>
          <span className="text-base font-bold text-emerald-400 mt-1 block">{summary.fully_paid_orders || 0}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold mr-1 text-[11px] uppercase tracking-wider">
              {t('quick_filters')}:
            </span>
            {[
              { id: 'All', label: 'All Debt' },
              { id: 'Unpaid', label: 'Unpaid' },
              { id: 'Partially Paid', label: 'Partially Paid' },
              { id: 'Paid', label: 'Paid' },
              { id: 'Recent', label: '< 14 Days' },
              { id: 'Older', label: '> 14 Days' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  statusFilter === f.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by Order, Client, Phone..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* AR Main Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C111C] text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="py-3 px-3.5">{t('order_id')}</th>
                <th className="py-3 px-3.5">{t('customer')}</th>
                <th className="py-3 px-3.5">{t('phone')}</th>
                <th className="py-3 px-3.5">{t('service')}</th>
                <th className="py-3 px-3.5">{t('total_price')}</th>
                <th className="py-3 px-3.5">{t('amount_paid')}</th>
                <th className="py-3 px-3.5">{t('outstanding_balance')}</th>
                <th className="py-3 px-3.5">Debt Status</th>
                <th className="py-3 px-3.5">{t('created_by')}</th>
                <th className="py-3 px-3.5">{t('assigned_to')}</th>
                <th className="py-3 px-3.5">{t('days_outstanding')}</th>
                <th className="py-3 px-3.5 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    No debt orders found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const internalId = ord.internal_id || ord.id || ord.order_number;
                  const orderId = ord.order_id || ord.order_number || ord.id;
                  const custName = ord.customer_name || ord.customer?.full_name || 'N/A';
                  const custPhone = ord.customer_phone || ord.customer?.phone || 'N/A';
                  const svc = ord.service_type || 'Travel Service';
                  const totalPrice = Number(ord.total_price || 0);
                  const totalPaid = Number(ord.total_paid ?? ord.amount_paid ?? 0);
                  const debt = Number(ord.outstanding_debt ?? Math.max(0, totalPrice - totalPaid));
                  const debtStatus = ord.debt_status || (debt === 0 ? 'Paid' : totalPaid > 0 ? 'Partially Paid' : 'Unpaid');
                  const createdBy = ord.created_by || 'Staff';
                  const assignedEmp = ord.assigned_employee || ord.assigned_staff || 'Unassigned';
                  const daysOut = Number(ord.days_outstanding ?? 0);

                  return (
                    <tr key={internalId} className="hover:bg-slate-800/40 transition">
                      <td
                        onClick={() => onSelectOrder(internalId)}
                        className="py-3 px-3.5 font-mono font-bold text-amber-300 cursor-pointer hover:underline"
                      >
                        {orderId}
                      </td>
                      <td className="py-3 px-3.5 font-medium text-white">{custName}</td>
                      <td className="py-3 px-3.5 font-mono text-slate-400">{custPhone}</td>
                      <td className="py-3 px-3.5 text-slate-400">{svc}</td>
                      <td className="py-3 px-3.5 font-mono font-bold text-white">
                        ${totalPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-emerald-400 font-semibold">
                        ${totalPaid.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 font-mono font-extrabold text-red-400">
                        ${debt.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            debtStatus === 'Paid'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : debtStatus === 'Partially Paid'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : 'bg-red-500/15 text-red-400 border-red-500/30'
                          }`}
                        >
                          {debtStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-mono text-slate-400">{createdBy}</td>
                      <td className="py-3 px-3.5 font-mono text-slate-300">{assignedEmp}</td>
                      <td className="py-3 px-3.5 font-mono text-slate-400">{daysOut} days</td>
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectOrder(internalId)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition"
                          >
                            {t('view')}
                          </button>

                          {debt > 0 && (
                            <button
                              onClick={() => {
                                setSelectedOrderForPay({
                                  ...ord,
                                  internal_id: internalId,
                                  order_id: orderId,
                                  customer_name: custName,
                                  total_price: totalPrice,
                                  total_paid: totalPaid,
                                  outstanding_debt: debt,
                                });
                                setPayAmount(debt.toString());
                                setPayError(null);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition flex items-center gap-1"
                            >
                              <PlusCircle className="w-3 h-3" />
                              <span>{t('add_payment')}</span>
                            </button>
                          )}

                          {user?.role === 'super_admin' && (
                            <button
                              onClick={() => {
                                setSelectedOrderForAdj({
                                  ...ord,
                                  internal_id: internalId,
                                  order_id: orderId,
                                });
                                setAdjAmount('0');
                                setAdjReason('');
                              }}
                              title="Super Admin Financial Adjustment"
                              className="p-1 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {selectedOrderForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121826] border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Record Debt Payment
              </h3>
              <button
                onClick={() => setSelectedOrderForPay(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Number:</span>
                <span className="font-mono font-bold text-amber-300">{selectedOrderForPay.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="font-medium text-white">{selectedOrderForPay.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Price:</span>
                <span className="font-mono text-slate-300">${selectedOrderForPay.total_price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Already Paid:</span>
                <span className="font-mono text-emerald-400">${selectedOrderForPay.total_paid}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-slate-800 pt-1.5 mt-1">
                <span className="text-amber-400">Remaining Debt:</span>
                <span className="font-mono text-red-400">${selectedOrderForPay.outstanding_debt}</span>
              </div>
            </div>

            {payError && (
              <div className="mt-3 p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg">
                {payError}
              </div>
            )}

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Amount ($ USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  max={selectedOrderForPay.outstanding_debt}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Method *
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Cash">Cash (Counter)</option>
                  <option value="Bank Transfer">Bank Transfer (Premier Bank, IBS, Dahabshiil)</option>
                  <option value="EVC Plus">EVC Plus (Hormuud)</option>
                  <option value="Zaad">Zaad (Telesom)</option>
                  <option value="Sahal">Sahal (Golis)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Reference / Note
                </label>
                <input
                  type="text"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  placeholder="e.g. Receipt #4492, EVC TXN ID"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForPay(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={payLoading}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg transition"
                >
                  {payLoading ? 'Recording...' : t('save_payment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Financial Adjustment Modal (Super Admin Only) */}
      {selectedOrderForAdj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121826] border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Super Admin Financial Adjustment
              </h3>
              <button
                onClick={() => setSelectedOrderForAdj(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Any adjustment is strictly logged into the financial audit history with your username (
              <span className="font-mono text-amber-300">{user?.username}</span>).
            </p>

            <form onSubmit={handleFinancialAdjustment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reason for Adjustment *
                </label>
                <input
                  type="text"
                  required
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  placeholder="e.g. Authorized discount, fee waiver, price correction"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adjustment Amount ($ USD) (+/- to total price)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(e.target.value)}
                  placeholder="e.g. -50 to reduce total or +50 to increase"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForAdj(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={adjLoading}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg transition"
                >
                  {adjLoading ? 'Saving...' : 'Apply Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
