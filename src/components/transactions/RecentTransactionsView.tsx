import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Search,
  Filter,
  DollarSign,
  Calendar,
  User,
  ArrowUpDown,
  Download,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Transaction, TransactionType } from '../../types';

export const RecentTransactionsView: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  useEffect(() => {
    loadTransactions();
  }, [typeFilter]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (typeFilter !== 'All') params.type = typeFilter;
      if (search) params.search = search;

      const data = await api.getTransactions(params);
      setTransactions(data);
    } catch (err) {
      console.warn('Transactions notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Order ID',
      'Customer',
      'Transaction Type',
      'Prev Balance',
      'Payment Amount',
      'New Balance',
      'Currency',
      'Changed By',
      'Timestamp',
      'Notes',
    ];
    const rows = transactions.map((t) => [
      t.id,
      t.order_id,
      `"${t.customer_name}"`,
      t.transaction_type,
      t.previous_balance,
      t.payment_amount,
      t.new_balance,
      t.currency,
      t.changed_by,
      t.created_at,
      `"${t.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `balcad_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Transactions exported to CSV successfully.', 'success');
  };

  const getBadgeStyle = (type: TransactionType) => {
    switch (type) {
      case 'Payment Received':
      case 'Debt Fully Paid':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold';
      case 'Partial Payment':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Debt Updated':
        return 'bg-red-500/15 text-red-300 border-red-500/30 font-bold';
      case 'Price Updated':
      case 'Financial Adjustment':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Order Created':
      default:
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    }
  };

  const transactionTypes = [
    'All',
    'Payment Received',
    'Partial Payment',
    'Debt Updated',
    'Debt Fully Paid',
    'Order Created',
    'Price Updated',
    'Financial Adjustment',
  ];

  const filtered = transactions.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.order_id.toLowerCase().includes(q) ||
      t.customer_name.toLowerCase().includes(q) ||
      t.changed_by.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Receipt className="w-6 h-6 text-amber-400" />
              <span>{t('recent_transactions')}</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Immutable Audit
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete financial audit trail of all orders, payments, debt updates, and financial adjustments.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-xs transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV / Excel</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        {/* Quick Type Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {transactionTypes.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                typeFilter === type
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Transaction ID (TRX-...), Order ID, Customer name, or Changed By..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C111C] text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="py-3 px-3.5">Transaction ID</th>
                <th className="py-3 px-3.5">{t('order_id')}</th>
                <th className="py-3 px-3.5">{t('customer')}</th>
                <th className="py-3 px-3.5">{t('type')}</th>
                <th className="py-3 px-3.5">Prev Balance</th>
                <th className="py-3 px-3.5">Payment</th>
                <th className="py-3 px-3.5">New Balance</th>
                <th className="py-3 px-3.5">Changed By</th>
                <th className="py-3 px-3.5">{t('date')}</th>
                <th className="py-3 px-3.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No financial transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-400">{trx.id}</td>
                    <td className="py-3 px-3.5 font-mono font-bold text-amber-300">
                      {trx.order_id}
                    </td>
                    <td className="py-3 px-3.5 font-medium text-white">{trx.customer_name}</td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] border ${getBadgeStyle(
                          trx.transaction_type
                        )}`}
                      >
                        {trx.transaction_type}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-mono text-slate-400">
                      ${trx.previous_balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-emerald-400">
                      ${trx.payment_amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-white">
                      ${trx.new_balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-amber-300">
                      Changed by: @{trx.changed_by}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-slate-500 text-[11px]">
                      {new Date(trx.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3.5 text-slate-400 truncate max-w-[200px]" title={trx.notes}>
                      {trx.notes || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
