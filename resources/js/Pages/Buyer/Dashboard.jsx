// resources/js/Pages/Buyer/Dashboard.jsx
import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiPackage,
  FiShoppingCart,
  FiFileText,
  FiMessageCircle,
  FiClock,
  FiTrendingUp,
  FiAlertCircle,
  FiUsers,
  FiArrowRight,
  FiShield,
  FiCheckCircle,
  FiExternalLink
} from 'react-icons/fi';
import { BsGraphUp, BsShieldCheck, BsBuildingCheck } from 'react-icons/bs';
import { MdOutlineMessage } from 'react-icons/md';
import { formatCurrency, formatIndianDate } from '@/Utils/formatters';

export default function BuyerDashboard() {
  const {
    recentRfqs = [],
    recentOrders = [],
    recentQuotes = [],
    unreadMessages = 0,
    recentMessages = [],
    statistics = {},
    chartData,
    recentActivity = [],
    savedSuppliersCount = 0,
    pendingActions = []
  } = usePage().props;

  // Refined Status Pill Styles
  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    switch (s) {
      case 'open':
      case 'active':
        return { label: 'Active RFQ', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'pending':
      case 'pending_confirmation':
        return { label: 'Pending Review', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'accepted':
        return { label: 'Bid Accepted', cls: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'confirmed':
        return { label: 'PO Confirmed', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'processing':
        return { label: 'In Production', cls: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'shipped':
        return { label: 'Dispatched (E-Way)', cls: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      case 'delivered':
        return { label: 'Escrow Released', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'rejected':
      case 'cancelled':
        return { label: 'Closed / Cancelled', cls: 'bg-slate-100 text-slate-600 border-slate-200' };
      default:
        return { label: s.replace('_', ' ').toUpperCase(), cls: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <DashboardLayout>
      <Head title="Buyer Procurement Command Center — Treadmesh India" />

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* ------------------------------------------------------------- */}
        {/* HEADER: CONSOLE TITLE & QUICK ACTIONS                         */}
        {/* ------------------------------------------------------------- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-500">
                Institutional Sourcing Terminal
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight mt-0.5">
              Procurement Command Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live overview of RFQs, competitive manufacturer bids, and orders secured in Nodal Escrow.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={route('buyer.rfqs.create')}
              className="group inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200"
            >
              <span>Publish New RFQ</span>
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
                <FiArrowRight className="text-xs" />
              </span>
            </Link>

            <Link
              href={route('buyer.messages.index')}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors relative"
              title="Supplier Communications"
            >
              <MdOutlineMessage className="text-lg text-slate-700" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-mono font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                  {unreadMessages}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PENDING ACTIONS ALERT (IF ANY)                                */}
        {/* ------------------------------------------------------------- */}
        {pendingActions?.length > 0 && (
          <div className="p-1 rounded-2xl bg-amber-500/10 border border-amber-300/80">
            <div className="p-4 rounded-xl bg-amber-50/80 flex items-start gap-3">
              <FiAlertCircle className="text-amber-700 text-lg mt-0.5 shrink-0" />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider font-mono">
                  Action Items Requiring Approval ({pendingActions.length})
                </h4>
                <div className="mt-2 space-y-1.5">
                  {pendingActions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <p className="text-amber-900 font-medium">{action.message}</p>
                      <Link
                        href={action.url}
                        className="text-amber-800 hover:text-amber-950 font-bold underline inline-flex items-center gap-1"
                      >
                        <span>Review Item</span>
                        <FiArrowRight className="text-xs" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* KEY METRICS TILES (INDIAN NUMBERING & RUPEE STANDARDS)       */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* RFQs Tile */}
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex justify-between items-start text-slate-400">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                  Published RFQs
                </span>
                <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                  <FiFileText className="text-base" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-950 mt-2">
                {statistics.total_rfqs || 0}
              </div>
              <div className="flex items-center gap-2 text-xs mt-2 text-slate-500">
                <span className="font-semibold text-emerald-600">{statistics.active_rfqs || 0} Active</span>
                <span>•</span>
                <span>{statistics.rfqs_this_month || 0} This Month</span>
              </div>
            </div>
          </div>

          {/* Quotes Received Tile */}
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex justify-between items-start text-slate-400">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                  Manufacturer Bids
                </span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <FiPackage className="text-base" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-950 mt-2">
                {statistics.total_quotes || 0}
              </div>
              <div className="flex items-center gap-2 text-xs mt-2 text-slate-500">
                <span className="font-semibold text-amber-600">{statistics.pending_quotes || 0} Under Evaluation</span>
                <span>•</span>
                <span>{statistics.quotes_this_month || 0} New</span>
              </div>
            </div>
          </div>

          {/* Orders Tile */}
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex justify-between items-start text-slate-400">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                  Wholesale Orders
                </span>
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <FiShoppingCart className="text-base" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-950 mt-2">
                {statistics.total_orders || 0}
              </div>
              <div className="flex items-center gap-2 text-xs mt-2 text-slate-500">
                <span className="font-semibold text-cyan-600">{statistics.pending_orders || 0} In Transit</span>
                <span>•</span>
                <span className="text-emerald-600">{statistics.delivered_orders || 0} Completed</span>
              </div>
            </div>
          </div>

          {/* Outlay Tile (INR) */}
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex justify-between items-start text-slate-400">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                  Total Sourcing Outlay
                </span>
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600 font-mono font-bold text-sm">
                  ₹
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-950 mt-2 truncate">
                {formatCurrency(statistics.total_spent)}
              </div>
              <div className="flex items-center gap-2 text-xs mt-2 text-slate-500">
                <span>Monthly: <strong className="text-slate-800 font-mono">{formatCurrency(statistics.monthly_spent)}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ACTIVITY OVERVIEW CHART SECTION                               */}
        {/* ------------------------------------------------------------- */}
        {chartData && (
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-6 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <BsGraphUp className="text-brand-600" /> Sourcing Activity Trend (Last 6 Months)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Monthly distribution of RFQ publishing volume vs. quote bids and fulfilled purchase orders.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono font-semibold">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 bg-indigo-600 rounded"></span> RFQs
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span> Orders
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 bg-purple-500 rounded"></span> Quotes
                  </div>
                </div>
              </div>

              {/* Responsive Bar Graphic */}
              <div className="h-48 border border-slate-100 rounded-xl bg-slate-50/50 p-4">
                <div className="grid grid-cols-6 gap-3 h-full items-end">
                  {chartData.labels.map((label, index) => {
                    const rfqMax = Math.max(...chartData.rfqs, 1);
                    const orderMax = Math.max(...chartData.orders, 1);
                    const quoteMax = Math.max(...chartData.quotes, 1);
                    const rfqHeight = Math.round((chartData.rfqs[index] / rfqMax) * 100);
                    const orderHeight = Math.round((chartData.orders[index] / orderMax) * 100);
                    const quoteHeight = Math.round((chartData.quotes[index] / quoteMax) * 100);

                    return (
                      <div key={label} className="flex flex-col items-center h-full justify-end">
                        <div className="flex items-end gap-1 w-full justify-center h-32">
                          <div
                            className="w-2 sm:w-3 bg-indigo-600 rounded-t transition-all duration-300"
                            style={{ height: `${Math.max(rfqHeight, 6)}%` }}
                            title={`RFQs: ${chartData.rfqs[index]}`}
                          />
                          <div
                            className="w-2 sm:w-3 bg-emerald-500 rounded-t transition-all duration-300"
                            style={{ height: `${Math.max(orderHeight, 6)}%` }}
                            title={`Orders: ${chartData.orders[index]}`}
                          />
                          <div
                            className="w-2 sm:w-3 bg-purple-500 rounded-t transition-all duration-300"
                            style={{ height: `${Math.max(quoteHeight, 6)}%` }}
                            title={`Quotes: ${chartData.quotes[index]}`}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 mt-2 font-medium">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TWO-COLUMN OPERATIONAL WORKBENCH                             */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Recent RFQs & Quotes (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Recent RFQs Table Card */}
            <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
              <div className="bg-white rounded-xl p-5 shadow-card">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <FiFileText className="text-brand-600" /> Active Sourcing Requests (RFQs)
                    </h3>
                    <p className="text-xs text-slate-500">Live technical inquiries open for manufacturer bidding</p>
                  </div>
                  <Link
                    href={route('buyer.rfqs.index')}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors inline-flex items-center gap-1"
                  >
                    <span>View All RFQs</span>
                    <FiChevronRight />
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {recentRfqs && recentRfqs.length > 0 ? (
                    recentRfqs.map((rfq) => {
                      const badge = getStatusBadge(rfq.status);
                      return (
                        <div
                          key={rfq.id}
                          className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-slate-900 truncate">
                                {rfq.title}
                              </h4>
                              <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full border ${badge.cls}`}>
                                {badge.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                              <span>RFQ #{rfq.rfq_number}</span>
                              <span>•</span>
                              <span>Target: {rfq.quantity} {rfq.unit || 'units'}</span>
                              <span>•</span>
                              <span>Required: {formatIndianDate(rfq.required_by_date)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 justify-end shrink-0">
                            {rfq.quotes_count > 0 && (
                              <span className="text-xs font-mono font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                                {rfq.quotes_count} Bids In
                              </span>
                            )}
                            <Link
                              href={route('buyer.rfqs.show', rfq.id)}
                              className="text-xs font-semibold text-slate-700 hover:text-slate-950 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              Manage RFQ &rarr;
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No active RFQs currently published.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Quotes Table Card */}
            <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
              <div className="bg-white rounded-xl p-5 shadow-card">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <FiPackage className="text-emerald-600" /> Incoming Factory Quotations
                    </h3>
                    <p className="text-xs text-slate-500">Direct wholesale bids received from verified suppliers</p>
                  </div>
                  <Link
                    href={route('buyer.quotes.index')}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors inline-flex items-center gap-1"
                  >
                    <span>View All Quotes</span>
                    <FiChevronRight />
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {recentQuotes && recentQuotes.length > 0 ? (
                    recentQuotes.map((quote) => {
                      const badge = getStatusBadge(quote.status);
                      return (
                        <div
                          key={quote.id}
                          className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-slate-900 truncate">
                                {quote.supplier?.name || 'Verified Supplier'}
                              </h4>
                              <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full border ${badge.cls}`}>
                                {badge.label}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 mt-0.5 truncate">
                              Target: {quote.rfq?.title || 'Wholesale Requirement'}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                              <span className="font-bold text-slate-900">{formatCurrency(quote.total_amount)}</span>
                              <span>•</span>
                              <span>Quote #{quote.quote_number}</span>
                              <span>•</span>
                              <span>Valid: {formatIndianDate(quote.valid_until)}</span>
                            </div>
                          </div>

                          <Link
                            href={route('buyer.quotes.show', quote.id)}
                            className="text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 px-3.5 py-1.5 rounded-lg transition-colors shrink-0 text-center"
                          >
                            Review & Accept Bid &rarr;
                          </Link>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No quotation bids received yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Escrow Orders, Messages & Vendor Network (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Purchase Orders in Escrow */}
            <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
              <div className="bg-white rounded-xl p-5 shadow-card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <FiShoppingCart className="text-indigo-600" /> Orders in Escrow
                  </h3>
                  <Link href={route('buyer.orders.index')} className="text-xs font-semibold text-brand-600 hover:text-brand-800">
                    All &rarr;
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {recentOrders && recentOrders.length > 0 ? (
                    recentOrders.map((order) => {
                      const badge = getStatusBadge(order.order_status);
                      return (
                        <div key={order.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-mono font-bold text-xs text-slate-900">
                                #{order.order_number}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5 truncate">
                                {order.supplier?.name}
                              </div>
                              <div className="font-mono font-bold text-slate-900 text-xs mt-1">
                                {formatCurrency(order.total_amount)}
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 text-[9px] font-mono font-semibold rounded border ${badge.cls}`}>
                              {badge.label}
                            </span>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
                            <span className="text-slate-400 text-[11px] font-mono">
                              {formatIndianDate(order.created_at)}
                            </span>
                            <Link
                              href={route('buyer.orders.show', order.id)}
                              className="text-brand-600 hover:text-brand-800 font-semibold"
                            >
                              Track & Escrow &rarr;
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center py-6 text-xs text-slate-400">No active purchase orders.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Supplier Communications */}
            <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
              <div className="bg-white rounded-xl p-5 shadow-card">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <FiMessageCircle className="text-purple-600" /> Supplier Messages
                  </h3>
                  <Link href={route('buyer.messages.index')} className="text-xs font-semibold text-brand-600 hover:text-brand-800">
                    Inbox &rarr;
                  </Link>
                </div>

                <div className="space-y-2">
                  {recentMessages && recentMessages.length > 0 ? (
                    recentMessages.map((msg) => {
                      const isMe = msg.sender_id === usePage().props.auth?.user?.id;
                      return (
                        <div key={msg.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                          <div className="flex justify-between font-medium text-slate-800 text-[11px]">
                            <span>{isMe ? 'You' : msg.sender?.name}</span>
                            <span className="text-slate-400 font-mono text-[10px]">{formatIndianDate(msg.created_at)}</span>
                          </div>
                          <p className="text-slate-600 mt-1 line-clamp-1">{msg.message}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center py-4 text-xs text-slate-400">No recent messages.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Verified Manufacturer Directory CTA */}
            <div className="p-1 rounded-2xl bg-slate-900 text-white shadow-card">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <BsBuildingCheck className="text-brand-400 text-base" />
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-brand-300">
                    Vetted Manufacturer Network
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">
                  Connected Suppliers ({savedSuppliersCount || 0})
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Explore verified manufacturers across Tirupur, Chakan, Peenya, Manesar, and Dahej industrial zones.
                </p>
                <Link
                  href={route('buyer.suppliers.index')}
                  className="mt-4 block w-full text-center bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Explore All Factory Hubs &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* INSTITUTIONAL AUDIT TRAIL / ACTIVITY FEED                     */}
        {/* ------------------------------------------------------------- */}
        {recentActivity && recentActivity.length > 0 && (
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
                <FiClock className="text-slate-500" /> Sourcing Audit Trail & Compliance Log
              </h3>
              <div className="divide-y divide-slate-100">
                {recentActivity.map((activity, index) => {
                  const badge = getStatusBadge(activity.status);
                  return (
                    <div key={index} className="py-2.5 flex items-center justify-between text-xs gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          {activity.type === 'rfq' && <FiFileText />}
                          {activity.type === 'order' && <FiShoppingCart />}
                          {activity.type === 'quote' && <FiPackage />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">{activity.title}</p>
                          <p className="text-[11px] font-mono text-slate-400">{formatIndianDate(activity.time)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {activity.amount && (
                          <span className="font-mono font-bold text-slate-900">
                            {formatCurrency(activity.amount)}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-[9px] font-mono font-semibold rounded border ${badge.cls}`}>
                          {badge.label}
                        </span>
                        {activity.url && (
                          <Link href={activity.url} className="text-brand-600 hover:text-brand-800 font-semibold">
                            View &rarr;
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}