// resources/js/Pages/Buyer/Quotes/Show.jsx

import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatCurrency,
  formatIndianDate,
  formatQuoteStatus,
  formatOrderStatus
} from '@/Utils/formatters';
import {
  FiFileText,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiArrowLeft,
  FiCalendar,
  FiUser,
  FiDownload,
  FiAlertCircle,
  FiBarChart2,
  FiShoppingBag,
  FiShield,
  FiClock,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';

export default function QuoteShow({ quote, isExpired, otherQuotes, existingOrder, productBreakdown }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Accepted (Awarded)
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <FiXCircle className="w-3.5 h-3.5 text-rose-600" />
            Bid Declined
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <FiClock className="w-3.5 h-3.5 text-amber-600" />
            Under Evaluation
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <Head title={`Quote #${quote.quote_number} - ${quote.supplier?.name}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-4">
            <Link
              href={route('buyer.quotes.index')}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="Back to Quotations"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  Quote #{quote.quote_number}
                </span>
                {getStatusBadge(quote.status)}
                {isExpired && quote.status === 'pending' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    <FiAlertCircle className="w-3 h-3 text-slate-500" />
                    Validity Expired
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Quotation from {quote.supplier?.name}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {quote.status === 'pending' && !isExpired && (
              <>
                <Link
                  href={route('buyer.quotes.accept-confirm', quote.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  Accept & Award PO
                </Link>
                <Link
                  href={route('buyer.quotes.reject-confirm', quote.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-colors"
                >
                  <FiXCircle className="w-4 h-4" />
                  Decline Bid
                </Link>
              </>
            )}
            <button
              onClick={() => router.get(route('buyer.quotes.download', quote.id))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Expired Warning Banner */}
        {isExpired && quote.status === 'pending' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <FiAlertCircle className="text-amber-600 w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900">Quotation Offer Expired</p>
              <p className="text-xs text-amber-700 mt-0.5">
                The pricing terms for this quote expired on {formatIndianDate(quote.valid_until)}. Please request an updated quotation from the vendor.
              </p>
            </div>
          </div>
        )}

        {/* Accepted Success Banner */}
        {quote.status === 'accepted' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <FiCheckCircle className="text-emerald-600 w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-900">Quotation Awarded & Accepted</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  This quotation was accepted on {formatIndianDate(quote.accepted_at)}. Purchase Order generation is enabled.
                </p>
              </div>
            </div>
            {!existingOrder && (
              <Link
                href={route('buyer.orders.confirm', [quote.rfq_id, quote.id])}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
              >
                Proceed to Issue PO →
              </Link>
            )}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Scope & Price Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tender Reference */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FiFileText className="w-4 h-4 text-indigo-600" />
                Procurement Tender Reference
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Quote Reference</span>
                  <span className="font-bold text-slate-900 font-mono mt-0.5 block">{quote.quote_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tender / RFQ</span>
                  <Link
                    href={route('buyer.rfqs.show', quote.rfq_id)}
                    className="font-bold text-indigo-600 hover:text-indigo-800 mt-0.5 block font-mono"
                  >
                    #{quote.rfq?.rfq_number}
                  </Link>
                </div>
                <div>
                  <span className="text-slate-500 block">Submission Date</span>
                  <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                    {formatIndianDate(quote.created_at)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Quote Validity</span>
                  <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                    Until {formatIndianDate(quote.valid_until)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="text-slate-500 font-medium block">Tender Title:</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{quote.rfq?.title}</span>
              </div>

              {quote.acceptance_notes && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-900 block mb-1">Buyer Procurement Acceptance Notes:</span>
                  <p className="text-emerald-800">{quote.acceptance_notes}</p>
                </div>
              )}

              {quote.rejection_reason && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs">
                  <span className="font-bold text-rose-900 block mb-1">Reason for Declining Bid:</span>
                  <p className="text-rose-800">{quote.rejection_reason}</p>
                </div>
              )}
            </div>

            {/* Itemized Pricing Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FiPackage className="w-4 h-4 text-indigo-600" />
                  Itemized Quotation & Bill of Materials
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {productBreakdown?.length || 0} Items
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {productBreakdown?.map((item, index) => {
                  const unitPrice = item.quantity > 0 ? (item.price / item.quantity) : item.price;
                  return (
                    <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          Quantity: <span className="font-mono font-semibold text-slate-700">{item.quantity}</span>
                          {item.specifications && <span> · {item.specifications}</span>}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-base font-extrabold text-indigo-600">
                          {formatCurrency(item.price)}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          {formatCurrency(unitPrice)} / unit
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Row */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/70 -mx-6 -mb-6 p-6 rounded-b-2xl">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">
                    Total Commercial Bid (Excl. / Incl. GST as agreed)
                  </span>
                  <span className="text-xs text-slate-400">All prices quoted in Indian National Rupee (INR)</span>
                </div>
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {formatCurrency(quote.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Supplier Info & Benchmarks */}
          <div className="space-y-6">
            {/* Vendor Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FiUser className="w-4 h-4 text-slate-500" />
                Vendor Enterprise Information
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{quote.supplier?.name}</h3>
                    {quote.supplier?.supplier?.company_name && (
                      <p className="text-xs text-slate-500">{quote.supplier.supplier.company_name}</p>
                    )}
                  </div>
                  {quote.supplier?.supplier?.verification_status === 'verified' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 text-[10px] font-bold">
                      <FiShield className="w-3 h-3 text-emerald-500" />
                      Verified
                    </span>
                  )}
                </div>

                {quote.supplier?.supplier && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-slate-600">
                    {quote.supplier.supplier.company_email && (
                      <div className="flex items-center gap-2">
                        <FiMail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{quote.supplier.supplier.company_email}</span>
                      </div>
                    )}
                    {quote.supplier.supplier.company_phone && (
                      <div className="flex items-center gap-2">
                        <FiPhone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{quote.supplier.supplier.company_phone}</span>
                      </div>
                    )}
                    {quote.supplier.supplier.company_address && (
                      <div className="flex items-start gap-2">
                        <FiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{quote.supplier.supplier.company_address}</span>
                      </div>
                    )}
                  </div>
                )}

                <Link
                  href={route('buyer.suppliers.show', quote.supplier_id)}
                  className="mt-3 block text-center py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-xs"
                >
                  View Verified Supplier Profile →
                </Link>
              </div>
            </div>

            {/* Other Competing Quotes */}
            {otherQuotes.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <FiBarChart2 className="w-4 h-4 text-indigo-600" />
                    Competing Vendor Bids ({otherQuotes.length})
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {otherQuotes.map((otherQuote) => (
                    <div key={otherQuote.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{otherQuote.supplier?.name}</p>
                        <p className="font-mono text-indigo-600 font-extrabold mt-0.5">
                          {formatCurrency(otherQuote.total_amount)}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          otherQuote.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          otherQuote.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {formatQuoteStatus(otherQuote.status)}
                        </span>
                        <Link
                          href={route('buyer.quotes.show', otherQuote.id)}
                          className="block text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          View Bid →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {quote.status === 'pending' && (
                  <Link
                    href={route('buyer.quotes.compare', { quote_ids: [quote.id, ...otherQuotes.slice(0, 3).map(q => q.id)] })}
                    className="block text-center py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl transition-colors text-xs"
                  >
                    Side-by-Side Comparison
                  </Link>
                )}
              </div>
            )}

            {/* Active Order Card if issued */}
            {existingOrder && (
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <FiShoppingBag className="w-4 h-4" />
                  Purchase Order Active
                </div>
                <h3 className="text-base font-bold">
                  PO #{existingOrder.order_number}
                </h3>
                <p className="text-xs text-slate-300">
                  Status: <strong className="text-emerald-400">{formatOrderStatus(existingOrder.order_status)}</strong>
                </p>
                <p className="text-xs text-slate-300">
                  Total Value: <strong className="text-white font-mono">{formatCurrency(existingOrder.total_amount)}</strong>
                </p>
                <Link
                  href={route('buyer.orders.show', existingOrder.id)}
                  className="block text-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors mt-2"
                >
                  Manage Order & Escrow →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}