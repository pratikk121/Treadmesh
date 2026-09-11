// Pages/Admin/Orders/Statistics.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatCurrency,
  formatIndianScale,
  formatIndianDate,
  formatOrderStatus,
  formatPaymentStatus
} from '@/Utils/formatters';

import {
  FiArrowLeft,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiPieChart,
  FiUsers,
  FiShield,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import {
  MdOutlinePayment,
  MdOutlineLocalShipping
} from 'react-icons/md';
import { BsBoxSeam, BsGraphUp } from 'react-icons/bs';

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
  Cell,
} from 'recharts';

export default function Statistics({ stats }) {
  const {
    daily = [],
    by_status = [],
    by_payment = [],
    top_products = [],
    top_buyers = []
  } = stats || {};

  // Colors for charts
  const STATUS_COLORS = {
    pending_confirmation: '#F59E0B', // Amber
    confirmed: '#3B82F6',            // Blue
    processing: '#8B5CF6',           // Purple
    shipped: '#06B6D4',              // Cyan
    delivered: '#10B981',            // Emerald
    cancelled: '#EF4444',            // Rose
    pending: '#F59E0B',              // Amber
    paid: '#10B981'                  // Emerald
  };

  // Format date for chart
  const formatChartDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? date : new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(d);
  };

  // Calculate totals from stats data
  const totalOrders = by_status.reduce((acc, curr) => acc + curr.total, 0);
  const totalRevenue = daily.reduce((acc, curr) => acc + (Number(curr.revenue) || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalUnitsSold = top_products.reduce((acc, curr) => acc + (Number(curr.total_quantity) || 0), 0);

  return (
    <DashboardLayout>
      <Head title="Purchase Order Intelligence & Analytics - Treadmesh Admin" />

      <div className="space-y-6 pb-12">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.orders.index')}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl transition shadow-xs"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Central Operations
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 font-medium">Fulfillment & Escrow</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
                Purchase Order Intelligence & Analytics
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Audit pan-India procurement velocity, gross settlement volumes, and commercial order distribution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={route('admin.orders.index')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow-sm transition"
            >
              <FiShoppingCart className="w-4 h-4 text-gray-300" />
              <span>Purchase Order Ledger</span>
            </Link>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Orders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Purchase Orders</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1.5 font-mono">
                  {totalOrders.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  <span>Cumulative B2B contracts</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                <FiShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 2: Gross Escrow Value */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gross Platform Escrow</p>
                <p className="text-2xl font-extrabold text-emerald-700 mt-1.5 font-mono">
                  {formatCurrency(totalRevenue)}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
                  <span>Scale:</span>
                  <span className="bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {formatIndianScale(totalRevenue)}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
                <FiShield className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 3: Average Order Value */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average PO Value</p>
                <p className="text-2xl font-extrabold text-indigo-700 mt-1.5 font-mono">
                  {formatCurrency(avgOrderValue)}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  <span>Mean wholesale ticket</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-600">
                <FiTrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 4: Total Units Sold */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Units Procured</p>
                <p className="text-2xl font-extrabold text-amber-600 mt-1.5 font-mono">
                  {totalUnitsSold.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-700 font-medium">
                  <BsBoxSeam className="w-3.5 h-3.5" />
                  <span>Physical units dispatched</span>
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-600">
                <BsBoxSeam className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Orders & Revenue Trend */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FiCalendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Daily Procurement Volume & Escrow GMV (Past 30 Days)</h3>
                  <p className="text-xs text-gray-500">Tracking daily contract volumes and value settlements</p>
                </div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daily} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tickFormatter={formatChartDate} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" orientation="left" stroke="#4F46E5" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#10B981"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(val) => formatIndianScale(val)}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'Escrow Value (₹)') return [formatCurrency(value), name];
                      return [`${value} Orders`, name];
                    }}
                    labelFormatter={(label) => formatIndianDate(label)}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="total_orders" fill="#4F46E5" name="Purchase Orders" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="revenue" fill="#10B981" name="Escrow Value (₹)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fulfillment Status Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FiPieChart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Orders by Fulfillment Status</h3>
                  <p className="text-xs text-gray-500">Pipeline progression from confirmation to delivery</p>
                </div>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={by_status}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="total"
                    nameKey="order_status"
                  >
                    {by_status.map((entry) => (
                      <Cell key={`cell-${entry.order_status}`} fill={STATUS_COLORS[entry.order_status] || '#9CA3AF'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} Orders`, formatOrderStatus(name)]}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
              {by_status.map((item) => (
                <div key={item.order_status} className="flex justify-between items-center p-2 rounded-lg bg-gray-50/70 border border-gray-100">
                  <span className="text-xs font-semibold text-gray-700">
                    {formatOrderStatus(item.order_status)}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-900">
                    {item.total.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Status Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <MdOutlinePayment className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Nodal Escrow & Payment Status</h3>
                  <p className="text-xs text-gray-500">Settled balances vs pending escrow reconciliations</p>
                </div>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={by_payment}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="total"
                    nameKey="payment_status"
                  >
                    {by_payment.map((entry) => (
                      <Cell key={`cell-${entry.payment_status}`} fill={STATUS_COLORS[entry.payment_status] || '#9CA3AF'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} Orders`, formatPaymentStatus(name)]}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
              {by_payment.map((item) => (
                <div key={item.payment_status} className="flex justify-between items-center p-2 rounded-lg bg-gray-50/70 border border-gray-100">
                  <span className="text-xs font-semibold text-gray-700">
                    {formatPaymentStatus(item.payment_status)}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-900">
                    {item.total.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <BsBoxSeam className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Top 10 Procured Products</h3>
                  <p className="text-xs text-gray-500">Highest velocity items across verified POs</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {top_products.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-2.5 hover:bg-gray-50/70 rounded-xl transition border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-gray-900 truncate max-w-[200px]">
                      {product.product_name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-gray-600 font-mono">
                      {Number(product.total_quantity).toLocaleString('en-IN')} Units
                    </span>
                    <span className="text-xs font-bold text-gray-900 font-mono block">
                      {formatCurrency(product.total_revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Buyers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-50 text-green-600 rounded-lg">
                  <FiUsers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Top 10 Enterprise Buyers</h3>
                  <p className="text-xs text-gray-500">Highest procurement spend and order volume</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {top_buyers.map((buyer, index) => (
                <div key={index} className="flex items-center justify-between p-2.5 hover:bg-gray-50/70 rounded-xl transition border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-gray-900 block">
                        {buyer.buyer?.name}
                      </span>
                      <span className="text-[11px] text-gray-500 font-mono">
                        {buyer.order_count} Purchase Orders
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    {formatCurrency(buyer.total_spent)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Breakdown Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base">Order Status Distribution Ledger</h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
              {totalOrders} Cumulative POs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/75 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Fulfillment Status
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Order Count
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Volume Share
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Distribution
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {by_status.map((item) => {
                  const percentage = totalOrders > 0
                    ? ((item.total / totalOrders) * 100).toFixed(1)
                    : 0;

                  return (
                    <tr key={item.order_status} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {formatOrderStatus(item.order_status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-bold text-gray-900">
                          {item.total.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono text-gray-600 font-medium">
                          {percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-36 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
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