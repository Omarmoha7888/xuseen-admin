import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Clock,
  Settings,
  Calendar,
  CheckCircle2,
  CheckCheck,
  XCircle,
  AlertCircle,
  DollarSign,
  UserPlus,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plane,
  FileCheck,
  Hotel,
  Luggage,
  Car,
  Bell,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Order, Transaction, DashboardMetrics } from '../../types';

interface DashboardViewProps {
  onNavigateTab: (tab: string, filter?: string, serviceFilter?: string) => void;
  onSelectOrder: (orderId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onSelectOrder,
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [m, ords, trxs] = await Promise.all([
        api.getDashboardMetrics(),
        api.getOrders(),
        api.getTransactions(),
      ]);
      setMetrics(m);
      setRecentOrders(ords.slice(0, 5));
      setRecentTransactions(trxs.slice(0, 5));
    } catch (err) {
      console.warn('Could not load dashboard data at this time:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Completed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Pending':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Debt':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Rejected':
        return 'bg-red-600/20 text-red-400 border-red-600/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case 'Payment Received':
      case 'Debt Fully Paid':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Partial Payment':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Debt Updated':
        return 'bg-red-500/15 text-red-300 border-red-500/30';
      case 'Price Updated':
      case 'Financial Adjustment':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-[#0C1220] via-[#131B30] to-[#0A0E18] p-6 md:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-2/5 overflow-hidden pointer-events-none opacity-40 md:opacity-75">
          <img
            src="/src/assets/images/dashboard_flight_banner_1790674741043.jpg"
            alt="Balcad Flight"
            className="w-full h-full object-cover object-right mix-blend-screen"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C1220] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
            <Plane className="w-3.5 h-3.5" />
            <span>Balcad Travel Agency • Admin CRM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {t('welcome_back')},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300">
              {user?.profile?.full_name || user?.username}
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 mt-2 leading-relaxed">
            {t('dashboard_subtitle')}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('new_order')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition active:scale-95 duration-75 flex items-center gap-2 cursor-pointer"
            >
              <span>+ {t('new_order')}</span>
            </button>
            <button
              onClick={() => onNavigateTab('ar_report')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 font-medium text-xs sm:text-sm border border-amber-500/20 transition active:scale-95 duration-75 flex items-center gap-2 cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>{t('ar_report')}</span>
            </button>
            <button
              onClick={() => onNavigateTab('orders')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-200 font-medium text-xs sm:text-sm border border-slate-700/60 transition active:scale-95 duration-75 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-slate-400" />
              <span>{t('orders')}</span>
            </button>
          </div>
        </div>

        <div className="absolute top-6 right-6 hidden md:block">
          <span className="font-serif italic text-2xl font-bold text-amber-300/40 select-none tracking-wide">
            Explore The World
          </span>
        </div>
      </div>

      {/* 2. KPI Cards Grid - All 12 Cards are Fully Interactive & Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. New Requests */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('orders', 'New')}
          className="bg-[#111726] border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/80 rounded-2xl p-4 transition-all duration-100 shadow-md group cursor-pointer active:scale-95 select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
              <Inbox className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 12%
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium group-hover:text-blue-300 transition-colors">
            {t('new_requests')}
          </span>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {metrics ? metrics.new_requests : 8}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Click to view</span>
        </div>

        {/* 2. Pending Orders */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('orders', 'Pending')}
          className="bg-[#111726] border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-900/80 rounded-2xl p-4 transition-all duration-100 shadow-md group cursor-pointer active:scale-95 select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 8%
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium group-hover:text-amber-300 transition-colors">
            {t('pending_orders')}
          </span>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {metrics ? metrics.pending_orders : 5}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Click to view</span>
        </div>

        {/* 3. In Progress */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('orders', 'In Progress')}
          className="bg-[#111726] border border-slate-800/80 hover:border-purple-500/50 hover:bg-slate-900/80 rounded-2xl p-4 transition-all duration-100 shadow-md group cursor-pointer active:scale-95 select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition">
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 15%
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium group-hover:text-purple-300 transition-colors">
            {t('in_progress')}
          </span>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {metrics ? metrics.in_progress_orders : 7}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Click to view</span>
        </div>

        {/* 4. Available Orders */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('orders', 'Available')}
          className="bg-[#111726] border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900/80 rounded-2xl p-4 transition-all duration-100 shadow-md group cursor-pointer active:scale-95 select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 6%
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium group-hover:text-indigo-300 transition-colors">
            {t('available_orders')}
          </span>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {metrics ? metrics.available_orders : 3}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Click to view</span>
        </div>

        {/* 5. Confirmed Orders */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('orders', 'Confirmed')}
          className="bg-[#111726] border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900/80 rounded-2xl p-4 transition-all duration-100 shadow-md group cursor-pointer active:scale-95 select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 20%
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium group-hover:text-emerald-300 transition-colors">
            {t('confirmed_orders')}
          </span>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {metrics ? metrics.confirmed_orders : 12}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Click to view</span>
        </div>

        {/* 6. Completed Orders */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('orders', 'Completed')}
          className="bg-[#111726] border border-slate-800/80 hover:border-teal-500/50 hover:bg-slate-900/80 rounded-2xl p-4 transition-all duration-100 shadow-md group cursor-pointer active:scale-95 select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300 group-hover:scale-105 transition">
              <CheckCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 10%
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium group-hover:text-teal-300 transition-colors">
            {t('completed_orders')}
          </span>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {metrics ? metrics.completed_orders : 18}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Click to view</span>
        </div>

        {/* 7. Rejected Orders */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('orders', 'Rejected')}
          className="bg-[#111726] border border-slate-800/80 hover:border-red-500/50 hover:bg-slate-900/80 rounded-2xl p-4 transition-all duration-100 shadow-md group cursor-pointer active:scale-95 select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-105 transition">
              <XCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-red-400 font-semibold flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" /> 33%
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium group-hover:text-red-300 transition-colors">
            {t('rejected_orders')}
          </span>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {metrics ? metrics.rejected_orders : 2}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Click to view</span>
        </div>

        {/* 8. Debt Orders */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('ar_report')}
          className="bg-[#111726] border border-amber-500/40 hover:border-amber-400 hover:bg-slate-900/80 rounded-2xl p-4 transition-all duration-100 shadow-md cursor-pointer active:scale-95 select-none group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 25%
            </span>
          </div>
          <span className="text-xs text-amber-300 font-medium group-hover:text-amber-200 transition-colors">
            {t('debt_orders')}
          </span>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {metrics ? metrics.debt_orders : 4}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Open AR Report</span>
        </div>

        {/* 9. Total Outstanding Debt ($2,850) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('ar_report')}
          className="bg-gradient-to-br from-[#161F33] to-[#101626] border border-amber-500/50 hover:border-amber-400 hover:from-[#1b253d] rounded-2xl p-4 transition-all duration-100 shadow-lg cursor-pointer active:scale-95 select-none group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 18%
            </span>
          </div>
          <span className="text-xs text-amber-300 font-bold">{t('total_outstanding_debt')}</span>
          <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 mt-0.5 font-mono">
            ${metrics ? metrics.total_outstanding_debt.toLocaleString() : '2,850'}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Open AR Report</span>
        </div>

        {/* 10. Today's Requests */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('orders', 'New')}
          className="bg-[#111726] border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/80 rounded-2xl p-4 transition-all duration-100 shadow-md group cursor-pointer active:scale-95 select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 50%
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium group-hover:text-cyan-300 transition-colors">
            {t('todays_requests')}
          </span>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {metrics ? metrics.todays_requests : 6}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Click to view</span>
        </div>

        {/* 11. Today's Orders */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('orders', 'All')}
          className="bg-[#111726] border border-slate-800/80 hover:border-sky-500/50 hover:bg-slate-900/80 rounded-2xl p-4 transition-all duration-100 shadow-md group cursor-pointer active:scale-95 select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 29%
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium group-hover:text-sky-300 transition-colors">
            {t('todays_orders')}
          </span>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {metrics ? metrics.todays_orders : 9}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Click to view</span>
        </div>

        {/* 12. Active Employees */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            if (user?.role === 'super_admin') {
              onNavigateTab('employees');
            } else {
              onNavigateTab('messages');
            }
          }}
          className="bg-[#111726] border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/80 rounded-2xl p-4 transition-all duration-100 shadow-md group cursor-pointer active:scale-95 select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">Active</span>
          </div>
          <span className="text-xs text-slate-400 font-medium group-hover:text-blue-300 transition-colors">
            {t('active_employees')}
          </span>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {metrics ? metrics.active_employees : 4}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {user?.role === 'super_admin' ? 'Manage Staff' : 'View Team'}
          </span>
        </div>
      </div>

      {/* 3. Interactive Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Chart 1: Orders by Day */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-[#111726] border border-slate-800/80 hover:border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between cursor-pointer transition hover:bg-slate-900/40"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{t('orders_by_day')}</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
              Last 7 Days
            </span>
          </div>

          <div className="h-44 w-full relative flex items-end justify-between pt-6 px-1">
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none p-4" viewBox="0 0 240 100">
              <polyline
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                points="10,75 45,55 80,55 120,30 160,45 200,20 230,35"
              />
              {[
                { x: 10, y: 75 },
                { x: 45, y: 55 },
                { x: 80, y: 55 },
                { x: 120, y: 30 },
                { x: 160, y: 45 },
                { x: 200, y: 20 },
                { x: 230, y: 35 },
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#FBBF24" stroke="#0B0F19" strokeWidth="2" />
              ))}
            </svg>

            {['Apr 20', 'Apr 21', 'Apr 22', 'Apr 23', 'Apr 24', 'Apr 25', 'Apr 26'].map((day, i) => (
              <span key={i} className="text-[9px] text-slate-500 font-mono text-center">
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Chart 2: Orders by Service */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-3">
            <Luggage className="w-4 h-4 text-amber-400" />
            <span>{t('orders_by_service')}</span>
          </h3>

          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#0284c7" strokeWidth="4.5" strokeDasharray="35 65" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#2563eb" strokeWidth="4.5" strokeDasharray="20 80" strokeDashoffset="-35" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="15 85" strokeDashoffset="-55" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#8b5cf6" strokeWidth="4.5" strokeDasharray="15 85" strokeDashoffset="-70" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray="10 90" strokeDashoffset="-85" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#64748b" strokeWidth="4.5" strokeDasharray="5 95" strokeDashoffset="-95" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-sm font-extrabold text-white">15</span>
                <span className="text-[8px] text-slate-400">Total</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] flex-1">
              <button
                type="button"
                onClick={() => onNavigateTab('orders', undefined, 'Flight Ticket')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500" /> Flight</span>
                <span className="font-bold text-white">35%</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('orders', undefined, 'Visa Service')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600" /> Visa</span>
                <span className="font-bold text-white">20%</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('orders', undefined, 'Hotel')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Hotel</span>
                <span className="font-bold text-white">15%</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('orders', undefined, 'Travel Package')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Package</span>
                <span className="font-bold text-white">15%</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('orders', undefined, 'Airport Transfer')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Transfer</span>
                <span className="font-bold text-white">10%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chart 3: Orders by Status */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{t('orders_by_status')}</span>
          </h3>

          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray="22 78" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#059669" strokeWidth="4.5" strokeDasharray="19 81" strokeDashoffset="-22" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="19 81" strokeDashoffset="-41" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="13 87" strokeDashoffset="-60" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#ef4444" strokeWidth="4.5" strokeDasharray="6 94" strokeDashoffset="-73" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#6366f1" strokeWidth="4.5" strokeDasharray="8 92" strokeDashoffset="-79" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-sm font-extrabold text-white">100</span>
                <span className="text-[8px] text-slate-400">Total</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] flex-1">
              <button
                type="button"
                onClick={() => onNavigateTab('orders', 'Confirmed')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Confirmed</span>
                <span className="font-bold text-white">22%</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('orders', 'Completed')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-700" /> Completed</span>
                <span className="font-bold text-white">19%</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('orders', 'In Progress')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> In Progress</span>
                <span className="font-bold text-white">19%</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('orders', 'Pending')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Pending</span>
                <span className="font-bold text-white">13%</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('ar_report')}
                className="w-full flex items-center justify-between text-slate-300 hover:text-red-300 p-1 rounded hover:bg-slate-800 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Debt Orders</span>
                <span className="font-bold text-red-400">6%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chart 4: Payments & Debt */}
        <div
          onClick={() => onNavigateTab('ar_report')}
          className="bg-[#111726] border border-slate-800/80 hover:border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between cursor-pointer transition hover:bg-slate-900/40"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>{t('payments_debt')}</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
              This Month
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Payments
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Outstanding Debt
            </span>
          </div>

          <div className="h-36 flex items-end justify-between gap-3 pt-2">
            {[
              { label: 'Week 1', p: 70, d: 50 },
              { label: 'Week 2', p: 90, d: 65 },
              { label: 'Week 3', p: 85, d: 45 },
              { label: 'Week 4', p: 75, d: 40 },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1 h-28">
                  <div
                    style={{ height: `${col.p}%` }}
                    className="w-3.5 bg-emerald-500 rounded-t-sm hover:opacity-80 transition"
                    title={`Payments: $${col.p * 70}`}
                  />
                  <div
                    style={{ height: `${col.d}%` }}
                    className="w-3.5 bg-amber-500 rounded-t-sm hover:opacity-80 transition"
                    title={`Debt: $${col.d * 50}`}
                  />
                </div>
                <span className="text-[9px] text-slate-500 font-mono">{col.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Recent Orders & Recent Transactions Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span>{t('recent_orders')}</span>
            </h2>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer active:scale-95 duration-75"
            >
              <span>{t('view_all')}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D121F] text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">{t('order_id')}</th>
                  <th className="py-2.5 px-3">{t('customer')}</th>
                  <th className="py-2.5 px-3">{t('service')}</th>
                  <th className="py-2.5 px-3">{t('status')}</th>
                  <th className="py-2.5 px-3">{t('total_price')}</th>
                  <th className="py-2.5 px-3">{t('created_by')}</th>
                  <th className="py-2.5 px-3">{t('date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => onSelectOrder(ord.id)}
                    className="hover:bg-slate-800/50 cursor-pointer transition active:bg-slate-800"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-amber-300">
                      {ord.order_number}
                    </td>
                    <td className="py-3 px-3 font-medium text-white">
                      {ord.customer?.full_name || 'Customer'}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{ord.service_type}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      ${ord.total_price.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">@{ord.created_by}</td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {ord.created_at.split('T')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>{t('recent_transactions')}</span>
            </h2>
            <button
              onClick={() => onNavigateTab('transactions')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer active:scale-95 duration-75"
            >
              <span>{t('view_all')}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D121F] text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">{t('type')}</th>
                  <th className="py-2.5 px-3">{t('order_id')}</th>
                  <th className="py-2.5 px-3">{t('amount')}</th>
                  <th className="py-2.5 px-3">By</th>
                  <th className="py-2.5 px-3">{t('date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentTransactions.map((trx) => (
                  <tr
                    key={trx.id}
                    onClick={() => onNavigateTab('transactions')}
                    className="hover:bg-slate-800/50 cursor-pointer transition active:bg-slate-800"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-slate-400">{trx.id}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTransactionTypeBadge(
                          trx.transaction_type
                        )}`}
                      >
                        {trx.transaction_type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-amber-300 font-semibold">
                      {trx.order_id}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      ${trx.payment_amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">@{trx.changed_by}</td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {trx.created_at.split('T')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
