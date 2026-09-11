// resources/js/Pages/Supplier/Orders/Index.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiEye,
  FiFilter,
  FiSearch,
  FiShoppingCart,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiPackage,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiFileText
} from 'react-icons/fi';
import { MdPending, MdVerified } from 'react-icons/md';
import {
  formatCurrency,
  formatIndianDate,
  formatOrderStatus,
  formatPaymentStatus
} from '@/Utils/formatters';

export default function OrdersIndex({ orders, stats, orderStatuses, paymentStatuses }) {
  const [dateTo, setDateTo] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    router.get(route('supplier.orders.index'), {
      search: searchTerm,
      order_status: orderStatus,
      payment_status: paymentStatus,
      date_from: dateFrom,
      date_to: dateTo,
      sort: sortField,
      direction: sortDirection
    }, {
      preserveState: true,
      replace: true
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setOrderStatus('');
    setPaymentStatus('');
    setDateFrom('');
    setDateTo('');
    setSortField('created_at');
    setSortDirection('desc');

    router.get(route('supplier.orders.index'), {}, {
      preserveState: true,
      replace: true
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    applyFilters();
  };

  const handleExport = () => {
    const params = new URLSearchParams({
      ...(orderStatus && { order_status: orderStatus }),
      ...(paymentStatus && { payment_status: paymentStatus }),
      ...(dateFrom && { date_from: dateFrom }),
      ...(dateTo && { date_to: dateTo })
    });

    window.location.href = route('supplier.orders.export') + '?' + params.toString();
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
      <Head title="Supplier Fulfillment & Orders — Treadmesh" />

      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              Incoming Purchase Orders
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review incoming corporate POs, generate GST tax invoices, and upload E-Way bills.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-semibold shadow-sm transition"
          >
            <FiDownload className="w-4 h-4 text-slate-500" />
            <span>Export Orders Ledger</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Total POs</span>
            <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{stats.total || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-amber-600 block">Awaiting Confirmation</span>
            <p className="text-2xl font-bold font-mono text-amber-600 mt-1">{stats.pending_confirmation || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-sky-600 block">In Production</span>
            <p className="text-2xl font-bold font-mono text-sky-600 mt-1">{stats.processing || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-indigo-600 block">Dispatched (E-Way)</span>
            <p className="text-2xl font-bold font-mono text-indigo-600 mt-1">{stats.shipped || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-emerald-600 block">Delivered & Settled</span>
            <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">{stats.delivered || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Escrow Volume</span>
            <p className="text-xl font-bold font-mono text-emerald-600 mt-1">{formatCurrency(stats.total_revenue || 0)}</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <FiSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by PO number or procuring buyer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </form>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700"
              >
                <FiFilter className="w-3.5 h-3.5" />
                <span>Filters</span>
                {showFilters ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="pt-3 mt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Order Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                >
                  <option value="">All Statuses</option>
                  {Object.entries(orderStatuses || {}).map(([val, label]) => (
                    <option key={val} value={val}>{formatOrderStatus(val)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Settlement Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                >
                  <option value="">All Settlement Types</option>
                  <option value="pending">Awaiting Escrow Deposit</option>
                  <option value="paid">Escrow Funded (Nodal)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="sm:col-span-4 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="px-4 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 cursor-pointer" onClick={() => handleSort('order_number')}>
                    PO Number
                  </th>
                  <th className="px-5 py-3">Procuring Buyer</th>
                  <th className="px-5 py-3 cursor-pointer" onClick={() => handleSort('total_amount')}>
                    Contract Amount
                  </th>
                  <th className="px-5 py-3">Fulfillment Status</th>
                  <th className="px-5 py-3">Escrow Status</th>
                  <th className="px-5 py-3 cursor-pointer" onClick={() => handleSort('created_at')}>
                    Order Date
                  </th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.data.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5">
                      <Link
                        href={route('supplier.orders.show', order.id)}
                        className="font-mono font-bold text-brand-600 hover:text-brand-700"
                      >
                        PO-{order.order_number}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900">{order.buyer?.name}</p>
                      <p className="text-[11px] text-slate-500">{order.buyer?.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-mono font-bold text-slate-900">{formatCurrency(order.total_amount)}</p>
                      <p className="text-[11px] text-slate-500">{order.items?.length || 0} SKUs</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadge(order.order_status)}`}>
                        {formatOrderStatus(order.order_status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {formatPaymentStatus(order.payment_status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600">
                      {formatIndianDate(order.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={route('supplier.orders.show', order.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-xs font-semibold shadow-sm transition"
                      >
                        <FiEye className="w-3.5 h-3.5" />
                        <span>View Order</span>
                      </Link>
                    </td>
                  </tr>
                ))}

                {orders.data.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <FiShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-800">No Purchase Orders Found</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        New orders from enterprise buyers will be listed here in real-time.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {orders.links && orders.links.length > 3 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
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
      </div>
    </DashboardLayout>
  );
}