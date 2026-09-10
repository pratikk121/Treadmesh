// resources/js/Pages/Admin/Dashboard.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiDownload,
  FiRefreshCw,
  FiArrowUpRight,
  FiShield,
  FiActivity,
  FiDatabase,
  FiServer
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
} from 'react-icons/md';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  formatCurrency,
  formatIndianScale,
  formatIndianDate,
  formatOrderStatus,
  formatPaymentStatus,
  formatRfqStatus
} from '@/Utils/formatters';

export default function AdminDashboard({
  stats,
  charts,
  pendingItems,
  recentOrders,
  recentRfqs,
  systemHealth
}) {
  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (['paid', 'delivered', 'approved', 'verified'].includes(s)) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-1 ring-emerald-500/10';
    }
    if (['processing', 'quoted', 'shipped'].includes(s)) {
      return 'bg-sky-50 text-sky-700 border-sky-200/80 ring-1 ring-sky-500/10';
    }
    if (['pending', 'pending_confirmation', 'unpaid', 'open'].includes(s)) {
      return 'bg-amber-50 text-amber-700 border-amber-200/80 ring-1 ring-amber-500/10';
    }
    if (['rejected', 'cancelled'].includes(s)) {
      return 'bg-rose-50 text-rose-700 border-rose-200/80 ring-1 ring-rose-500/10';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200/80';
  };

  const revenueMoM = stats?.revenue_last_month > 0
    ? Math.round(((stats.revenue_this_month - stats.revenue_last_month) / stats.revenue_last_month) * 100)
    : 0;

  return (
    <DashboardLayout>
      <Head title="Enterprise Admin Operations — Treadmesh" />

      <div className="space-y-8 pb-10">
        {/* Top Header / Platform Command Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                Central Operations Console
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Nodal Escrow Live
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              National wholesale marketplace overview, GSTIN verification queue, and transaction health.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition active:scale-[0.98]"
            >
              <FiDownload className="w-4 h-4 text-slate-500" />
              <span>Export Audit Ledger</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 shadow-sm transition active:scale-[0.98]"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Node</span>
            </button>
          </div>
        </div>

        {/* Double-Bezel High-Impact Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* GMV Today */}
          <div className="p-1 rounded-2xl bg-gradient-to-b from-slate-200/80 via-slate-100 to-slate-200/40 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="bg-white rounded-[14px] p-5 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Platform Volume Today
                  </span>
                  <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 mt-1">
                    {formatCurrency(stats?.revenue_today || 0)}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <FiActivity className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Month-on-Month</span>
                <span className={`inline-flex items-center font-semibold font-mono ${revenueMoM >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {revenueMoM >= 0 ? (
                    <FiTrendingUp className="w-3.5 h-3.5 mr-1" />
                  ) : (
                    <FiTrendingDown className="w-3.5 h-3.5 mr-1" />
                  )}
                  {revenueMoM >= 0 ? `+${revenueMoM}%` : `${revenueMoM}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Today's Orders */}
          <div className="p-1 rounded-2xl bg-gradient-to-b from-slate-200/80 via-slate-100 to-slate-200/40 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="bg-white rounded-[14px] p-5 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Active Orders Today
                  </span>
                  <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 mt-1">
                    {stats?.orders_today || 0}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <FiShoppingCart className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1 text-[11px] text-slate-500">
                <div>
                  <span className="block text-[10px] uppercase text-slate-400">Pending</span>
                  <span className="font-bold text-slate-700 font-mono">{stats?.orders_by_status?.pending_confirmation || 0}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-slate-400">In Prod</span>
                  <span className="font-bold text-slate-700 font-mono">{stats?.orders_by_status?.processing || 0}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-slate-400">Delivered</span>
                  <span className="font-bold text-emerald-600 font-mono">{stats?.orders_by_status?.delivered || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Registered Enterprises */}
          <div className="p-1 rounded-2xl bg-gradient-to-b from-slate-200/80 via-slate-100 to-slate-200/40 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="bg-white rounded-[14px] p-5 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Registered Enterprises
                  </span>
                  <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 mt-1">
                    {stats?.total_users || 0}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <FiUsers className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  <span className="font-semibold text-slate-800">{stats?.users_by_role?.buyer || 0}</span> Buyers
                  {' '}&bull;{' '}
                  <span className="font-semibold text-slate-800">{stats?.users_by_role?.supplier || 0}</span> Suppliers
                </span>
                <span className="text-emerald-600 font-medium font-mono text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                  +{stats?.new_users_today || 0} today
                </span>
              </div>
            </div>
          </div>

          {/* Catalog Management */}
          <div className="p-1 rounded-2xl bg-gradient-to-b from-slate-200/80 via-slate-100 to-slate-200/40 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="bg-white rounded-[14px] p-5 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Live Catalog SKUs
                  </span>
                  <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 mt-1">
                    {stats?.approved_products || 0}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <FiPackage className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Low Stock: <span className="font-semibold text-rose-600 font-mono">{stats?.low_stock_products || 0}</span>
                </span>
                <span className="text-amber-700 font-medium font-mono text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                  {stats?.pending_products || 0} pending audit
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification & Compliance Pipelines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supplier KYC & GSTIN Verification Queue */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center">
                  <MdPending className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Supplier KYC & GSTIN Verification
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manufacturing units awaiting compliance audit & escrow approval
                  </p>
                </div>
              </div>
              <Link
                href={route('admin.supplier-verification.index')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                View Queue <FiArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {pendingItems?.suppliers?.length > 0 ? (
                pendingItems.suppliers.map((supplier) => (
                  <div key={supplier.id} className="p-4 hover:bg-slate-50/80 transition flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold font-mono text-sm flex items-center justify-center shrink-0">
                        {supplier.company_name?.charAt(0) || 'V'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {supplier.company_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{supplier.contact}</span>
                          <span>&bull;</span>
                          <span className="truncate">{supplier.email}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">
                          Submitted: {formatIndianDate(supplier.submitted_at)}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={supplier.url}
                      className="shrink-0 px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                      Audit KYC
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center my-auto">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-emerald-100">
                    <FiCheckCircle className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">All Vendors Audited</p>
                  <p className="text-xs text-slate-500 mt-0.5">Zero pending GSTIN verification tickets in queue.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Product Catalog Approvals */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100/80 text-sky-700 flex items-center justify-center">
                  <FiPackage className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Pending Catalog Approvals
                  </h2>
                  <p className="text-xs text-slate-500">
                    Wholesale items awaiting HSN, specification, and pricing review
                  </p>
                </div>
              </div>
              <Link
                href={route('admin.product-approval.index')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                View All <FiArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {pendingItems?.products?.length > 0 ? (
                pendingItems.products.map((product) => (
                  <div key={product.id} className="p-4 hover:bg-slate-50/80 transition flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
                        <FiPackage className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>Vendor: {product.supplier}</span>
                          <span>&bull;</span>
                          <span className="font-mono font-medium text-slate-700">{formatCurrency(product.price)}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">
                          Submitted: {formatIndianDate(product.submitted_at)}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={product.url}
                      className="shrink-0 px-3.5 py-1.5 bg-brand-600 text-white hover:bg-brand-700 text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                      Review SKU
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center my-auto">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-emerald-100">
                    <FiCheckCircle className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">Catalog Queue Clear</p>
                  <p className="text-xs text-slate-500 mt-0.5">All submitted wholesale listings have been reviewed and published.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recharts Performance Trends (30 Days) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  30-Day Platform Gross Volume
                </h3>
                <p className="text-xs text-slate-500">
                  Settled transactions processed through RBI-compliant Nodal Escrow
                </p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                INR (₹)
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts?.revenue_trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => formatIndianScale(val)}
                  />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Volume']}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#F8FAFC',
                      fontSize: '12px',
                      padding: '8px 12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0284C7"
                    strokeWidth={2.5}
                    fill="url(#adminRevenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Flow Trend Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  30-Day Order Fulfillment Velocity
                </h3>
                <p className="text-xs text-slate-500">
                  Daily purchase orders confirmed and moved into production
                </p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                PO Units
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts?.order_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#F8FAFC',
                      fontSize: '12px',
                      padding: '8px 12px'
                    }}
                  />
                  <Bar dataKey="orders" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transactions & Procurement Tenders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Purchase Orders</h3>
                <p className="text-xs text-slate-500">Latest commercial transactions across manufacturing clusters</p>
              </div>
              <Link
                href={route('admin.orders.index')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                All Orders <FiArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/75 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">PO Number</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Parties</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gross Value</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {recentOrders?.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5">
                        <Link href={order.url} className="font-mono font-semibold text-brand-600 hover:text-brand-700">
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-medium text-slate-900">{order.buyer}</p>
                          <p className="text-[11px] text-slate-500">&rarr; {order.supplier}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadge(order.status)}`}>
                          {formatOrderStatus(order.status)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadge(order.payment_status)}`}>
                          {formatPaymentStatus(order.payment_status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent RFQs / Enterprise Tenders */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent RFQ Tenders</h3>
                <p className="text-xs text-slate-500">Live demand requests broadcasted to verified manufacturers</p>
              </div>
              <Link
                href={route('admin.rfqs.index')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                All RFQs <FiArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/75 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tender ID</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Requirements</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Procuring Buyer</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bids</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {recentRfqs?.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5">
                        <Link href={rfq.url} className="font-mono font-semibold text-brand-600 hover:text-brand-700">
                          {rfq.rfq_number}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-medium text-slate-900 truncate max-w-[180px]">{rfq.title}</p>
                          <p className="text-[11px] text-slate-500 font-mono">Lot Size: {rfq.quantity}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        {rfq.buyer}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">
                        {rfq.quotes_count}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadge(rfq.status)}`}>
                          {formatRfqStatus(rfq.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Secondary Metric Highlights & System Reliability */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                <MdVerified className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Verified Vendors</p>
                <p className="text-lg font-bold font-mono text-slate-900">{stats?.verified_suppliers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <FiCheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Active SKUs</p>
                <p className="text-lg font-bold font-mono text-slate-900">{stats?.approved_products || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <FiFileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Active Tenders</p>
                <p className="text-lg font-bold font-mono text-slate-900">{stats?.open_rfqs || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <FiShield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Average PO Value</p>
                <p className="text-lg font-bold font-mono text-slate-900">
                  {formatCurrency(stats?.average_order_value || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* System Health / Cloud Infrastructure Sentinel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <FiServer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Cloud Infrastructure & Sentinel Status</h3>
                <p className="text-xs text-slate-500">Production Redis worker nodes, PostgreSQL replication, and storage telemetry</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              All Systems Operational
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-3 border-t border-slate-100">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500">S3 / Cloud Storage</span>
                <span className="text-xs font-mono font-bold text-slate-900">{systemHealth?.storage_usage?.percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-brand-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${systemHealth?.storage_usage?.percentage}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
                {systemHealth?.storage_usage?.used} of {systemHealth?.storage_usage?.total}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Queued Worker Jobs</p>
              <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">{systemHealth?.pending_jobs || 0}</p>
              <p className="text-[10px] text-slate-400 mt-1">Async PDF & Mail pipeline</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Failed Queue Jobs</p>
              <p className={`text-xl font-bold font-mono mt-0.5 ${systemHealth?.failed_jobs > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {systemHealth?.failed_jobs || 0}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Dead-letter queue</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">PostgreSQL Backup</p>
              <p className="text-base font-bold font-mono text-slate-900 mt-0.5">{systemHealth?.last_backup || 'Automated Hourly'}</p>
              <p className="text-[10px] text-emerald-600 mt-1 font-semibold">&bull; Encrypted Hot Snapshot</p>
            </div>
          </div>
        </div>

        {/* Quick Operational Shortcuts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href={route('admin.suppliers.index')}
            className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-brand-300 hover:shadow-sm transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition">
                <FiUsers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Vendors</p>
                <p className="text-[11px] text-slate-500">Manage manufacturers</p>
              </div>
            </div>
          </Link>

          <Link
            href={route('admin.products.index')}
            className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-brand-300 hover:shadow-sm transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition">
                <FiPackage className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Catalog</p>
                <p className="text-[11px] text-slate-500">Master SKU registry</p>
              </div>
            </div>
          </Link>

          <Link
            href={route('admin.orders.index')}
            className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-brand-300 hover:shadow-sm transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition">
                <FiShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Purchase Orders</p>
                <p className="text-[11px] text-slate-500">Escrow & fulfillment</p>
              </div>
            </div>
          </Link>

          <Link
            href={route('admin.rfqs.index')}
            className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-brand-300 hover:shadow-sm transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition">
                <FiFileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Tenders & RFQs</p>
                <p className="text-[11px] text-slate-500">Commercial quotes</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}