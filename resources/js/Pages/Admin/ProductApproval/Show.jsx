// Pages/Admin/ProductApproval/Show.jsx

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
  FiCheckCircle,
  FiXCircle,
  FiPackage,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiLayers,
} from 'react-icons/fi';
import {
  MdWarning,
  MdOutlineCategory,
  MdVerified,
} from 'react-icons/md';
import { BsBuilding, BsShieldCheck } from 'react-icons/bs';

const NoImg = "/noImg.jpg";

export default function Show({ product, similarProducts, supplierProducts }) {
  // State management for forms and UI controls
  const [notes, setNotes] = useState('');
  const [featured, setFeatured] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionDetails, setRejectionDetails] = useState({});
  const [sendNotification, setSendNotification] = useState(true);

  // Handle product approval
  const handleApprove = () => {
    Swal.fire({
      title: 'Approve Product Listing',
      text: `Are you sure you want to approve "${product.name}" for public marketplace discovery?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Approve Listing',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('admin.product-approval.approve', product.id), {
          notes,
          featured,
          send_notification: sendNotification
        }, {
          onSuccess: () => {
            Swal.fire({
              title: 'Approved!',
              text: 'The product listing has been approved and published to the catalog.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  // Handle product rejection
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      Swal.fire({
        title: 'Rejection Reason Required',
        text: 'Please specify clear feedback on why this listing is being rejected.',
        icon: 'error',
        confirmButtonColor: '#4F46E5'
      });
      return;
    }

    Swal.fire({
      title: 'Reject Listing Submission',
      text: `Are you sure you want to reject "${product.name}"? Vendor will receive modification requests.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Reject Listing',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('admin.product-approval.reject', product.id), {
          rejection_reason: rejectionReason,
          rejection_details: rejectionDetails,
          send_notification: sendNotification
        }, {
          onSuccess: () => {
            Swal.fire({
              title: 'Listing Rejected',
              text: 'The product submission has been rejected with vendor remediation instructions.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  return (
    <DashboardLayout>
      <Head title={`${product.name} - Review & Audit - Treadmesh Admin`} />

      <div className="space-y-6">
        {/* Header - Back button and page title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.product-approval.index')}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  Pending Catalog Audit
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 font-medium">SKU: {product.slug || product.id}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Submitted by <span className="font-medium text-gray-800">{product.supplier?.company_name}</span> on {formatIndianDate(product.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleApprove}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
            >
              <FiCheckCircle className="w-4 h-4" />
              <span>Approve Listing</span>
            </button>
            <button
              onClick={() => setShowRejectForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm font-semibold rounded-xl transition"
            >
              <FiXCircle className="w-4 h-4" />
              <span>Reject Submission</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiPackage className="w-4 h-4 text-indigo-600" />
                <span>Catalog Media & Showcase</span>
              </h3>
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
                    <span className="text-sm font-medium">No primary image provided</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details - Tabbed interface */}
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
                    Pricing & Bulk Tiers
                  </button>
                  <button
                    onClick={() => setActiveTab('supplier')}
                    className={`px-6 py-3.5 text-sm font-semibold transition border-b-2 ${activeTab === 'supplier'
                      ? 'text-indigo-600 border-indigo-600 bg-white'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                      }`}
                  >
                    Vendor & Make-in-India Profile
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Product Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                        {product.description || 'No detailed description provided.'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</p>
                        <p className="font-semibold text-gray-900 mt-1 flex items-center gap-1.5">
                          <MdOutlineCategory className="w-4 h-4 text-indigo-600" />
                          {product.category}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Standard Unit</p>
                        <p className="font-semibold text-gray-900 mt-1">{product.unit || 'Piece'}</p>
                      </div>
                      <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Minimum Order</p>
                        <p className="font-semibold text-gray-900 mt-1">{product.minimum_order_quantity} {product.unit}</p>
                      </div>
                      <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Available</p>
                        <p className="font-semibold text-gray-900 mt-1">{Number(product.stock_quantity || 0).toLocaleString('en-IN')} {product.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>Listing Slug: <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-mono">{product.slug}</code></span>
                      <span>•</span>
                      <span>Created: <span className="font-medium text-gray-700">{formatIndianDate(product.created_at)}</span></span>
                    </div>
                  </div>
                )}

                {/* Pricing & Inventory Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    <div className="bg-emerald-50/70 border border-emerald-100 p-5 rounded-xl">
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Base Wholesale Price (Excl. GST)</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(product.base_price)} <span className="text-xs font-normal text-gray-500">/ {product.unit}</span></p>
                      <p className="text-xs text-emerald-700 mt-1">Minimum procurement requirement: {product.minimum_order_quantity} {product.unit}</p>
                    </div>

                    {product.bulkPrices && product.bulkPrices.length > 0 ? (
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <FiLayers className="w-4 h-4 text-indigo-600" />
                          <span>Tiered Volume Wholesale Discounts</span>
                        </h4>
                        <div className="space-y-2">
                          {product.bulkPrices.map((tier, index) => (
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
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center text-sm text-gray-500">
                        No tiered volume pricing configured. Flat base rate applies to all order quantities.
                      </div>
                    )}
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
                          {product.supplier?.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <MdVerified className="w-3.5 h-3.5" />
                              Verified OEM
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              Pending KYC
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

            {/* Review Notes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Auditor Notes & Marketplace Placement</h3>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter internal audit observations, HSN classification notes, or quality remarks..."
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="mt-4 flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Feature in Spotlight Showcase</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendNotification}
                    onChange={(e) => setSendNotification(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">Send status update notification to vendor</span>
                </label>
              </div>
            </div>

            {/* Reject Form */}
            {showRejectForm && (
              <div className="bg-rose-50/60 rounded-2xl border border-rose-200 p-6 shadow-sm">
                <h3 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
                  <MdWarning className="w-5 h-5 text-rose-600" />
                  <span>Rejection Grounds & Required Rectifications</span>
                </h3>
                <p className="text-xs text-rose-700 mb-4">
                  Clearly describe what the seller must fix (e.g., upload valid lab test certificates, update HSN code, correct base pricing).
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-rose-900 uppercase tracking-wider mb-2">
                      Reason for Rejection *
                    </label>
                    <textarea
                      rows="3"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g., Inadequate product specifications, missing BIS certification number, or non-compliant image resolution..."
                      className="w-full px-3.5 py-2.5 text-sm border border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Listing Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleApprove}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm transition"
                >
                  <FiCheckCircle className="w-5 h-5" />
                  <span>Approve & Publish</span>
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-xl transition"
                >
                  <FiXCircle className="w-5 h-5" />
                  <span>Reject Listing</span>
                </button>
                <Link
                  href={route('admin.product-approval.index')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  <span>Back to Queue</span>
                </Link>
              </div>
            </div>

            {/* Product Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Compliance Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Review Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    Under Review
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Submission Date</span>
                  <span className="font-medium text-gray-900">{formatIndianDate(product.created_at)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Supplier KYC</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${product.supplier?.isVerified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                    {product.supplier?.isVerified ? 'Verified Vendor' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>

            {/* Similar Products */}
            {similarProducts && similarProducts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Comparable Marketplace SKUs</h3>
                <div className="space-y-3">
                  {similarProducts.map((similar) => (
                    <div key={similar.id} className="p-3 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-100 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{similar.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{similar.supplier?.company_name}</p>
                        </div>
                        <span className="text-sm font-bold text-indigo-600">
                          {formatCurrency(similar.base_price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Supplier's Other Products */}
            {supplierProducts && supplierProducts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">More from this Manufacturer</h3>
                <div className="space-y-3">
                  {supplierProducts.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl border border-gray-100 transition">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiPackage className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs font-semibold text-gray-600">{formatCurrency(item.base_price)}</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Approved
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}