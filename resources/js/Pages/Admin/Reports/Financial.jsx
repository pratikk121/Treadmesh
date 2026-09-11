// resources/js/Pages/Admin/Reports/Financial.jsx

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiDownload,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiCreditCard,
  FiShield,
  FiArrowUpRight,
  FiFilter
} from 'react-icons/fi';
import {
  MdOutlineAccountBalance,
  MdOutlinePayments
} from 'react-icons/md';
import { BsBuilding, BsShieldCheck } from 'react-icons/bs';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  formatCurrency,
  formatIndianScale,
  formatIndianDate
} from '@/Utils/formatters';

export default function Financial({ financialData = {}, period = 'monthly', dateRange = {} }) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [showCustomPicker, setShowCustomPicker] = useState(period === 'custom');
  const [customRange, setCustomRange] = useState({
    start: dateRange?.start || '',
    end: dateRange?.end || ''
  });

  // Destructure data from props
  const {
    revenue = { total: 0, by_payment_method: [] },
    payment_stats = { paid: 0, pending: 0 },
    monthly_revenue = [],
    revenue_by_supplier = []
  } = financialData;

  const totalSettledGMV = Number(revenue?.total || 0);
  const paidCount = Number(payment_stats?.paid || 0);
  const pendingCount = Number(payment_stats?.pending || 0);
  const totalOrders = paidCount + pendingCount;
  const avgSettledValue = paidCount > 0 ? Math.round(totalSettledGMV / paidCount) : 0;
  const settlementSuccessRate = totalOrders > 0 ? ((paidCount / totalOrders) * 100).toFixed(1) : '100.0';

  // Indian B2B Payment Rails Palette
  const COLORS = ['#4F46E5', '#10B981', '#06B6D4', '#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6', '#64748B'];

  const normalizePaymentRail = (method) => {
    if (!method) return 'Nodal Escrow Settlement';
    const clean = String(method).toLowerCase().replace(/[-_]/g, ' ');
    if (clean.includes('upi')) return 'UPI Instant (VPA / AutoPay)';
    if (clean.includes('bank') || clean.includes('transfer') || clean.includes('neft') || clean.includes('rtgs')) {
      return 'RTGS / NEFT Corporate Settlement';
    }
    if (clean.includes('net') || clean.includes('banking')) return 'Corporate Net Banking (IMPS)';
    if (clean.includes('card') || clean.includes('credit') || clean.includes('debit')) {
      return 'Commercial Purchasing Card';
    }
    if (clean.includes('escrow') || clean.includes('nodal')) return 'RBI-Regulated Nodal Escrow';
    if (clean.includes('cheque') || clean.includes('draft')) return 'Corporate Cheque / DD';
    return clean.replace(/\b\w/g, c => c.toUpperCase());
  };

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  // Handle period change
  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    if (newPeriod === 'custom') {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
      router.get(route('admin.reports.financial'), { period: newPeriod }, { preserveState: true });
    }
  };

  // Handle custom date apply
  const handleCustomDateApply = () => {
    router.get(route('admin.reports.financial'), {
      period: 'custom',
      date_from: customRange.start,
      date_to: customRange.end
    }, { preserveState: true });
    setShowCustomPicker(false);
  };

  // Handle export
  const handleExport = (format = 'csv') => {
    window.location.href = route('admin.reports.export', {
      type: 'sales', // Backend handles sales/financial export through sales dataset
      format,
      period: selectedPeriod,
      date_from: dateRange?.start,
      date_to: dateRange?.end
    });
  };

  const periodOptions = [
    { value: 'daily', label: 'Daily Run-Rate' },
    { value: 'weekly', label: 'Weekly Summary' },
    { value: 'monthly', label: 'Monthly Statement' },
    { value: 'quarterly', label: 'Quarterly (Q1-Q4)' },
    { value: 'yearly', label: 'Annual Fiscal Year' },
    { value: 'custom', label: 'Custom Date Range' },
  ];

  return (
    <DashboardLayout>
      <Head title="Financial & Escrow Settlement Reports | Treadmesh Admin" />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Treasury & Settlement
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <BsShieldCheck className="w-3 h-3 text-indigo-600" />
                RBI Nodal Compliant
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              Financial Settlements & Revenue Audit
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Live audit of gross settled marketplace volume, RTGS/NEFT/UPI payment rail velocity, and vendor payouts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="pl-3.5 pr-8 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 border border-slate-300/80 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition cursor-pointer"
              >
                {periodOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition shadow-xs cursor-pointer"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export Ledger</span>
            </button>
          </div>
        </div>

        {/* Custom Date Range Filter Dropdown */}
        {showCustomPicker && (
          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FiFilter className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Custom Date Filter:</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">From:</label>
              <input
                type="date"
                value={customRange.start}
                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">To:</label>
              <input
                type="date"
                value={customRange.end}
                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleCustomDateApply}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition"
            >
              Apply Filter
            </button>
          </div>
        )}

        {/* Active Reporting Period Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <FiCalendar className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">Settlement Ledger Window</p>
              <p className="text-sm font-semibold text-white">
                {dateRange?.start ? formatIndianDate(dateRange.start) : 'Start'} &mdash; {dateRange?.end ? formatIndianDate(dateRange.end) : 'Current Date'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-slate-400">Escrow Clearance:</span>{' '}
              <span className="font-semibold text-emerald-400">{settlementSuccessRate}%</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="text-right">
              <span className="text-slate-400">Avg Settlement:</span>{' '}
              <span className="font-semibold text-white">{formatCurrency(avgSettledValue)}</span>
            </div>
          </div>
        </div>

        {/* Key Financial Telemetry Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Settled GMV */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Gross Settled GMV
              </span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition">
                <FiDollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatCurrency(totalSettledGMV)}
              </span>
              {totalSettledGMV > 0 && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {formatIndianScale(totalSettledGMV)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Realized payments credited via Escrow</span>
            </p>
          </div>

          {/* Card 2: Settled Orders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Settled B2B Orders
              </span>
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition">
                <FiCheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(paidCount)}
              </span>
              <span className="text-xs text-slate-500">fulfilled POs</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span className="font-semibold text-indigo-600">{settlementSuccessRate}%</span>
              <span>full milestone compliance</span>
            </p>
          </div>

          {/* Card 3: Pending Escrow Orders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                In-Escrow / Awaiting Dispatch
              </span>
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-100 transition">
                <FiClock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(pendingCount)}
              </span>
              <span className="text-xs text-amber-600 font-medium">pending verification</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>Held securely until E-Way bill delivery</span>
            </p>
          </div>

          {/* Card 4: Active Payment Channels */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Payment Rails
              </span>
              <div className="p-2 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-100 transition">
                <FiCreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {revenue?.by_payment_method?.length || 0}
              </span>
              <span className="text-xs text-slate-500">channels active</span>
            </div>
            <p className="text-xs text-purple-700 mt-2 flex items-center gap-1 font-medium">
              <MdOutlineAccountBalance className="w-3.5 h-3.5" />
              <span>RTGS / NEFT / UPI Enabled</span>
            </p>
          </div>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Revenue Velocity - Area Chart (2 cols) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                  <FiTrendingUp className="w-5 h-5 text-indigo-600" />
                  Monthly Settlement & GMV Velocity
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gross invoice volume cleared through Treadmesh nodal escrow accounts
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  Settled INR
                </span>
              </div>
            </div>

            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly_revenue} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="financialColorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(val) => {
                      if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
                      if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
                      if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
                      return `₹${val}`;
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090D16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                    }}
                    formatter={(value) => [formatCurrency(value), 'Gross Settled GMV']}
                    labelStyle={{ color: '#94a3b8', fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#financialColorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Method Distribution - Pie Chart (1 col) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <MdOutlinePayments className="w-5 h-5 text-indigo-600" />
                Payment Rail Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution across settlement channels
              </p>
            </div>

            <div className="h-56 my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenue?.by_payment_method || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="total"
                    nameKey="payment_method"
                  >
                    {(revenue?.by_payment_method || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090D16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    formatter={(value, name) => [formatCurrency(value), normalizePaymentRail(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Payment Rail Legend */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100">
              {(revenue?.by_payment_method || []).slice(0, 4).map((item, index) => {
                const pct = totalSettledGMV > 0 ? ((Number(item.total) / totalSettledGMV) * 100).toFixed(1) : 0;
                return (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-slate-600 truncate">{normalizePaymentRail(item.payment_method)}</span>
                    </div>
                    <span className="font-semibold text-slate-900 ml-2">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Suppliers by Settled Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <BsBuilding className="w-5 h-5 text-indigo-600" />
                Top OEM Vendors & Suppliers by Settled Volume
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Highest grossing verified suppliers across current accounting period
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Top 10 Suppliers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {revenue_by_supplier.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-slate-400 text-sm">
                No supplier settlement records found for this period.
              </div>
            ) : (
              revenue_by_supplier.map((supplier, index) => {
                const maxRev = Math.max(...revenue_by_supplier.map(s => Number(s.revenue) || 1));
                const sharePct = ((Number(supplier.revenue) / (totalSettledGMV || 1)) * 100).toFixed(1);
                const barWidth = Math.min(100, Math.max(10, ((Number(supplier.revenue) / maxRev) * 100)));

                return (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-semibold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 truncate">
                          {supplier.supplier_name || 'Enterprise Supplier'}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 font-mono flex-shrink-0">
                        {formatCurrency(supplier.revenue)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Marketplace GMV Contribution</span>
                      <span className="font-medium text-slate-700">{sharePct}%</span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detailed Monthly Settlement Ledger Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Monthly Settlement & Revenue Ledger</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit breakdown of realized B2B orders per accounting cycle
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">
              {monthly_revenue.length} reporting months
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-3.5">Month</th>
                  <th className="px-6 py-3.5 text-right">Settled Volume (INR ₹)</th>
                  <th className="px-6 py-3.5 text-right">Contribution %</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {monthly_revenue.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
                      No monthly revenue entries recorded.
                    </td>
                  </tr>
                ) : (
                  monthly_revenue.map((item, index) => {
                    const percentage = totalSettledGMV > 0
                      ? ((item.revenue / totalSettledGMV) * 100).toFixed(1)
                      : 0;

                    return (
                      <tr key={index} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-900 font-mono">{item.month}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-slate-900 font-mono">
                            {formatCurrency(item.revenue)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <span className="text-xs font-mono text-slate-600 font-medium">{percentage}%</span>
                            <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${Math.min(100, Math.max(2, percentage))}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                            Settled & Closed
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}