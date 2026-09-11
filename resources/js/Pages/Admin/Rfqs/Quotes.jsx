// resources/js/Pages/Admin/Rfqs/Quotes.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiUser,
  FiClock,
  FiCalendar,
  FiArrowLeft,
  FiDollarSign,
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
  FiExternalLink
} from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';
import {
  formatCurrency,
  formatIndianDate,
  formatQuoteStatus
} from '@/Utils/formatters';

export default function Quotes({ rfq, quotes }) {
  // Check if quote is valid based on valid_until date
  const isValidQuote = (quote) => {
    return quote.valid_until ? new Date(quote.valid_until) > new Date() : true;
  };

  return (
    <DashboardLayout>
      <Head title={`RFQ #${rfq.rfq_number} - Vendor Quotations | Treadmesh Admin`} />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header - Back button and page title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.rfqs.show', rfq.id)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              title="Return to tender specifications"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Competitive Bid Analysis
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  {quotes.length} {quotes.length === 1 ? 'Bid Received' : 'Bids Received'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                RFQ #{rfq.rfq_number} — Vendor Quotations
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {rfq.title} • Itemized commercial proposals and pricing matrices
              </p>
            </div>
          </div>

          <Link
            href={route('admin.rfqs.show', rfq.id)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
          >
            <FiArrowLeft className="w-4 h-4 text-slate-500" />
            <span>View RFQ Dossier</span>
          </Link>
        </div>

        {/* Quotes Grid */}
        <div className="space-y-4">
          {quotes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-12 text-center">
              <FiPackage className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No Quotations Received</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Authorized suppliers have not submitted formal commercial bids for this procurement tender yet.
              </p>
            </div>
          ) : (
            quotes.map((quote) => {
              const isStillValid = isValidQuote(quote);
              return (
                <div
                  key={quote.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden hover:border-slate-300 transition"
                >
                  <div className="p-6 space-y-5">
                    {/* Header - Supplier info and status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-base border border-indigo-100">
                          <BsBuilding className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">
                              {quote.supplier?.name || 'Verified Supplier'}
                            </h3>
                            {quote.supplierProfile?.company_name && (
                              <span className="text-xs text-slate-500">
                                ({quote.supplierProfile.company_name})
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{quote.supplier?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                          #{quote.quote_number}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            quote.status === 'accepted'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : quote.status === 'rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          }`}
                        >
                          {formatQuoteStatus(quote.status)}
                        </span>
                        {!isStillValid && quote.status === 'pending' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Validity Expired
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quote Details - Summary cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Quoted Value</p>
                        <p className="text-2xl font-bold font-mono text-indigo-600 mt-1">
                          {formatCurrency(quote.total_amount)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">INR (Base Quote)</p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bid Validity Deadline</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FiCalendar className="w-4 h-4 text-slate-400" />
                          <span className="text-base font-bold text-slate-900">
                            {formatIndianDate(quote.valid_until)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Offered price lock</p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Settlement Rail</p>
                        <p className="text-sm font-semibold text-slate-800 mt-1 truncate">
                          {quote.payment_terms === 'advance' ? '100% Nodal Escrow Advance' :
                           quote.payment_terms === 'partial' ? '50% Advance / 50% Dispatch' :
                           quote.payment_terms === 'delivery' ? '100% Post Dispatch' :
                           quote.payment_terms === 'credit_7' ? 'Net 7 Days Credit' :
                           quote.payment_terms === 'credit_15' ? 'Net 15 Days Credit' :
                           quote.payment_terms === 'credit_30' ? 'Net 30 Days Credit' :
                           quote.payment_terms || 'Standard Nodal Escrow'}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Lead: {quote.delivery_estimate || 'Standard Freight'}</p>
                      </div>
                    </div>

                    {/* Product Breakdown */}
                    {quote.product_breakdown && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                          <FiPackage className="w-4 h-4 text-indigo-600" />
                          Itemized Bill of Quantities (BOQ)
                        </h4>
                        <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                          {Array.isArray(quote.product_breakdown) ? (
                            <div className="divide-y divide-slate-200/60">
                              {quote.product_breakdown.map((item, index) => (
                                <div key={index} className="py-2 flex justify-between items-center text-xs">
                                  <div>
                                    <span className="font-semibold text-slate-900">{item.name || item.product_name || 'Line Item'}</span>
                                    {item.hsn && <span className="ml-2 text-slate-400 font-mono">HSN: {item.hsn}</span>}
                                  </div>
                                  <div className="text-right">
                                    <span className="font-mono text-slate-600">
                                      {item.quantity} units @ {formatCurrency(item.unit_price || item.price)} =
                                    </span>{' '}
                                    <span className="font-mono font-bold text-slate-900 ml-1">
                                      {formatCurrency(item.total_price || (item.quantity * (item.unit_price || item.price)))}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">
                              {JSON.stringify(quote.product_breakdown, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes if provided */}
                    {quote.notes && (
                      <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/60 text-xs text-amber-900">
                        <span className="font-semibold">Supplier Note:</span> {quote.notes}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <FiClock className="w-3.5 h-3.5 text-slate-400" />
                          Submitted on {formatIndianDate(quote.created_at)}
                        </span>
                      </div>
                      {quote.order && (
                        <Link
                          href={route('admin.orders.show', quote.order.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium transition border border-emerald-200/50"
                        >
                          <FiCheckCircle className="w-3.5 h-3.5" />
                          <span>View Converted Purchase Order</span>
                          <FiExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}