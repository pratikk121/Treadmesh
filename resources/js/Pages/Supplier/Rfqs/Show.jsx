// resources/js/Pages/Supplier/Rfqs/Show.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatCurrency,
  formatIndianDate,
  formatQuoteStatus,
  formatRfqStatus
} from '@/Utils/formatters';
import {
  FiArrowLeft,
  FiCalendar,
  FiUser,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiSend,
  FiClock,
  FiLayers,
  FiShield,
  FiEdit2
} from 'react-icons/fi';

export default function RfqShow({
  rfq,
  isOpen,
  canQuote,
  otherQuotes,
  existingQuote,
  supplierProducts,
}) {
  const getDaysRemaining = () => {
    if (!rfq.required_by_date) return { text: 'Active Tender', color: 'text-slate-600' };
    const now = new Date();
    const deadline = new Date(rfq.required_by_date);
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Bidding Closed', color: 'text-rose-600 font-bold' };
    if (diffDays === 0) return { text: 'Closing Today', color: 'text-amber-600 font-bold animate-pulse' };
    if (diffDays === 1) return { text: 'Closing Tomorrow', color: 'text-amber-600 font-semibold' };
    return { text: `${diffDays} Days Remaining`, color: 'text-emerald-700 font-medium' };
  };

  const daysRemaining = getDaysRemaining();

  const getQuoteStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Accepted & Awarded
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <FiXCircle className="w-3.5 h-3.5 text-rose-600" />
            Bid Declined
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <FiClock className="w-3.5 h-3.5 text-amber-600" />
            Under Buyer Evaluation
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <Head title={`RFQ #${rfq.rfq_number} - ${rfq.title}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-4">
            <Link
              href={route('supplier.rfqs.index')}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="Back to Tenders"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  Tender #{rfq.rfq_number}
                </span>
                <span className="text-xs text-slate-400">
                  Published on {formatIndianDate(rfq.created_at)}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {rfq.title}
              </h1>
            </div>
          </div>

          {!existingQuote && isOpen && canQuote && (
            <Link
              href={route('supplier.rfqs.create-quote', rfq.id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <FiSend className="w-3.5 h-3.5" />
              Submit Commercial Quotation
            </Link>
          )}
        </div>

        {/* Closed or Already Quoted Alerts */}
        {!isOpen && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3 text-xs">
            <FiXCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-900">Bidding Concluded for this Tender</p>
              <p className="text-rose-700 mt-0.5">
                The quotation submission deadline has expired or the buyer has concluded the tender evaluation.
              </p>
            </div>
          </div>
        )}

        {existingQuote && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-emerald-900">Quotation Submitted Successfully</p>
                <p className="text-emerald-700 mt-0.5">
                  Quote Ref: <strong>#{existingQuote.quote_number}</strong> · Amount: <strong>{formatCurrency(existingQuote.total_amount)}</strong>
                </p>
              </div>
            </div>
            <div>
              {getQuoteStatusBadge(existingQuote.status)}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Scope & BOQ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tender Scope */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FiPackage className="w-4 h-4 text-indigo-600" />
                Procurement Tender Specifications
              </h2>

              {rfq.description ? (
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                  {rfq.description}
                </p>
              ) : (
                <p className="text-sm italic text-slate-400">No additional scope description provided.</p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block">Required Delivery Date</span>
                  <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                    {formatIndianDate(rfq.required_by_date)}
                  </span>
                  <span className={`text-[11px] block ${daysRemaining.color}`}>
                    {daysRemaining.text}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Procurement Quantity</span>
                  <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                    {rfq.quantity || 'Per BOQ Below'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tender Status</span>
                  <span className="font-semibold text-emerald-700 mt-0.5 block">
                    {formatRfqStatus(rfq.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bill of Quantities Requested */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FiLayers className="w-4 h-4 text-indigo-600" />
                  Bill of Quantities (BOQ) Requested by Buyer
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {rfq.products_requested?.length || 0} Line Items
                </span>
              </div>

              {rfq.products_requested && rfq.products_requested.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {rfq.products_requested.map((product, index) => {
                    const matchingProduct = supplierProducts?.find(
                      p => p.category?.toLowerCase() === product.category?.toLowerCase()
                    );

                    return (
                      <div key={index} className="py-4 first:pt-0 last:pb-0 space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <p className="font-bold text-slate-900 text-sm">
                              {product.name || product.category}
                            </p>
                            {product.description && (
                              <p className="text-xs text-slate-500">{product.description}</p>
                            )}
                            {product.category && (
                              <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                                Category: {product.category}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-sm font-extrabold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 block">
                              {product.quantity || 'N/A'} {product.unit || ''}
                            </span>
                          </div>
                        </div>

                        {matchingProduct && (
                          <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs flex items-center justify-between">
                            <span className="text-emerald-800 font-medium">
                              ✓ You have matching catalog inventory: <strong>{matchingProduct.name}</strong>
                            </span>
                            <span className="font-mono font-bold text-emerald-900">
                              Base: {formatCurrency(matchingProduct.base_price)}/{matchingProduct.unit}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No specific line item breakdown specified.</p>
              )}
            </div>

            {/* Other Competing Quotes Benchmark (Blind Market Info) */}
            {otherQuotes.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Market Bidding Activity ({otherQuotes.length} Competing Bids)
                </h2>
                <div className="space-y-2.5">
                  {otherQuotes.map((q) => (
                    <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">Verified Supplier Bid</p>
                        <p className="text-[11px] text-slate-400 font-mono">Ref #{q.quote_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-indigo-600">{formatCurrency(q.total_amount)}</p>
                        <p className="text-[10px] text-slate-400">Valid until {formatIndianDate(q.valid_until)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Buyer Info & Quotation Action */}
          <div className="space-y-6">
            {/* Buyer Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FiUser className="w-4 h-4 text-slate-500" />
                Buyer Procurement Entity
              </h2>

              <div className="space-y-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[11px]">Organization / Buyer</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{rfq.buyer?.name}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Member On Network</span>
                  <p className="font-medium text-slate-700 mt-0.5">
                    {rfq.buyer?.created_at ? formatIndianDate(rfq.buyer.created_at) : 'Active Corporate Member'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
                <FiShield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>GST-verified procurement account. Escrow settlement protected.</span>
              </div>
            </div>

            {/* Existing Quote Card */}
            {existingQuote && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Your Active Quotation
                  </h2>
                  {getQuoteStatusBadge(existingQuote.status)}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quote Reference:</span>
                    <span className="font-mono font-bold text-slate-800">#{existingQuote.quote_number}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Quoted Total:</span>
                    <span className="font-mono text-base font-extrabold text-indigo-600">
                      {formatCurrency(existingQuote.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Offer Validity:</span>
                    <span className="font-mono text-slate-700">Until {formatIndianDate(existingQuote.valid_until)}</span>
                  </div>
                </div>

                {existingQuote.status === 'pending' && (
                  <Link
                    href={route('supplier.rfqs.edit-quote', existingQuote.id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                    Revise Quotation Terms
                  </Link>
                )}
              </div>
            )}

            {/* Submit Quote CTA */}
            {!existingQuote && isOpen && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Participate in Tender
                </h2>

                {canQuote ? (
                  <>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Submit an itemized commercial proposal with unit pricing, delivery lead times, and GST tax calculations.
                    </p>
                    <Link
                      href={route('supplier.rfqs.create-quote', rfq.id)}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      <FiSend className="w-4 h-4" />
                      Submit Commercial Quotation
                    </Link>
                  </>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-2">
                    <p className="font-bold">Catalog Inventory Needed</p>
                    <p className="text-[11px] leading-relaxed">
                      You need active products matching this tender's category to submit a commercial bid.
                    </p>
                    <Link
                      href={route('supplier.products.create')}
                      className="inline-block text-indigo-600 font-bold hover:underline"
                    >
                      Add Products to Catalog →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Matching Products from Vendor Catalog */}
            {supplierProducts && supplierProducts.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Your Relevant Products
                </h2>
                <div className="divide-y divide-slate-100 text-xs">
                  {supplierProducts.map((prod) => (
                    <div key={prod.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{prod.name}</p>
                        <p className="text-[10px] text-slate-400">{prod.category || 'General'}</p>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {formatCurrency(prod.base_price)}/{prod.unit || 'unit'}
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