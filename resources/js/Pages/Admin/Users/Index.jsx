// Pages/Admin/Users/Index.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Admin dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// sweetalert - For beautiful alert messages
import Swal from 'sweetalert2';

// Icons - Importing icon sets for UI elements
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
  FiMoreVertical
} from 'react-icons/fi';
import {
  MdOutlineAdminPanelSettings,
  MdOutlineStorefront,
  MdOutlineShoppingCart
} from 'react-icons/md';

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
    { value: '', label: 'All roles' },
    { value: 'admin', label: 'Admin', icon: MdOutlineAdminPanelSettings, color: 'text-purple-600' },
    { value: 'supplier', label: 'Supplier', icon: MdOutlineStorefront, color: 'text-blue-600' },
    { value: 'buyer', label: 'Buyer', icon: MdOutlineShoppingCart, color: 'text-green-600' },
  ];

  // Status options for dropdown
  const statusOptions = [
    { value: '', label: 'All statuses are' },
    { value: 'true', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'false', label: 'Inactive', color: 'bg-red-100 text-red-800' },
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
    const action = user.is_active ? 'Inactive' : 'Active';
    Swal.fire({
      title: `${user.is_active ? 'Inactive' : 'Active'} Do`,
      text: `Are you ${user.name} who ${action} want to?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: user.is_active ? '#EF4444' : '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: `according to income yes, ${action} Do`,
      cancelButtonText: 'cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.patch(route('admin.users.toggle-status', user.id), {}, {
          onSuccess: () => {
            Swal.fire({
              title: 'successful!',
              text: `User ${action} Done।`,
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
      title: 'Delete user',
      text: `Are you ${user.name} Want to delete? This action cannot be undone।`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('admin.users.destroy', user.id), {
          onSuccess: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'User Deleted।',
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
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  // Format date - Converts ISO date to readable format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get role badge with appropriate styling
  const getRoleBadge = (role) => {
    const badges = {
      admin: { color: 'bg-purple-100 text-purple-800', icon: MdOutlineAdminPanelSettings, label: 'Admin' },
      supplier: { color: 'bg-blue-100 text-blue-800', icon: MdOutlineStorefront, label: 'Supplier' },
      buyer: { color: 'bg-green-100 text-green-800', icon: MdOutlineShoppingCart, label: 'Buyer' },
    };
    const badge = badges[role] || badges.buyer;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    );
  };

  // Get active status badge
  const getStatusBadge = (isActive) => {
    return isActive
      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <FiUserCheck className="w-3 h-3 mr-1" />
        Active
      </span>
      : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <FiUserX className="w-3 h-3 mr-1" />
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
      <Head title="User Management" />

      <div className="space-y-6">
        {/* Header - Page title and action buttons */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage all users, roles and permissions
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
            <Link
              href={route('admin.users.create')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <FiUserPlus className="w-4 h-4" />
              <span>Add user</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards - Key metrics overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total users</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active user</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Supplier</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.suppliers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MdOutlineStorefront className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Buyer</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.buyers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <MdOutlineShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar - Main search and filter controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <FiFilter className="w-4 h-4" />
                <span>More filters</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  delete
                </button>
              )}
            </div>
          </div>

          {/* Bulk Actions - Show when users are selected */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
              <span className="text-sm font-medium text-indigo-700">
                {selectedUsers.length} T user selected
              </span>
              <div className="relative">
                <button
                  onClick={() => setBulkActionMenu(!bulkActionMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <FiMoreVertical className="w-4 h-4" />
                  Multiple activities
                </button>
                {bulkActionMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border z-10">
                    <button
                      onClick={() => {
                        setBulkActionMenu(false);
                        handleExport();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Selected export
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Users Table - Main data table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.data.length && users.data.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('name')}
                  >
                    User <SortIndicator field="name" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('email')}
                  >
                    Email <SortIndicator field="email" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('role')}
                  >
                    Introduction <SortIndicator field="role" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('is_active')}
                  >
                    Status <SortIndicator field="is_active" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('created_at')}
                  >
                    Date of Joining <SortIndicator field="created_at" />
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activities
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link href={route('admin.users.show', user.id)} className="hover:text-indigo-600">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${user.role === 'admin' ? 'bg-purple-500' :
                            user.role === 'supplier' ? 'bg-blue-500' : 'bg-green-500'
                            }`}>
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${user.email}`} className="text-sm text-gray-600 hover:text-indigo-600">
                        {user.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.is_active)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{formatDate(user.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={route('admin.users.show', user.id)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="See"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={route('admin.users.edit', user.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="editing"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1 rounded-lg transition ${user.is_active
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                            }`}
                          title={user.is_active ? 'Disable' : 'Activate'}
                        >
                          {user.is_active ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="delete"
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

          {/* Pagination - Navigation controls */}
          {users.links && (
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  total {users.total} of the {users.from} from {users.to} Showing
                </p>
                <div className="flex gap-2">
                  {users.links.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => router.get(link.url)}
                      disabled={!link.url || link.active}
                      className={`px-3 py-1 rounded-lg text-sm ${link.active
                        ? 'bg-indigo-600 text-white'
                        : link.url
                          ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      dangerouslySetInnerHTML={{
                        __html: link.label
                          .replace('Previous', 'previous')
                          .replace('Next', 'next')
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Modal - Advanced filtering options */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">More filters</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="from"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="up to"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg"
                >
                  Reset
                </button>
                <button
                  onClick={handleFilter}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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