// resources/js/Pages/Admin/Reports/Products.jsx

import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiPackage,
  FiTrendingUp,
  FiDownload,
  FiAlertCircle,
  FiLayers,
  FiBox,
  FiArrowUpRight
} from 'react-icons/fi';
import {
  MdOutlineCategory,
  MdOutlineAttachMoney,
  MdOutlineInventory2
} from 'react-icons/md';
import { BsShieldCheck } from 'react-icons/bs';
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
  Cell
} from 'recharts';
import {
  formatCurrency,
  formatIndianScale
} from '@/Utils/formatters';

export default function Products({ productData = {} }) {
  // Destructure data from props
  const {
    inventory = { total_products: 0, total_value: 0, out_of_stock: 0, low_stock: 0 },
    top_selling = [],
    by_category = [],
    price_distribution = {}
  } = productData;

  const COLORS = ['#4F46E5', '#10B981', '#06B6D4', '#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6', '#64748B'];

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  const handleExport = (format = 'csv') => {
    window.location.href = route('admin.reports.export', {
      type: 'products',
      format
    });
  };

  const priceDistributionData = [
    { range: '< ₹1 Lakh', count: price_distribution?.under_100k || 0 },
    { range: '₹1L - ₹5L', count: price_distribution?.['100k_500k'] || 0 },
    { range: '₹5L - ₹10L', count: price_distribution?.['500k_1m'] || 0 },
    { range: '₹10L - ₹50L', count: price_distribution?.['1m_5m'] || 0 },
    { range: '> ₹50 Lakhs', count: price_distribution?.above_5m || 0 },
  ];

  return (
    <DashboardLayout>
      <Head title="Product Catalog & Inventory Intelligence | Treadmesh Admin" />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Supply Chain & Catalog
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <BsShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified OEM Supply
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              Product Catalog & Warehouse Valuation
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Live telemetry of active industrial SKUs, warehouse inventory valuation, and stock alerts
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition shadow-xs cursor-pointer"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export Catalog CSV</span>
            </button>
          </div>
        </div>

        {/* Inventory Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Listed SKUs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Listed SKUs
              </span>
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition">
                <FiPackage className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(inventory.total_products)}
              </span>
              <span className="text-xs text-slate-500">catalog items</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>Across verified vendor clusters</span>
            </p>
          </div>

          {/* Card 2: Inventory Value */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Inventory Valuation
              </span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition">
                <MdOutlineAttachMoney className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatCurrency(inventory.total_value)}
              </span>
              {Number(inventory.total_value) > 0 && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {formatIndianScale(inventory.total_value)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>Cumulative base warehouse value</span>
            </p>
          </div>

          {/* Card 3: Out of Stock SKUs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Critical Stockout SKUs
              </span>
              <div className="p-2 bg-red-50 rounded-xl text-red-600 group-hover:bg-red-100 transition">
                <FiAlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(inventory.out_of_stock)}
              </span>
              <span className="text-xs text-red-600 font-medium">zero stock</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>Suppliers notified for immediate replenishment</span>
            </p>
          </div>

          {/* Card 4: Low Stock Alert */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Low Stock Threshold Alert
              </span>
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-100 transition">
                <MdOutlineInventory2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(inventory.low_stock)}
              </span>
              <span className="text-xs text-amber-600 font-medium">&lt; 10 units left</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>Nearing re-order quantity triggers</span>
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution - Pie Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <MdOutlineCategory className="w-5 h-5 text-indigo-600" />
                SKU Distribution by Industrial Vertical
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of active listings across manufacturing categories
              </p>
            </div>

            <div className="h-64 my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={by_category}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="category"
                  >
                    {by_category.map((entry, index) => (
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
                    formatter={(val, name) => [`${formatNumber(val)} SKUs`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-100">
              {by_category.slice(0, 4).map((item, index) => {
                const total = inventory.total_products || 1;
                const pct = ((item.count / total) * 100).toFixed(1);
                return (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-slate-600 truncate">{item.category}</span>
                    </div>
                    <span className="font-semibold text-slate-900 ml-2">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Distribution - Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <FiLayers className="w-5 h-5 text-indigo-600" />
                B2B Catalog Unit Price Brackets (INR ₹)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Product volume grouped into commercial procurement tiers
              </p>
            </div>

            <div className="h-64 my-auto mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceDistributionData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="range"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090D16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    formatter={(val) => [`${val} SKUs`, 'Catalog Items']}
                  />
                  <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Slab Analysis: Commercial B2B Standard</span>
              <span className="font-medium text-indigo-600">Lakhs & Crores Scale</span>
            </div>
          </div>
        </div>

        {/* Top Selling Products Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <FiTrendingUp className="w-5 h-5 text-indigo-600" />
                Highest Velocity SKUs & Order Fulfillment
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Top grossing and most dispatched products across marketplace orders
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">
              Top {top_selling.length} Products
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-3.5 w-16">Rank</th>
                  <th className="px-6 py-3.5">Product / Industrial SKU</th>
                  <th className="px-6 py-3.5 text-right">Units Sold</th>
                  <th className="px-6 py-3.5 text-right">Realized GMV (INR ₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {top_selling.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
                      No fulfilled product order transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  top_selling.map((product, index) => (
                    <tr key={index} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          index === 0 ? 'bg-amber-100 text-amber-800' :
                          index === 1 ? 'bg-slate-200 text-slate-700' :
                          index === 2 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">{product.product_name}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">
                        {formatNumber(product.total_quantity)} units
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">
                        {formatCurrency(product.total_revenue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Details Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Industrial Vertical Catalog Breakdown</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Consolidated volume and percentage contribution per industry vertical
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">
              {by_category.length} verticals
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-3.5">Category Vertical</th>
                  <th className="px-6 py-3.5 text-right">Active SKU Count</th>
                  <th className="px-6 py-3.5 text-right">Catalog Share %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {by_category.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400 text-sm">
                      No categories found in the catalog.
                    </td>
                  </tr>
                ) : (
                  by_category.map((item, index) => {
                    const percentage = (inventory.total_products > 0)
                      ? ((item.count / inventory.total_products) * 100).toFixed(1)
                      : 0;

                    return (
                      <tr key={index} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-900">{item.category}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">
                          {formatNumber(item.count)}
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