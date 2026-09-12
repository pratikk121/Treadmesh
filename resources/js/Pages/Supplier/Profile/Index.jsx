// Pages/Supplier/Profile/Index.jsx

// React - Core React imports for component functionality
import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Layout - Supplier dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Formatters
import { formatCurrency, formatIndianDate } from '@/Utils/formatters';

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
        text: 'Verified Supplier'
      };
    } else if (status === 'pending') {
      return {
        color: 'bg-amber-100 text-amber-800',
        icon: MdPending,
        text: 'Pending Verification'
      };
    } else {
      return {
        color: 'bg-red-100 text-red-800',
        icon: MdWarning,
        text: 'Verification Rejected'
      };
    }
  };

  // Get verification status
  const verificationStatus = getVerificationStatus();
  // Get verification status color and icon
  const StatusIcon = verificationStatus.icon;

  return (
    <DashboardLayout>
      <Head title="Supplier Business Profile | Treadmesh" />

      <div className="space-y-6">
        {/* Header - Page title and edit button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-plus-jakarta">Supplier Business Profile</h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage your enterprise manufacturer credentials, GSTIN registration, and fulfillment metrics
            </p>
          </div>
          <Link
            href={route('supplier.profile.edit')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm shadow-xs"
          >
            <FiEdit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
        </div>

        {/* Profile Completion Alert */}
        {profileCompletion < 100 && (
          <div className="bg-indigo-50/70 border-l-4 border-indigo-500 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiTrendingUp className="h-5 w-5 text-indigo-600 mt-0.5" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-slate-800">
                  Your profile is <span className="font-bold text-indigo-700">{profileCompletion}% Complete</span>.
                  Complete your profile with statutory GSTIN, registered plant addresses, and certificates to boost trust with Indian enterprise procurement teams.
                </p>
                <div className="mt-2.5 w-full bg-indigo-100 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
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
          <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 font-plus-jakarta">Company Information</h2>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${verificationStatus.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
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
                        className="w-20 h-20 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center">
                        <FiBriefcase className="w-8 h-8 text-indigo-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 font-plus-jakarta">{supplier.company_name}</h3>
                      {supplier.business_type && (
                        <p className="text-sm font-medium text-indigo-600 mt-0.5">{supplier.business_type}</p>
                      )}
                      {supplier.year_established && (
                        <p className="text-xs text-slate-500 mt-1">
                          Established {supplier.year_established}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <FiUser className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Contact Person</p>
                        <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <FiMail className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Email Address</p>
                        <p className="font-semibold text-slate-900 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <FiPhone className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Phone Number</p>
                        <p className="font-semibold text-slate-900 text-sm">{supplier.company_phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <FiMapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Registered Office / Plant</p>
                        <p className="font-semibold text-slate-900 text-sm">
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
                    <div className="border-t border-slate-100 pt-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 font-plus-jakarta">Statutory & Tax Compliance</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {supplier.trade_license_number && (
                          <div>
                            <p className="text-xs text-slate-500">GSTIN / Trade License No.</p>
                            <p className="font-semibold text-slate-900 font-mono text-sm">{supplier.trade_license_number}</p>
                          </div>
                        )}
                        {supplier.tax_id && (
                          <div>
                            <p className="text-xs text-slate-500">PAN / Tax Identification</p>
                            <p className="font-semibold text-slate-900 font-mono text-sm">{supplier.tax_id}</p>
                          </div>
                        )}
                        {supplier.website && (
                          <div>
                            <p className="text-xs text-slate-500">Corporate Website</p>
                            <a
                              href={supplier.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-indigo-600 hover:text-indigo-700 text-sm"
                            >
                              {supplier.website}
                            </a>
                          </div>
                        )}
                        {supplier.number_of_employees && (
                          <div>
                            <p className="text-xs text-slate-500">Workforce Size</p>
                            <p className="font-semibold text-slate-900 text-sm">{supplier.number_of_employees}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Company Description */}
                  {supplier.description && (
                    <div className="border-t border-slate-100 pt-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2 font-plus-jakarta">Corporate Overview & Capability Statement</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{supplier.description}</p>
                    </div>
                  )}

                  {/* Documents Section */}
                  {(supplier.trade_license_document || supplier.certificate_of_incorporation) && (
                    <div className="border-t border-slate-100 pt-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 font-plus-jakarta">Compliance & Statutory Certificates</h4>
                      <div className="space-y-2">
                        {supplier.trade_license_document && (
                          <a
                            href={`/storage/${supplier.trade_license_document}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 text-indigo-600 hover:text-indigo-700 text-sm transition"
                          >
                            <FiFileText className="w-4 h-4" />
                            <span>GSTIN / Udyam Certificate Document</span>
                            <FiEye className="w-4 h-4 ml-auto text-slate-400" />
                          </a>
                        )}
                        {supplier.certificate_of_incorporation && (
                          <a
                            href={`/storage/${supplier.certificate_of_incorporation}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 text-indigo-600 hover:text-indigo-700 text-sm transition"
                          >
                            <FiFileText className="w-4 h-4" />
                            <span>Certificate of Incorporation / MSME Registration</span>
                            <FiEye className="w-4 h-4 ml-auto text-slate-400" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Empty State - No profile yet
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBriefcase className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 font-plus-jakarta">Supplier Profile Incomplete</h3>
                  <p className="text-slate-500 text-sm mb-4">Please establish your corporate identity, tax registration, and manufacturing capabilities.</p>
                  <Link
                    href={route('supplier.profile.edit')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-xs"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Complete Profile</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="space-y-4">
            {/* Verification Status Card */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-4 font-plus-jakarta">Treadmesh Trust & Verification</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Profile Completeness</span>
                  <span className="text-sm font-bold text-slate-900">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">KYC Status</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${verificationStatus.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {verificationStatus.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-4 font-plus-jakarta">Commercial Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FiPackage className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-slate-600">Total Listed SKUs</span>
                  </div>
                  <span className="text-base font-bold text-slate-900 font-mono">{stats.total_products}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm text-slate-600">Active SKUs</span>
                  </div>
                  <span className="text-base font-bold text-slate-900 font-mono">{stats.active_products}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <FiFileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-slate-600">Total Quotations</span>
                  </div>
                  <span className="text-base font-bold text-slate-900 font-mono">{stats.total_quotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <FiClock className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-sm text-slate-600">Pending Quotes</span>
                  </div>
                  <span className="text-base font-bold text-slate-900 font-mono">{stats.pending_quotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm text-slate-600">Accepted Quotes</span>
                  </div>
                  <span className="text-base font-bold text-slate-900 font-mono">{stats.accepted_quotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <FiShoppingCart className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-sm text-slate-600">Purchase Orders Fulfilled</span>
                  </div>
                  <span className="text-base font-bold text-slate-900 font-mono">{stats.total_orders}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <FiDollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">Gross Invoiced Revenue</span>
                  </div>
                  <span className="text-base font-bold text-emerald-700 font-mono">{formatCurrency(stats.total_revenue)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Products & Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FiPackage className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 font-plus-jakarta">Recently Listed SKUs</h3>
                    <p className="text-xs text-slate-500">Latest 5 catalog additions</p>
                  </div>
                </div>
                <Link
                  href={route('supplier.products.index')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {recentProducts?.length > 0 ? (
                recentProducts.map((product) => (
                  <div key={product.id} className="p-4 hover:bg-slate-50/70 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                          <FiPackage className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <Link
                            href={route('supplier.products.edit', product.id)}
                            className="font-semibold text-slate-900 hover:text-indigo-600 text-sm"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-mono">SKU: {product.sku || `TM-${product.id}`}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-800">{formatCurrency(product.base_price)}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${product.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                              {product.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={route('supplier.products.edit', product.id)}
                        className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
                        title="Edit SKU"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiPackage className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-700 font-semibold text-sm">No Active SKUs Listed</p>
                  <p className="text-xs text-slate-400 mt-0.5">Begin listing manufactured items for wholesale buyers</p>
                  <Link
                    href={route('supplier.products.create')}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition mt-3 shadow-xs"
                  >
                    <FiPackage className="w-3.5 h-3.5" />
                    List New SKU
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <FiShoppingCart className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 font-plus-jakarta">Recent Purchase Orders</h3>
                    <p className="text-xs text-slate-500">Latest 5 buyer procurement orders</p>
                  </div>
                </div>
                <Link
                  href={route('supplier.orders.index')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {recentOrders?.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-slate-50/70 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center">
                          <FiShoppingCart className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <Link
                            href={route('supplier.orders.show', order.id)}
                            className="font-semibold text-slate-900 hover:text-indigo-600 text-sm"
                          >
                            Order #{order.order_number}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span>{order.buyer?.name}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-800">{formatCurrency(order.total_amount)}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${order.order_status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                              order.order_status === 'processing' ? 'bg-blue-50 text-blue-700' :
                                order.order_status === 'shipped' ? 'bg-purple-50 text-purple-700' :
                                  'bg-amber-50 text-amber-700'
                              }`}>
                              {order.order_status === 'pending_confirmation' ? 'Awaiting Confirmation' :
                                order.order_status === 'confirmed' ? 'Confirmed' :
                                  order.order_status === 'processing' ? 'In Production' :
                                    order.order_status === 'shipped' ? 'Dispatched' :
                                      order.order_status === 'delivered' ? 'Delivered' :
                                        order.order_status === 'cancelled' ? 'Cancelled' : order.order_status?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">{formatIndianDate(order.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiShoppingCart className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-700 font-semibold text-sm">No Purchase Orders Yet</p>
                  <p className="text-xs text-slate-400 mt-0.5">Incoming buyer orders and contracts will be tracked here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-4 font-plus-jakarta">Supplier Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href={route('supplier.products.create')}
              className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-lg hover:bg-indigo-50 hover:border-indigo-100 transition group"
            >
              <div className="p-3 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition mb-2">
                <FiPackage className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-xs font-semibold text-slate-800">List New SKU</span>
            </Link>
            <Link
              href={route('supplier.orders.index')}
              className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-lg hover:bg-indigo-50 hover:border-indigo-100 transition group"
            >
              <div className="p-3 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition mb-2">
                <FiShoppingCart className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-xs font-semibold text-slate-800">Manage Orders</span>
            </Link>
            <Link
              href={route('supplier.rfqs.index')}
              className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-lg hover:bg-indigo-50 hover:border-indigo-100 transition group"
            >
              <div className="p-3 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition mb-2">
                <FiFileText className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-xs font-semibold text-slate-800">Browse Open RFQs</span>
            </Link>
            <Link
              href={route('supplier.messages.index')}
              className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-lg hover:bg-indigo-50 hover:border-indigo-100 transition group"
            >
              <div className="p-3 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition mb-2">
                <FiUser className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-xs font-semibold text-slate-800">Buyer Messages</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}