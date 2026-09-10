// resources/js/Pages/Supplier/Dashboard.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiPackage,
  FiShoppingCart,
  FiFileText,
  FiMessageSquare,
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiDownload,
  FiRefreshCw,
  FiTruck,
  FiBarChart2,
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
  FiChevronRight
} from 'react-icons/fi';
import {
  BsShieldCheck,
  BsBuildingCheck,
  BsGraphUp,
  BsBoxSeam
} from 'react-icons/bs';
import { MdWarning } from 'react-icons/md';
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { formatCurrency, formatIndianDate } from '@/Utils/formatters';

export default function SupplierDashboard({
  counts = {},
  chart_data = {},
  recent_rfqs = [],
  top_products = [],
  recent_orders = [],
  sales_analytics = {},
  recent_messages = [],
  low_stock_alerts = [],
  quote_performance = {},
  upcoming_deliveries = [],
}) {
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(value || 0);
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    switch (s) {
      case 'open':
      case 'active':
        return { label: 'Active', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'pending':
      case 'pending_confirmation':
        return { label: 'Awaiting Confirmation', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'accepted':
        return { label: 'Bid Accepted', cls: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'confirmed':
        return { label: 'Order Confirmed', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'processing':
        return { label: 'In Production', cls: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'shipped':
        return { label: 'Dispatched (E-Way)', cls: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      case 'delivered':
        return { label: 'Settled & Released', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'rejected':
      case 'cancelled':
        return { label: 'Closed / Cancelled', cls: 'bg-slate-100 text-slate-600 border-slate-200' };
      default:
        return { label: s.replace('_', ' ').toUpperCase(), cls: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const CHART_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <DashboardLayout>
      <Head title="Manufacturer Operations Console — Treadmesh India" />

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* ------------------------------------------------------------- */}
        {/* CONSOLE HEADER & EXPORT ACTIONS                               */}
        {/* ------------------------------------------------------------- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-500">
                Factory Dispatch & Sourcing Node
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight mt-0.5">
              Manufacturer Operations Console
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track active wholesale production, incoming RFQ tenders, and escrow-backed milestone settlements.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => window.location.href = route('supplier.dashboard.export')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <FiDownload className="text-xs" />
              <span>Export GST Ledger</span>
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-950 text-white hover:bg-slate-800 rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <FiRefreshCw className="text-xs" />
              <span>Sync Feeds</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* UNREAD COMMUNICATIONS ALERT                                   */}
        {/* ------------------------------------------------------------- */}
        {counts?.unreadMessages > 0 && (
          <div className="p-1 rounded-2xl bg-brand-500/10 border border-brand-200">
            <div className="p-4 rounded-xl bg-brand-50/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-brand-950 font-medium">
                <FiMessageSquare className="text-brand-600 text-base shrink-0" />
                <span>
                  You have <strong className="font-mono">{counts.unreadMessages}</strong> unread commercial inquiries from enterprise buyers.
                </span>
              </div>
              <Link
                href={route('supplier.messages.index')}
                className="font-bold text-brand-700 hover:text-brand-900 underline inline-flex items-center gap-1"
              >
                <span>Open Buyer Inbox</span>
                <FiChevronRight className="text-xs" />
              </Link>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* KEY OPERATIONAL METRICS (INR CALIBRATED)                      */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue Tile */}
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex justify-between items-start text-slate-400">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                  Monthly Invoiced Value
                </span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 font-mono font-bold text-sm">
                  ₹
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-950 mt-2 truncate">
                {formatCurrency(counts?.monthlyRevenue || 0)}
              </div>
              <div className="flex items-center justify-between text-xs mt-2 text-slate-500">
                <span>Total: <strong className="text-slate-800 font-mono">{formatCurrency(counts?.totalRevenue || 0)}</strong></span>
                {sales_analytics?.growth?.revenue !== undefined && (
                  <span className={`font-mono font-semibold flex items-center gap-0.5 ${
                    sales_analytics.growth.revenue >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {sales_analytics.growth.revenue >= 0 ? <FiTrendingUp className="text-xs" /> : <FiTrendingDown className="text-xs" />}
                    {Math.abs(Math.round(sales_analytics.growth.revenue))}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Orders Tile */}
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex justify-between items-start text-slate-400">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                  Total Purchase Orders
                </span>
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <FiShoppingCart className="text-base" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-950 mt-2">
                {formatNumber(counts?.totalOrders || 0)}
              </div>
              <div className="grid grid-cols-3 gap-1 text-[11px] font-mono mt-2 pt-2 border-t border-slate-100 text-slate-500">
                <div>
                  <span className="text-amber-600 font-bold">{counts?.pendingOrders || 0}</span> Awaiting
                </div>
                <div>
                  <span className="text-purple-600 font-bold">{counts?.processingOrders || 0}</span> Making
                </div>
                <div>
                  <span className="text-emerald-600 font-bold">{counts?.deliveredOrders || 0}</span> Settled
                </div>
              </div>
            </div>
          </div>

          {/* Products Tile */}
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex justify-between items-start text-slate-400">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                  Catalog Inventory
                </span>
                <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                  <FiPackage className="text-base" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-950 mt-2">
                {formatNumber(counts?.activeProducts || 0)}
                <span className="text-xs font-normal text-slate-400 font-sans ml-1">SKUs Live</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2 text-slate-500">
                <span>Total: <strong className="font-mono text-slate-700">{counts?.totalProducts || 0}</strong></span>
                {low_stock_alerts?.length > 0 && (
                  <span className="text-amber-600 font-semibold font-mono flex items-center gap-1">
                    <FiAlertTriangle className="text-xs" /> {low_stock_alerts.length} Low
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quotation Acceptance Tile */}
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex justify-between items-start text-slate-400">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                  Bid Conversion Rate
                </span>
                <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600">
                  <FiBarChart2 className="text-base" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-950 mt-2">
                {Math.round(quote_performance?.acceptanceRate || 0)}%
              </div>
              <div className="flex items-center justify-between text-xs mt-2 text-slate-500">
                <span>Won: <strong className="text-emerald-600 font-mono">{quote_performance?.acceptedQuotes || 0}</strong></span>
                <span>•</span>
                <span>Active Bids: <strong className="text-amber-600 font-mono">{quote_performance?.pendingQuotes || 0}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* LOW INVENTORY STOCK NOTICES (IF ANY)                          */}
        {/* ------------------------------------------------------------- */}
        {low_stock_alerts?.length > 0 && (
          <div className="p-1 rounded-2xl bg-amber-500/10 border border-amber-300">
            <div className="bg-white rounded-xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-3 text-amber-800">
                <MdWarning className="text-lg text-amber-600 shrink-0" />
                <h3 className="font-bold text-xs uppercase tracking-wider font-mono">
                  Inventory Replenishment Warnings ({low_stock_alerts.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {low_stock_alerts.map((product) => (
                  <div key={product.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={route('supplier.products.edit', product.id)}
                        className="font-bold text-xs text-slate-900 hover:text-brand-600 truncate block"
                      >
                        {product.name}
                      </Link>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        SKU: {product.sku} • Stock: <span className="text-rose-600 font-bold">{product.stock_quantity} units</span>
                      </div>
                    </div>
                    <Link
                      href={route('supplier.products.edit', product.id)}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-800 shrink-0"
                    >
                      Update
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CHARTS: SALES TRENDS & ORDER STATUS BREAKDOWN                 */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Line Chart (8 cols) */}
          <div className="lg:col-span-8 p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <BsGraphUp className="text-brand-600" /> Revenue & Order Volume Trend
                  </h3>
                  <p className="text-xs text-slate-500">Daily invoicing value in INR (₹) and completed purchase orders</p>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                  Daily Cadence
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chart_data?.daily_sales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="date"
                      stroke="#94A3B8"
                      fontSize={11}
                      fontFamily="JetBrains Mono"
                      tickFormatter={(date) => formatIndianDate(date)}
                    />
                    <YAxis yAxisId="left" stroke="#94A3B8" fontSize={11} fontFamily="JetBrains Mono" />
                    <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={11} fontFamily="JetBrains Mono" />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'Invoiced (₹)') return formatCurrency(value);
                        return value;
                      }}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#F8FAFC',
                        fontSize: '11px',
                        fontFamily: 'JetBrains Mono'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      name="Invoiced (₹)"
                      stroke="#4F46E5"
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      name="Units/Orders"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Orders by Status Donut (4 cols) */}
          <div className="lg:col-span-4 p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card flex flex-col justify-between h-full">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  Order Status Distribution
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Active fulfillment & dispatch balance
                </p>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(chart_data?.orders_by_status || {}).map(([name, value]) => ({
                        name: getStatusBadge(name).label,
                        value
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {Object.entries(chart_data?.orders_by_status || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => formatNumber(val)}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        color: '#F8FAFC',
                        fontSize: '11px',
                        fontFamily: 'JetBrains Mono'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-center text-[10px] font-mono">
                {Object.keys(chart_data?.orders_by_status || {}).slice(0, 4).map((status, idx) => (
                  <div key={status} className="flex items-center gap-1 text-slate-600">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                    <span>{getStatusBadge(status).label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* RECENT ORDERS & MATCHING RFQS TABLES                          */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders Table Card */}
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <FiShoppingCart className="text-brand-600" /> Recent Purchase Orders
                  </h3>
                  <p className="text-xs text-slate-500">Incoming purchase orders with escrow settlement status</p>
                </div>
                <Link
                  href={route('supplier.orders.index')}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-800 inline-flex items-center gap-1"
                >
                  <span>View All</span>
                  <FiChevronRight />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3">Order #</th>
                      <th className="py-2.5 px-3">Enterprise Buyer</th>
                      <th className="py-2.5 px-3">Amount (₹)</th>
                      <th className="py-2.5 px-3">Fulfillment Status</th>
                      <th className="py-2.5 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recent_orders && recent_orders.length > 0 ? (
                      recent_orders.map((order) => {
                        const badge = getStatusBadge(order.order_status);
                        return (
                          <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-brand-600">
                              <Link href={route('supplier.orders.show', order.id)}>
                                #{order.order_number}
                              </Link>
                            </td>
                            <td className="py-3 px-3 font-medium text-slate-800">
                              {order.buyer?.name || 'Commercial Buyer'}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-950">
                              {formatCurrency(order.total_amount)}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 text-[9px] font-mono font-semibold rounded-full border ${badge.cls}`}>
                                {badge.label}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                              {formatIndianDate(order.created_at)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-400">
                          No recent orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Matching RFQs Table Card */}
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <FiFileText className="text-purple-600" /> Tenders Matching Manufacturing Profile
                  </h3>
                  <p className="text-xs text-slate-500">Live buyer inquiries open for direct quotation submission</p>
                </div>
                <Link
                  href={route('supplier.rfqs.index')}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-800 inline-flex items-center gap-1"
                >
                  <span>View All</span>
                  <FiChevronRight />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3">RFQ #</th>
                      <th className="py-2.5 px-3">Part Title & Volume</th>
                      <th className="py-2.5 px-3">Buyer</th>
                      <th className="py-2.5 px-3">Deadline</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recent_rfqs && recent_rfqs.length > 0 ? (
                      recent_rfqs.map((rfq) => (
                        <tr key={rfq.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            #{rfq.rfq_number}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-slate-900 line-clamp-1">{rfq.title}</div>
                            <div className="text-[11px] font-mono text-slate-500">Target: {rfq.quantity} units</div>
                          </td>
                          <td className="py-3 px-3 text-slate-700">
                            {rfq.buyer?.name || 'Verified Buyer'}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600">
                            {formatIndianDate(rfq.required_by_date)}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              href={route('supplier.rfqs.create-quote', rfq.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-950 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                            >
                              <span>Bid Quote</span>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-400">
                          No matching RFQs open at present.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TOP PRODUCTS & UPCOMING FREIGHT DELIVERIES                    */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FiBarChart2 className="text-emerald-600" /> High-Volume Commercial SKUs
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Monthly Ranking</span>
              </div>

              <div className="space-y-3">
                {top_products && top_products.length > 0 ? (
                  top_products.map((product, idx) => (
                    <div key={product.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
                          0{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={route('supplier.products.edit', product.id)}
                            className="font-bold text-xs text-slate-900 hover:text-brand-600 truncate block"
                          >
                            {product.name}
                          </Link>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                            Sold: {formatNumber(product.total_quantity_sold || 0)} units • Revenue: <strong className="text-slate-800">{formatCurrency(product.total_revenue || 0)}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="w-20 sm:w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden shrink-0">
                        <div
                          className="h-full bg-brand-600 rounded-full"
                          style={{ width: `${Math.min((product.total_quantity_sold || 0) / (top_products[0]?.total_quantity_sold || 1) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-xs text-slate-400">No product sales logged this period.</p>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Freight Deliveries */}
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FiTruck className="text-cyan-600" /> Upcoming Freight Dispatches
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Next 7 Days</span>
              </div>

              <div className="space-y-3">
                {upcoming_deliveries && upcoming_deliveries.length > 0 ? (
                  upcoming_deliveries.map((order) => {
                    const badge = getStatusBadge(order.order_status);
                    return (
                      <div key={order.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                            <FiTruck className="text-base" />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={route('supplier.orders.show', order.id)}
                              className="font-bold text-xs text-slate-900 hover:text-brand-600 truncate block"
                            >
                              Order #{order.order_number}
                            </Link>
                            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                              Buyer: {order.buyer?.name} • Est. Dispatch: {formatIndianDate(order.estimated_delivery)}
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-mono font-semibold rounded border shrink-0 ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center py-6 text-xs text-slate-400">No deliveries scheduled in next 7 days.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* QUOTE CONVERSION PERFORMANCE GRID                            */}
        {/* ------------------------------------------------------------- */}
        <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
          <div className="bg-white rounded-xl p-5 shadow-card">
            <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <BsShieldCheck className="text-brand-600" /> Quotation Governance & Bidding Metrics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                  Total Bids Quoted
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                  {formatNumber(quote_performance?.totalQuotes || 0)}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 block font-semibold">
                  Accepted Bids
                </span>
                <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block">
                  {formatNumber(quote_performance?.acceptedQuotes || 0)}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 block font-semibold">
                  Awaiting Decision
                </span>
                <span className="text-xl font-bold font-mono text-amber-700 mt-1 block">
                  {formatNumber(quote_performance?.pendingQuotes || 0)}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                  Avg Turnaround
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                  {Math.round(quote_performance?.averageResponseTime || 18)} hrs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}