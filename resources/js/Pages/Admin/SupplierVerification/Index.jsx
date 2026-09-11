// resources/js/Pages/Admin/SupplierVerification/Index.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Swal from 'sweetalert2';
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiMapPin,
  FiPhone,
  FiEye,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiRefreshCw,
  FiShield,
  FiFileText,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
  MdWarning,
} from 'react-icons/md';
import { formatIndianDate } from '@/Utils/formatters';

export default function Index({ pendingSuppliers, stats = {}, cities = [], filters = {} }) {
  // State management for filters and UI controls
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCity, setSelectedCity] = useState(filters.city || '');
  const [sortField, setSortField] = useState(filters.sort_field || 'created_at');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('admin.supplier-verification.index'), {
      ...filters,
      search: searchTerm,
      city: selectedCity,
      date_from: dateFrom,
      date_to: dateTo,
      sort_field: sortField,
      sort_direction: sortDirection
    }, { preserveState: true });
  };

  // Handle filter application
  const handleFilter = () => {
    router.get(route('admin.supplier-verification.index'), {
      ...filters,
      search: searchTerm,
      city: selectedCity,
      date_from: dateFrom,
      date_to: dateTo,
      sort_field: sortField,
      sort_direction: sortDirection
    }, { preserveState: true });
    setShowFilterModal(false);
  };

  // Reset all filters to default
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCity('');
    setDateFrom('');
    setDateTo('');
    setSortField('created_at');
    setSortDirection('desc');
    router.get(route('admin.supplier-verification.index'), {}, { preserveState: true });
    setShowFilterModal(false);
  };

  // Handle column sorting
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);

    router.get(route('admin.supplier-verification.index'), {
      ...filters,
      search: searchTerm,
      city: selectedCity,
      date_from: dateFrom,
      date_to: dateTo,
      sort_field: field,
      sort_direction: direction
    }, { preserveState: true });
  };

  // Handle bulk selection of suppliers
  const handleSelectAll = (e) => {
    if (e.target.checked && pendingSuppliers?.data) {
      setSelectedSuppliers(pendingSuppliers.data.map(s => s.id));
    } else {
      setSelectedSuppliers([]);
    }
  };

  const handleSelectSupplier = (id) => {
    if (selectedSuppliers.includes(id)) {
      setSelectedSuppliers(selectedSuppliers.filter(sId => sId !== id));
    } else {
      setSelectedSuppliers([...selectedSuppliers, id]);
    }
  };

  // Handle bulk verify selected suppliers
  const handleBulkVerify = () => {
    if (selectedSuppliers.length === 0) return;

    Swal.fire({
      title: 'Batch Approve Verification',
      text: `Are you sure you want to verify and approve ${selectedSuppliers.length} supplier account(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Approve Selected',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('admin.supplier-verification.bulk-verify'), {
          supplier_ids: selectedSuppliers
        }, {
          onSuccess: () => {
            setSelectedSuppliers([]);
            Swal.fire({
              title: 'Verification Complete',
              text: `${selectedSuppliers.length} supplier(s) successfully verified for marketplace operations.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  // Sort indicator component for table headers
  const SortIndicator = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <FiChevronUp className="w-3.5 h-3.5 text-indigo-600 inline ml-1" />
    ) : (
      <FiChevronDown className="w-3.5 h-3.5 text-indigo-600 inline ml-1" />
    );
  };

  const activeFilterCount = [selectedCity, dateFrom, dateTo].filter(Boolean).length;

  return (
    <DashboardLayout>
      <Head title="Supplier KYC & Verification" />

      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* Header - Executive Navigation Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.02]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Supplier KYC & Verification</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Audit GSTIN credentials, trade licenses, and MSME registrations for onboarding suppliers.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={route('admin.supplier-verification.verified')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/70 rounded-xl text-xs font-semibold transition"
            >
              <MdVerified className="w-4 h-4 text-emerald-600" />
              <span>Approved Suppliers</span>
            </Link>
            <Link
              href={route('admin.supplier-verification.rejected')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/70 rounded-xl text-xs font-semibold transition"
            >
              <MdWarning className="w-4 h-4 text-rose-600" />
              <span>Rejected Applications</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards - Key verification metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/40 to-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Pending Review</p>
                <p className="text-2xl font-bold text-amber-700 mt-1.5 font-mono">{stats.pending || 0}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl text-amber-700">
                <MdPending className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-amber-700/80 mt-2 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Awaiting compliance verification
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/40 to-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Verified & Active</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1.5 font-mono">{stats.verified || 0}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
                <MdVerified className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-emerald-700/80 mt-2 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active Make-in-India suppliers
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-200/80 bg-gradient-to-b from-rose-50/40 to-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-800">Rejected</p>
                <p className="text-2xl font-bold text-rose-700 mt-1.5 font-mono">{stats.rejected || 0}</p>
              </div>
              <div className="p-3 bg-rose-100 rounded-xl text-rose-700">
                <MdWarning className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-rose-700/80 mt-2 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Failed compliance criteria
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Registered</p>
                <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono">{stats.total || 0}</p>
              </div>
              <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
                <FiUsers className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Cumulative vendor registrations</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200/80">
          <div className="flex flex-col md:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by company name, email, or GSTIN / trade license..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <FiFilter className="w-4 h-4 text-slate-500" />
                <span>Filter Hubs & Dates</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {(filters.search || filters.city || filters.date_from || filters.date_to) && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  <FiRefreshCw className="w-3.5 h-3.5" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedSuppliers.length > 0 && (
            <div className="mt-3.5 flex items-center justify-between p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl">
              <span className="text-xs font-semibold text-indigo-900">
                {selectedSuppliers.length} supplier application(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkVerify}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                >
                  Batch Approve Selected
                </button>
                <button
                  onClick={() => setSelectedSuppliers([])}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium transition"
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Suppliers Verification Table */}
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedSuppliers.length === pendingSuppliers?.data?.length && pendingSuppliers?.data?.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 cursor-pointer hover:text-slate-900 transition"
                    onClick={() => handleSort('company_name')}
                  >
                    <span>Company Name</span>
                    <SortIndicator field="company_name" />
                  </th>
                  <th scope="col" className="px-6 py-3.5">Contact Person & SPOC</th>
                  <th scope="col" className="px-6 py-3.5">Manufacturing Hub / City</th>
                  <th scope="col" className="px-6 py-3.5">GSTIN / Trade License</th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 cursor-pointer hover:text-slate-900 transition"
                    onClick={() => handleSort('created_at')}
                  >
                    <span>Submission Date</span>
                    <SortIndicator field="created_at" />
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {pendingSuppliers?.data?.length > 0 ? (
                  pendingSuppliers.data.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-slate-50/80 transition group">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSuppliers.includes(supplier.id)}
                          onChange={() => handleSelectSupplier(supplier.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={route('admin.supplier-verification.verify', supplier.id)}
                          className="font-semibold text-slate-900 group-hover:text-indigo-600 transition block"
                        >
                          {supplier.company_name}
                        </Link>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {supplier.company_email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{supplier.user?.name || 'Authorized Signatory'}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <FiPhone className="w-3 h-3 text-slate-400" />
                          <span className="font-mono">{supplier.company_phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                          <FiMapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{supplier.city || 'India'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-slate-700">
                        {supplier.trade_license_number || 'Pending Submission'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono">
                        {formatIndianDate(supplier.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={route('admin.supplier-verification.verify', supplier.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition border border-indigo-200/60"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>Audit & Verify</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FiShield className="w-8 h-8 stroke-[1.5] text-slate-300" />
                        <p className="text-sm font-semibold text-slate-700">No pending supplier verifications</p>
                        <p className="text-xs text-slate-400 max-w-sm">
                          All submitted supplier applications have been reviewed or no records match your filter criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pendingSuppliers?.links && (
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>
                Showing {pendingSuppliers.from || 0} to {pendingSuppliers.to || 0} of {pendingSuppliers.total || 0} applications
              </p>
              <div className="flex gap-1.5">
                {pendingSuppliers.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => router.get(link.url)}
                    disabled={!link.url || link.active}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${link.active
                      ? 'bg-slate-900 text-white font-semibold'
                      : link.url
                        ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        : 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                      }`}
                    dangerouslySetInnerHTML={{
                      __html: link.label
                        .replace('Previous', '&larr; Prev')
                        .replace('Next', 'Next &rarr;')
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FiFilter className="w-4 h-4 text-indigo-600" />
                  Filter Supplier Verifications
                </h3>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <FiXCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Manufacturing Hub / City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  >
                    <option value="">All Indian Industrial Hubs</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Submission Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">From:</span>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">To:</span>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 text-xs">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-xl hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition"
                >
                  Reset
                </button>
                <button
                  onClick={handleFilter}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-sm transition"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}