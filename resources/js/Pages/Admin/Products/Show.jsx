// Pages/Admin/Products/Show.jsx

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
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiMail,
  FiPhone,
  FiMapPin,
  FiStar,
  FiTrendingUp,
  FiShoppingCart,
  FiLayers,
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
  MdWarning,
  MdOutlineInventory,
  MdOutlineCategory,
} from 'react-icons/md';
import { BsBuilding, } from 'react-icons/bs';

// Default image for product fallback
const NoImg = "/noImg.jpg";

export default function Show({ product, salesData, recentOrders }) {
  // State management for tabs and forms
  const [activeTab, setActiveTab] = useState('details');
  const [stockAdjustment, setStockAdjustment] = useState({
    stock_quantity: product.stock_quantity,
    adjustment_reason: ''
  });
  const [showStockForm, setShowStockForm] = useState(false);

  // Handle product deletion
  const handleDelete = () => {
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
            router.get(route('admin.products.index'));
          }
        });
      }
    });
  };

  // Handle toggle featured status
  const handleToggleFeatured = () => {
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

  // Handle stock quantity update
  const handleStockUpdate = () => {
    router.post(route('admin.products.update-stock', product.id), stockAdjustment, {
      onSuccess: () => {
        setShowStockForm(false);
        Swal.fire({
          title: 'Success!',
          text: 'Inventory level updated successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
        <Icon className="w-3.5 h-3.5 mr-1" />
        {badge.label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <Head title={`${product.name} - Product Details - Treadmesh Admin`} />

      <div className="space-y-6">
        {/* Header - Back button, title and action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.products.index')}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {product.category}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 font-medium">SKU: {product.slug || product.id}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manufactured by <span className="font-medium text-gray-800">{product.supplier?.company_name}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFeatured}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border transition ${product.is_featured
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
            >
              <FiStar className={`w-4 h-4 ${product.is_featured ? 'fill-current text-amber-500' : 'text-gray-400'}`} />
              <span>{product.is_featured ? 'Featured in Spotlight' : 'Feature SKU'}</span>
            </button>
            <Link
              href={route('admin.products.edit', product.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
            >
              <FiEdit2 className="w-4 h-4" />
              <span>Edit Product</span>
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm font-semibold rounded-xl transition"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Status Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {getStatusBadge(product.status)}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${product.stock_quantity > 0
                ? product.stock_quantity < 10
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                <MdOutlineInventory className="w-3.5 h-3.5 mr-1" />
                {product.stock_quantity > 0
                  ? product.stock_quantity < 10
                    ? `Low Stock (${product.stock_quantity} ${product.unit})`
                    : `In Stock (${product.stock_quantity} ${product.unit})`
                  : 'Out of Stock'}
              </span>
            </div>
            <button
              onClick={() => setShowStockForm(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 transition"
            >
              <MdOutlineInventory className="w-4 h-4" />
              <span>Adjust Inventory Level</span>
            </button>
          </div>
        </div>

        {/* Stock Update Form */}
        {showStockForm && (
          <div className="bg-indigo-50/70 rounded-2xl border border-indigo-200 p-6 shadow-sm">
            <h3 className="font-bold text-indigo-950 mb-3">Update Inventory Level</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-2">
                  New Available Quantity ({product.unit})
                </label>
                <input
                  type="number"
                  value={stockAdjustment.stock_quantity}
                  onChange={(e) => setStockAdjustment({
                    ...stockAdjustment,
                    stock_quantity: parseInt(e.target.value) || 0
                  })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-2">
                  Adjustment Reason / PO Ref
                </label>
                <input
                  type="text"
                  value={stockAdjustment.adjustment_reason}
                  onChange={(e) => setStockAdjustment({
                    ...stockAdjustment,
                    adjustment_reason: e.target.value
                  })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Factory production lot, procurement restock, physical audit"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowStockForm(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStockUpdate}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
              >
                Save Inventory
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs for different sections */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50/50">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-3.5 text-sm font-semibold transition border-b-2 ${activeTab === 'details'
                      ? 'text-indigo-600 border-indigo-600 bg-white'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                      }`}
                  >
                    Product Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className={`px-6 py-3.5 text-sm font-semibold transition border-b-2 ${activeTab === 'pricing'
                      ? 'text-indigo-600 border-indigo-600 bg-white'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                      }`}
                  >
                    Commercial Pricing & Tiers
                  </button>
                  <button
                    onClick={() => setActiveTab('supplier')}
                    className={`px-6 py-3.5 text-sm font-semibold transition border-b-2 ${activeTab === 'supplier'
                      ? 'text-indigo-600 border-indigo-600 bg-white'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                      }`}
                  >
                    Manufacturer Dossier
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Product Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Product Images */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Product Media</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.main_image ? (
                          <div className="col-span-2">
                            <img
                              src={product.main_image.startsWith('http') || product.main_image.startsWith('/') ? product.main_image : `/storage/${product.main_image}`}
                              alt={product.name}
                              className="w-full h-80 object-cover rounded-xl border border-gray-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = NoImg;
                              }}
                            />
                          </div>
                        ) : (
                          <div className="col-span-2 h-64 bg-gray-50 rounded-xl border border-gray-200 border-dashed flex flex-col items-center justify-center text-gray-400">
                            <FiPackage className="w-12 h-12 text-gray-300 mb-2" />
                            <span className="text-sm font-medium">No primary image available</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Technical Description & Scope</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                        {product.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</p>
                        <p className="font-semibold text-gray-900 mt-1 flex items-center gap-1.5">
                          <MdOutlineCategory className="w-4 h-4 text-indigo-600" />
                          {product.category}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit of Measure</p>
                        <p className="font-semibold text-gray-900 mt-1">{product.unit || 'Piece'}</p>
                      </div>
                      <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Minimum Order</p>
                        <p className="font-semibold text-gray-900 mt-1">{product.minimum_order_quantity} {product.unit}</p>
                      </div>
                      <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Listing Date</p>
                        <p className="font-semibold text-gray-900 mt-1">{formatIndianDate(product.created_at)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing & Inventory Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    {/* Base Price */}
                    <div className="bg-emerald-50/70 border border-emerald-100 p-5 rounded-xl">
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Base Unit Price (Excl. GST)</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(product.base_price)} <span className="text-xs font-normal text-gray-500">/ {product.unit}</span></p>
                      <p className="text-xs text-emerald-700 mt-1">Minimum Procurement MOQ: {product.minimum_order_quantity} {product.unit}</p>
                    </div>

                    {/* Bulk Pricing */}
                    {product.bulk_prices && product.bulk_prices.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <FiLayers className="w-4 h-4 text-indigo-600" />
                          <span>Tiered Volume Wholesale Discounts</span>
                        </h4>
                        <div className="space-y-2">
                          {product.bulk_prices.map((tier, index) => (
                            <div key={index} className="flex justify-between items-center p-3.5 bg-gray-50 hover:bg-gray-100/70 rounded-xl border border-gray-100 transition">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                                  {index + 1}
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {tier.min_quantity} {tier.max_quantity ? `- ${tier.max_quantity}` : '+'} {product.unit}
                                </span>
                              </div>
                              <span className="font-bold text-indigo-600 text-base">
                                {formatCurrency(tier.price)} <span className="text-xs text-gray-400 font-normal">/ {product.unit}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stock Info */}
                    <div className="border-t border-gray-100 pt-5">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Inventory Status</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500">Current In-Stock Quantity</p>
                          <p className="text-xl font-bold text-gray-900 mt-1">{Number(product.stock_quantity || 0).toLocaleString('en-IN')} {product.unit}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500">Last Stock Revision</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">{product.updated_at ? formatIndianDate(product.updated_at) : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Supplier Info Tab */}
                {activeTab === 'supplier' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <BsBuilding className="w-7 h-7 text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-gray-900">{product.supplier?.company_name}</h4>
                          {product.supplier?.isVerified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <MdVerified className="w-3.5 h-3.5" />
                              Verified OEM
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Verified Vendor Since {new Date(product.supplier?.created_at).getFullYear() || '2025'} • Make-in-India Manufacturer
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                        <FiMail className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Official Communication Email</p>
                          <a href={`mailto:${product.supplier?.company_email}`} className="text-sm font-medium text-indigo-600 hover:underline">
                            {product.supplier?.company_email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                        <FiPhone className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Business Telephone</p>
                          <a href={`tel:${product.supplier?.company_phone}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                            {product.supplier?.company_phone}
                          </a>
                        </div>
                      </div>
                      <div className="col-span-full flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                        <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Manufacturing Facility & Industrial Hub</p>
                          <span className="text-sm font-medium text-gray-900">
                            {product.supplier?.company_address}, {product.supplier?.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-sm">
                      <div>
                        <span className="text-xs text-gray-500">Authorised Representative:</span>
                        <p className="font-semibold text-gray-900">{product.supplier?.user?.name || 'N/A'}</p>
                      </div>
                      <Link
                        href={route('admin.suppliers.show', product.supplier?.id || 1)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        View Full Supplier Dossier →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            {recentOrders && recentOrders.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FiShoppingCart className="w-4 h-4 text-indigo-600" />
                  <span>Recent Procurement Purchase Orders</span>
                </h3>
                <div className="space-y-3">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100/70 rounded-xl border border-gray-100 transition">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">PO #{order.order_number}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Procuring Buyer: <span className="font-medium text-gray-800">{order.buyer_name}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600 text-sm">{order.quantity} {product.unit || 'Units'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatIndianDate(order.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Sales Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Commercial Sales Performance</span>
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500">Total Units Dispatched</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">
                    {Number(salesData?.total_ordered || 0).toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-500">{product.unit}</span>
                  </p>
                </div>
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Gross Revenue (INR)</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{formatCurrency(salesData?.total_revenue || 0)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <p className="text-xs text-gray-500">Total Orders</p>
                    <p className="text-lg font-bold text-gray-900 mt-0.5">{salesData?.times_purchased || 0}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <p className="text-xs text-gray-500">Buyer Rating</p>
                    <p className="text-lg font-bold text-amber-600 mt-0.5">★ {salesData?.average_rating || '5.0'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href={route('admin.products.edit', product.id)}
                  className="flex items-center gap-2.5 p-3 text-sm font-semibold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70 rounded-xl transition"
                >
                  <FiEdit2 className="w-4 h-4" />
                  <span>Edit Product Specifications</span>
                </Link>
                <button
                  onClick={() => setShowStockForm(true)}
                  className="flex items-center gap-2.5 p-3 text-sm font-semibold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 rounded-xl transition w-full text-left"
                >
                  <MdOutlineInventory className="w-4 h-4" />
                  <span>Adjust Inventory Level</span>
                </button>
                <button
                  onClick={handleToggleFeatured}
                  className={`flex items-center gap-2.5 p-3 text-sm font-semibold rounded-xl transition w-full text-left ${product.is_featured
                    ? 'text-amber-800 bg-amber-50 hover:bg-amber-100'
                    : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                  <FiStar className="w-4 h-4" />
                  <span>{product.is_featured ? 'Remove from Spotlight' : 'Feature in Spotlight'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}