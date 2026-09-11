// resources/js/Pages/Admin/Rfqs/Show.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Swal from 'sweetalert2';
import {
  FiArrowLeft,
  FiCalendar,
  FiUser,
  FiMail,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiEye,
  FiFileText,
  FiShield,
  FiLayers,
  FiDollarSign,
  FiClock,
  FiExternalLink
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
  MdWarning
} from 'react-icons/md';
import { BsBuilding } from 'react-icons/bs';
import {
  formatCurrency,
  formatIndianDate,
  formatRfqStatus,
  formatQuoteStatus,
  formatOrderStatus
} from '@/Utils/formatters';

export default function Show({ rfq }) {
  // State management for tabs and forms
  const [activeTab, setActiveTab] = useState('details');
  const [showCloseForm, setShowCloseForm] = useState(false);
  const [closeData, setCloseData] = useState({ reason: '', notify_buyer: true });

  // Handle close RFQ
  const handleCloseRfq = () => {
    if (!closeData.reason.trim()) {
      Swal.fire({
        title: 'Closure Reason Required',
        text: 'Please state the official administrative rationale for closing this procurement tender.',
        icon: 'error',
        confirmButtonColor: '#0F172A'
      });
      return;
    }

    router.post(route('admin.rfqs.close', rfq.id), closeData, {
      onSuccess: () => {
        setShowCloseForm(false);
        Swal.fire({
          title: 'Tender Closed',
          text: `RFQ #${rfq.rfq_number} has been formally closed.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  // Handle reopen RFQ
  const handleReopenRfq = () => {
    Swal.fire({
      title: 'Reopen Procurement Tender?',
      text: `Are you sure you want to reopen RFQ #${rfq.rfq_number}? Suppliers will be allowed to submit new bids.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16A34A',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Yes, Reopen Tender',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('admin.rfqs.reopen', rfq.id), {}, {
          onSuccess: () => {
            Swal.fire({
              title: 'Tender Reopened',
              text: `RFQ #${rfq.rfq_number} is once again open for vendor proposals.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  // Handle delete RFQ
  const handleDelete = () => {
    Swal.fire({
      title: 'Delete Procurement Tender?',
      text: `Are you sure you want to permanently delete RFQ #${rfq.rfq_number}? This action cannot be reversed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Yes, Delete Permanently',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('admin.rfqs.destroy', rfq.id), {
          onSuccess: () => {
            router.get(route('admin.rfqs.index'));
          }
        });
      }
    });
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Open Tender
          </span>
        );
      case 'quoted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
            <MdVerified className="w-4 h-4 text-blue-600" />
            Quotes Received
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <FiCheckCircle className="w-4 h-4 text-slate-500" />
            Closed / Awarded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {formatRfqStatus(status)}
          </span>
        );
    }
  };

  // Parse products from JSON
  const products = typeof rfq.products_requested === 'string'
    ? JSON.parse(rfq.products_requested)
    : rfq.products_requested || [];

  return (
    <DashboardLayout>
      <Head title={`RFQ #${rfq.rfq_number} - Procurement Dossier | Treadmesh Admin`} />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header - Back button, title and action buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.rfqs.index')}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              title="Return to tender ledger"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Procurement Dossier
                </span>
                {getStatusBadge(rfq.status)}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                RFQ #{rfq.rfq_number}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Published on {formatIndianDate(rfq.created_at)} • Target Delivery: {formatIndianDate(rfq.required_by_date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {rfq.status === 'closed' ? (
              <button
                onClick={handleReopenRfq}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition shadow-xs"
              >
                <FiCheckCircle className="w-4 h-4" />
                <span>Reopen Tender</span>
              </button>
            ) : (
              <button
                onClick={() => setShowCloseForm(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition shadow-xs"
              >
                <FiXCircle className="w-4 h-4" />
                <span>Close Tender</span>
              </button>
            )}
            <button
              onClick={handleDelete}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-medium rounded-xl transition"
              title="Delete tender"
            >
              <FiXCircle className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Close RFQ Form Drawer */}
        {showCloseForm && (
          <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-950 text-base flex items-center gap-2">
                <FiXCircle className="w-5 h-5 text-amber-600" />
                Administrative Tender Closure
              </h3>
              <button
                onClick={() => setShowCloseForm(false)}
                className="text-amber-800 hover:text-amber-950 text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
            <p className="text-xs text-amber-800">
              Closing this RFQ will prevent vendors from submitting additional quotes. Existing quotes can still be reviewed by the buyer.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-amber-900 uppercase tracking-wider mb-1">
                  Reason for Closure <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={closeData.reason}
                  onChange={(e) => setCloseData({ ...closeData, reason: e.target.value })}
                  rows="3"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition placeholder:text-slate-400"
                  placeholder="State the administrative or commercial reason (e.g., Awarded offline, specifications revised, budgetary freeze)..."
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={closeData.notify_buyer}
                    onChange={(e) => setCloseData({ ...closeData, notify_buyer: e.target.checked })}
                    className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-medium text-amber-900">
                    Dispatch formal notification email to buyer regarding closure
                  </span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowCloseForm(false)}
                  className="px-4 py-2 text-xs font-medium text-amber-900 hover:bg-amber-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCloseRfq}
                  className="px-5 py-2 text-xs font-medium bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition shadow-xs"
                >
                  Confirm Tender Closure
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details & Tabs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-slate-100 bg-slate-50/50">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-3.5 text-sm font-semibold transition border-b-2 ${
                      activeTab === 'details'
                        ? 'text-indigo-600 border-indigo-600 bg-white'
                        : 'text-slate-500 border-transparent hover:text-slate-800'
                    }`}
                  >
                    Tender Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('quotes')}
                    className={`px-6 py-3.5 text-sm font-semibold transition border-b-2 ${
                      activeTab === 'quotes'
                        ? 'text-indigo-600 border-indigo-600 bg-white'
                        : 'text-slate-500 border-transparent hover:text-slate-800'
                    }`}
                  >
                    Vendor Bids ({rfq.quotes?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`px-6 py-3.5 text-sm font-semibold transition border-b-2 ${
                      activeTab === 'messages'
                        ? 'text-indigo-600 border-indigo-600 bg-white'
                        : 'text-slate-500 border-transparent hover:text-slate-800'
                    }`}
                  >
                    Communications ({rfq.messages?.length || 0})
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* RFQ Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                        {rfq.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                        {rfq.description}
                      </p>
                    </div>

                    {/* Bill of Quantities / Scope */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                        <FiPackage className="w-4 h-4 text-indigo-600" />
                        Bill of Quantities / Scope of Supply
                      </h4>
                      {products.length > 0 ? (
                        <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
                          {products.map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/50 transition">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xs font-mono font-semibold">
                                  {index + 1}
                                </span>
                                <span className="text-sm font-semibold text-slate-900">
                                  {product.product_name || product.name || 'Material Item'}
                                </span>
                              </div>
                              <span className="text-xs font-mono font-semibold bg-slate-100 px-3 py-1 rounded-lg text-slate-700">
                                {product.quantity || rfq.quantity} Units
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600">
                          Total Tender Quantity: <span className="font-semibold text-slate-900">{rfq.quantity} units</span>
                        </div>
                      )}
                    </div>

                    {/* Key Technical & Commercial Attributes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cumulative Lot Size</p>
                        <p className="text-xl font-bold font-mono text-slate-900 mt-1">{rfq.quantity} Units</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Target Delivery Schedule</p>
                        <p className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-indigo-600" />
                          <span>{formatIndianDate(rfq.required_by_date)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quotes Tab */}
                {activeTab === 'quotes' && (
                  <div className="space-y-4">
                    {rfq.quotes?.length > 0 ? (
                      rfq.quotes.map((quote) => (
                        <div key={quote.id} className="border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 transition bg-white space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-sm border border-indigo-100">
                                <BsBuilding className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{quote.supplier?.name || 'Authorized Vendor'}</p>
                                <p className="text-xs text-slate-500">{quote.supplier?.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                #{quote.quote_number}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                quote.status === 'accepted'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                  : quote.status === 'rejected'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              }`}>
                                {formatQuoteStatus(quote.status)}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-3.5 bg-slate-50 rounded-xl">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Quoted Value</p>
                              <p className="text-xl font-bold font-mono text-indigo-600 mt-0.5">
                                {formatCurrency(quote.total_amount)}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">INR (Base Quote)</p>
                            </div>
                            <div className="p-3.5 bg-slate-50 rounded-xl">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bid Validity</p>
                              <p className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                                <FiClock className="w-4 h-4 text-slate-400" />
                                {formatIndianDate(quote.valid_until)}
                              </p>
                            </div>
                          </div>

                          {quote.product_breakdown && (
                            <div className="pt-2">
                              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Itemized BOQ Breakdown</p>
                              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl font-mono overflow-x-auto max-h-40">
                                {Array.isArray(quote.product_breakdown) ? (
                                  <div className="space-y-1.5 font-sans">
                                    {quote.product_breakdown.map((item, i) => (
                                      <div key={i} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-0">
                                        <span className="font-medium text-slate-800">{item.name || item.product_name || 'Line Item'}</span>
                                        <span className="font-mono text-slate-600">
                                          {item.quantity} units @ {formatCurrency(item.unit_price || item.price)} = <strong className="text-slate-900">{formatCurrency(item.total_price || (item.quantity * (item.unit_price || item.price)))}</strong>
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <pre>{JSON.stringify(quote.product_breakdown, null, 2)}</pre>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 px-4">
                        <FiPackage className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="font-semibold text-slate-700">No Vendor Bids Submitted</p>
                        <p className="text-xs text-slate-500 mt-1">Suppliers have not submitted formal quotations for this RFQ yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                  <div className="space-y-4">
                    {rfq.messages?.length > 0 ? (
                      rfq.messages.map((message) => (
                        <div key={message.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 text-sm">{message.sender?.name}</span>
                              <span className="text-xs text-slate-400">to {message.receiver?.name}</span>
                            </div>
                            <span className="text-xs text-slate-400">{formatIndianDate(message.created_at)}</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{message.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 px-4">
                        <FiMessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="font-semibold text-slate-700">No Communications Recorded</p>
                        <p className="text-xs text-slate-500 mt-1">There are no audit messages exchanged for this procurement tender.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Buyer Info, Order Conversion, Governance */}
          <div className="space-y-6">
            {/* Buyer Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <FiUser className="w-4 h-4 text-indigo-600" />
                Enterprise Buyer Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-sm border border-indigo-100">
                    {rfq.buyer?.name?.charAt(0) || 'B'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{rfq.buyer?.name}</p>
                    <p className="text-xs text-slate-500">Corporate Procurement Account</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs">
                  <FiMail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${rfq.buyer?.email}`} className="text-indigo-600 hover:underline">
                    {rfq.buyer?.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Order Information (if converted) */}
            {rfq.order && (
              <div className="bg-white rounded-2xl border border-emerald-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                    Converted Purchase Order
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {formatOrderStatus(rfq.order.order_status)}
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">PO Number:</span>
                    <span className="font-mono font-bold text-slate-900">{rfq.order.order_number}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Settled Value:</span>
                    <span className="font-mono font-bold text-emerald-600 text-sm">
                      {formatCurrency(rfq.order.total_amount)}
                    </span>
                  </div>
                </div>
                <Link
                  href={route('admin.orders.show', rfq.order.id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl transition shadow-xs"
                >
                  <span>View Purchase Order Dossier</span>
                  <FiExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Quick Operations */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Governance Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href={route('admin.rfqs.quotes', rfq.id)}
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-medium text-slate-700 transition"
                >
                  <span className="flex items-center gap-2">
                    <FiEye className="w-4 h-4 text-indigo-600" />
                    View All Vendor Quotes
                  </span>
                  <span className="font-mono font-semibold text-slate-900">{rfq.quotes?.length || 0}</span>
                </Link>
                {rfq.status !== 'closed' && (
                  <button
                    onClick={() => setShowCloseForm(true)}
                    className="w-full flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-medium text-amber-900 transition"
                  >
                    <span className="flex items-center gap-2">
                      <FiXCircle className="w-4 h-4 text-amber-600" />
                      Administrative Closure
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}