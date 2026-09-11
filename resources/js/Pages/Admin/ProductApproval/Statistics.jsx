// Pages/Admin/ProductApproval/Statistics.jsx

// React - Core React imports for component functionality
import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Layout - Admin dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatCurrency, formatIndianScale } from '@/Utils/formatters';

// Icons - Importing icon sets for UI elements
import {
  FiArrowLeft,
  FiPackage,
  FiTrendingUp,
  FiCalendar
} from 'react-icons/fi';
import {
  MdOutlineCategory,
} from 'react-icons/md';
import { BsBuilding, BsGraphUp } from 'react-icons/bs';

// Recharts - Charting library components for data visualization
import {
  BarChart,
  Bar,
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

export default function Statistics({ stats }) {
  const { by_category, by_supplier, price_range, weekly_trend } = stats;

  // Colors for charts - Color palette for pie chart segments
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6'];

  return (
    <DashboardLayout>
      <Head title="Product Approval Analytics - Treadmesh Admin" />

      <div className="space-y-6">
        {/* Header - Back button and page title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.product-approval.index')}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Catalog Intelligence
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 font-medium">Approval Pipeline</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">Product Approval Analytics</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Pipeline distribution, supplier velocity, and price spread across Indian manufacturing sectors.
              </p>
            </div>
          </div>
          <Link
            href={route('admin.product-approval.index')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition shadow-sm"
          >
            <FiPackage className="w-4 h-4 text-emerald-400" />
            <span>Back to Approval Queue</span>
          </Link>
        </div>

        {/* Price Range Stats - Key price metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Min Submitted Price</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {formatCurrency(price_range.min || 0)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Lowest unit wholesale rate</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <span className="text-lg font-bold text-indigo-600">₹</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Submitted Price</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {formatCurrency(price_range.max || 0)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Highest unit wholesale rate</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <FiTrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Unit Price</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {formatCurrency(price_range.avg || 0)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Mean catalog valuation</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <BsGraphUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution - Pie chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MdOutlineCategory className="w-4 h-4 text-indigo-600" />
              <span>Submissions by Industrial Category</span>
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={by_category}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.category}: ${entry.total}`}
                    outerRadius={85}
                    fill="#8884d8"
                    dataKey="total"
                    nameKey="category"
                  >
                    {by_category.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val} SKUs`, 'Submitted']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-1">
              {by_category.map((item, index) => {
                const total = by_category.reduce((acc, curr) => acc + curr.total, 0);
                const pct = total > 0 ? Math.round((item.total / total) * 100) : 0;
                return (
                  <div key={index} className="flex justify-between items-center text-sm py-1 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="text-gray-700 font-medium">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{item.total} SKUs</span>
                      <span className="text-xs text-gray-400 font-mono">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supplier Distribution - Bar chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BsBuilding className="w-4 h-4 text-indigo-600" />
              <span>Top Manufacturers by Submissions</span>
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={by_supplier}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="supplier.company_name" width={130} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val) => [`${val} Submissions`, 'Count']} />
                  <Bar dataKey="total" fill="#4F46E5" radius={[0, 4, 4, 0]} name="Pending Listings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Trend - 30-day submission trend */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiCalendar className="w-4 h-4 text-indigo-600" />
              <span>30-Day Catalog Submission Trend</span>
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly_trend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} name="Daily Submissions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pending Submissions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{by_category.reduce((acc, curr) => acc + curr.total, 0)}</p>
                <p className="text-xs text-gray-400 mt-1">Awaiting audit</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <FiPackage className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories Represented</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{by_category.length}</p>
                <p className="text-xs text-gray-400 mt-1">Industrial classifications</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <MdOutlineCategory className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Manufacturers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{by_supplier.length}</p>
                <p className="text-xs text-gray-400 mt-1">Suppliers submitting SKUs</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <BsBuilding className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price Spread</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {formatIndianScale(price_range.min || 0)} - {formatIndianScale(price_range.max || 0)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Wholesale price range</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-lg font-bold text-amber-600">₹</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}