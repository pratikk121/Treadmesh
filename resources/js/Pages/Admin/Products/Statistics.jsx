// Pages/Admin/Products/Statistics.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatCurrency, formatIndianScale } from '@/Utils/formatters';

import {
  FiArrowLeft,
  FiPackage,
  FiTrendingUp,
  FiPieChart,
  FiDollarSign,
  FiLayers,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiXCircle
} from 'react-icons/fi';
import {
  MdOutlineCategory,
  MdOutlineInventory,
} from 'react-icons/md';
import { BsBuilding } from 'react-icons/bs';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function Statistics({ stats }) {
  const {
    by_category = [],
    by_status = [],
    by_supplier = [],
    inventory_value = { total: 0, by_category: [] },
    recent_additions = 0
  } = stats || {};

  // Status colors
  const STATUS_COLORS = {
    approved: '#10B981', // Emerald
    pending: '#F59E0B',  // Amber
    rejected: '#EF4444', // Rose
  };

  // Status chart data
  const statusData = [
    { name: 'Approved', value: by_status.find(s => s.status === 'approved')?.total || 0, color: STATUS_COLORS.approved },
    { name: 'Pending Review', value: by_status.find(s => s.status === 'pending')?.total || 0, color: STATUS_COLORS.pending },
    { name: 'Rejected', value: by_status.find(s => s.status === 'rejected')?.total || 0, color: STATUS_COLORS.rejected },
  ].filter(item => item.value > 0);

  // Total products
  const totalProducts = statusData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <DashboardLayout>
      <Head title="Product Catalog Analytics & Valuation - Treadmesh Admin" />

      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.products.index')}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl transition shadow-xs"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Marketplace Intelligence
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 font-medium">Pan-India Catalog</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
                Product Catalog Intelligence
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Valuation analytics, category inventory distribution, and supplier manufacturing capacity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={route('admin.products.index')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow-sm transition"
            >
              <FiPackage className="w-4 h-4 text-gray-300" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total SKUs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total SKUs</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1.5 font-mono">
                  {totalProducts.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  <span>Active marketplace listings</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                <FiPackage className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 2: Total Inventory Valuation */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Inventory Valuation</p>
                <p className="text-2xl font-extrabold text-emerald-700 mt-1.5 font-mono">
                  {formatCurrency(inventory_value?.total || 0)}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
                  <span>Scale:</span>
                  <span className="bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {formatIndianScale(inventory_value?.total || 0)}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
                <FiDollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 3: Active Categories */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Categories</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1.5 font-mono">
                  {by_category.length}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                  <span>Industrial supply verticals</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-600">
                <MdOutlineCategory className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 4: Recent Additions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">New Additions</p>
                <p className="text-2xl font-extrabold text-amber-600 mt-1.5 font-mono">
                  +{recent_additions}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-700 font-medium">
                  <FiTrendingUp className="w-3.5 h-3.5" />
                  <span>Added past 30 days</span>
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-600">
                <FiTrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FiPieChart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Products by Approval Status</h3>
                  <p className="text-xs text-gray-500">Catalog verification lifecycle breakdown</p>
                </div>
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} SKUs`, name]}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
              {statusData.map((item, index) => {
                const percentage = totalProducts > 0 ? ((item.value / totalProducts) * 100).toFixed(1) : 0;
                return (
                  <div key={index} className="text-center p-2 rounded-xl bg-gray-50/70 border border-gray-100">
                    <div className="flex items-center justify-center gap-1 text-xs font-semibold text-gray-600 mb-0.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span>{item.name}</span>
                    </div>
                    <p className="text-lg font-bold font-mono" style={{ color: item.color }}>
                      {item.value.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium">{percentage}% share</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <MdOutlineCategory className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">SKU Distribution by Category</h3>
                  <p className="text-xs text-gray-500">Number of active catalog products per industry sector</p>
                </div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={by_category}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="category" width={110} stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [`${value} SKUs`, 'Catalog Volume']}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="total" fill="#4F46E5" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Suppliers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <BsBuilding className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Top Suppliers by Catalog Volume</h3>
                  <p className="text-xs text-gray-500">Verified manufacturers & vendors with the highest SKU count</p>
                </div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={by_supplier}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="supplier.company_name"
                    width={120}
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} SKUs`, 'Listed Catalog']}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="total" fill="#10B981" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory Valuation by Category */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                  <MdOutlineInventory className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Inventory Valuation by Category</h3>
                  <p className="text-xs text-gray-500">Cumulative stock value (INR) per product vertical</p>
                </div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={inventory_value.by_category}
                  margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="category"
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    height={60}
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => formatIndianScale(value)}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Stock Valuation']}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="px-6 py-4.5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Category Valuation & Inventory Breakdown</h3>
              <p className="text-xs text-gray-500 mt-0.5">Comprehensive SKU counts, valuation scale, and marketplace share</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
              {inventory_value.by_category.length} Active Categories
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/75 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Active SKUs
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Inventory Valuation (₹)
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Commercial Scale
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Share of Catalog
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {inventory_value.by_category.map((item, index) => {
                  const percentage = inventory_value.total > 0
                    ? ((item.value / inventory_value.total) * 100).toFixed(1)
                    : 0;
                  const skuCount = by_category.find(c => c.category === item.category)?.total || 0;

                  return (
                    <tr key={index} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <FiBox className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-gray-900">{item.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-medium text-gray-900">
                          {skuCount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-bold text-gray-900">
                          {formatCurrency(item.value)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {formatIndianScale(item.value)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(Number(percentage), 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 font-mono w-10 text-right">
                            {percentage}%
                          </span>
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