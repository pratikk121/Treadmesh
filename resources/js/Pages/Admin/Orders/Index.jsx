// resources/js/Pages/Admin/Orders/Index.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiShoppingCart,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiMoreVertical,
  FiActivity,
  FiShield
} from 'react-icons/fi';
import {
  MdPending,
  MdVerified,
  MdOutlineAttachMoney,
  MdOutlineLocalShipping
} from 'react-icons/md';
import { BsBuilding, BsGraphUp } from 'react-icons/bs';
import {
  formatCurrency,
  formatIndianDate,
  formatOrderStatus,
  formatPaymentStatus
} from '@/Utils/formatters';

export default function Index({
  orders,
  stats,
  suppliers,
  buyers,
  orderStatuses,
  paymentStatuses,
  filters
}) {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkActionMenu, setBulkActionMenu] = useState(false);
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [minAmount, setMinAmount] = useState(filters.min_amount || '');
  const [maxAmount, setMaxAmount] = useState(filters.max_amount || '');
  const [selectedBuyer, setSelectedBuyer] = useState(filters.buyer_id || '');
  const [sortField, setSortField] = useState(filters.sort_field || 'created_at');
  const [selectedSupplier, setSelectedSupplier] = useState(filters.supplier_id || '');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(filters.order_status || '');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(filters.payment_status || '');

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleFilter = () => {
    applyFilters();
    setShowFilterModal(false);
  };

  const applyFilters = () => {
    router.get(route('admin.orders.index'), {
      search: searchTerm,
      order_status: selectedOrderStatus,
      payment_status: selectedPaymentStatus,
      supplier_id: selectedSupplier,
      buyer_id: selectedBuyer,
      date_from: dateFrom,
      date_to: dateTo,
      min_amount: minAmount,
      max_amount: maxAmount,
      sort_field: sortField,
      sort_direction: sortDirection
    }, { preserveState: true });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedOrderStatus('');
    setSelectedPaymentStatus('');
    setSelectedSupplier('');
    setSelectedBuyer('');
    setDateFrom('');
    setDateTo('');
    setMinAmount('');
    setMaxAmount('');
    setSortField('created_at');
    setSortDirection('desc');
    router.get(route('admin.orders.index'), {}, { preserveState: true });
    setShowFilterModal(false);
  };

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    applyFilters();
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.data.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(oId => oId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleExport = () => {
    window.location.href = route('admin.orders.export', {
      ...filters,
      order_status: selectedOrderStatus,
      date_from: dateFrom,
      date_to: dateTo
    });
  };

  const SortIndicator = ({ field }) => {
    if (sortField !== field) return null;
    return <span className="ml-1 font-mono">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (['delivered', 'confirmed', 'sure', 'paid'].includes(s)) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10';
    }
    if (['processing', 'shipped'].includes(s)) {
      return 'bg-sky-50 text-sky-700 border-sky-200 ring-1 ring-sky-500/10';
    }
    if (['pending_confirmation', 'pending', 'unpaid'].includes(s)) {
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/10';
    }
    if (['cancelled', 'cancel'].includes(s)) {
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/10';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const activeFilterCount = [
    selectedOrderStatus,
    selectedPaymentStatus,
    selectedSupplier,
    selectedBuyer,
    dateFrom,
    dateTo,
    minAmount,
    maxAmount
  ].filter(Boolean).length;

  return (
    <DashboardLayout>
      <Head title="Purchase Order Supervision — Central Operations" />

      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              National Purchase Order Supervision
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Audit wholesale procurement volumes, nodal escrow releases, and manufacturing dispatch across India.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition"
            >
              <FiDownload className="w-4 h-4 text-slate-500" />
              <span>Export Ledger</span>
            </button>
            <Link
              href={route('admin.orders.statistics')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-xs font-semibold shadow-sm transition"
            >
              <BsGraphUp className="w-3.5 h-3.5" />
              <span>Order Analytics</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">Total POs</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900">{stats?.total_orders || 0}</span>
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FiShoppingCart className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">Gross Platform Escrow</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-600">{formatCurrency(stats?.total_revenue || 0)}</span>
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FiShield className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-amber-600 block tracking-wider">Awaiting Confirmation</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold font-mono text-amber-600">{stats?.pending_orders || 0}</span>
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <MdPending className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-sky-600 block tracking-wider">In Factory Production</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold font-mono text-sky-600">{stats?.processing_orders || 0}</span>
              <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <FiPackage className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <FiSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by PO number, enterprise name, or GSTIN..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <div className="flex gap-2">
              <select
                value={selectedOrderStatus}
                onChange={(e) => setSelectedOrderStatus(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">All Fulfillment Statuses</option>
                {Object.entries(orderStatuses || {}).map(([val, label]) => (
                  <option key={val} value={val}>{formatOrderStatus(val)}</option>
                ))}
              </select>
              <button
                onClick={() => setShowFilterModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
              >
                <FiFilter className="w-3.5 h-3.5 text-slate-500" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-brand-100 text-brand-700 rounded-full text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleReset}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-900"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedOrders.length > 0 && (
            <div className="mt-3 flex items-center justify-between p-3 bg-brand-50 rounded-xl border border-brand-200/60">
              <span className="text-xs font-semibold text-brand-800">
                {selectedOrders.length} orders selected
              </span>
              <div className="relative">
                <button
                  onClick={() => setBulkActionMenu(!bulkActionMenu)}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Bulk Actions
                </button>
                {bulkActionMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl py-1.5 border border-slate-200 z-20 text-xs">
                    <button
                      onClick={() => {
                        setBulkActionMenu(false);
                        handleExport();
                      }}
                      className="block w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      Export Selected
                    </button>
                  </div>
                )}
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
                  <th className="px-5 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === orders.data.length && orders.data.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                  </th>
                  <th
                    className="px-5 py-3 cursor-pointer"
                    onClick={() => handleSort('order_number')}
                  >
                    PO # <SortIndicator field="order_number" />
                  </th>
                  <th className="px-5 py-3">Procuring Buyer</th>
                  <th className="px-5 py-3">Manufacturing Vendor</th>
                  <th
                    className="px-5 py-3 cursor-pointer"
                    onClick={() => handleSort('total_amount')}
                  >
                    Gross Value <SortIndicator field="total_amount" />
                  </th>
                  <th className="px-5 py-3">Fulfillment Status</th>
                  <th className="px-5 py-3">Nodal Escrow</th>
                  <th
                    className="px-5 py-3 cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    PO Date <SortIndicator field="created_at" />
                  </th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.data.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={route('admin.orders.show', order.id)}
                        className="font-mono font-bold text-brand-600 hover:text-brand-700"
                      >
                        PO-{order.order_number}
                      </Link>
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {order.items?.length || 0} SKUs
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900">{order.buyer?.name}</p>
                      <p className="text-[11px] text-slate-500">{order.buyer?.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900">{order.supplier?.name}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadge(order.order_status)}`}>
                        {formatOrderStatus(order.order_status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadge(order.payment_status)}`}>
                        {formatPaymentStatus(order.payment_status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600">
                      {formatIndianDate(order.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={route('admin.orders.show', order.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-xs font-semibold shadow-sm transition"
                      >
                        <FiEye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {orders.links && (
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

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-slate-200">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 font-display">Advanced Order Filter</h3>
              </div>
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nodal Escrow Status
                    </label>
                    <select
                      value={selectedPaymentStatus}
                      onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-xl"
                    >
                      <option value="">All Settlement Statuses</option>
                      {Object.entries(paymentStatuses || {}).map(([val, label]) => (
                        <option key={val} value={val}>{formatPaymentStatus(val)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Supplier / Factory
                    </label>
                    <select
                      value={selectedSupplier}
                      onChange={(e) => setSelectedSupplier(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-xl"
                    >
                      <option value="">All Suppliers</option>
                      {suppliers?.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Buyer Organization
                  </label>
                  <select
                    value={selectedBuyer}
                    onChange={(e) => setSelectedBuyer(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="">All Buyers</option>
                    {buyers?.map((buyer) => (
                      <option key={buyer.id} value={buyer.id}>{buyer.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Order Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="p-2 border border-slate-200 rounded-xl"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="p-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    PO Value Range (INR ₹)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      className="p-2 border border-slate-200 rounded-xl"
                      placeholder="Min ₹"
                      min="0"
                    />
                    <input
                      type="number"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      className="p-2 border border-slate-200 rounded-xl"
                      placeholder="Max ₹"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  Reset
                </button>
                <button
                  onClick={handleFilter}
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 text-xs font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}