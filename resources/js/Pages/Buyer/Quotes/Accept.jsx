// resources/js/Pages/Buyer/Quotes/Accept.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatCurrency,
  formatIndianDate
} from '@/Utils/formatters';
import {
  FiCheckCircle,
  FiArrowLeft,
  FiPackage,
  FiUser,
  FiCalendar,
  FiAlertCircle,
  FiCheck,
  FiShield,
  FiFileText
} from 'react-icons/fi';

export default function QuoteAccept({ quote }) {
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
    confirmation: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.confirmation) {
      setErrors({ confirmation: 'You must confirm the commercial terms to accept this quotation.' });
      return;
    }

    setSubmitting(true);
    router.post(route('buyer.quotes.accept', quote.id), formData, {
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
      <Head title={`Accept Quote #${quote.quote_number}`} />

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
              Award Tender & Accept Quotation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Confirm acceptance of commercial bid #{quote.quote_number} and initiate Purchase Order generation.
            </p>
          </div>
        </div>

        {/* Quote Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4 text-emerald-600" />
            Commercial Proposal Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Quote Reference</span>
              <span className="font-bold text-slate-900 font-mono mt-0.5 block">{quote.quote_number}</span>
            </div>
            <div>
              <span className="text-slate-500 block">RFQ Reference</span>
              <span className="font-bold text-indigo-600 font-mono mt-0.5 block">#{quote.rfq?.rfq_number}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Vendor Enterprise</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{quote.supplier?.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Validity Date</span>
              <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                {formatIndianDate(quote.valid_until)}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <span className="text-slate-500 block">Tender Title:</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">{quote.rfq?.title}</span>
          </div>

          {/* Line items requested */}
          {quote.rfq?.products_requested && quote.rfq.products_requested.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Requested Bill of Materials:
              </span>
              <div className="space-y-1.5">
                {quote.rfq.products_requested.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs">
                    <span className="font-medium text-slate-800">{product.name}</span>
                    <span className="font-mono font-bold text-indigo-600">
                      {product.quantity} {product.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grand Total */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/70 -mx-6 -mb-6 p-6 rounded-b-2xl">
            <div>
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">
                Final Agreed Commercial Value
              </span>
              <span className="text-[11px] text-slate-400">Excl./Incl. GST as stipulated in bid proposal</span>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {formatCurrency(quote.total_amount)}
            </span>
          </div>
        </div>

        {/* Acceptance Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <FiFileText className="w-4 h-4 text-indigo-600" />
            Purchase Order Directives & Confirmation
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
              Procurement & Billing Remarks (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Provide delivery instructions, site contact details, GST billing instructions, or PO memo..."
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="confirmation"
                checked={formData.confirmation}
                onChange={handleChange}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                I hereby accept quotation #{quote.quote_number} as the winning tender. I acknowledge that all competing bids on this RFQ will be concluded, and an active Purchase Order subject to Treadmesh Nodal Escrow settlement terms will be instantiated.
              </span>
            </label>
            {errors.confirmation && (
              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                <FiAlertCircle className="w-3.5 h-3.5" />
                {errors.confirmation}
              </p>
            )}
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
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Award...
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  Accept Bid & Issue PO
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}