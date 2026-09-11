// resources/js/Pages/Buyer/Quotes/Reject.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatCurrency,
  formatIndianDate
} from '@/Utils/formatters';
import {
  FiXCircle,
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiAlertCircle,
  FiFileText,
  FiX
} from 'react-icons/fi';

export default function QuoteReject({ quote }) {
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ rejection_reason: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.rejection_reason.trim()) {
      setErrors({ rejection_reason: 'Please specify the commercial or technical rationale for declining this quote.' });
      return;
    }

    setSubmitting(true);
    router.post(route('buyer.quotes.reject', quote.id), formData, {
      onSuccess: () => {
        setSubmitting(false);
      },
      onError: (errs) => {
        setErrors(errs);
        setSubmitting(false);
      }
    });
  };

  return (
    <DashboardLayout>
      <Head title={`Decline Quote #${quote.quote_number}`} />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <Link
            href={route('buyer.quotes.show', quote.id)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Back to Quote"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Decline Vendor Quotation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Submit formal procurement feedback regarding Quote #{quote.quote_number} to {quote.supplier?.name}.
            </p>
          </div>
        </div>

        {/* Quote Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <FiFileText className="w-4 h-4 text-indigo-600" />
            Quotation Overview
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Quote Reference</span>
              <span className="font-bold text-slate-900 font-mono mt-0.5 block">{quote.quote_number}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Vendor Enterprise</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{quote.supplier?.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Quoted Commercial Value</span>
              <span className="font-bold text-indigo-600 font-mono mt-0.5 block">{formatCurrency(quote.total_amount)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Valid Until</span>
              <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                {formatIndianDate(quote.valid_until)}
              </span>
            </div>
          </div>
        </div>

        {/* Rejection Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <FiXCircle className="w-4 h-4 text-rose-600" />
            Feedback & Rationale for Declining
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
              Commercial / Technical Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="rejection_reason"
              value={formData.rejection_reason}
              onChange={handleChange}
              rows="4"
              className={`w-full text-xs border rounded-xl px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                errors.rejection_reason ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
              }`}
              placeholder="e.g., Quotation exceeded target commercial budget, delivery lead time did not meet project milestones, or alternate vendor selected based on technical evaluation..."
            />
            {errors.rejection_reason && (
              <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <FiAlertCircle className="w-3.5 h-3.5" />
                {errors.rejection_reason}
              </p>
            )}
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
            <FiAlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              An automated status notification will be sent to the supplier. This action concludes this specific bid and cannot be reversed.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href={route('buyer.quotes.show', quote.id)}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Feedback...
                </>
              ) : (
                <>
                  <FiX className="w-4 h-4" />
                  Confirm & Decline Bid
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}