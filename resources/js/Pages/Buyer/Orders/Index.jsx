// resources/js/Pages/Buyer/Orders/Index.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiShoppingBag,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiSearch,
  FiCalendar,
  FiFileText,
  FiArrowUpRight,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import { MdPending, MdVerified } from 'react-icons/md';
import {
  formatCurrency,
  formatIndianDate,
  formatOrderStatus,
  formatPaymentStatus
} from '@/Utils/formatters';

export default function OrdersIndex({ orders, counts }) {
  const [filters, setFilters] = useState({
    status: '',
    payment_status: '',
    search: '',
    from_date: '',
    to_date: '',
    sort: 'latest'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    router.get(route('buyer.orders.index'), newFilters, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('buyer.orders.index'), filters, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const resetFilters = () => {
    const resetValues = {
      status: '',
      search: '',
      to_date: '',
      from_date: '',
      sort: 'latest',
      payment_status: '',
    };
    setFilters(resetValues);
    router.get(route('buyer.orders.index'), resetValues, {
      preserveState: true
    });
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (['delivered', 'confirmed', 'sure'].includes(s)) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10';
    }
    if (['processing', 'shipped'].includes(s)) {
      return 'bg-sky-50 text-sky-700 border-sky-200 ring-1 ring-sky-500/10';
    }
    if (['pending_confirmation', 'pending'].includes(s)) {
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/10';
    }
    if (['cancelled', 'cancel'].includes(s)) {
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/10';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <DashboardLayout>
      <Head title="Purchase Orders — Treadmesh" />

      <div className="space-y-6 pb-12">
        {/* Header - Title and summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              Purchase Order Ledger
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track B2B wholesale procurement, factory dispatches, E-Way bills, and delivery settlements.
            </p>
          </div>
          <Link
            href={route('buyer.products.index')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-xs font-semibold shadow-sm transition active:scale-[0.98] self-start sm:self-auto"
          >
            <FiShoppingBag className="w-4 h-4" />
            <span>Procure New SKUs</span>
          </Link>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Awaiting Acceptance
            </span>
            <p className="text-xl font-bold font-mono text-amber-600 mt-1">{counts?.pending || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              In Production
            </span>
            <p className="text-xl font-bold font-mono text-purple-600 mt-1">{counts?.processing || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Dispatched (Transit)
            </span>
            <p className="text-xl font-bold font-mono text-sky-600 mt-1">{counts?.shipped || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Delivered & Settled
            </span>
            <p className="text-xl font-bold font-mono text-emerald-600 mt-1">{counts?.delivered || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Total PO Contracts
            </span>
            <p className="text-xl font-bold font-mono text-slate-900 mt-1">{orders?.total || 0}</p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by PO number..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              {/* Order Status */}
              <div>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">All Fulfillment Statuses</option>
                  <option value="pending_confirmation">Awaiting Acceptance</option>
                  <option value="confirmed">PO Confirmed</option>
                  <option value="processing">In Production</option>
                  <option value="shipped">Dispatched (E-Way Bill)</option>
                  <option value="delivered">Delivered & Accepted</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <select
                  value={filters.payment_status}
                  onChange={(e) => handleFilterChange('payment_status', e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">All Settlement Statuses</option>
                  <option value="pending">Awaiting Escrow Deposit</option>
                  <option value="paid">Paid (Nodal Escrow Held)</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount_high">Value: High to Low</option>
                  <option value="amount_low">Value: Low to High</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
                <span className="text-slate-500">Date:</span>
                <input
                  type="date"
                  value={filters.from_date}
                  onChange={(e) => handleFilterChange('from_date', e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1"
                />
                <span className="text-slate-400">&rarr;</span>
                <input
                  type="date"
                  value={filters.to_date}
                  onChange={(e) => handleFilterChange('to_date', e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1"
                />
              </div>

              <div className="flex items-center gap-2 self-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Orders Listing */}
        {orders?.data?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <FiShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Purchase Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Initiate quotes through RFQ tenders or direct wholesale catalog procurement to generate verified B2B orders.
            </p>
            <Link
              href={route('buyer.products.index')}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
            >
              Browse National Wholesale Catalog &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.data.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Order Overview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Link
                        href={route('buyer.orders.show', order.id)}
                        className="text-base font-bold font-mono text-brand-600 hover:text-brand-700"
                      >
                        PO-{order.order_number}
                      </Link>
                      <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadge(order.order_status)}`}>
                        {formatOrderStatus(order.order_status)}
                      </span>
                      <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {formatPaymentStatus(order.payment_status)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="font-medium text-slate-900">
                        Supplier: {order.supplier?.name || 'Verified Manufacturer'}
                      </span>
                      <span>&bull;</span>
                      <span>Order Date: {formatIndianDate(order.created_at)}</span>
                      <span>&bull;</span>
                      <span className="font-mono font-bold text-slate-900">
                        Total Value: {formatCurrency(order.total_amount)}
                      </span>
                    </div>

                    {/* Order Line Items Snippet */}
                    {order.items && order.items.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-700"
                          >
                            <FiPackage className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium truncate max-w-[200px]">{item.product_name}</span>
                            <span className="font-mono text-slate-400">({item.quantity} units)</span>
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-xs text-slate-400 self-center">
                            +{order.items.length - 3} more items
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                    <Link
                      href={route('buyer.orders.show', order.id)}
                      className="px-3.5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-xs font-semibold transition"
                    >
                      View Order Details
                    </Link>
                    <Link
                      href={route('buyer.orders.invoice', order.id)}
                      className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 text-xs font-semibold transition inline-flex items-center gap-1"
                    >
                      <FiFileText className="w-3.5 h-3.5" />
                      <span>Tax Invoice</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {orders.links && orders.links.length > 3 && (
              <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
                <p>
                  Showing {orders.from || 0} to {orders.to || 0} of {orders.total || 0} orders
                </p>
                <div className="flex gap-1">
                  {orders.links.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => link.url && router.get(link.url)}
                      disabled={!link.url || link.active}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                        link.active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : link.url
                          ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}