// Pages/Admin/Products/Index.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Admin dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

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
  FiStar as FiStarFilled,
  FiMoreVertical,
  FiAlertCircle
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
  MdWarning,
  MdOutlineAttachMoney
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
    { value: '', label: 'All statuses are' },
    { value: 'approved', label: 'Approved', color: 'green' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
  ];

  // Stock status options for dropdown
  const stockStatusOptions = [
    { value: '', label: 'All stock' },
    { value: 'in_stock', label: '' },
    { value: 'low_stock', label: 'Stock low (<10)' },
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
        title: 'Multiple product approval',
        text: `Are you ${selectedProducts.length} t want to approve the product?`,
        icon: 'question',
        confirmColor: '#10B981',
        action: 'approve'
      },
      reject: {
        title: 'Rejection of multiple products',
        text: `Are you ${selectedProducts.length} t want to reject the product?`,
        icon: 'warning',
        confirmColor: '#EF4444',
        action: 'reject'
      },
      feature: {
        title: 'Multiple product promotions',
        text: `Are you ${selectedProducts.length} T want to mark the product as promoted?`,
        icon: 'question',
        confirmColor: '#8B5CF6',
        action: 'feature'
      },
      unfeature: {
        title: 'Cancel multiple product promotions',
        text: `Are you ${selectedProducts.length} T want to remove the promoted mark from the product?`,
        icon: 'question',
        confirmColor: '#6B7280',
        action: 'unfeature'
      },
      delete: {
        title: 'Delete multiple products',
        text: `Are you ${selectedProducts.length} Want to remove t products? This action cannot be undone।`,
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
      confirmButtonText: 'Yes, continue',
      cancelButtonText: 'cancel'
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
              title: 'successful!',
              text: `to start sending messages Multiple operations completed successfully।`,
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
      title: 'Delete product',
      text: `Are you ${product.name} Want to delete? This action cannot be undone।`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('admin.products.destroy', product.id), {
          onSuccess: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The product has been deleted।',
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
          title: 'successful!',
          text: `The product is ${product.is_featured ? 'Unpublished' : 'Promoted'} marked as।`,
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
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  // Format currency - Converts number to USD currency format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date - Converts ISO date to readable format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    const badges = {
      approved: { color: 'bg-green-100 text-green-800', icon: MdVerified, label: 'Approved' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: MdPending, label: 'Pending' },
      rejected: { color: 'bg-red-100 text-red-800', icon: MdWarning, label: 'Rejected' },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
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
      <Head title="Product Management" />

      <div className="space-y-6">
        {/* Header - Page title and action buttons */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and monitor all products in the marketplace
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
              href={route('admin.products.statistics')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
            >
              <BsGraphUp className="w-4 h-4" />
              <span>Statistics</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards - Key metrics overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiPackage className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total stock value is</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(stats.total_value)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <MdOutlineAttachMoney className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <MdVerified className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.out_of_stock}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FiAlertCircle className="w-6 h-6 text-red-600" />
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
                  placeholder="Search by product name, description or supplier..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <div className="flex gap-2">
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
                <span>Filter</span>
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

          {/* Bulk Actions - Show when products are selected */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
              <span className="text-sm font-medium text-indigo-700">
                {selectedProducts.length} products selected
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
                      onClick={() => handleBulkAction('approve')}
                      className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                    >
                      Selected authorization
                    </button>
                    <button
                      onClick={() => handleBulkAction('reject')}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Selected Reject
                    </button>
                    <div className="border-t my-1"></div>
                    <button
                      onClick={() => handleBulkAction('feature')}
                      className="block w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-gray-100"
                    >
                      Marked as promoted
                    </button>
                    <button
                      onClick={() => handleBulkAction('unfeature')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                    >
                      Remove the promoted symbol
                    </button>
                    <div className="border-t my-1"></div>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete selected
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Products Table - Main data table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.data.length && products.data.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('name')}
                  >
                    Product <SortIndicator field="name" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('category')}
                  >
                    Category <SortIndicator field="category" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('base_price')}
                  >
                    Price <SortIndicator field="base_price" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('stock_quantity')}
                  >
                    Stock <SortIndicator field="stock_quantity" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promoted
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('created_at')}
                  >
                    Creation Date <SortIndicator field="created_at" />
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activities
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.data.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link href={route('admin.products.show', product.id)} className="hover:text-indigo-600">
                        <div className="flex items-center gap-3">
                          {product.main_image ? (
                            <img
                              src={product.main_image ? `/storage/${product.main_image}` : NoImg}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = NoImg;
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <BsBoxSeam className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">Minimum Order: {product.minimum_order_quantity} {product.unit}</div>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BsBuilding className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.supplier?.company_name}</div>
                          <div className="text-xs text-gray-500">{product.supplier?.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(product.base_price)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${product.stock_quantity > 0
                          ? product.stock_quantity < 10
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                          : 'bg-red-500'
                          }`} />
                        <span className="text-sm text-gray-900">{product.stock_quantity || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        className={`p-1 rounded-full hover:bg-gray-100 transition ${product.is_featured ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                      >
                        {product.is_featured ? <FiStarFilled className="w-5 h-5" /> : <FiStar className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{formatDate(product.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={route('admin.products.edit', product.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="editing"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <Link
                          href={route('admin.products.show', product.id)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="See"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
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
          {products.links && (
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  total {products.total} of the {products.from} from {products.to} Showing
                </p>
                <div className="flex gap-2">
                  {products.links.map((link, index) => (
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Advanced filter</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier
                    </label>
                    <select
                      value={selectedSupplier}
                      onChange={(e) => setSelectedSupplier(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">All suppliers</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>{supplier.company_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock status
                  </label>
                  <select
                    value={selectedStockStatus}
                    onChange={(e) => setSelectedStockStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {stockStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price range ($)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Lowest Price"
                      min="0"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Maximum price"
                      min="0"
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