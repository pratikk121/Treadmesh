// resources/js/Pages/Buyer/Orders/CreateFromRfq.jsx

import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatCurrency,
  formatIndianDate
} from '@/Utils/formatters';
import {
  FiArrowLeft,
  FiPackage,
  FiCheckCircle,
  FiMapPin,
  FiAlertCircle,
  FiShoppingBag,
  FiFileText,
  FiShield,
  FiCheck
} from 'react-icons/fi';

export default function CreateFromRfq({ rfq, quote }) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const { data, setData, post, processing, errors } = useForm({
    notes: '',
    rfq_id: rfq.id,
    quote_id: quote.id,
    shipping_address: '',
    terms_accepted: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route('buyer.orders.store-from-quote'), {
      preserveScroll: true,
      onSuccess: (response) => {
        setOrderPlaced(true);
        if (response.props?.order?.order_number) {
          setOrderNumber(response.props.order.order_number);
        }
      },
    });
  };

  // RFQ Not Open
  if (rfq.status !== 'open') {
    return (
      <DashboardLayout>
        <Head title="Tender Concluded" />

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Tender Concluded</h2>
            <p className="text-sm text-slate-600 mb-6">
              This procurement tender is no longer active for orders. It has either been concluded or an order has already been created.
            </p>
            <Link
              href={route('buyer.rfqs.show', rfq.id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Return to Tender Overview
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Order already exists
  if (rfq.order) {
    return (
      <DashboardLayout>
        <Head title="Purchase Order Exists" />

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Purchase Order Already Placed</h2>
            <p className="text-sm text-slate-600 mb-6">
              A formal Purchase Order has already been generated for this procurement tender.
            </p>
            <Link
              href={route('buyer.orders.show', rfq.order.id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              View Purchase Order →
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Order Placed Success View
  if (orderPlaced) {
    return (
      <DashboardLayout>
        <Head title="Purchase Order Created" />

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
              <FiCheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Purchase Order Successfully Placed!</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your Purchase Order has been transmitted to the supplier. Freight dispatch and E-Way bill generation will follow vendor confirmation.
            </p>
            {orderNumber && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
                Order Ref: <strong className="text-indigo-600 text-sm">{orderNumber}</strong>
              </div>
            )}
            <div className="space-y-2 pt-2">
              <Link
                href={route('buyer.orders.index')}
                className="block w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Go to Order Management
              </Link>
              <Link
                href={route('buyer.rfqs.show', rfq.id)}
                className="block w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Back to RFQ Tender
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head title="Generate Purchase Order from Quote" />

      <div className="space-y-6">
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
              Generate Purchase Order (PO)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Award commercial tender #{rfq.rfq_number} and instantiate order contract with {quote.supplier?.name}.
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Scope & Delivery Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tender Summary */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FiPackage className="w-4 h-4 text-indigo-600" />
                  Bill of Quantities & Agreed Pricing
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Winning Bid
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="text-slate-500 block">Tender Subject:</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{rfq.title} (#{rfq.rfq_number})</span>
              </div>

              {/* Line items list */}
              <div className="divide-y divide-slate-100 text-xs">
                {rfq.products_requested?.map((product, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-center">
                    <span className="font-medium text-slate-800">
                      {product.name} <span className="text-slate-400">· {product.quantity} {product.unit}</span>
                    </span>
                    <span className="font-mono text-slate-700 font-semibold">
                      Confirmed in Bid
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block">Vendor Enterprise</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{quote.supplier?.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Registered Entity</span>
                  <span className="font-medium text-slate-700 mt-0.5 block">
                    {quote.supplier?.supplier?.company_name || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Quote Reference</span>
                  <span className="font-bold text-slate-900 font-mono mt-0.5 block">#{quote.quote_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Validity</span>
                  <span className="font-semibold text-slate-700 font-mono mt-0.5 block">
                    {formatIndianDate(quote.valid_until)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-rose-500" />
                Consignee Site & Delivery Address <span className="text-rose-500">*</span>
              </h2>

              <div>
                <textarea
                  value={data.shipping_address}
                  onChange={(e) => setData('shipping_address', e.target.value)}
                  rows="3"
                  className={`w-full text-xs border rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.shipping_address ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                  }`}
                  placeholder="Enter complete delivery address with Industrial Estate/Plot #, City, State, and PIN Code..."
                  required
                />
                {errors.shipping_address && (
                  <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.shipping_address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Procurement Memo / Unloading Instructions (Optional)
                </label>
                <textarea
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  rows="2"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Gate pass instructions, site supervisor contact, loading dock restrictions..."
                />
              </div>
            </div>
          </div>

          {/* Right Column: Commercial Summary & Order Creation */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Commercial Settlement Summary
              </h2>

              <p className="text-3xl font-extrabold text-slate-900 font-mono">
                {formatCurrency(quote.total_amount)}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Quoted Base Commercials</span>
                  <span className="font-mono font-bold text-slate-800">{formatCurrency(quote.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Freight & E-Way Bill</span>
                  <span className="text-slate-500">As per quote / Vendor dispatch</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Applicable</span>
                  <span className="text-slate-500">HSN/SAC compliant</span>
                </div>
              </div>
            </div>

            {/* Terms and Confirmation */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.terms_accepted}
                  onChange={(e) => setData('terms_accepted', e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I confirm the procurement specifications and agree to the Treadmesh B2B escrow and E-Way bill delivery terms.
                </span>
              </label>
              {errors.terms_accepted && (
                <p className="text-xs text-rose-600 font-semibold">{errors.terms_accepted}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={processing || !data.terms_accepted || !data.shipping_address}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Instantiating Order...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    Confirm & Issue Purchase Order
                  </>
                )}
              </button>
            </div>

            {/* Escrow Guidance */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs space-y-2 text-slate-600">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <FiShield className="w-4 h-4 text-emerald-600" />
                <span>Nodal Escrow Guaranteed</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Your funds are held securely in an RBI-compliant nodal account until goods are received and verified against the Bill of Quantities (BOQ).
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}