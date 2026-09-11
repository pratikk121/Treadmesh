// Pages/Admin/ProductApproval/Index.jsx

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
  FiEye,
  FiCalendar,
  FiCheckCircle,
  FiX,
  FiXCircle,
} from 'react-icons/fi';
import {
  MdPending,
  MdVerified,
  MdWarning,
  MdOutlineCategory
} from 'react-icons/md';
import { BsBoxSeam, BsBuilding, BsShieldCheck } from 'react-icons/bs';

// Default image for product fallback
const NoImg = "/noImg.jpg";

export default function Index({ pendingProducts, stats, categories, suppliers, filters }) {
  // State management for filters and UI controls
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [minPrice, setMinPrice] = useState(filters.min_price || '');
  const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
  const [selectedSupplier, setSelectedSupplier] = useState(filters.supplier_id || '');

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('admin.product-approval.index'), {
      ...filters,
      search: searchTerm,
      category: selectedCategory,
      supplier_id: selectedSupplier,
      date_from: dateFrom,
      date_to: dateTo,
      min_price: minPrice,
      max_price: maxPrice
    }, { preserveState: true });
  };

  // Handle filter application
  const handleFilter = () => {
    router.get(route('admin.product-approval.index'), {
      ...filters,
      search: searchTerm,
      category: selectedCategory,
      supplier_id: selectedSupplier,
      date_from: dateFrom,
      date_to: dateTo,
      min_price: minPrice,
      max_price: maxPrice
    }, { preserveState: true });
    setShowFilterModal(false);
  };

  // Handle reset all filters
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSupplier('');
    setDateFrom('');
    setDateTo('');
    setMinPrice('');
    setMaxPrice('');
    router.get(route('admin.product-approval.index'), {}, { preserveState: true });
    setShowFilterModal(false);
  };

  // Handle bulk selection of products
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(pendingProducts.data.map(p => p.id));
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

  // Handle bulk approve products
  const handleBulkApprove = () => {
    if (selectedProducts.length === 0) return;

    Swal.fire({
      title: 'Bulk Product Approval',
      text: `Are you sure you want to approve ${selectedProducts.length} selected products for public listing?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Approve All',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('admin.product-approval.bulk-approve'), {
          product_ids: selectedProducts
        }, {
          onSuccess: () => {
            setSelectedProducts([]);
            Swal.fire({
              title: 'Approved!',
              text: `${selectedProducts.length} products have been approved and published to the catalog.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  // Count active filters for display
  const activeFilterCount = [
    selectedCategory,
    selectedSupplier,
    dateFrom,
    dateTo,
    minPrice,
    maxPrice
  ].filter(Boolean).length;

  return (
    <DashboardLayout>
      <Head title="Product Verification & Approval - Treadmesh Admin" />

      <div className="space-y-6">
        {/* Header - Page title and action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Catalog Compliance
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-medium">Make-in-India Verification</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Product Approval Queue</h1>
            <p className="text-sm text-gray-500 mt-1">
              Audit supplier catalog listings, technical specifications, and HSN compliance prior to marketplace indexing.
            </p>
          </div>
          <Link
            href={route('admin.product-approval.statistics')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-xl transition shadow-sm"
          >
            <FiPackage className="w-4 h-4 text-emerald-400" />
            <span>Approval Analytics</span>
          </Link>
        </div>

        {/* Stats Cards - Key metrics overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Review</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending || 0}</p>
                <p className="text-xs text-gray-400 mt-1">Awaiting catalog audit</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <MdPending className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved Today</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved_today || 0}</p>
                <p className="text-xs text-gray-400 mt-1">Published to marketplace</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <MdVerified className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rejected Today</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">{stats.rejected_today || 0}</p>
                <p className="text-xs text-gray-400 mt-1">Requires seller correction</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <MdWarning className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.categories || 0}</p>
                <p className="text-xs text-gray-400 mt-1">Industrial categories</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <MdOutlineCategory className="w-6 h-6 text-indigo-600" />
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
                  placeholder="Search by SKU, product name, specs, or manufacturer..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <div className="flex items-center gap-2">
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

          {/* Bulk Actions Bar */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
                <BsShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>{selectedProducts.length} product(s) selected for bulk action</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkApprove}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Approve Selected</span>
                </button>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white/60 transition"
                >
                  Deselect All
                </button>
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
                      checked={selectedProducts.length === pendingProducts.data.length && pendingProducts.data.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product & MOQ
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Manufacturer / Supplier
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Unit Base Price
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Inventory
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Submitted Date
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {pendingProducts.data && pendingProducts.data.length > 0 ? (
                  pendingProducts.data.map((product) => (
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
                        <Link href={route('admin.product-approval.show', product.id)} className="group flex items-center gap-3">
                          {product.main_image ? (
                            <img
                              src={product.main_image.startsWith('http') || product.main_image.startsWith('/') ? product.main_image : `/storage/${product.main_image}`}
                              alt={product.name}
                              className="w-11 h-11 rounded-lg object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = NoImg;
                              }}
                            />
                          ) : (
                            <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                              <BsBoxSeam className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              MOQ: <span className="font-medium text-gray-700">{product.minimum_order_quantity} {product.unit}</span>
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
                        {product.bulk_prices && Object.keys(product.bulk_prices).length > 0 && (
                          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Tiered Pricing Available</div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900">
                          {Number(product.stock_quantity || 0).toLocaleString('en-IN')} {product.unit}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatIndianDate(product.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={route('admin.product-approval.show', product.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>Review SKU</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <BsBoxSeam className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-base font-medium text-gray-900">No pending products in review</p>
                        <p className="text-xs text-gray-500 mt-1">All supplier submissions have been evaluated.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pendingProducts.links && pendingProducts.links.length > 3 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{pendingProducts.from || 0}</span> to <span className="font-semibold text-gray-900">{pendingProducts.to || 0}</span> of <span className="font-semibold text-gray-900">{pendingProducts.total || 0}</span> submissions
                </p>
                <div className="flex gap-1">
                  {pendingProducts.links.map((link, index) => (
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
                  <h3 className="text-lg font-bold text-gray-900">Filter Submissions</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Filter products by category, manufacturer, date, and price.</p>
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
                    Submission Date Range
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
                    Unit Price Range (₹)
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