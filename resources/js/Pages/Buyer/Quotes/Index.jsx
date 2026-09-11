// resources/js/Pages/Buyer/Quotes/Index.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatCurrency,
  formatIndianDate,
  formatQuoteStatus
} from '@/Utils/formatters';
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiSearch,
  FiCalendar,
  FiUser,
  FiAlertCircle,
  FiDownload,
  FiBarChart2,
  FiFilter,
  FiPackage,
  FiArrowRight,
  FiShield
} from 'react-icons/fi';

export default function QuotesIndex({ quotes, counts, rfqs }) {
  const [filters, setFilters] = useState({
    status: '',
    rfq_id: '',
    supplier_id: '',
    search: '',
    from_date: '',
    to_date: '',
    validity: '',
    sort: 'latest'
  });
  const [selectedQuotes, setSelectedQuotes] = useState([]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    router.get(route('buyer.quotes.index'), newFilters, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('buyer.quotes.index'), filters, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const resetFilters = () => {
    const resetValues = {
      status: '',
      rfq_id: '',
      search: '',
      to_date: '',
      validity: '',
      from_date: '',
      sort: 'latest',
      supplier_id: '',
    };
    setFilters(resetValues);
    router.get(route('buyer.quotes.index'), resetValues, {
      preserveState: true
    });
  };

  const toggleQuoteSelection = (quoteId) => {
    setSelectedQuotes(prev => {
      if (prev.includes(quoteId)) {
        return prev.filter(id => id !== quoteId);
      } else {
        if (prev.length < 5) {
          return [...prev, quoteId];
        }
        return prev;
      }
    });
  };

  const compareQuotes = () => {
    if (selectedQuotes.length >= 2) {
      router.get(route('buyer.quotes.compare'), { quote_ids: selectedQuotes });
    }
  };

  const isQuoteValid = (quote) => {
    if (!quote?.valid_until) return false;
    const validUntil = new Date(quote.valid_until);
    if (Number.isNaN(validUntil.getTime())) return false;
    return validUntil >= new Date();
  };

  const getStatusBadge = (quote) => {
    if (quote.status === 'pending' && !isQuoteValid(quote)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <FiAlertCircle className="w-3 h-3 text-slate-500" />
          Validity Expired
        </span>
      );
    }

    switch (quote.status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FiCheckCircle className="w-3 h-3 text-emerald-500" />
            Accepted (PO Ready)
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <FiXCircle className="w-3 h-3 text-rose-500" />
            Bid Declined
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <FiClock className="w-3 h-3 text-amber-500" />
            Under Evaluation
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <Head title="Procurement Quotations Received" />

      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Supplier Quotations
              </h1>
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                Bid Evaluation Desk
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Review, evaluate, and benchmark competitive vendor quotations against your open procurement tenders.
            </p>
          </div>

          {selectedQuotes.length >= 2 && (
            <button
              onClick={compareQuotes}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              <FiBarChart2 className="w-4 h-4" />
              Compare Selected ({selectedQuotes.length})
            </button>
          )}
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-slate-500">Total Bids</p>
            <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{quotes.total || 0}</p>
            <span className="text-[11px] text-slate-400">All submitted quotes</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-amber-700">Under Review</p>
            <p className="text-2xl font-extrabold text-amber-600 font-mono mt-1">{counts.pending || 0}</p>
            <span className="text-[11px] text-slate-400">Awaiting evaluation</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-emerald-700">Accepted</p>
            <p className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">{counts.accepted || 0}</p>
            <span className="text-[11px] text-slate-400">Converted to orders</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-rose-700">Declined</p>
            <p className="text-2xl font-extrabold text-rose-600 font-mono mt-1">{counts.rejected || 0}</p>
            <span className="text-[11px] text-slate-400">Not selected</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-slate-500">Expired</p>
            <p className="text-2xl font-extrabold text-slate-700 font-mono mt-1">{counts.expired || 0}</p>
            <span className="text-[11px] text-slate-400">Validity lapsed</span>
          </div>
        </div>

        {/* Filter Drawer */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Search Quotations</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Quote Ref, RFQ #, Vendor..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Under Evaluation</option>
                  <option value="accepted">Accepted (Awarded)</option>
                  <option value="rejected">Bid Declined</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Tender / RFQ</label>
                <select
                  value={filters.rfq_id}
                  onChange={(e) => handleFilterChange('rfq_id', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                >
                  <option value="">All RFQs</option>
                  {rfqs.map((rfq) => (
                    <option key={rfq.id} value={rfq.id}>
                      {rfq.title} (#{rfq.rfq_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Validity</label>
                <select
                  value={filters.validity}
                  onChange={(e) => handleFilterChange('validity', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                >
                  <option value="">All Validity</option>
                  <option value="valid">Active & Valid</option>
                  <option value="expired">Validity Expired</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Date From</label>
                <input
                  type="date"
                  value={filters.from_date}
                  onChange={(e) => handleFilterChange('from_date', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Date Up To</label>
                <input
                  type="date"
                  value={filters.to_date}
                  onChange={(e) => handleFilterChange('to_date', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                >
                  <option value="latest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount_high">Commercial Bid: High to Low</option>
                  <option value="amount_low">Commercial Bid: Low to High</option>
                  <option value="valid_until">By Expiration Date</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Filter
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Quotes List */}
        {quotes.data.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
              <FiFileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Quotations Found</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              When suppliers submit commercial bids responding to your RFQs, their proposals will appear here for evaluation.
            </p>
            <Link
              href={route('buyer.rfqs.create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              Publish New RFQ
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.data.map((quote) => {
              const valid = isQuoteValid(quote);
              return (
                <div
                  key={quote.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Checkbox for compare */}
                    <div className="flex items-start lg:items-center">
                      <input
                        type="checkbox"
                        checked={selectedQuotes.includes(quote.id)}
                        onChange={() => toggleQuoteSelection(quote.id)}
                        disabled={quote.status !== 'pending' || !valid}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        title={valid ? 'Select for comparison' : 'Quote expired'}
                      />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center flex-wrap gap-2.5">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          Quote #{quote.quote_number}
                        </span>
                        {getStatusBadge(quote)}
                        <Link
                          href={route('buyer.rfqs.show', quote.rfq.id)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 ml-1"
                        >
                          RFQ: {quote.rfq.title} (#{quote.rfq.rfq_number})
                        </Link>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <FiUser className="w-3.5 h-3.5 text-slate-400" />
                          <span>{quote.supplier?.name}</span>
                        </div>
                        {quote.supplier?.supplier?.verification_status === 'verified' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 text-[10px] font-bold">
                            <FiShield className="w-3 h-3 text-emerald-500" />
                            GST Verified Supplier
                          </span>
                        )}
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">
                          Received: {formatIndianDate(quote.created_at)}
                        </span>
                      </div>

                      {/* Pricing strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-500 block">Total Commercial Bid</span>
                          <span className="text-base font-extrabold text-indigo-600 font-mono mt-0.5 block">
                            {formatCurrency(quote.total_amount)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Quote Validity</span>
                          <span className={`font-semibold font-mono mt-0.5 block ${valid ? 'text-slate-700' : 'text-rose-600'}`}>
                            {formatIndianDate(quote.valid_until)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Line Items</span>
                          <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                            {quote.rfq?.products_requested?.length || 0} Materials
                          </span>
                        </div>
                      </div>

                      {/* Product Breakdown Snippet */}
                      {quote.product_breakdown && quote.product_breakdown.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {quote.product_breakdown.slice(0, 3).map((item, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 flex items-center gap-1.5"
                            >
                              <span className="font-medium">{item.name}</span>
                              <span className="text-slate-400">×{item.quantity}</span>
                              <span className="font-bold text-indigo-600 font-mono">
                                {formatCurrency(item.price)}
                              </span>
                            </span>
                          ))}
                          {quote.product_breakdown.length > 3 && (
                            <span className="text-xs text-slate-500 self-center">
                              +{quote.product_breakdown.length - 3} more items
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions Column */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <Link
                        href={route('buyer.quotes.show', quote.id)}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      >
                        <FiEye className="w-3.5 h-3.5" />
                        View Quotation
                      </Link>

                      {quote.status === 'pending' && valid && (
                        <>
                          <Link
                            href={route('buyer.quotes.accept-confirm', quote.id)}
                            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                          >
                            <FiCheckCircle className="w-3.5 h-3.5" />
                            Accept Bid
                          </Link>
                          <Link
                            href={route('buyer.quotes.reject-confirm', quote.id)}
                            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-colors"
                          >
                            <FiXCircle className="w-3.5 h-3.5" />
                            Decline
                          </Link>
                        </>
                      )}

                      <button
                        onClick={() => router.get(route('buyer.quotes.download', quote.id))}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                      >
                        <FiDownload className="w-3.5 h-3.5" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {quotes.links && quotes.links.length > 3 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  {quotes.links.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => router.get(link.url)}
                      dangerouslySetInnerHTML={{
                        __html: link.label
                          .replace('Previous', '« Previous')
                          .replace('Next', 'Next »')
                      }}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${link.active
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : link.url
                          ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      disabled={!link.url}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}