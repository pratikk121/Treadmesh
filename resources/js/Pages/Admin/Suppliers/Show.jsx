// resources/js/Pages/Admin/Suppliers/Show.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiUser,
  FiAward,
  FiExternalLink,
  FiTrendingUp,
  FiShield
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
  MdWarning,
  MdOutlineStorefront
} from 'react-icons/md';
import Swal from 'sweetalert2';
import {
  formatCurrency,
  formatIndianScale,
  formatIndianDate
} from '@/Utils/formatters';

export default function Show({ supplier = {}, stats = {}, recentOrders = [], recentProducts = [] }) {
  // State management for active tab
  const [activeTab, setActiveTab] = useState('overview');

  // Handle toggle account status (activate/deactivate)
  const handleToggleStatus = () => {
    const isCurrentlyActive = supplier?.user?.is_active;
    Swal.fire({
      title: isCurrentlyActive ? 'Deactivate Supplier Account?' : 'Activate Supplier Account?',
      text: `Are you sure you want to ${isCurrentlyActive ? 'suspend marketplace trading for' : 're-activate'} ${supplier.company_name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isCurrentlyActive ? 'Yes, deactivate' : 'Yes, activate',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.patch(route('admin.suppliers.toggle-status', supplier.id), {}, {
          onSuccess: () => {
            Swal.fire('Updated', 'Supplier status updated.', 'success');
          }
        });
      }
    });
  };

  // Handle delete supplier
  const handleDelete = () => {
    Swal.fire({
      title: 'Delete Supplier?',
      text: `Are you sure you want to permanently delete ${supplier.company_name}? This will purge associated records.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete permanently',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('admin.suppliers.destroy', supplier.id), {
          onSuccess: () => {
            Swal.fire('Deleted', 'Supplier record deleted.', 'success');
          }
        });
      }
    });
  };

  // Get verification status badge
  const getStatusBadge = (status) => {
    const badges = {
      verified: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', icon: MdVerified, label: 'Verified & KYC Approved' },
      pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200/80', icon: MdPending, label: 'KYC Pending' },
      rejected: { bg: 'bg-rose-50 text-rose-700 border-rose-200/80', icon: MdWarning, label: 'KYC Rejected' }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <Head title={`${supplier.company_name || 'Supplier'} — Details & Dossier`} />

      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* Header - Back button, title, and action buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.02]">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.suppliers.index')}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{supplier.company_name}</h1>
                {getStatusBadge(supplier.verification_status)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Registered Make-in-India Manufacturer / Supplier since {formatIndianDate(supplier.created_at)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={route('admin.suppliers.edit', supplier.id)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm transition"
            >
              <FiEdit className="w-4 h-4" />
              <span>Edit Details</span>
            </Link>
            <button
              onClick={handleToggleStatus}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${supplier?.user?.is_active
                ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/70'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/70'
                }`}
            >
              {supplier?.user?.is_active ? (
                <>
                  <FiXCircle className="w-4 h-4" />
                  <span>Suspend Account</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Activate Account</span>
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/70 rounded-xl text-xs font-semibold transition"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* 4-Column KPI Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Catalog SKUs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Catalog SKUs</p>
                <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono">{stats.total_products || 0}</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <FiPackage className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-2 text-xs font-mono">
              <span className="text-emerald-700 font-medium">{stats.approved_products || 0} Approved</span>
              <span>•</span>
              <span className="text-amber-700 font-medium">{stats.pending_products || 0} Pending</span>
            </div>
          </div>

          {/* Total Purchase Orders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Purchase Orders</p>
                <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono">{stats.total_orders || 0}</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <FiShoppingCart className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-2.5 text-xs text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {stats.completed_orders || 0} Orders Fulfilled
            </p>
          </div>

          {/* Gross Realized GMV */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gross Realized GMV</p>
                <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono">
                  {formatIndianScale(stats.total_revenue || 0)}
                </p>
              </div>
              <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                <FiTrendingUp className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-2.5 text-xs text-slate-500 font-mono">
              {formatCurrency(stats.total_revenue || 0)}
            </p>
          </div>

          {/* RFQ Quotes Submitted */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bids / Quotes Submitted</p>
                <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono">{supplier.quotes_count || 0}</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <FiFileText className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-2.5 text-xs text-slate-500">Commercial tenders quoted</p>
          </div>
        </div>

        {/* Main Content: Left Column Info + Right Column Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Company Profile & Verification */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MdOutlineStorefront className="w-5 h-5 text-indigo-600" />
                Company Overview
              </h2>
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <FiUser className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-slate-400 font-medium">Primary Contact / SPOC</p>
                    <p className="font-semibold text-slate-900 mt-0.5">{supplier.user?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMail className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-slate-400 font-medium">Official Email</p>
                    <a href={`mailto:${supplier.company_email}`} className="font-mono text-indigo-600 hover:underline mt-0.5 block">
                      {supplier.company_email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiPhone className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-slate-400 font-medium">Phone Number</p>
                    <a href={`tel:${supplier.company_phone}`} className="font-mono text-slate-800 hover:text-indigo-600 mt-0.5 block">
                      {supplier.company_phone || 'N/A'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-slate-400 font-medium">Manufacturing Hub Address</p>
                    <p className="font-medium text-slate-900 mt-0.5">{supplier.company_address || 'N/A'}</p>
                    <p className="text-slate-500 font-medium">{supplier.city || 'India'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* License & Statutory Information */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FiAward className="w-5 h-5 text-indigo-600" />
                Statutory & KYC Credentials
              </h2>
              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">GSTIN / Trade License Number</p>
                  <p className="font-mono font-bold text-slate-900 mt-1">{supplier.trade_license_number || 'Pending Submission'}</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-slate-400 font-medium mb-1.5">Marketplace Account State</p>
                  <div>
                    {supplier?.user?.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                        <FiCheckCircle className="w-3 h-3" />
                        Active & Trading
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                        <FiXCircle className="w-3 h-3" />
                        Suspended Account
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Activity Ledgers */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200/80 overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-slate-100 px-6">
                <nav className="flex gap-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 text-xs font-bold border-b-2 transition ${activeTab === 'overview'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    Overview & Activity
                  </button>
                  <button
                    onClick={() => setActiveTab('products')}
                    className={`py-4 text-xs font-bold border-b-2 transition ${activeTab === 'products'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    Listed SKUs ({stats.total_products || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`py-4 text-xs font-bold border-b-2 transition ${activeTab === 'orders'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    Purchase Orders ({stats.total_orders || 0})
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6 text-xs">
                    {/* Recent Products */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900 text-sm">Recently Listed SKUs</h4>
                        <Link
                          href={route('admin.products.index', { supplier_id: supplier.id })}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                        >
                          <span>View Full Catalog</span>
                          <FiExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                      <div className="space-y-2.5">
                        {recentProducts.length > 0 ? (
                          recentProducts.map((product) => (
                            <Link
                              key={product.id}
                              href={route('admin.products.show', product.id)}
                              className="block p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-100 transition group"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">{product.name}</p>
                                  <p className="text-[11px] text-slate-500 mt-0.5">Category: {product.category || 'General'}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-mono font-bold text-slate-900">{formatCurrency(product.base_price)}</p>
                                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">Available Stock: {product.stock_quantity || 0}</p>
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="py-6 text-center text-slate-400">
                            No products registered yet.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900 text-sm">Recent Purchase Orders</h4>
                        <Link
                          href={route('admin.orders.index', { supplier_id: supplier.user_id })}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                        >
                          <span>View All Orders</span>
                          <FiExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                      <div className="space-y-2.5">
                        {recentOrders.length > 0 ? (
                          recentOrders.map((order) => (
                            <Link
                              key={order.id}
                              href={route('admin.orders.show', order.id)}
                              className="block p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-100 transition group"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                                    PO #{order.order_number}
                                  </p>
                                  <p className="text-[11px] text-slate-500 mt-0.5">Buyer: {order.buyer?.name || 'Corporate Buyer'}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-mono font-bold text-slate-900">{formatCurrency(order.total_amount)}</p>
                                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{formatIndianDate(order.created_at)}</p>
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="py-6 text-center text-slate-400">
                            No purchase orders recorded yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'products' && (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    <p className="mb-3">Direct link to all {stats.total_products || 0} registered SKUs for {supplier.company_name}.</p>
                    <Link
                      href={route('admin.products.index', { supplier_id: supplier.id })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-sm transition"
                    >
                      <span>Open Product Catalog Filter</span>
                      <FiExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    <p className="mb-3">Direct link to all {stats.total_orders || 0} purchase orders for this supplier.</p>
                    <Link
                      href={route('admin.orders.index', { supplier_id: supplier.user_id })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-sm transition"
                    >
                      <span>Open Purchase Order Filter</span>
                      <FiExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}