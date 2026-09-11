// resources/js/Pages/Supplier/Analytics/Sales.jsx

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiDownload,
  FiDollarSign,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiMapPin
} from 'react-icons/fi';
import { BsShieldCheck, BsGraphUp } from 'react-icons/bs';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  formatCurrency,
  formatIndianScale,
  formatIndianDate
} from '@/Utils/formatters';

export default function SalesAnalytics({
  summary = {},
  dateRange = {},
  topProducts = [],
  salesByBuyer = [],
  salesByPeriod = [],
  paymentMethods = [],
  salesByCategory = [],
  geoDistribution = [],
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(dateRange?.period || 'month');

  const [customDateFrom, setCustomDateFrom] = useState(
    dateRange?.start ? new Date(dateRange.start).toISOString().split('T')[0] : ''
  );
  const [customDateTo, setCustomDateTo] = useState(
    dateRange?.end ? new Date(dateRange.end).toISOString().split('T')[0] : ''
  );

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(value || 0);
  };

  const formatPercentage = (value) => {
    const val = Number(value || 0);
    return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
  };

  const CHART_COLORS = ['#4F46E5', '#10B981', '#06B6D4', '#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6', '#64748B'];

  const safeSalesByPeriod = Array.isArray(salesByPeriod)
    ? salesByPeriod
    : Object.values(salesByPeriod || {});

  const categoryData = Array.isArray(salesByCategory)
    ? salesByCategory.map((item) => ({
      name: item.category || item.name || 'Industrial Supplies',
      value: Number(item.revenue || item.value || 0)
    }))
    : Object.entries(salesByCategory || {}).map(([category, data]) => ({
      name: category,
      value: Number(data?.revenue || 0)
    }));

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period !== 'custom') {
      router.get(route('supplier.analytics.sales'), { period }, {
        preserveState: true,
        replace: true
      });
    } else {
      setShowDatePicker(true);
    }
  };

  const applyCustomRange = () => {
    if (customDateFrom && customDateTo) {
      router.get(route('supplier.analytics.sales'), {
        period: 'custom',
        date_from: customDateFrom,
        date_to: customDateTo
      }, {
        preserveState: true,
        replace: true
      });
      setShowDatePicker(false);
    }
  };

  const handleExport = (type) => {
    const params = new URLSearchParams({
      type,
      format: 'csv',
      date_from: customDateFrom || '',
      date_to: customDateTo || ''
    });
    window.location.href = route('supplier.analytics.export') + '?' + params.toString();
  };

  const totalRev = Number(summary.total_revenue || 0);

  return (
    <DashboardLayout>
      <Head title="Supplier Sales & Revenue Analytics | Treadmesh" />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Supplier Intelligence
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <BsShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Vendor Performance
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              Sales Telemetry & Order Growth
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time audit of fulfilled purchase orders, gross realized GMV, and corporate customer accounts
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleExport('sales')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition shadow-xs cursor-pointer"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export Sales CSV</span>
            </button>
          </div>
        </div>

        {/* Duration Filter Pill Bar */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-slate-500 mr-2">
                <FiCalendar className="w-4 h-4 text-slate-400" />
                <span>Period:</span>
              </div>
              {[
                { id: 'week', label: 'Past Week' },
                { id: 'month', label: 'Past Month' },
                { id: 'quarter', label: 'Past Quarter' },
                { id: 'year', label: 'Fiscal Year' },
                { id: 'custom', label: 'Custom Range' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePeriodChange(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedPeriod === item.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-mono">
              {dateRange?.start ? formatIndianDate(dateRange.start) : 'Start'} &mdash; {dateRange?.end ? formatIndianDate(dateRange.end) : 'End'}
            </div>
          </div>

          {/* Custom Date Range Picker Accordion */}
          {showDatePicker && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={applyCustomRange}
                disabled={!customDateFrom || !customDateTo}
                className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                Apply Range
              </button>
              <button
                onClick={() => setShowDatePicker(false)}
                className="px-3.5 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* 5-Column Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Gross Sales */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Gross Sales Revenue</p>
              <div className="p-1.5 bg-white/10 rounded-lg">
                <FiDollarSign className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <p className="text-xl font-bold mt-2 font-mono">{formatCurrency(summary.total_revenue)}</p>
            <div className="mt-2 flex items-center text-xs">
              {Number(summary.revenue_growth || 0) >= 0 ? (
                <span className="text-emerald-400 flex items-center font-medium">
                  <FiTrendingUp className="w-3.5 h-3.5 mr-1" />
                  {formatPercentage(summary.revenue_growth)} vs prev
                </span>
              ) : (
                <span className="text-rose-400 flex items-center font-medium">
                  <FiTrendingDown className="w-3.5 h-3.5 mr-1" />
                  {formatPercentage(summary.revenue_growth)} vs prev
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Fulfilled Orders */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Fulfilled POs</p>
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                <FiShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 mt-2 font-mono">{formatNumber(summary.total_orders)}</p>
            <div className="mt-2 flex items-center text-xs">
              {Number(summary.orders_growth || 0) >= 0 ? (
                <span className="text-emerald-600 font-medium">↑ {formatPercentage(summary.orders_growth)}</span>
              ) : (
                <span className="text-rose-600 font-medium">↓ {formatPercentage(summary.orders_growth)}</span>
              )}
              <span className="ml-1 text-slate-400">orders</span>
            </div>
          </div>

          {/* Card 3: Average Order Value */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Avg Order Value</p>
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                <BsGraphUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 mt-2 font-mono">{formatCurrency(summary.average_order_value)}</p>
            <div className="mt-2 flex items-center text-xs">
              {Number(summary.aov_growth || 0) >= 0 ? (
                <span className="text-emerald-600 font-medium">↑ {formatPercentage(summary.aov_growth)}</span>
              ) : (
                <span className="text-rose-600 font-medium">↓ {formatPercentage(summary.aov_growth)}</span>
              )}
              <span className="ml-1 text-slate-400">per PO</span>
            </div>
          </div>

          {/* Card 4: Product Units Sold */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Units Dispatched</p>
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                <FiBox className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 mt-2 font-mono">{formatNumber(summary.total_items_sold)}</p>
            <p className="text-xs text-slate-400 mt-2">Physical supply units</p>
          </div>

          {/* Card 5: Unique Corporate Buyers */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Enterprise Buyers</p>
              <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
                <FiUsers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 mt-2 font-mono">{formatNumber(summary.unique_customers)}</p>
            <p className="text-xs text-slate-400 mt-2">Distinct corporate clients</p>
          </div>
        </div>

        {/* Charts Grid 1: Revenue Velocity & Order Volume */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Area Chart */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Revenue & Settlement Velocity</h2>
                <p className="text-xs text-slate-500 mt-0.5">Realized sales in Indian Rupees (INR ₹)</p>
              </div>
              <span className="text-xs font-mono font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                INR Slabs
              </span>
            </div>

            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={safeSalesByPeriod}>
                  <defs>
                    <linearGradient id="supplierRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(date) => {
                      if (!date) return '';
                      return new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(value) => {
                      if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
                      if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
                      if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
                      return `₹${value}`;
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090D16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    formatter={(val) => [formatCurrency(val), 'Realized GMV']}
                    labelFormatter={(label) => formatIndianDate(label)}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#supplierRevGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Bar Chart */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Purchase Order Fulfillment Velocity</h2>
                <p className="text-xs text-slate-500 mt-0.5">Daily / Weekly order counts</p>
              </div>
              <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                Order Units
              </span>
            </div>

            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeSalesByPeriod}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(date) => {
                      if (!date) return '';
                      return new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090D16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    formatter={(val) => [`${val} POs`, 'Order Volume']}
                    labelFormatter={(label) => formatIndianDate(label)}
                  />
                  <Bar dataKey="orders" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Grid 2: Category Breakdown & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution Pie Chart */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Sales Contribution by Industrial Vertical</h2>
              <p className="text-xs text-slate-500 mt-0.5">Revenue proportion across manufacturing categories</p>
            </div>

            <div className="h-64 my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090D16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    formatter={(value) => [formatCurrency(value), 'Vertical Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Listed Products */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Highest Velocity Listed SKUs</h2>
                <p className="text-xs text-slate-500 mt-0.5">Top performing products by revenue & units</p>
              </div>
              <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                Top {topProducts.length}
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {topProducts.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No product sales recorded in this period.
                </div>
              ) : (
                topProducts.slice(0, 5).map((product, index) => (
                  <div
                    key={product.id || index}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                        index === 0 ? 'bg-amber-100 text-amber-800' :
                        index === 1 ? 'bg-slate-200 text-slate-700' :
                        index === 2 ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        #{index + 1}
                      </span>
                      <div className="truncate">
                        <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
                        <p className="text-xs text-slate-500">
                          {formatNumber(product.total_quantity_sold)} units &middot; {product.order_count} POs
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 text-sm font-mono flex-shrink-0 ml-2">
                      {formatCurrency(product.total_revenue)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Grid: Top Buyers & Payment Rails */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Buyers Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Top Corporate Accounts by Spend</h2>
                <p className="text-xs text-slate-500 mt-0.5">Highest value enterprise buyers sourcing your catalog</p>
              </div>
              <span className="text-xs font-mono font-medium text-slate-500">
                {salesByBuyer.length} clients
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="px-6 py-3.5">Enterprise Client</th>
                    <th className="px-6 py-3.5 text-right">Orders Fulfilled</th>
                    <th className="px-6 py-3.5 text-right">Total Revenue (INR ₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {salesByBuyer.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-400 text-sm">
                        No corporate buyer purchases in this period.
                      </td>
                    </tr>
                  ) : (
                    salesByBuyer.map((buyer) => (
                      <tr key={buyer.buyer_id} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                              {buyer.buyer?.name?.charAt(0) || 'B'}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{buyer.buyer?.name || 'Enterprise Buyer'}</p>
                              <p className="text-xs text-slate-400">{buyer.buyer?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">
                          {buyer.order_count} POs
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">
                          {formatCurrency(buyer.total_spent)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Status / Settlement Health */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Escrow Settlement Status</h2>
              <p className="text-xs text-slate-500 mt-0.5">Realized payouts vs awaiting dispatch</p>
            </div>

            <div className="space-y-4 my-auto py-4">
              {paymentMethods.map((method) => {
                const isPaid = method.payment_status === 'paid';
                const pct = totalRev > 0 ? ((Number(method.total) / totalRev) * 100).toFixed(1) : 0;

                return (
                  <div key={method.payment_status} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        {isPaid ? (
                          <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <FiClock className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        {isPaid ? 'Settled in Bank' : 'Held in Escrow'}
                      </span>
                      <span className="text-sm font-bold font-mono text-slate-900">
                        {formatCurrency(method.total)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>{method.count} transactions</span>
                      <span className="font-mono font-medium">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Settlement Rail:</span>
              <span className="font-semibold text-indigo-600">RBI Nodal Escrow</span>
            </div>
          </div>
        </div>

        {/* Geographical Dispatch Hubs */}
        {geoDistribution.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FiMapPin className="w-4 h-4 text-indigo-600" />
                  Dispatch Distribution by Industrial Hubs
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Shipment destinations and order density across Indian states and cities</p>
              </div>
              <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                Make-in-India Logistics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {geoDistribution.map((location) => (
                <div key={location.city} className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition">
                  <p className="font-semibold text-slate-900 text-sm">{location.city || 'National Dispatch'}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                    <span className="text-xs text-slate-500">{location.order_count} POs</span>
                    <span className="font-bold text-emerald-600 text-sm font-mono">{formatCurrency(location.total_spent)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}