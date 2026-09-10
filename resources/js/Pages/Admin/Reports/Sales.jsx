// Pages/Admin/Reports/Sales.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';

// Layout - Admin dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
import {
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
  FiCalendar,
  FiDownload,
  FiBarChart2,
} from 'react-icons/fi';
import {
  MdOutlineAttachMoney,
  MdOutlineCategory
} from 'react-icons/md';
import { BsBuilding } from 'react-icons/bs';

// Recharts - Charting library components for data visualization
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

export default function Sales({ salesData, period, dateRange }) {
  // State management for period and custom date range
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [customDateRange, setCustomDateRange] = useState({ start: dateRange.start, end: dateRange.end });

  // Destructure data from props
  const { overview, by_period, by_category, by_supplier, daily_trend } = salesData;

  // Colors for charts - Color palette for visualizations
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6'];

  // Format currency - Converts number to USD currency format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format number - Adds thousand separators
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Handle period change - Update report period
  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    router.get(route('admin.reports.sales'), { period: newPeriod }, { preserveState: true });
  };

  // Handle custom date apply - Apply custom date range filter
  const handleCustomDateApply = () => {
    router.get(route('admin.reports.sales'), {
      period: 'custom',
      date_from: customDateRange.start,
      date_to: customDateRange.end
    }, { preserveState: true });
    setShowDatePicker(false);
  };

  // Handle export - Download report in specified format
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
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Annually' },
    { value: 'custom', label: 'Custom Range' },
  ];

  return (
    <DashboardLayout>
      <Head title="Sales report" />

      <div className="space-y-6">
        {/* Header - Page title, period selector and export button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales report</h1>
            <p className="text-sm text-gray-600 mt-1">
              Analyze Sales Performance & Revenue Trends
            </p>
          </div>
          <div className="flex gap-2">
            {/* Period Selector */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {periodOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        {showDatePicker && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">from</label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">up to</label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                onClick={handleCustomDateApply}
                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                application
              </button>
              <button
                onClick={() => setShowDatePicker(false)}
                className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                cancel
              </button>
            </div>
          </div>
        )}

        {/* Date Range Display */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-center gap-2 text-indigo-700">
          <FiCalendar className="w-4 h-4" />
          <span className="text-sm font-medium">
            Report period: {new Date(dateRange.start).toLocaleDateString('en-US')} - {new Date(dateRange.end).toLocaleDateString('en-US')}
          </span>
        </div>

        {/* Overview Cards - Key sales metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total income is</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(overview.total_revenue)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total order</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{formatNumber(overview.total_orders)}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiShoppingCart className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average order value</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(overview.average_order_value)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MdOutlineAttachMoney className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">The conversion rate is</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{overview.conversion_rate}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid - Data visualization section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend - Area chart with revenue and orders */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-indigo-600" />
              Revenue Trends
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily_trend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4F46E5"
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                    name="Income"
                  />
                  <Bar yAxisId="left" dataKey="orders" fill="#10B981" name="Order" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales by Category - Pie chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MdOutlineCategory className="w-5 h-5 text-indigo-600" />
              Category wise sales
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={by_category}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(1)}%`}
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

          {/* Top Suppliers by Revenue */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BsBuilding className="w-5 h-5 text-indigo-600" />
              Top Supplier by Revenue
            </h3>
            <div className="space-y-4">
              {by_supplier.map((supplier, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{supplier.supplier_name}</p>
                      <p className="text-xs text-gray-500">{supplier.order_count} orders</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-indigo-600">
                    {formatCurrency(supplier.total_revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Period Performance Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiBarChart2 className="w-5 h-5 text-indigo-600" />
              Performance over time
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Order</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Income</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Average order value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {by_period.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.period}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">{formatNumber(item.total_orders)}</td>
                      <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{formatCurrency(item.revenue)}</td>
                      <td className="px-4 py-3 text-sm text-right text-indigo-600">{formatCurrency(item.average_value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Category Breakdown Table - Detailed category analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Category Performance Description</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount sold is</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Income</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Percentage of total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {by_category.map((item, index) => {
                  const percentage = (item.total_revenue / overview.total_revenue * 100).toFixed(1);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{item.category}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900">{formatNumber(item.order_count)}</td>
                      <td className="px-6 py-4 text-right text-gray-900">{formatNumber(item.total_quantity)}</td>
                      <td className="px-6 py-4 text-right text-green-600 font-medium">{formatCurrency(item.total_revenue)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm text-gray-600">{percentage}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
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