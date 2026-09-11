// resources/js/Pages/Admin/Rfqs/Index.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Swal from 'sweetalert2';
import {
  FiFileText,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiMoreVertical,
  FiLayers,
  FiShoppingBag,
  FiRefreshCw
} from 'react-icons/fi';
import {
  MdPending,
  MdVerified,
  MdWarning
} from 'react-icons/md';
import { BsGraphUp } from 'react-icons/bs';
import { formatIndianDate, formatRfqStatus } from '@/Utils/formatters';

export default function Index({ rfqs, stats, buyers, filters }) {
  // State management for filters and UI controls
  const [selectedRfqs, setSelectedRfqs] = useState([]);
  const [dateTo, setDateTo] = useState(filters?.date_to || '');
  const [bulkActionMenu, setBulkActionMenu] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [requiredTo, setRequiredTo] = useState(filters?.required_to || '');
  const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
  const [selectedBuyer, setSelectedBuyer] = useState(filters?.buyer_id || '');
  const [requiredFrom, setRequiredFrom] = useState(filters?.required_from || '');

  // Status options for dropdown
  const statusOptions = [
    { value: '', label: 'All Procurement Statuses' },
    { value: 'open', label: 'Open for Bidding' },
    { value: 'quoted', label: 'Quotes Received' },
    { value: 'closed', label: 'Closed / Converted' },
  ];

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  // Handle filter application
  const handleFilter = () => {
    applyFilters();
    setShowFilterModal(false);
  };

  // Apply all filters to the RFQ list
  const applyFilters = () => {
    router.get(route('admin.rfqs.index'), {
      search: searchTerm,
      status: selectedStatus,
      buyer_id: selectedBuyer,
      date_from: dateFrom,
      date_to: dateTo,
      required_from: requiredFrom,
      required_to: requiredTo
    }, { preserveState: true });
  };

  // Reset all filters to default
  const handleReset = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedBuyer('');
    setDateFrom('');
    setDateTo('');
    setRequiredFrom('');
    setRequiredTo('');
    router.get(route('admin.rfqs.index'), {}, { preserveState: true });
    setShowFilterModal(false);
  };

  // Handle export functionality
  const handleExport = () => {
    window.location.href = route('admin.rfqs.export', {
      ...filters,
      status: selectedStatus,
      date_from: dateFrom,
      date_to: dateTo
    });
  };

  // Handle bulk selection of RFQs
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRfqs(rfqs.data.map(r => r.id));
    } else {
      setSelectedRfqs([]);
    }
  };

  const handleSelectRfq = (id) => {
    if (selectedRfqs.includes(id)) {
      setSelectedRfqs(selectedRfqs.filter(rId => rId !== id));
    } else {
      setSelectedRfqs([...selectedRfqs, id]);
    }
  };

  // Handle delete single RFQ
  const handleDelete = (rfq) => {
    Swal.fire({
      title: 'Delete Procurement Tender?',
      text: `Are you sure you want to delete RFQ #${rfq.rfq_number}? All vendor quotes and associated message threads will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Yes, Delete Tender',
      cancelButtonText: 'Keep Tender'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('admin.rfqs.destroy', rfq.id), {
          onSuccess: () => {
            Swal.fire({
              title: 'Tender Deleted',
              text: `RFQ #${rfq.rfq_number} has been deleted successfully.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Open Tender
          </span>
        );
      case 'quoted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
            <MdVerified className="w-3.5 h-3.5 text-blue-600" />
            Quotes Received
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <FiCheckCircle className="w-3.5 h-3.5 text-slate-500" />
            Closed / Awarded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {formatRfqStatus(status)}
          </span>
        );
    }
  };

  // Count active filters for display
  const activeFilterCount = [
    selectedStatus,
    selectedBuyer,
    dateFrom,
    dateTo,
    requiredFrom,
    requiredTo
  ].filter(Boolean).length;

  return (
    <DashboardLayout>
      <Head title="RFQ & Tender Management | Treadmesh Admin" />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header - Page title and action buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Procurement Governance
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Admin Control
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              RFQ & Tender Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Central governance across enterprise buyer tenders, vendor quotation lifecycles, and purchase order conversions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
              title="Export RFQ dataset to CSV"
            >
              <FiDownload className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <Link
              href={route('admin.rfqs.statistics')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium rounded-xl border border-indigo-200/60 transition"
            >
              <BsGraphUp className="w-4 h-4 text-indigo-600" />
              <span>Tender Analytics</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards - Key RFQ metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total RFQ Tenders</p>
                <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{stats?.total || 0}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Platform-wide tender volume</p>
              </div>
              <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                <FiFileText className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Open for Bidding</p>
                <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">{stats?.open || 0}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Active vendor submission windows</p>
              </div>
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                <MdPending className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quotes Received</p>
                <p className="text-2xl font-bold font-mono text-blue-600 mt-1">{stats?.quoted || 0}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Tenders under commercial review</p>
              </div>
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                <MdVerified className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Converted to Orders</p>
                <p className="text-2xl font-bold font-mono text-purple-600 mt-1">{stats?.converted_to_order || 0}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">PO generated & escrow active</p>
              </div>
              <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100">
                <FiCheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col md:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by RFQ #, title, or enterprise buyer name..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>

            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-white transition"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <button
                onClick={() => setShowFilterModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
              >
                <FiFilter className="w-4 h-4 text-slate-500" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-xs font-semibold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={handleReset}
                  className="px-3 py-2 text-sm text-slate-500 hover:text-slate-900 transition flex items-center gap-1"
                  title="Reset all filters"
                >
                  <FiRefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Bulk Actions Panel */}
          {selectedRfqs.length > 0 && (
            <div className="mt-3 flex items-center justify-between p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
              <span className="text-xs font-semibold text-indigo-900">
                {selectedRfqs.length} procurement tenders selected
              </span>
              <div className="relative">
                <button
                  onClick={() => setBulkActionMenu(!bulkActionMenu)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition"
                >
                  <FiMoreVertical className="w-3.5 h-3.5" />
                  <span>Batch Operations</span>
                </button>
                {bulkActionMenu && (
                  <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg py-1 border border-slate-200 z-10">
                    <button
                      onClick={() => {
                        setBulkActionMenu(false);
                        handleExport();
                      }}
                      className="block w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Export Selected
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RFQs Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedRfqs.length === rfqs.data.length && rfqs.data.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-5 py-3.5">Tender #</th>
                  <th className="px-5 py-3.5">Procurement Title & Specs</th>
                  <th className="px-5 py-3.5">Enterprise Buyer</th>
                  <th className="px-5 py-3.5">Quantity / Lots</th>
                  <th className="px-5 py-3.5">Target Delivery</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Bids Received</th>
                  <th className="px-5 py-3.5">Published Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {rfqs.data.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-12 px-4 text-slate-500">
                      <FiLayers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="font-semibold text-slate-700">No Procurement Tenders Found</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Try adjusting your search criteria or filter constraints.
                      </p>
                    </td>
                  </tr>
                ) : (
                  rfqs.data.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRfqs.includes(rfq.id)}
                          onChange={() => handleSelectRfq(rfq.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={route('admin.rfqs.show', rfq.id)}
                          className="font-mono text-xs font-semibold text-indigo-600 hover:underline"
                        >
                          {rfq.rfq_number}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900 line-clamp-1">{rfq.title}</div>
                        <div className="text-xs text-slate-500 truncate max-w-xs mt-0.5">{rfq.description}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-semibold text-xs border border-slate-200">
                            {rfq.buyer?.name?.charAt(0) || 'B'}
                          </div>
                          <div>
                            <span className="font-medium text-slate-900 block text-xs">{rfq.buyer?.name}</span>
                            <span className="text-[11px] text-slate-500">{rfq.buyer?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-semibold text-slate-800">
                          {rfq.quantity} units
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatIndianDate(rfq.required_by_date)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(rfq.status)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {rfq.quotes_count || 0} bids
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {formatIndianDate(rfq.created_at)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={route('admin.rfqs.show', rfq.id)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="View RFQ Dossier"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(rfq)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Tender"
                          >
                            <FiAlertCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {rfqs.links && (
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-700">{rfqs.from || 0}</span> to{' '}
                <span className="font-semibold text-slate-700">{rfqs.to || 0}</span> of{' '}
                <span className="font-semibold text-slate-700">{rfqs.total || 0}</span> procurement tenders
              </p>
              <div className="flex gap-1.5">
                {rfqs.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => router.get(link.url)}
                    disabled={!link.url || link.active}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      link.active
                        ? 'bg-indigo-600 text-white'
                        : link.url
                          ? 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: link.label
                        .replace('Previous', '&laquo; Prev')
                        .replace('Next', 'Next &raquo;')
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-slate-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Advanced Procurement Filters</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Filter tenders by corporate buyer or timeline windows</p>
                </div>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <FiXCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Enterprise Buyer
                  </label>
                  <select
                    value={selectedBuyer}
                    onChange={(e) => setSelectedBuyer(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-white"
                  >
                    <option value="">All Corporate Buyers</option>
                    {buyers.map((buyer) => (
                      <option key={buyer.id} value={buyer.id}>{buyer.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Publication Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[11px] text-slate-500 mb-1">From Date</span>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500 mb-1">To Date</span>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Target Delivery Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[11px] text-slate-500 mb-1">From Date</span>
                      <input
                        type="date"
                        value={requiredFrom}
                        onChange={(e) => setRequiredFrom(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500 mb-1">To Date</span>
                      <input
                        type="date"
                        value={requiredTo}
                        onChange={(e) => setRequiredTo(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-2.5 bg-slate-50/50">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-xl transition"
                >
                  Reset
                </button>
                <button
                  onClick={handleFilter}
                  className="px-5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-xs"
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