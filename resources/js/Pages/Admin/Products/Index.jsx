// Pages/Admin/Products/Index.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Admin dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatCurrency, formatIndianDate } from '@/Utils/formatters';

// sweetalert - For beautiful alert messages
import Swal from 'sweetalert2';

// Icons - Importing icon sets for UI elements
import {
  FiPackage,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiStar,
  FiMoreVertical,
  FiAlertCircle,
  FiX,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
  MdWarning,
  MdOutlineCategory
} from 'react-icons/md';
import { BsBoxSeam, BsBuilding, BsGraphUp } from 'react-icons/bs';

// Default image for product fallback
const NoImg = "/noImg.jpg";

export default function Index({ products, stats, categories, suppliers, filters }) {
  // State management for filters and UI controls
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [bulkActionMenu, setBulkActionMenu] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [minPrice, setMinPrice] = useState(filters.min_price || '');
  const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
  const [sortField, setSortField] = useState(filters.sort_field || 'created_at');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
  const [selectedSupplier, setSelectedSupplier] = useState(filters.supplier_id || '');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');
  const [selectedStockStatus, setSelectedStockStatus] = useState(filters.stock_status || '');

  // Status options for dropdown
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'approved', label: 'Approved', color: 'green' },
    { value: 'pending', label: 'Pending Review', color: 'yellow' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
  ];

  // Stock status options for dropdown
  const stockStatusOptions = [
    { value: '', label: 'All Inventory Levels' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low_stock', label: 'Low Stock (< 10 units)' },
    { value: 'out_of_stock', label: 'Out of Stock' },
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

  // Apply all filters to the product list
  const applyFilters = () => {
    router.get(route('admin.products.index'), {
      search: searchTerm,
      status: selectedStatus,
      category: selectedCategory,
      supplier_id: selectedSupplier,
      stock_status: selectedStockStatus,
      date_from: dateFrom,
      date_to: dateTo,
      min_price: minPrice,
      max_price: maxPrice,
      sort_field: sortField,
      sort_direction: sortDirection
    }, { preserveState: true });
  };

  // Reset all filters to default
  const handleReset = () => {
    setDateTo('');
    setDateFrom('');
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedCategory('');
    setSelectedSupplier('');
    setSortDirection('desc');
    setShowFilterModal(false);
    setSelectedStockStatus('');
    setSortField('created_at');
    router.get(route('admin.products.index'), {}, { preserveState: true });
  };

  // Handle column sorting
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    applyFilters();
  };

  // Handle bulk selection of products
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.data.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pId => pId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Handle bulk actions (approve, reject, feature, delete)
  const handleBulkAction = (action) => {
    if (selectedProducts.length === 0) return;

    const actionConfig = {
      approve: {
        title: 'Bulk Approve Products',
        text: `Are you sure you want to approve ${selectedProducts.length} selected products for public listing?`,
        icon: 'question',
        confirmColor: '#10B981',
        action: 'approve'
      },
      reject: {
        title: 'Bulk Reject Products',
        text: `Are you sure you want to reject ${selectedProducts.length} selected products?`,
        icon: 'warning',
        confirmColor: '#EF4444',
        action: 'reject'
      },
      feature: {
        title: 'Feature Selected Products',
        text: `Are you sure you want to feature ${selectedProducts.length} products in the B2B spotlight?`,
        icon: 'question',
        confirmColor: '#8B5CF6',
        action: 'feature'
      },
      unfeature: {
        title: 'Unfeature Selected Products',
        text: `Are you sure you want to remove ${selectedProducts.length} products from the spotlight?`,
        icon: 'question',
        confirmColor: '#6B7280',
        action: 'unfeature'
      },
      delete: {
        title: 'Bulk Delete Products',
        text: `Are you sure you want to remove ${selectedProducts.length} products? This action cannot be undone.`,
        icon: 'warning',
        confirmColor: '#EF4444',
        action: 'delete'
      }
    };

    const config = actionConfig[action];

    Swal.fire({
      title: config.title,
      text: config.text,
      icon: config.icon,
      showCancelButton: true,
      confirmButtonColor: config.confirmColor,
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('admin.products.bulk-update'), {
          product_ids: selectedProducts,
          action: config.action
        }, {
          onSuccess: () => {
            setSelectedProducts([]);
            setBulkActionMenu(false);
            Swal.fire({
              title: 'Success!',
              text: 'The selected products have been updated successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  // Handle delete single product
  const handleDelete = (product) => {
    Swal.fire({
      title: 'Delete Product Listing',
      text: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('admin.products.destroy', product.id), {
          onSuccess: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The product listing has been deleted from catalog.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  // Handle toggle featured status
  const handleToggleFeatured = (product) => {
    router.patch(route('admin.products.toggle-featured', product.id), {}, {
      onSuccess: () => {
        Swal.fire({
          title: 'Success!',
          text: `Product ${product.is_featured ? 'removed from spotlight' : 'marked as featured'}.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Handle export functionality
  const handleExport = () => {
    window.location.href = route('admin.products.export', {
      ...filters,
      status: selectedStatus,
      category: selectedCategory
    });
  };

  // Sort indicator component for table headers
  const SortIndicator = ({ field }) => {
    if (sortField !== field) return null;
    return <span className="ml-1 text-indigo-600 font-bold">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    const badges = {
      approved: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: MdVerified, label: 'Approved' },
      pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: MdPending, label: 'Pending Review' },
      rejected: { color: 'bg-rose-50 text-rose-700 border-rose-200', icon: MdWarning, label: 'Rejected' },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    );
  };

  // Count active filters for display
  const activeFilterCount = [
    selectedStatus,
    selectedCategory,
    selectedSupplier,
    selectedStockStatus,
    dateFrom,
    dateTo,
    minPrice,
    maxPrice
  ].filter(Boolean).length;

  return (
    <DashboardLayout>
      <Head title="Product Catalog Management - Treadmesh Admin" />

      <div className="space-y-6">
        {/* Header - Page title and action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Master Catalog
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-medium">B2B Wholesale SKUs</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Product Catalog Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Supervise all catalog items, vendor pricing tiers, and real-time inventory counts across India.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition shadow-sm"
            >
              <FiDownload className="w-4 h-4 text-gray-500" />
              <span>Export CSV</span>
            </button>
            <Link
              href={route('admin.products.statistics')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition shadow-sm"
            >
              <BsGraphUp className="w-4 h-4 text-emerald-400" />
              <span>Catalog Analytics</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards - Key metrics overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{Number(stats.total || 0).toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-400 mt-1">Total catalog SKUs</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <FiPackage className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Inventory Value</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(stats.total_value || 0)}</p>
                <p className="text-xs text-gray-400 mt-1">Cumulative wholesale valuation</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-xl font-bold text-emerald-600">₹</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live & Approved</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{Number(stats.approved || 0).toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-400 mt-1">Active on marketplace</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <MdVerified className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Out of Stock</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">{Number(stats.out_of_stock || 0).toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-400 mt-1">Requires vendor restock</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <FiAlertCircle className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by product name, SKU, category, or vendor..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                onClick={() => setShowFilterModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 transition"
              >
                <FiFilter className="w-4 h-4 text-gray-500" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-indigo-600 text-white rounded-full text-xs font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  <FiX className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Bulk Actions Menu */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
              <span className="text-sm font-semibold text-indigo-900">
                {selectedProducts.length} product(s) selected
              </span>
              <div className="relative">
                <button
                  onClick={() => setBulkActionMenu(!bulkActionMenu)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
                >
                  <FiMoreVertical className="w-4 h-4" />
                  <span>Bulk Actions</span>
                </button>
                {bulkActionMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-1.5 border border-gray-100 z-20">
                    <button
                      onClick={() => handleBulkAction('approve')}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition"
                    >
                      <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Approve Selected</span>
                    </button>
                    <button
                      onClick={() => handleBulkAction('reject')}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 transition"
                    >
                      <FiXCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Reject Selected</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => handleBulkAction('feature')}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 transition"
                    >
                      <FiStar className="w-3.5 h-3.5 text-purple-600" />
                      <span>Feature in Spotlight</span>
                    </button>
                    <button
                      onClick={() => handleBulkAction('unfeature')}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      <FiStar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Remove from Spotlight</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 transition"
                    >
                      <FiTrash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Delete Selected</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/75 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.data.length && products.data.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th
                    className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition"
                    onClick={() => handleSort('name')}
                  >
                    Product <SortIndicator field="name" />
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Supplier / Hub
                  </th>
                  <th
                    className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition"
                    onClick={() => handleSort('category')}
                  >
                    Category <SortIndicator field="category" />
                  </th>
                  <th
                    className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition"
                    onClick={() => handleSort('base_price')}
                  >
                    Base Price <SortIndicator field="base_price" />
                  </th>
                  <th
                    className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition"
                    onClick={() => handleSort('stock_quantity')}
                  >
                    Stock <SortIndicator field="stock_quantity" />
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th
                    className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition"
                    onClick={() => handleSort('created_at')}
                  >
                    Listing Date <SortIndicator field="created_at" />
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {products.data && products.data.length > 0 ? (
                  products.data.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <Link href={route('admin.products.show', product.id)} className="group flex items-center gap-3">
                          {product.main_image ? (
                            <img
                              src={product.main_image.startsWith('http') || product.main_image.startsWith('/') ? product.main_image : `/storage/${product.main_image}`}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = NoImg;
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                              <BsBoxSeam className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              MOQ: {product.minimum_order_quantity} {product.unit}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2">
                          <BsBuilding className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900">{product.supplier?.company_name || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{product.supplier?.city || product.supplier?.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900">{formatCurrency(product.base_price)}</div>
                        <span className="text-[11px] text-gray-400">/ {product.unit}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${product.stock_quantity > 0
                            ? product.stock_quantity < 10
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                            : 'bg-rose-500'
                            }`} />
                          <span className="font-medium text-gray-900">
                            {Number(product.stock_quantity || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`p-1.5 rounded-lg transition ${product.is_featured ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                          title={product.is_featured ? 'Remove from spotlight' : 'Feature in spotlight'}
                        >
                          <FiStar className={`w-4 h-4 ${product.is_featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">
                        {formatIndianDate(product.created_at)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={route('admin.products.edit', product.id)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit Product"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </Link>
                          <Link
                            href={route('admin.products.show', product.id)}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Product"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <BsBoxSeam className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-base font-medium text-gray-900">No products found</p>
                        <p className="text-xs text-gray-500 mt-1">Try refining your search terms or filter criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {products.links && products.links.length > 3 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{products.from || 0}</span> to <span className="font-semibold text-gray-900">{products.to || 0}</span> of <span className="font-semibold text-gray-900">{products.total || 0}</span> products
                </p>
                <div className="flex gap-1">
                  {products.links.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => link.url && router.get(link.url)}
                      disabled={!link.url || link.active}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${link.active
                        ? 'bg-gray-900 text-white'
                        : link.url
                          ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      dangerouslySetInnerHTML={{
                        __html: link.label
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Filter Catalog</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Filter items by category, vendor, inventory status, and price.</p>
                </div>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Supplier / Manufacturer
                    </label>
                    <select
                      value={selectedSupplier}
                      onChange={(e) => setSelectedSupplier(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">All Suppliers</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>{supplier.company_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Inventory Status
                  </label>
                  <select
                    value={selectedStockStatus}
                    onChange={(e) => setSelectedStockStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {stockStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Listing Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <span className="text-[11px] text-gray-400 mt-1 block">From Date</span>
                    </div>
                    <div>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <span className="text-[11px] text-gray-400 mt-1 block">To Date</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Price Range (₹)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Min Price (₹)"
                      min="0"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Max Price (₹)"
                      min="0"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 bg-white rounded-lg transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFilter}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
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