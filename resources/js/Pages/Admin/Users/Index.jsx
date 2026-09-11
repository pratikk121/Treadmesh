// Pages/Admin/Users/Index.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Swal from 'sweetalert2';
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiUserCheck,
  FiUserX,
  FiMoreVertical,
  FiShield
} from 'react-icons/fi';
import {
  MdOutlineAdminPanelSettings,
  MdOutlineStorefront,
  MdOutlineShoppingCart
} from 'react-icons/md';
import { formatIndianDate } from '@/Utils/formatters';

export default function Index({ users, stats, filters }) {
  // State management for filters and UI controls
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [bulkActionMenu, setBulkActionMenu] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedRole, setSelectedRole] = useState(filters.role || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.is_active || '');
  const [sortField, setSortField] = useState(filters.sort_field || 'created_at');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');

  // Role options for dropdown
  const roleOptions = [
    { value: '', label: 'All System Roles' },
    { value: 'admin', label: 'Admin', icon: MdOutlineAdminPanelSettings, color: 'text-purple-600' },
    { value: 'supplier', label: 'Supplier', icon: MdOutlineStorefront, color: 'text-blue-600' },
    { value: 'buyer', label: 'Buyer', icon: MdOutlineShoppingCart, color: 'text-emerald-600' },
  ];

  // Status options for dropdown
  const statusOptions = [
    { value: '', label: 'All Account Statuses' },
    { value: 'true', label: 'Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'false', label: 'Inactive', color: 'bg-rose-50 text-rose-700 border-rose-200' },
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

  // Apply all filters to the user list
  const applyFilters = () => {
    router.get(route('admin.users.index'), {
      search: searchTerm,
      role: selectedRole,
      is_active: selectedStatus,
      date_from: dateFrom,
      date_to: dateTo,
      sort_field: sortField,
      sort_direction: sortDirection
    }, { preserveState: true });
  };

  // Reset all filters to default
  const handleReset = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedStatus('');
    setDateFrom('');
    setDateTo('');
    setSortField('created_at');
    setSortDirection('desc');
    router.get(route('admin.users.index'), {}, { preserveState: true });
    setShowFilterModal(false);
  };

  // Handle column sorting
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    applyFilters();
  };

  // Handle bulk selection of users
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.data.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uId => uId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  // Handle toggle user status (activate/deactivate)
  const handleToggleStatus = (user) => {
    const action = user.is_active ? 'Deactivate' : 'Activate';
    Swal.fire({
      title: `${action} User Account?`,
      text: `Are you sure you want to ${action.toLowerCase()} access for "${user.name}" (${user.email})?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: user.is_active ? '#EF4444' : '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: `Yes, ${action} Account`,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.patch(route('admin.users.toggle-status', user.id), {}, {
          onSuccess: () => {
            Swal.fire({
              title: 'Status Updated',
              text: `User account has been successfully ${user.is_active ? 'deactivated' : 'activated'}.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  // Handle delete single user
  const handleDelete = (user) => {
    Swal.fire({
      title: 'Delete User Account?',
      text: `Are you sure you want to permanently delete "${user.name}"? This action cannot be reversed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Delete Account',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('admin.users.destroy', user.id), {
          onSuccess: () => {
            Swal.fire({
              title: 'Account Deleted',
              text: 'The user account has been permanently removed.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  // Handle export functionality
  const handleExport = () => {
    window.location.href = route('admin.users.export', {
      role: selectedRole,
      date_from: dateFrom,
      date_to: dateTo
    });
  };

  // Sort indicator component for table headers
  const SortIndicator = ({ field }) => {
    if (sortField !== field) return null;
    return <span className="ml-1 font-mono">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  // Get role badge with appropriate styling
  const getRoleBadge = (role) => {
    const badges = {
      admin: { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: MdOutlineAdminPanelSettings, label: 'Admin' },
      supplier: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: MdOutlineStorefront, label: 'Supplier' },
      buyer: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: MdOutlineShoppingCart, label: 'Buyer' },
    };
    const badge = badges[role] || badges.buyer;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}>
        <Icon className="w-3.5 h-3.5 mr-1" />
        {badge.label}
      </span>
    );
  };

  // Get active status badge
  const getStatusBadge = (isActive) => {
    return isActive
      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <FiUserCheck className="w-3.5 h-3.5 mr-1" />
        Active
      </span>
      : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <FiUserX className="w-3.5 h-3.5 mr-1" />
        Inactive
      </span>;
  };

  // Count active filters for display
  const activeFilterCount = [
    selectedRole,
    selectedStatus,
    dateFrom,
    dateTo
  ].filter(Boolean).length;

  return (
    <DashboardLayout>
      <Head title="User Identity & Access Management - Treadmesh Admin" />

      <div className="space-y-6 pb-12">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Access & Identity Control
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-medium">Enterprise RBAC</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
              User Identity & Access Control
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Supervise all system roles, administrative permissions, and account lifecycle states
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <FiDownload className="w-4 h-4 text-gray-500" />
              <span>Export CSV</span>
            </button>
            <Link
              href={route('admin.users.create')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition"
            >
              <FiUserPlus className="w-4 h-4" />
              <span>Create User Account</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Users</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1.5 font-mono">{stats.total}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  <span>Registered platform accounts</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                <FiUsers className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Users</p>
                <p className="text-2xl font-extrabold text-emerald-700 mt-1.5 font-mono">{stats.active}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
                  <FiUserCheck className="w-3.5 h-3.5" />
                  <span>Authorized login access</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
                <FiUserCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Manufacturers & Vendors</p>
                <p className="text-2xl font-extrabold text-blue-700 mt-1.5 font-mono">{stats.suppliers}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span>Catalog & RFQ suppliers</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
                <MdOutlineStorefront className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Enterprise Buyers</p>
                <p className="text-2xl font-extrabold text-purple-700 mt-1.5 font-mono">{stats.buyers}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                  <span>Procurement departments</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-600">
                <MdOutlineShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col md:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or email address..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                onClick={() => setShowFilterModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
              >
                <FiFilter className="w-3.5 h-3.5 text-slate-500" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold border border-indigo-200">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleReset}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-900 transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="mt-3 flex items-center justify-between p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
              <span className="text-xs font-semibold text-indigo-900">
                {selectedUsers.length} users selected
              </span>
              <div className="relative">
                <button
                  onClick={() => setBulkActionMenu(!bulkActionMenu)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-black transition"
                >
                  <FiMoreVertical className="w-3.5 h-3.5" />
                  <span>Bulk Actions</span>
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

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.data.length && users.data.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th
                    className="px-5 py-3 cursor-pointer hover:text-slate-900"
                    onClick={() => handleSort('name')}
                  >
                    User Name <SortIndicator field="name" />
                  </th>
                  <th
                    className="px-5 py-3 cursor-pointer hover:text-slate-900"
                    onClick={() => handleSort('email')}
                  >
                    Email Address <SortIndicator field="email" />
                  </th>
                  <th
                    className="px-5 py-3 cursor-pointer hover:text-slate-900"
                    onClick={() => handleSort('role')}
                  >
                    System Role <SortIndicator field="role" />
                  </th>
                  <th
                    className="px-5 py-3 cursor-pointer hover:text-slate-900"
                    onClick={() => handleSort('is_active')}
                  >
                    Status <SortIndicator field="is_active" />
                  </th>
                  <th
                    className="px-5 py-3 cursor-pointer hover:text-slate-900"
                    onClick={() => handleSort('created_at')}
                  >
                    Member Since <SortIndicator field="created_at" />
                  </th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.data.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={route('admin.users.show', user.id)} className="hover:text-indigo-600">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${user.role === 'admin' ? 'bg-purple-600' :
                            user.role === 'supplier' ? 'bg-blue-600' : 'bg-emerald-600'
                            }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-900">{user.name}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <a href={`mailto:${user.email}`} className="text-slate-600 hover:text-indigo-600 font-mono text-[11px]">
                        {user.email}
                      </a>
                    </td>
                    <td className="px-5 py-3.5">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-5 py-3.5">
                      {getStatusBadge(user.is_active)}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500 text-[11px]">
                      {formatIndianDate(user.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={route('admin.users.show', user.id)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                          title="View User Dossier"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={route('admin.users.edit', user.id)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                          title="Edit User Account"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1.5 rounded-lg transition ${user.is_active
                            ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                            : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                          title={user.is_active ? 'Deactivate Account' : 'Activate Account'}
                        >
                          {user.is_active ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Account"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.links && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <p>
                Showing {users.from || 0} to {users.to || 0} of {users.total || 0} users
              </p>
              <div className="flex gap-1">
                {users.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => link.url && router.get(link.url)}
                    disabled={!link.url || link.active}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${link.active
                      ? 'bg-slate-900 text-white border-slate-900'
                      : link.url
                        ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                      }`}
                    dangerouslySetInnerHTML={{
                      __html: link.label
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 font-display">Advanced Filter</h3>
              </div>
              <div className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    Registration Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">From</span>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">To</span>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                >
                  Reset
                </button>
                <button
                  onClick={handleFilter}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition"
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