// resources/js/Pages/Admin/Reports/Sales.jsx

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
  FiCalendar,
  FiDownload,
  FiBarChart2,
  FiFilter,
  FiLayers
} from 'react-icons/fi';
import {
  MdOutlineCategory
} from 'react-icons/md';
import { BsBuilding } from 'react-icons/bs';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  formatCurrency,
  formatIndianScale,
  formatIndianDate
} from '@/Utils/formatters';

export default function Sales({ salesData, period, dateRange }) {
  // State management for period and custom date range
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(period || 'monthly');
  const [customDateRange, setCustomDateRange] = useState({
    start: dateRange?.start || '',
    end: dateRange?.end || ''
  });

  // Destructure data from props
  const { overview = {}, by_period = [], by_category = [], by_supplier = [], daily_trend = [] } = salesData || {};

  // Colors for charts
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6'];

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  // Handle period change
  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    if (newPeriod === 'custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
      router.get(route('admin.reports.sales'), { period: newPeriod }, { preserveState: true });
    }
  };

  // Handle custom date apply
  const handleCustomDateApply = () => {
    router.get(route('admin.reports.sales'), {
      period: 'custom',
      date_from: customDateRange.start,
      date_to: customDateRange.end
    }, { preserveState: true });
    setShowDatePicker(false);
  };

  // Handle export
  const handleExport = (format = 'csv') => {
    window.location.href = route('admin.reports.export', {
      type: 'sales',
      format,
      period: selectedPeriod,
      date_from: customDateRange.start,
      date_to: customDateRange.end
    });
  };

  // Period options for dropdown
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
      <Head title="Sales & Revenue Intelligence | Treadmesh Admin" />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Financial Telemetry
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Real-Time GMV
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              Sales & Gross Merchandise Value (GMV)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Analyze settled platform sales, purchase order realization, and product category velocity across India.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-white transition"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
              title="Export Sales Ledger to CSV"
            >
              <FiDownload className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        {showDatePicker && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FiFilter className="w-4 h-4 text-indigo-600" />
              Custom Fiscal Reporting Window
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCustomDateApply}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl transition shadow-xs"
                >
                  Apply Filter
                </button>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Date Range Badge */}
        {dateRange?.start && dateRange?.end && (
          <div className="bg-indigo-50/70 border border-indigo-200/60 rounded-xl px-4 py-2.5 flex items-center gap-2 text-indigo-900 text-xs font-medium">
            <FiCalendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Reporting Period: <strong className="font-semibold">{formatIndianDate(dateRange.start)}</strong> — <strong className="font-semibold">{formatIndianDate(dateRange.end)}</strong>
            </span>
          </div>
        )}

        {/* Overview Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gross Settled Revenue</p>
                <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">{formatCurrency(overview.total_revenue)}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{formatIndianScale(overview.total_revenue)} platform GMV</p>
              </div>
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                <FiDollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Settled Purchase Orders</p>
                <p className="text-2xl font-bold font-mono text-indigo-600 mt-1">{formatNumber(overview.total_orders)}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Completed commercial dispatches</p>
              </div>
              <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                <FiShoppingCart className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Average Order Value (AOV)</p>
                <p className="text-2xl font-bold font-mono text-blue-600 mt-1">{formatCurrency(overview.average_order_value)}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Mean ticket size per PO</p>
              </div>
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                <FiBarChart2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tender Conversion Rate</p>
                <p className="text-2xl font-bold font-mono text-purple-600 mt-1">{overview.conversion_rate || 0}%</p>
                <p className="text-[11px] text-slate-500 mt-0.5">RFQ-to-settled-PO conversion</p>
              </div>
              <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100">
                <FiTrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Velocity Area Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4 text-indigo-600" />
                Revenue & Procurement Volume Trends
              </h3>
              <span className="text-xs text-slate-500 font-medium">Daily Telemetry</span>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily_trend} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#94A3B8" fontSize={11} tickFormatter={(val) => formatIndianScale(val)} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'Revenue (INR)' ? formatCurrency(value) : value,
                      name
                    ]}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                    name="Revenue (INR)"
                  />
                  <Bar yAxisId="left" dataKey="orders" fill="#10B981" name="Orders Count" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales by Category Pie */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MdOutlineCategory className="w-4 h-4 text-indigo-600" />
                Category Revenue Distribution
              </h3>
              <span className="text-xs text-slate-500 font-medium">By Gross Turnover</span>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={by_category}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total_revenue"
                    nameKey="category"
                  >
                    {by_category.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Suppliers by Realized GMV */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BsBuilding className="w-4 h-4 text-indigo-600" />
                Top Manufacturing Partners by GMV
              </h3>
              <span className="text-xs text-slate-500 font-medium">Order Realization</span>
            </div>

            <div className="space-y-2.5">
              {by_supplier.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No supplier performance records in this range.</p>
              ) : (
                by_supplier.map((supplier, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-mono font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{supplier.supplier_name}</p>
                        <p className="text-[11px] text-slate-500">{supplier.order_count} settled orders</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      {formatCurrency(supplier.total_revenue)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Periodic Financial Run-Rate */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FiBarChart2 className="w-4 h-4 text-indigo-600" />
                Periodic Financial Run-Rate Ledger
              </h3>
              <span className="text-xs text-slate-500 font-medium">INR Settlement Breakdown</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Reporting Interval</th>
                    <th className="px-5 py-3 text-right">Settled Orders</th>
                    <th className="px-5 py-3 text-right">Gross GMV (INR)</th>
                    <th className="px-5 py-3 text-right">Average Order Ticket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {by_period.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5 font-semibold text-slate-900">{item.period}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-slate-700">{formatNumber(item.total_orders)}</td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-600">{formatCurrency(item.revenue)}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-indigo-600">{formatCurrency(item.average_value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Product Category Performance Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Product Category Performance Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Category Title</th>
                  <th className="px-5 py-3.5 text-right">Order Count</th>
                  <th className="px-5 py-3.5 text-right">Dispatched Quantity</th>
                  <th className="px-5 py-3.5 text-right">Realized GMV</th>
                  <th className="px-5 py-3.5 text-right">GMV Contribution Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {by_category.map((item, index) => {
                  const percentage = overview.total_revenue > 0
                    ? ((item.total_revenue / overview.total_revenue) * 100).toFixed(1)
                    : 0;
                  return (
                    <tr key={index} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {item.category}
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-slate-700">{formatNumber(item.order_count)}</td>
                      <td className="px-5 py-4 text-right font-mono text-slate-700">{formatNumber(item.total_quantity)} units</td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-emerald-600">{formatCurrency(item.total_revenue)}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs font-mono font-semibold text-slate-600">{percentage}%</span>
                          <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}