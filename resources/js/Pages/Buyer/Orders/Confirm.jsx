// resources/js/Pages/Buyer/Orders/Confirm.jsx

import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatCurrency,
  formatIndianDate
} from '@/Utils/formatters';
import {
  FiShoppingBag,
  FiCheckCircle,
  FiArrowLeft,
  FiMapPin,
  FiFileText,
  FiAlertCircle,
  FiShield,
  FiPackage,
  FiCheck
} from 'react-icons/fi';

export default function OrderConfirm({ rfq, quote }) {
  const { auth } = usePage().props;

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
    rfq_id: rfq.id,
    quote_id: quote.id,
    terms_accepted: false,
    shipping_address: auth.user.address || '',
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

    if (!formData.terms_accepted) {
      setErrors({ terms_accepted: 'You must accept the B2B procurement terms and Nodal Escrow agreement.' });
      return;
    }

    if (!formData.shipping_address.trim()) {
      setErrors({ shipping_address: 'Please provide a valid Indian delivery destination & PIN code.' });
      return;
    }

    setSubmitting(true);
    router.post(route('buyer.orders.store'), formData, {
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
      <Head title="Confirm Purchase Order" />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <Link
            href={route('buyer.rfqs.show', rfq.id)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Back to RFQ"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Generate Formal Purchase Order (PO)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Lock in commercial terms from Quote #{quote.quote_number} and establish Nodal Escrow funding.
            </p>
          </div>
        </div>

        {/* Accepted Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
          <FiCheckCircle className="text-emerald-600 w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-emerald-900 text-sm">Quotation Accepted</p>
            <p className="text-emerald-700 mt-0.5">
              You are converting tender <strong>#{rfq.rfq_number}</strong> into a legally binding B2B Purchase Order with <strong>{quote.supplier?.name}</strong>.
            </p>
          </div>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <FiShoppingBag className="w-4 h-4 text-indigo-600" />
              Purchase Order Commercial Summary
            </h2>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="text-slate-500 block">Procurement Tender:</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{rfq.title} (#{rfq.rfq_number})</span>
            </div>

            {/* Bill of materials */}
            <div className="divide-y divide-slate-100 text-xs">
              {rfq.products_requested?.map((product, index) => (
                <div key={index} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{product.name}</p>
                    <p className="text-slate-500 font-mono">
                      Quantity: {product.quantity} {product.unit}
                    </p>
                  </div>
                  <span className="font-mono text-slate-700 font-semibold">
                    As Quoted
                  </span>
                </div>
              ))}
            </div>

            {/* Grand Total */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/70 -mx-6 -mb-6 p-6 rounded-b-2xl">
              <div>
                <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">
                  Total Order Value
                </span>
                <span className="text-[11px] text-slate-400">Excl. / Incl. GST as stipulated in quote terms</span>
              </div>
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {formatCurrency(quote.total_amount)}
              </span>
            </div>
          </div>

          {/* Quote Terms & Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <FiFileText className="w-4 h-4 text-slate-500" />
              Vendor Quotation Reference
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Quote Reference</span>
                <span className="font-bold text-slate-900 font-mono mt-0.5 block">{quote.quote_number}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Vendor Enterprise</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{quote.supplier?.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Valid Until</span>
                <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                  {formatIndianDate(quote.valid_until)}
                </span>
              </div>
            </div>

            {quote.product_breakdown && quote.product_breakdown.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                  Itemized Pricing Breakdown:
                </span>
                {quote.product_breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                    <span className="text-slate-700">{item.name} × {item.quantity}</span>
                    <span className="font-mono font-bold text-slate-900">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consignee Shipping Address */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-rose-500" />
              Consignee Delivery & Unloading Site Address <span className="text-rose-500">*</span>
            </h2>

            <textarea
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleChange}
              rows="3"
              className={`w-full text-xs border rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.shipping_address ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
              }`}
              placeholder="Provide complete delivery destination: Plot/Shop No., Industrial Area, City, State, and 6-digit Indian PIN Code..."
            />
            {errors.shipping_address && (
              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                <FiAlertCircle className="w-3.5 h-3.5" />
                {errors.shipping_address}
              </p>
            )}
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Procurement & Dispatch Remarks (Optional)
            </h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Special instructions regarding packaging, unloading crane requirements, gate entry passes..."
            />
          </div>

          {/* Terms Agreement */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="terms_accepted"
                checked={formData.terms_accepted}
                onChange={handleChange}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                I confirm the procurement details and line item quantities are accurate. I accept the commercial terms, E-Way Bill freight policy, and Treadmesh RBI-compliant Nodal Escrow settlement conditions.
              </span>
            </label>
            {errors.terms_accepted && (
              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                <FiAlertCircle className="w-3.5 h-3.5" />
                {errors.terms_accepted}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Link
              href={route('buyer.rfqs.show', rfq.id)}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Issuing Purchase Order...
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  Confirm & Issue Purchase Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}