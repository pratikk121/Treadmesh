// Pages/Admin/Products/Show.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Admin dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

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
  FiStar as FiStarFilled,
  FiTrendingUp,
  FiShoppingCart,
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
          title: 'successful!',
          text: `The product is ${product.is_featured ? 'Unpublished' : 'Promoted'} marked as।`,
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
          title: 'successful!',
          text: 'Stock updated successfully।',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Format currency - Converts number to BDT currency format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date - Converts ISO date to readable format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {badge.label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <Head title={`${product.name} - Details`} />

      <div className="space-y-6">
        {/* Header - Back button, title and action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.products.index')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Product description and management
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleToggleFeatured}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${product.is_featured
                ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
            >
              {product.is_featured ? <FiStarFilled className="w-4 h-4" /> : <FiStar className="w-4 h-4" />}
              <span>{product.is_featured ? 'Promoted' : 'Marked as promoted'}</span>
            </button>
            <Link
              href={route('admin.products.edit', product.id)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
            >
              <FiEdit2 className="w-4 h-4" />
              <span>editing</span>
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>delete</span>
            </button>
          </div>
        </div>

        {/* Product Status Bar - Current status badges */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {getStatusBadge(product.status)}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.stock_quantity > 0
                ? product.stock_quantity < 10
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                <MdOutlineInventory className="w-4 h-4 mr-1" />
                {product.stock_quantity > 0
                  ? product.stock_quantity < 10
                    ? `Stock low (${product.stock_quantity})`
                    : ` (${product.stock_quantity})`
                  : 'Out of Stock'}
              </span>
            </div>
            <button
              onClick={() => setShowStockForm(true)}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Stock update
            </button>
          </div>
        </div>

        {/* Stock Update Form */}
        {showStockForm && (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Stock quantity update</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New stock quantity
                </label>
                <input
                  type="number"
                  value={stockAdjustment.stock_quantity}
                  onChange={(e) => setStockAdjustment({
                    ...stockAdjustment,
                    stock_quantity: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for adjustment (optional)
                </label>
                <input
                  type="text"
                  value={stockAdjustment.adjustment_reason}
                  onChange={(e) => setStockAdjustment({
                    ...stockAdjustment,
                    adjustment_reason: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="eg: restocking, damaged goods, etc."
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowStockForm(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                cancel
              </button>
              <button
                onClick={handleStockUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Stock update
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs for different sections */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-3 text-sm font-medium ${activeTab === 'details'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Product details
                  </button>
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className={`px-6 py-3 text-sm font-medium ${activeTab === 'pricing'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Price and stock
                  </button>
                  <button
                    onClick={() => setActiveTab('supplier')}
                    className={`px-6 py-3 text-sm font-medium ${activeTab === 'supplier'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Supplier Information
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Product Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Product Images */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Product image</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.main_image ? (
                          <div className="col-span-2">
                            <img
                              src={product.main_image ? `/storage/${product.main_image}` : NoImg}
                              alt={product.name}
                              className="w-full h-64 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = NoImg;
                              }}
                            />
                          </div>
                        ) : (
                          <div className="col-span-2 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FiPackage className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                          <MdOutlineCategory className="w-4 h-4 text-indigo-600" />
                          {product.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Unit</p>
                        <p className="font-medium text-gray-900">{product.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Slug</p>
                        <p className="font-medium text-gray-900">{product.slug}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Creation Date</p>
                        <p className="font-medium text-gray-900">{formatDate(product.created_at)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing & Inventory Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    {/* Base Price */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Original price</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(product.base_price)}</p>
                      <p className="text-sm text-gray-500 mt-1">Minimum Order: {product.minimum_order_quantity} {product.unit}</p>
                    </div>

                    {/* Bulk Pricing */}
                    {product.bulk_prices && product.bulk_prices.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Bulk price level</h4>
                        <div className="space-y-2">
                          {product.bulk_prices.map((tier, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <span className="text-sm font-medium text-gray-900">
                                  {tier.min_quantity} - {tier.max_quantity || '∞'} {product.unit}
                                </span>
                              </div>
                              <span className="font-medium text-indigo-600">
                                {formatCurrency(tier.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stock Info */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Stock information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Current stock is</p>
                          <p className="text-xl font-bold text-gray-900">{product.stock_quantity} {product.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Latest update</p>
                          <p className="text-sm text-gray-900">{product.updated_at ? formatDate(product.updated_at) : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Supplier Info Tab */}
                {activeTab === 'supplier' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                        <BsBuilding className="w-8 h-8 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{product.supplier?.company_name}</h4>
                        <p className="text-sm text-gray-500">{new Date(product.supplier?.created_at).getFullYear()} Supplier from</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-2">
                        <FiMail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${product.supplier?.company_email}`} className="text-sm text-indigo-600 hover:text-indigo-700">
                          {product.supplier?.company_email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${product.supplier?.company_phone}`} className="text-sm text-gray-600 hover:text-indigo-600">
                          {product.supplier?.company_phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {product.supplier?.company_address}, {product.supplier?.city}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-500">Contact Person</p>
                      <p className="font-medium text-gray-900">{product.supplier?.user?.name}</p>
                      <p className="text-sm text-gray-500">{product.supplier?.user?.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            {recentOrders.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiShoppingCart className="w-5 h-5 text-indigo-600" />
                  Recent Orders
                </h3>
                <div className="space-y-3">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{order.order_number}</p>
                        <p className="text-sm text-gray-500">Buyer: {order.buyer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-indigo-600">{order.quantity} Unit</p>
                        <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5 text-indigo-600" />
                Sales performance
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total units sold are</p>
                  <p className="text-2xl font-bold text-gray-900">{salesData.total_ordered}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total income is</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(salesData.total_revenue)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-gray-500">The number of purchases is</p>
                    <p className="text-lg font-semibold text-gray-900">{salesData.times_purchased}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Average rating is</p>
                    <p className="text-lg font-semibold text-yellow-600">{salesData.average_rating} ★</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick operation</h3>
              <div className="space-y-2">
                <Link
                  href={route('admin.products.edit', product.id)}
                  className="flex items-center gap-2 p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <FiEdit2 className="w-5 h-5" />
                  <span>Product editing</span>
                </Link>
                <button
                  onClick={() => setShowStockForm(true)}
                  className="flex items-center gap-2 p-3 text-green-600 hover:bg-green-50 rounded-lg transition w-full text-left"
                >
                  <MdOutlineInventory className="w-5 h-5" />
                  <span>Stock update</span>
                </button>
                <button
                  onClick={handleToggleFeatured}
                  className={`flex items-center gap-2 p-3 rounded-lg transition w-full text-left ${product.is_featured
                    ? 'text-yellow-600 hover:bg-yellow-50'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {product.is_featured ? <FiStarFilled className="w-5 h-5" /> : <FiStar className="w-5 h-5" />}
                  <span>{product.is_featured ? 'Remove the promoted symbol' : 'Marked as promoted'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}