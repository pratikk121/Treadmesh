// resources/js/Pages/Admin/Suppliers/Index.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiPackage,
  FiEdit,
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiShield,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
  MdWarning
} from 'react-icons/md';
import Swal from 'sweetalert2';
import { formatIndianDate } from '@/Utils/formatters';

export default function Index({ suppliers = {}, stats = {}, cities = [], filters = {} }) {
  // State management for filters and UI controls
  const [bulkAction, setBulkAction] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCity, setSelectedCity] = useState(filters.city || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.verification_status || '');

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('admin.suppliers.index'), {
      ...filters,
      search: searchTerm,
      city: selectedCity,
      verification_status: selectedStatus
    }, { preserveState: true });
  };

  // Handle filter application
  const handleFilter = () => {
    router.get(route('admin.suppliers.index'), {
      ...filters,
      search: searchTerm,
      city: selectedCity,
      verification_status: selectedStatus
    }, { preserveState: true });
    setShowFilterModal(false);
  };

  // Reset all filters to default
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedStatus('');
    router.get(route('admin.suppliers.index'), {}, { preserveState: true });
    setShowFilterModal(false);
  };

  // Handle column sorting
  const handleSort = (field) => {
    const direction = filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc';
    router.get(route('admin.suppliers.index'), {
      ...filters,
      sort_field: field,
      sort_direction: direction
    }, { preserveState: true });
  };

  // Handle bulk selection of suppliers
  const handleSelectAll = (e) => {
    if (e.target.checked && suppliers?.data) {
      setSelectedSuppliers(suppliers.data.map(s => s.id));
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

  // Handle bulk action (verify, reject, activate, deactivate)
  const handleBulkAction = () => {
    if (!bulkAction || selectedSuppliers.length === 0) return;

    const actionLabels = {
      verify: 'verify and approve',
      reject: 'reject',
      activate: 'activate',
      deactivate: 'deactivate'
    };

    Swal.fire({
      title: 'Confirm Bulk Action',
      text: `Are you sure you want to ${actionLabels[bulkAction] || bulkAction} ${selectedSuppliers.length} selected supplier(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('admin.suppliers.bulk-update'), {
          supplier_ids: selectedSuppliers,
          action: bulkAction
        }, {
          onSuccess: () => {
            setSelectedSuppliers([]);
            setBulkAction('');

            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Batch supplier update executed successfully.'
            });
          }
        });
      }
    });
  };

  // Handle delete single supplier
  const handleDelete = (id, companyName) => {
    Swal.fire({
      title: 'Delete Supplier?',
      text: `Are you sure you want to delete ${companyName}? This action cannot be reversed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('admin.suppliers.destroy', id), {
          onSuccess: () => {
            Swal.fire('Deleted', 'Supplier record has been deleted.', 'success');
          }
        });
      }
    });
  };

  // Handle toggle supplier status (activate/deactivate)
  const handleToggleStatus = (id, currentStatus) => {
    Swal.fire({
      title: currentStatus ? 'Deactivate Supplier?' : 'Activate Supplier?',
      text: `Are you sure you want to ${currentStatus ? 'suspend' : 'reinstate'} trading permissions for this vendor?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: currentStatus ? 'Yes, deactivate' : 'Yes, activate',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.patch(route('admin.suppliers.toggle-status', id), {
          onSuccess: () => {
            Swal.fire('Updated', 'Supplier status updated.', 'success');
          }
        });
      }
    });
  };

  // Get verification status badge
  const getStatusBadge = (status) => {
    const badges = {
      verified: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', icon: MdVerified, label: 'Verified & KYC OK' },
      pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200/80', icon: MdPending, label: 'Pending Review' },
      rejected: { bg: 'bg-rose-50 text-rose-700 border-rose-200/80', icon: MdWarning, label: 'Rejected / Disqualified' }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
        <Icon className="w-3.5 h-3.5" />
        {badge.label}
      </span>
    );
  };

  // Get active status badge
  const getActiveBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
        <FiCheckCircle className="w-3 h-3" />
        Live
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
        <FiXCircle className="w-3 h-3" />
        Suspended
      </span>
    );
  };

  // Sort indicator component for table headers
  const SortIndicator = ({ field }) => {
    if (filters.sort_field !== field) return null;
    return filters.sort_direction === 'asc' ? (
      <FiChevronUp className="w-3.5 h-3.5 text-indigo-600 inline ml-1" />
    ) : (
      <FiChevronDown className="w-3.5 h-3.5 text-indigo-600 inline ml-1" />
    );
  };

  const activeFilterCount = [selectedCity, selectedStatus].filter(Boolean).length;

  return (
    <DashboardLayout>
      <Head title="Supplier Management & OEM Directory" />

      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* Header - Executive Navigation Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.02]">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <FiUsers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Supplier Management Directory</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Comprehensive register of verified Make-in-India manufacturers, wholesale vendors, and OEMs.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.get(route('admin.suppliers.export', filters))}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export Suppliers CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Key metrics overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Suppliers</p>
                <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono">{stats.total || 0}</p>
              </div>
              <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
                <FiUsers className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">All registered vendor accounts</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/40 to-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Verified Vendors</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1.5 font-mono">{stats.verified || 0}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
                <MdVerified className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-emerald-700/80 mt-2 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active GSTIN & MSME verified
            </p>
          </div>

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
              Awaiting KYC authorization
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-200/80 bg-gradient-to-b from-rose-50/40 to-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-800">Rejected / Inactive</p>
                <p className="text-2xl font-bold text-rose-700 mt-1.5 font-mono">{stats.rejected || 0}</p>
              </div>
              <div className="p-3 bg-rose-100 rounded-xl text-rose-700">
                <MdWarning className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-rose-700/80 mt-2 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              KYC rejected or suspended
            </p>
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
                  placeholder="Search by company name, official email, or trade license..."
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
                <span>Filter Vendors</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {(filters.search || filters.city || filters.verification_status) && (
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

          {/* Bulk Actions Toolbar */}
          {selectedSuppliers.length > 0 && (
            <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl">
              <span className="text-xs font-semibold text-indigo-900">
                {selectedSuppliers.length} supplier account(s) selected
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Choose Batch Action...</option>
                  <option value="verify">Verify & Approve Selected</option>
                  <option value="reject">Reject Selected</option>
                  <option value="activate">Activate Selected</option>
                  <option value="deactivate">Suspend / Deactivate Selected</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Action
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

        {/* Suppliers Directory Table */}
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedSuppliers.length === suppliers?.data?.length && suppliers?.data?.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 cursor-pointer hover:text-slate-900 transition"
                    onClick={() => handleSort('company_name')}
                  >
                    <span>OEM / Company Name</span>
                    <SortIndicator field="company_name" />
                  </th>
                  <th scope="col" className="px-6 py-3.5">Primary Contact / SPOC</th>
                  <th scope="col" className="px-6 py-3.5">Manufacturing Hub</th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 cursor-pointer hover:text-slate-900 transition"
                    onClick={() => handleSort('verification_status')}
                  >
                    <span>KYC Status</span>
                    <SortIndicator field="verification_status" />
                  </th>
                  <th scope="col" className="px-6 py-3.5">Trading State</th>
                  <th scope="col" className="px-6 py-3.5">Catalog SKUs</th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 cursor-pointer hover:text-slate-900 transition"
                    onClick={() => handleSort('created_at')}
                  >
                    <span>Registration Date</span>
                    <SortIndicator field="created_at" />
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {suppliers?.data?.length > 0 ? (
                  suppliers.data.map((supplier) => (
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
                          href={route('admin.suppliers.show', supplier.id)}
                          className="font-semibold text-slate-900 group-hover:text-indigo-600 transition block"
                        >
                          {supplier.company_name}
                        </Link>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {supplier.company_email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{supplier.user?.name || 'N/A'}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{supplier.company_phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                          <FiMapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{supplier.city || 'India'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(supplier.verification_status)}
                      </td>
                      <td className="px-6 py-4">
                        {getActiveBadge(supplier.user?.is_active)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-mono text-slate-700">
                          <FiPackage className="w-3.5 h-3.5 text-slate-400" />
                          <span>{supplier.products_count || 0} SKUs</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono">
                        {formatIndianDate(supplier.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={route('admin.suppliers.show', supplier.id)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                            title="View Supplier Dossier"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={route('admin.suppliers.edit', supplier.id)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Details"
                          >
                            <FiEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(supplier.id, supplier.user?.is_active)}
                            className={`p-1.5 rounded-lg transition ${supplier.user?.is_active
                              ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                            title={supplier.user?.is_active ? 'Deactivate Account' : 'Activate Account'}
                          >
                            {supplier.user?.is_active ? <FiXCircle className="w-4 h-4" /> : <FiCheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(supplier.id, supplier.company_name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Supplier"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FiUsers className="w-8 h-8 stroke-[1.5] text-slate-300" />
                        <p className="text-sm font-semibold text-slate-700">No suppliers found</p>
                        <p className="text-xs text-slate-400 max-w-sm">
                          Try adjusting your search query or removing filters to view the full directory.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {suppliers?.links && (
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>
                Showing {suppliers.from || 0} to {suppliers.to || 0} of {suppliers.total || 0} suppliers
              </p>
              <div className="flex gap-1.5">
                {suppliers.links.map((link, index) => (
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
                  Filter Supplier Directory
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
                    Verification Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  >
                    <option value="">All Verification Statuses</option>
                    <option value="pending">Pending Review</option>
                    <option value="verified">Verified & KYC Approved</option>
                    <option value="rejected">Rejected / Disqualified</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Manufacturing Hub / Industrial Cluster
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  >
                    <option value="">All Industrial Hubs</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
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