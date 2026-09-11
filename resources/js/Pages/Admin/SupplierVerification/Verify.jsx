// resources/js/Pages/Admin/SupplierVerification/Verify.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Swal from 'sweetalert2';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiSend,
  FiPackage,
  FiShield,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAward,
  FiFileText,
  FiCalendar,
  FiUserCheck,
  FiInfo
} from 'react-icons/fi';
import {
  MdWarning,
  MdOutlineStorefront,
  MdOutlineDescription
} from 'react-icons/md';
import { formatIndianDate } from '@/Utils/formatters';

export default function Verify({ verificationData = {} }) {
  // Destructure verification data
  const { supplier = {}, documents = {}, existing_products = 0, user_status = {} } = verificationData;

  // State management for forms and UI controls
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);
  const [showDocRequestForm, setShowDocRequestForm] = useState(false);
  const [documentRequest, setDocumentRequest] = useState({ message: '' });

  // Handle approve supplier
  const handleApprove = () => {
    Swal.fire({
      title: 'Approve Supplier Onboarding',
      text: `Are you sure you want to verify and approve ${supplier.company_name} for marketplace transactions?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Approve Supplier',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('admin.supplier-verification.approve', supplier.id), {
          notes,
          send_notification: sendNotification
        }, {
          onSuccess: () => {
            Swal.fire({
              title: 'Approved!',
              text: 'Supplier has been successfully verified and activated.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  // Handle reject supplier
  const handleReject = () => {
    if (!rejectionReason) {
      Swal.fire({
        title: 'Missing Reason',
        text: 'Please provide a justification for rejecting this supplier application.',
        icon: 'error',
        confirmButtonColor: '#4F46E5'
      });
      return;
    }

    Swal.fire({
      title: 'Reject Supplier Application',
      text: `Are you sure you want to reject the application for ${supplier.company_name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Reject Application',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('admin.supplier-verification.reject', supplier.id), {
          rejection_reason: rejectionReason,
          send_notification: sendNotification
        }, {
          onSuccess: () => {
            Swal.fire({
              title: 'Application Rejected',
              text: 'Supplier onboarding application has been formally rejected.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  // Handle document request
  const handleDocumentRequest = () => {
    if (!documentRequest.message) {
      Swal.fire({
        title: 'Missing Details',
        text: 'Please specify the exact missing or required documents for the supplier.',
        icon: 'error',
        confirmButtonColor: '#4F46E5'
      });
      return;
    }

    router.post(route('admin.supplier-verification.request-documents', supplier.id), documentRequest, {
      onSuccess: () => {
        setShowDocRequestForm(false);
        Swal.fire({
          title: 'Notice Dispatched',
          text: 'Document clarification request has been sent to the supplier.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  // Get document status icon
  const getDocumentIcon = (status) => {
    switch (status) {
      case 'present':
        return <FiCheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'missing':
        return <FiXCircle className="w-5 h-5 text-rose-600" />;
      default:
        return <FiAlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  // Get document status color
  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'missing':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <DashboardLayout>
      <Head title={`${supplier.company_name || 'Supplier'} — KYC Audit`} />

      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* Header - Navigation and Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.02]">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.supplier-verification.index')}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                  Verification Pending
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ID: #{supplier.id}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                {supplier.company_name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Enterprise KYC, GSTIN authenticity, and Make-in-India compliance review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApprove}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <FiCheckCircle className="w-4 h-4" />
              <span>Approve Supplier</span>
            </button>
            <button
              onClick={() => setShowRejectForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/70 rounded-xl text-xs font-semibold transition"
            >
              <FiXCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Credentials & Documents */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Information Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MdOutlineStorefront className="w-5 h-5 text-indigo-600" />
                Enterprise & Statutory Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400 block font-medium">Registered Entity Name</span>
                    <span className="font-semibold text-slate-900 text-sm mt-0.5 block">{supplier.company_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Primary Contact / Authorized SPOC</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">{supplier.user?.name || 'Authorized Signatory'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Official Email</span>
                    <a href={`mailto:${supplier.company_email}`} className="font-mono text-indigo-600 hover:underline mt-0.5 block">
                      {supplier.company_email}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Phone / WhatsApp Commercial</span>
                    <a href={`tel:${supplier.company_phone}`} className="font-mono text-slate-800 hover:text-indigo-600 mt-0.5 block">
                      {supplier.company_phone || 'N/A'}
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400 block font-medium">GSTIN / Trade License Number</span>
                    <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                      {supplier.trade_license_number || 'Pending Submission'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Manufacturing Facility & Hub</span>
                    <span className="font-medium text-slate-900 mt-0.5 block">{supplier.company_address || 'N/A'}</span>
                    <span className="text-slate-500">{supplier.city || 'India'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Application Submitted On</span>
                    <span className="font-mono text-slate-700 mt-0.5 block">
                      {formatIndianDate(supplier.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Required Verification Documents */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <MdOutlineDescription className="w-5 h-5 text-indigo-600" />
                  Statutory KYC & Compliance Documents
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  {Object.keys(documents).length} Checkpoints
                </span>
              </div>

              <div className="space-y-3">
                {Object.entries(documents).map(([key, doc]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-50/80 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="p-2 rounded-xl bg-white border border-slate-200/80 shrink-0">
                        {getDocumentIcon(doc.status)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-xs">
                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </p>
                        {doc.number && (
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">Registration Ref: {doc.number}</p>
                        )}
                        {doc.company_name && (
                          <p className="text-[11px] text-slate-500 mt-0.5">Entity on File: {doc.company_name}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getDocumentStatusColor(doc.status)}`}>
                        {doc.status === 'present' ? 'Uploaded / Verified' : 'Pending / Missing'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Internal Notes */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <h2 className="text-base font-semibold text-slate-900 mb-2">Compliance Audit Notes</h2>
              <p className="text-xs text-slate-500 mb-4">
                Internal remarks recorded during audit. This log will remain accessible in the admin ledger.
              </p>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add compliance audit remarks, GST verification notes, or site audit status..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
              <div className="mt-3.5 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendNotification"
                  checked={sendNotification}
                  onChange={(e) => setSendNotification(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="sendNotification" className="text-xs text-slate-700 font-medium">
                  Dispatch email notification with audit status update to supplier SPOC
                </label>
              </div>
            </div>

            {/* Rejection Form Modal / Drawer */}
            {showRejectForm && (
              <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-md bg-gradient-to-b from-rose-50/30 to-white">
                <h3 className="text-sm font-bold text-rose-700 mb-2 flex items-center gap-2">
                  <MdWarning className="w-5 h-5 text-rose-600" />
                  Formal Application Rejection Justification
                </h3>
                <p className="text-xs text-slate-600 mb-3">
                  State the legal, compliance, or document defect reasons. This justification will be emailed to the supplier.
                </p>
                <div className="space-y-3">
                  <textarea
                    rows="3"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., Invalid GSTIN mismatch with MCA master data; Trade license expired; Manufacturing cluster address unverified..."
                    className="w-full px-3.5 py-2 bg-white border border-rose-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                  />
                  <div className="flex justify-end gap-2 text-xs">
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-sm transition"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Document Request Form Drawer */}
            {showDocRequestForm && (
              <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-md bg-gradient-to-b from-amber-50/30 to-white">
                <h3 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <FiSend className="w-5 h-5 text-amber-600" />
                  Request Clarification / Missing Documents
                </h3>
                <p className="text-xs text-slate-600 mb-3">
                  Request re-submission of clear GST certificates, MSME Udyam registration, or bank verification documents.
                </p>
                <div className="space-y-3">
                  <textarea
                    rows="3"
                    value={documentRequest.message}
                    onChange={(e) => setDocumentRequest({ message: e.target.value })}
                    placeholder="Specify which documents are required (e.g., Please upload updated GSTIN Certificate with Form REG-06 and MSME Udyam certificate)..."
                    className="w-full px-3.5 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                  />
                  <div className="flex justify-end gap-2 text-xs">
                    <button
                      onClick={() => setShowDocRequestForm(false)}
                      className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDocumentRequest}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow-sm transition"
                    >
                      Send Clarification Notice
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Actions & Telemetry */}
          <div className="space-y-6">
            {/* Quick Action Matrix */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3.5">
                Compliance Decisions
              </h3>
              <div className="space-y-2.5 text-xs">
                <button
                  onClick={handleApprove}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm transition active:scale-[0.99]"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Approve & Verify Supplier</span>
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/70 rounded-xl font-semibold transition"
                >
                  <FiXCircle className="w-4 h-4" />
                  <span>Reject Application</span>
                </button>
                <button
                  onClick={() => setShowDocRequestForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/70 rounded-xl font-semibold transition"
                >
                  <FiSend className="w-4 h-4" />
                  <span>Request Missing Documents</span>
                </button>
              </div>
            </div>

            {/* Account Credentials Status */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3.5">
                Auth & Security State
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">User Account State</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${user_status?.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' : 'bg-rose-50 text-rose-700 border border-rose-200/80'}`}>
                    {user_status?.is_active ? 'Active' : 'Deactivated'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">Email Verification</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${user_status?.email_verified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' : 'bg-amber-50 text-amber-700 border border-amber-200/80'}`}>
                    {user_status?.email_verified ? 'Verified Email' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Catalog Telemetry */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3.5 flex items-center gap-1.5">
                <FiPackage className="w-3.5 h-3.5 text-indigo-600" />
                Product Catalog Telemetry
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Active Live SKUs</span>
                  <span className="font-mono font-bold text-slate-900">{existing_products || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">Pending Review SKUs</span>
                  <span className="font-mono font-bold text-amber-700">{supplier.products?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}