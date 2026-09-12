// Pages/Supplier/Products/Index.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Supplier dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Formatters
import { formatCurrency, formatIndianDate } from '@/Utils/formatters';

// Icons - Importing icon sets for UI elements
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiFilter,
  FiSearch,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
  FiArchive,
  FiToggleLeft,
  FiToggleRight
} from 'react-icons/fi';

// Image placeholder
const NoImg = "/noImg.jpg";

export default function ProductsIndex({ products, stats, categories }) {
  // State management for selection, filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  // Apply all filters to the product list
  const applyFilters = () => {
    router.get(route('supplier.products.index'), {
      search: searchTerm,
      status: statusFilter,
      category: categoryFilter,
      sort: sortField,
      direction: sortDirection
    }, {
      preserveState: true,
      replace: true
    });
  };

  // Reset all filters to default
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCategoryFilter('');
    setSortField('created_at');
    setSortDirection('desc');
    router.get(route('supplier.products.index'), {}, {
      preserveState: true,
      replace: true
    });
  };

  // Handle column sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    applyFilters();
  };

  // Handle product selection for bulk operations
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.data.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.data.map(p => p.id));
    }
  };

  const toggleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Bulk delete products
  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      router.post(route('supplier.products.bulk-delete'), {
        product_ids: selectedProducts
      }, {
        onSuccess: () => setSelectedProducts([])
      });
    }
  };

  // Duplicate product
  const handleDuplicate = (id) => {
    router.post(route('supplier.products.duplicate', id));
  };

  // Toggle product active status
  const handleToggleStatus = (id) => {
    router.patch(route('supplier.products.toggle-status', id));
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle, label: 'Active' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiClock, label: 'Pending' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', icon: FiXCircle, label: 'Inactive' }
    };
    const badge = badges[status] || badges.inactive;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  // Get stock status text based on quantity
  const getStockStatus = (product) => {
    if (product.stock_quantity <= 0) {
      return <span className="text-red-600 font-medium">Out of Stock</span>;
    } else if (product.stock_quantity <= 10) {
      return <span className="text-orange-600 font-medium">Stock low ({product.stock_quantity})</span>;
    }
    return <span className="text-green-600 font-medium">{product.stock_quantity} Unit</span>;
  };

  // Sort icon component for table headers
  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FiChevronDown className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc'
      ? <FiChevronUp className="w-4 h-4 text-indigo-600" />
      : <FiChevronDown className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <DashboardLayout>
      <Head title="Product Catalog Management | Treadmesh Supplier" />

      <div className="space-y-6">
        {/* Header - Page title and add product button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-plus-jakarta">Catalog & SKUs</h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage manufactured inventory, wholesale tiered pricing, and SKU listings
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={route('supplier.products.create')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm shadow-xs"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New SKU</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards - Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-plus-jakarta">Total SKUs</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-plus-jakarta">Active</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1 font-mono">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-plus-jakarta">Under Review</p>
            <p className="text-2xl font-bold text-amber-600 mt-1 font-mono">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-plus-jakarta">Delisted</p>
            <p className="text-2xl font-bold text-slate-600 mt-1 font-mono">{stats.inactive}</p>
          </div>
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-plus-jakarta">Low Stock Alert</p>
            <p className="text-2xl font-bold text-orange-600 mt-1 font-mono">{stats.low_stock}</p>
          </div>
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-plus-jakarta">Depleted (0)</p>
            <p className="text-2xl font-bold text-red-600 mt-1 font-mono">{stats.out_of_stock}</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium text-sm"
            >
              <FiFilter className="w-4 h-4 text-indigo-600" />
              <span>Filter Catalog</span>
              {showFilters ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
            </button>
            <span className="text-xs text-slate-500">
              {products.total} products registered
            </span>
          </div>

          {showFilters && (
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="col-span-2">
                  <form onSubmit={handleSearch} className="flex">
                    <input
                      type="text"
                      placeholder="Search SKU name, specifications, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition"
                    >
                      <FiSearch className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white"
                  >
                    <option value="">All Verification Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending Approval</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Action Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-xs transition"
                >
                  Reset Filters
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-xs transition shadow-xs"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-center justify-between">
            <span className="text-indigo-900 font-medium text-sm">
              {selectedProducts.length} SKU(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-xs transition shadow-xs"
              >
                Delete Selected SKUs
              </button>
              <button
                onClick={() => setSelectedProducts([])}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-xs transition"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-3.5 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.data.length && products.data.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Product / SKU Name
                      <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('base_price')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Wholesale Price
                      <SortIcon field="base_price" />
                    </button>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('stock_quantity')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Inventory
                      <SortIcon field="stock_quantity" />
                    </button>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('created_at')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Listing Date
                      <SortIcon field="created_at" />
                    </button>
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.data.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelectProduct(product.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img
                            src={product.main_image ? `/storage/${product.main_image}` : NoImg}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = NoImg;
                            }}
                          />
                        </div>
                        <div>
                          <Link
                            href={route('supplier.products.edit', product.id)}
                            className="font-semibold text-slate-900 hover:text-indigo-600 text-sm"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-slate-400 mt-0.5 font-mono">SKU: {product.sku || `TM-${product.id}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{formatCurrency(product.base_price)}</p>
                        <p className="text-xs text-slate-500">MOQ: {product.minimum_order_quantity} {product.unit}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{getStockStatus(product)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {formatIndianDate(product.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={route('supplier.products.bulk-prices', product.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                          title="Volume Tier Pricing"
                        >
                          <FiArchive className="w-4 h-4" />
                        </Link>
                        <Link
                          href={route('supplier.products.edit', product.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                          title="Edit SKU"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(product.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                          title="Clone SKU"
                        >
                          <FiCopy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this product?')) {
                              router.delete(route('supplier.products.destroy', product.id));
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Delete SKU"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Empty State */}
                {products.data.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <FiPackage className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-700 text-base font-semibold mb-1">No catalog SKUs found</p>
                      <p className="text-slate-400 text-xs mb-4">Start listing manufactured items for wholesale buyers</p>
                      <Link
                        href={route('supplier.products.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition shadow-xs"
                      >
                        <FiPlus className="w-4 h-4" />
                        Add First SKU
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {products.links && (
            <div className="px-6 py-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Showing {products.from || 0} to {products.to || 0} of {products.total} SKUs
                </p>
                <div className="flex gap-2">
                  {products.links.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => router.get(link.url)}
                      disabled={!link.url || link.active}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${link.active
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : link.url
                          ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      dangerouslySetInnerHTML={{
                        __html: link.label
                          .replace('&laquo; Previous', '← Previous')
                          .replace('Next &raquo;', 'Next →')
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}