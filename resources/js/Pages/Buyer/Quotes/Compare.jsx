// resources/js/Pages/Buyer/Quotes/Compare.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatCurrency,
  formatIndianDate,
  formatQuoteStatus
} from '@/Utils/formatters';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiStar,
  FiPackage,
  FiShield,
  FiEye,
  FiCheck,
  FiX
} from 'react-icons/fi';

export default function QuoteCompare({ comparisonData }) {
  const getAllProducts = () => {
    const products = new Set();
    comparisonData.forEach(item => {
      item.breakdown?.forEach(product => {
        products.add(product.name);
      });
    });
    return Array.from(products);
  };

  const allProducts = getAllProducts();

  return (
    <DashboardLayout>
      <Head title="Compare Vendor Quotations" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <Link
            href={route('buyer.quotes.index')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Back to Quotations"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Side-by-Side Quotation Benchmark
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Compare competing vendor prices, delivery schedules, and line item costs to determine the optimal procurement award.
            </p>
          </div>
        </div>

        {/* Comparison Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-xs">
              {/* Table Header */}
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-bold text-slate-600 uppercase tracking-wider w-48">
                    Evaluation Criterion
                  </th>
                  {comparisonData.map((item, index) => (
                    <th key={index} className="p-4 font-bold text-slate-900 border-l border-slate-200 min-w-[220px]">
                      <div className="space-y-1">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-bold inline-block">
                          Quote #{item.quote.quote_number}
                        </span>
                        <p className="text-sm font-extrabold text-slate-900 mt-1">{item.supplier}</p>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <FiStar className="text-amber-400 w-3.5 h-3.5 fill-amber-400" />
                          <span>Rating: {item.supplier_rating || '4.8'} / 5.0</span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {/* Commercial Bid */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">
                    Grand Total Commercial Bid
                  </td>
                  {comparisonData.map((item, index) => (
                    <td key={index} className="p-4 border-l border-slate-200">
                      <span className="text-base font-extrabold text-indigo-600 font-mono block">
                        {formatCurrency(item.total)}
                      </span>
                      <span className="text-[10px] text-slate-400">All Taxes & Freight terms as quoted</span>
                    </td>
                  ))}
                </tr>

                {/* Status Row */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">
                    Bid Status
                  </td>
                  {comparisonData.map((item, index) => (
                    <td key={index} className="p-4 border-l border-slate-200">
                      <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                        item.quote.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.quote.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {formatQuoteStatus(item.quote.status)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Validity */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">
                    Quotation Validity
                  </td>
                  {comparisonData.map((item, index) => {
                    const isExp = new Date(item.valid_until) < new Date();
                    return (
                      <td key={index} className="p-4 border-l border-slate-200">
                        <div className="flex items-center gap-1.5 font-mono">
                          <FiClock className="text-slate-400 w-3.5 h-3.5" />
                          <span className={isExp ? 'text-rose-600 font-semibold' : 'text-slate-700'}>
                            {formatIndianDate(item.valid_until)}
                          </span>
                        </div>
                        {isExp && (
                          <span className="text-[10px] font-bold text-rose-600 uppercase mt-0.5 block">
                            Expired
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* GST Compliance */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">
                    Vendor Compliance
                  </td>
                  {comparisonData.map((item, index) => {
                    const isVerified = item.quote.supplier?.supplier?.verification_status === 'verified';
                    return (
                      <td key={index} className="p-4 border-l border-slate-200">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <FiShield className="w-3.5 h-3.5 text-emerald-500" />
                            GST & KYC Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500">
                            <FiClock className="w-3.5 h-3.5 text-slate-400" />
                            Standard Verification
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Line Item Pricing Rows */}
                {allProducts.map((productName, productIndex) => (
                  <tr key={productIndex} className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-800 bg-slate-50/50">
                      <div className="flex items-center gap-1.5">
                        <FiPackage className="w-3.5 h-3.5 text-slate-400" />
                        <span>{productName}</span>
                      </div>
                    </td>
                    {comparisonData.map((item, quoteIndex) => {
                      const product = item.breakdown?.find(p => p.name === productName);
                      const unitPrice = product && product.quantity > 0 ? (product.price / product.quantity) : 0;
                      return (
                        <td key={quoteIndex} className="p-4 border-l border-slate-200">
                          {product ? (
                            <div>
                              <span className="font-mono font-bold text-slate-900 block">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {product.quantity} units · {formatCurrency(unitPrice)}/unit
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300 font-mono">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Action Row */}
                <tr className="bg-slate-50/70">
                  <td className="p-4 font-bold text-slate-700">Procurement Action</td>
                  {comparisonData.map((item, index) => {
                    const isPending = item.quote.status === 'pending';
                    const isValid = new Date(item.valid_until) >= new Date();
                    return (
                      <td key={index} className="p-4 border-l border-slate-200">
                        {isPending && isValid ? (
                          <div className="space-y-1.5">
                            <Link
                              href={route('buyer.quotes.accept-confirm', item.quote.id)}
                              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                            >
                              <FiCheck className="w-3.5 h-3.5" />
                              Accept & Issue PO
                            </Link>
                            <Link
                              href={route('buyer.quotes.reject-confirm', item.quote.id)}
                              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-colors"
                            >
                              <FiX className="w-3.5 h-3.5" />
                              Decline Bid
                            </Link>
                          </div>
                        ) : (
                          <Link
                            href={route('buyer.quotes.show', item.quote.id)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                            View Quote Details
                          </Link>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Informational Guidance Footer */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-3">
          <FiShield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-800">Commercial Tender Governance Protocol</p>
            <p className="text-slate-500 mt-0.5 leading-relaxed">
              Awarding a quotation will formally notify the selected vendor and create an active Purchase Order in the Treadmesh procurement ledger. All competing open bids on this RFQ will be concluded.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}