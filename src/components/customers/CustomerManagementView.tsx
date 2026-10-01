import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  PlusCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  DollarSign,
  Briefcase,
  AlertCircle,
  CheckCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Customer } from '../../types';

interface CustomerManagementViewProps {
  onSelectOrder: (orderId: string) => void;
  onNewOrderForCustomer?: (customer: Customer) => void;
}

export const CustomerManagementView: React.FC<CustomerManagementViewProps> = ({
  onSelectOrder,
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Selected Customer Modal / Profile
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  const [custOrders, setCustOrders] = useState<any[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);

  // Add Customer Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Somalia');
  const [city, setCity] = useState('Mogadishu');
  const [notes, setNotes] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.warn('Customer load notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProfile = async (cust: Customer) => {
    setSelectedCust(cust);
    setProfileLoading(true);
    try {
      const data = await api.getCustomer(cust.id);
      setCustOrders(data.orders || []);
    } catch (err) {
      console.warn('Customer orders load notice:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setAddLoading(true);
    try {
      await api.createCustomer({
        full_name: fullName,
        phone,
        email,
        country,
        city,
        notes,
      });
      showToast(`Customer "${fullName}" added successfully!`, 'success');
      setShowAddModal(false);
      setFullName('');
      setPhone('');
      setEmail('');
      setNotes('');
      await loadCustomers();
    } catch (err: any) {
      showToast(err.message || 'Failed to create customer', 'error');
    } finally {
      setAddLoading(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>{t('customers')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered customer database. Note: Customer service inquiries come through the public website to{' '}
            <span className="font-mono text-amber-300">balcadtravel@gmail.com</span> and are managed internally.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-3.5 shadow">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, phone number, email, or city..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C111C] text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="py-3 px-3.5">Customer Name</th>
                <th className="py-3 px-3.5">{t('phone')}</th>
                <th className="py-3 px-3.5">{t('email')}</th>
                <th className="py-3 px-3.5">Location</th>
                <th className="py-3 px-3.5">Orders</th>
                <th className="py-3 px-3.5">{t('outstanding_balance')}</th>
                <th className="py-3 px-3.5">Member Since</th>
                <th className="py-3 px-3.5 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No customers found matching search query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-800/40 transition">
                    <td
                      onClick={() => handleOpenProfile(cust)}
                      className="py-3 px-3.5 font-bold text-white cursor-pointer hover:text-amber-300"
                    >
                      {cust.full_name}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-slate-300">{cust.phone}</td>
                    <td className="py-3 px-3.5 text-slate-400">{cust.email || '-'}</td>
                    <td className="py-3 px-3.5 text-slate-300">
                      {cust.city}, {cust.country}
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-amber-300">
                      {cust.orders_count || 1}
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold">
                      {(cust.total_debt || 0) > 0 ? (
                        <span className="text-red-400">${cust.total_debt?.toLocaleString()}</span>
                      ) : (
                        <span className="text-emerald-400">$0</span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-slate-500 text-[11px]">
                      {cust.created_at.split('T')[0]}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        onClick={() => handleOpenProfile(cust)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[11px] font-semibold transition"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Customer Profile View */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121826] border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative text-white max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-sm">
                  {selectedCust.full_name[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedCust.full_name}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedCust.phone} • {selectedCust.city}, {selectedCust.country}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedCust(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Total Orders</span>
                  <span className="text-base font-bold text-white mt-1 block">
                    {custOrders.length || selectedCust.orders_count || 1}
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Outstanding Debt</span>
                  <span className="text-base font-mono font-bold text-red-400 mt-1 block">
                    ${(selectedCust.total_debt || 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Email</span>
                  <span className="text-slate-300 mt-1 block truncate">{selectedCust.email || 'None'}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Registered</span>
                  <span className="text-slate-300 mt-1 block font-mono">{selectedCust.created_at.split('T')[0]}</span>
                </div>
              </div>

              {selectedCust.notes && (
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Customer Preferences</span>
                  <p className="text-slate-300 mt-0.5">{selectedCust.notes}</p>
                </div>
              )}

              {/* Order history */}
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Order & Booking History
                </h4>
                {profileLoading ? (
                  <div className="py-6 text-center text-slate-500">Loading order history...</div>
                ) : custOrders.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 bg-slate-900/40 rounded-xl">
                    No active orders linked.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {custOrders.map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => {
                          setSelectedCust(null);
                          onSelectOrder(ord.id);
                        }}
                        className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-amber-500/40 cursor-pointer transition"
                      >
                        <div>
                          <span className="font-mono font-bold text-amber-300">{ord.order_number}</span>
                          <span className="text-slate-300 ml-2 font-medium">{ord.service_type}</span>
                          <span className="text-[10px] text-slate-500 font-mono ml-2">
                            {ord.created_at.split('T')[0]}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white">
                            ${ord.total_price.toLocaleString()}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedCust(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Customer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121826] border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Add Customer Profile
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sahra Osman Duale"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 615667788"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sahra@gmail.com"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Customer Notes / Preferences</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Frequent flyer, family travel"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  {addLoading ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
