// Pages/Supplier/Profile/Index.jsx

// React - Core React imports for component functionality
import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Layout - Supplier dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
import {
  FiEdit2,
  FiPackage,
  FiShoppingCart,
  FiFileText,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiTrendingUp,
  FiEye
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
  MdWarning
} from 'react-icons/md';

export default function ProfileIndex({
  user,
  supplier,
  stats,
  recentProducts,
  recentOrders,
  profileCompletion
}) {
  // Format currency - Converts number to USD currency format
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date - Converts ISO date to readable format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get verification status color and icon based on supplier verification status
  const getVerificationStatus = () => {
    if (!supplier?.id) {
      return {
        color: 'bg-gray-100 text-gray-800',
        icon: FiAlertCircle,
        text: 'Not started'
      };
    }

    const status = supplier.verification_status;
    if (status === 'verified') {
      return {
        color: 'bg-green-100 text-green-800',
        icon: MdVerified,
        text: 'Verified'
      };
    } else if (status === 'pending') {
      return {
        color: 'bg-yellow-100 text-yellow-800',
        icon: MdPending,
        text: '.Pending'
      };
    } else {
      return {
        color: 'bg-red-100 text-red-800',
        icon: MdWarning,
        text: 'Verification failed'
      };
    }
  };

  // Get verification status
  const verificationStatus = getVerificationStatus();
  // Get verification status color and icon
  const StatusIcon = verificationStatus.icon;

  return (
    <DashboardLayout>
      <Head title="Company profile" />

      <div className="space-y-6">
        {/* Header - Page title and edit button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company profile</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your company information and view performance metrics
            </p>
          </div>
          <Link
            href={route('supplier.profile.edit')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <FiEdit2 className="w-4 h-4" />
            <span>Edit profile</span>
          </Link>
        </div>

        {/* Profile Completion Alert */}
        {profileCompletion < 100 && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiTrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-blue-700">
                  Your profile is <span className="font-bold">{profileCompletion}% Complete</span>।
                  compared to last time Complete your profile to increase trust and visibility with buyers।
                </p>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Info Card */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${verificationStatus.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {verificationStatus.text}
                </span>
              </div>
            </div>
            <div className="p-6">
              {supplier?.id ? (
                <div className="space-y-6">
                  {/* Company Name & Logo */}
                  <div className="flex items-start gap-4">
                    {supplier.logo ? (
                      <img
                        src={`/storage/${supplier.logo}`}
                        alt={supplier.company_name}
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <FiBriefcase className="w-8 h-8 text-indigo-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{supplier.company_name}</h3>
                      {supplier.business_type && (
                        <p className="text-sm text-gray-600 mt-1">{supplier.business_type}</p>
                      )}
                      {supplier.year_established && (
                        <p className="text-sm text-gray-500 mt-1">
                          Established {supplier.year_established}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <FiUser className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Contact Person</p>
                        <p className="font-medium text-gray-900">{user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiMail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email address</p>
                        <p className="font-medium text-gray-900">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiPhone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Phone number</p>
                        <p className="font-medium text-gray-900">{supplier.company_phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">
                          {supplier.company_address}, {supplier.city}
                          {supplier.state && `, ${supplier.state}`}
                          {supplier.postal_code && ` - ${supplier.postal_code}`}
                          {supplier.country && <>, {supplier.country}</>}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Business Details Section */}
                  {(supplier.trade_license_number || supplier.tax_id || supplier.website) && (
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Business Description</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {supplier.trade_license_number && (
                          <div>
                            <p className="text-sm text-gray-500">Trade License No.</p>
                            <p className="font-medium text-gray-900">{supplier.trade_license_number}</p>
                          </div>
                        )}
                        {supplier.tax_id && (
                          <div>
                            <p className="text-sm text-gray-500">Tax ID / VAT Number</p>
                            <p className="font-medium text-gray-900">{supplier.tax_id}</p>
                          </div>
                        )}
                        {supplier.website && (
                          <div>
                            <p className="text-sm text-gray-500"></p>
                            <a
                              href={supplier.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-indigo-600 hover:text-indigo-700"
                            >
                              {supplier.website}
                            </a>
                          </div>
                        )}
                        {supplier.number_of_employees && (
                          <div>
                            <p className="text-sm text-gray-500">Number of employees</p>
                            <p className="font-medium text-gray-900">{supplier.number_of_employees}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Company Description */}
                  {supplier.description && (
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">About the company</h4>
                      <p className="text-gray-600">{supplier.description}</p>
                    </div>
                  )}

                  {/* Documents Section */}
                  {(supplier.trade_license_document || supplier.certificate_of_incorporation) && (
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Documents</h4>
                      <div className="space-y-2">
                        {supplier.trade_license_document && (
                          <a
                            href={`/storage/${supplier.trade_license_document}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                          >
                            <FiFileText className="w-4 h-4" />
                            <span>Trade License Document</span>
                            <FiEye className="w-4 h-4 ml-auto" />
                          </a>
                        )}
                        {supplier.certificate_of_incorporation && (
                          <a
                            href={`/storage/${supplier.certificate_of_incorporation}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                          >
                            <FiFileText className="w-4 h-4" />
                            <span>Certificate of Registration</span>
                            <FiEye className="w-4 h-4 ml-auto" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Empty State - No profile yet
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBriefcase className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No profile yet</h3>
                  <p className="text-gray-500 mb-4">You have not created your company profile yet।</p>
                  <Link
                    href={route('supplier.profile.edit')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Create profile</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="space-y-4">
            {/* Verification Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Verification Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Profile completeness</span>
                  <span className="text-sm font-medium text-gray-900">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-500">Verification</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${verificationStatus.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {verificationStatus.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Quick stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FiPackage className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">Total Products</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stats.total_products}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FiCheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600">Active product</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stats.active_products}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FiFileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-600">Total Quota</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stats.total_quotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <FiClock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-sm text-gray-600">Pending Quota</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stats.pending_quotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FiCheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600">Accepted Quota</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stats.accepted_quotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FiShoppingCart className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-sm text-gray-600">Total order</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stats.total_orders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FiDollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600">Total income is</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(stats.total_revenue)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Products & Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiPackage className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Latest products</h3>
                    <p className="text-sm text-gray-500">Last 5 products</p>
                  </div>
                </div>
                <Link
                  href={route('supplier.products.index')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentProducts?.length > 0 ? (
                recentProducts.map((product) => (
                  <div key={product.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <FiPackage className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <Link
                            href={route('supplier.products.edit', product.id)}
                            className="font-medium text-gray-900 hover:text-indigo-600"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>SKU: {product.sku || 'N/A'}</span>
                            <span>•</span>
                            <span>{formatCurrency(product.base_price)}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                              {product.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={route('supplier.products.edit', product.id)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiPackage className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No products</p>
                  <p className="text-sm text-gray-400 mt-1">Start adding your products</p>
                  <Link
                    href={route('supplier.products.create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition mt-4"
                  >
                    Add product
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiShoppingCart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                    <p className="text-sm text-gray-500">Last 5 orders</p>
                  </div>
                </div>
                <Link
                  href={route('supplier.orders.index')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentOrders?.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                          <FiShoppingCart className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <Link
                            href={route('supplier.orders.show', order.id)}
                            className="font-medium text-gray-900 hover:text-indigo-600"
                          >
                            Order #{order.order_number}
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{order.buyer?.name}</span>
                            <span>•</span>
                            <span>{formatCurrency(order.total_amount)}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.order_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.order_status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                  'bg-yellow-100 text-yellow-800'
                              }`}>
                              {order.order_status === 'pending_confirmation' ? 'Awaiting' :
                                order.order_status === 'confirmed' ? 'sure' :
                                  order.order_status === 'processing' ? 'In process' :
                                    order.order_status === 'shipped' ? 'has been sent' :
                                      order.order_status === 'delivered' ? 'Delivered' :
                                        order.order_status === 'cancelled' ? 'cancel' : order.order_status?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No order</p>
                  <p className="text-sm text-gray-400 mt-1">Orders can be seen here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Quick operation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href={route('supplier.products.create')}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition group"
            >
              <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition mb-2">
                <FiPackage className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Add product</span>
            </Link>
            <Link
              href={route('supplier.orders.index')}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition group"
            >
              <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition mb-2">
                <FiShoppingCart className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">View order</span>
            </Link>
            <Link
              href={route('supplier.rfqs.index')}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition group"
            >
              <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition mb-2">
                <FiFileText className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">RFQ Browse</span>
            </Link>
            <Link
              href={route('supplier.messages.index')}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition group"
            >
              <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition mb-2">
                <FiUser className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Message</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}