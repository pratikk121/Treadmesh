// resources/js/Pages/Supplier/Rfqs/MyQuotes.jsx

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
  FiFilter,
  FiSearch,
  FiEye,
  FiEdit2,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiLayers,
  FiShoppingBag
} from 'react-icons/fi';

export default function MyQuotes({ quotes, stats }) {
  const [dateTo, setDateTo] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  const getStatusBadge = (status, validUntil) => {
    if (status === 'pending' && new Date(validUntil) < new Date()) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <FiClock className="w-3 h-3 text-slate-500" />
          Validity Expired
        </span>
      );
    }

    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FiCheckCircle className="w-3 h-3 text-emerald-500" />
            Accepted (PO Awarded)
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
            Under Buyer Review
          </span>
        );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    router.get(route('supplier.rfqs.my-quotes'), {
      search: searchTerm,
      status: statusFilter,
      date_from: dateFrom,
      date_to: dateTo,
      sort: sortField,
      direction: sortDirection
    }, {
      preserveState: true,
      replace: true
    });
  };

  const resetFilters = () => {
    setDateTo('');
    setDateFrom('');
    setSearchTerm('');
    setStatusFilter('');
    setSortDirection('desc');
    setSortField('created_at');

    router.get(route('supplier.rfqs.my-quotes'), {}, {
      preserveState: true,
      replace: true
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    applyFilters();
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FiChevronDown className="w-3.5 h-3.5 text-slate-400" />;
    return sortDirection === 'asc'
      ? <FiChevronUp className="w-3.5 h-3.5 text-indigo-600" />
      : <FiChevronDown className="w-3.5 h-3.5 text-indigo-600" />;
  };

  return (
    <DashboardLayout>
      <Head title="My Submitted Quotations" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Vendor Quotations Ledger
              </h1>
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Tender Bids
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Monitor, revise, and track outcomes for commercial quotations submitted to enterprise buyers across India.
            </p>
          </div>
          <Link
            href={route('supplier.rfqs.index')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <FiLayers className="w-3.5 h-3.5" />
            Browse Open Tenders
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-slate-500">Total Bids</p>
            <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{stats.total || 0}</p>
            <span className="text-[11px] text-slate-400">All proposals submitted</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-amber-700">Under Evaluation</p>
            <p className="text-2xl font-extrabold text-amber-600 font-mono mt-1">{stats.pending || 0}</p>
            <span className="text-[11px] text-slate-400">Awaiting buyer response</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-emerald-700">Accepted & PO</p>
            <p className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">{stats.accepted || 0}</p>
            <span className="text-[11px] text-slate-400">Won tenders</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-rose-700">Declined Bids</p>
            <p className="text-2xl font-extrabold text-rose-600 font-mono mt-1">{stats.rejected || 0}</p>
            <span className="text-[11px] text-slate-400">Not selected</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-slate-500">Expired</p>
            <p className="text-2xl font-extrabold text-slate-700 font-mono mt-1">{stats.expired || 0}</p>
            <span className="text-[11px] text-slate-400">Lapsed validity</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900"
            >
              <FiFilter className="w-4 h-4 text-slate-400" />
              <span>Filter Quotations</span>
              {showFilters ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showFilters && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="col-span-2">
                  <form onSubmit={handleSearch} className="flex">
                    <input
                      type="text"
                      placeholder="Search by quote # or tender reference..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-l-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-r-xl transition-colors"
                    >
                      <FiSearch className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">All Bid Statuses</option>
                    <option value="pending">Under Buyer Review</option>
                    <option value="accepted">Accepted (PO Awarded)</option>
                    <option value="rejected">Bid Declined</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={resetFilters}
                    className="flex-1 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('quote_number')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Quote Ref #
                      <SortIcon field="quote_number" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    Tender Scope
                  </th>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    Buyer Entity
                  </th>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('total_amount')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Quoted Commercial Value
                      <SortIcon field="total_amount" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('valid_until')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Valid Until
                      <SortIcon field="valid_until" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('created_at')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Submitted
                      <SortIcon field="created_at" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 text-right font-bold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotes.data.map((quote) => {
                  const isExpired = quote.status === 'pending' && new Date(quote.valid_until) < new Date();

                  return (
                    <tr key={quote.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">
                        #{quote.quote_number}
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <Link
                          href={route('supplier.rfqs.show', quote.rfq?.id)}
                          className="font-bold text-indigo-600 hover:text-indigo-800 line-clamp-1 block"
                        >
                          #{quote.rfq?.rfq_number} — {quote.rfq?.title}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-800">{quote.rfq?.buyer?.name}</span>
                      </td>
                      <td className="px-5 py-4 font-mono font-extrabold text-slate-900">
                        {formatCurrency(quote.total_amount)}
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(quote.status, quote.valid_until)}
                      </td>
                      <td className="px-5 py-4 font-mono">
                        <span className={isExpired ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                          {formatIndianDate(quote.valid_until)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 font-mono">
                        {formatIndianDate(quote.created_at)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={route('supplier.rfqs.show', quote.rfq?.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Tender Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>

                          {quote.status === 'pending' && !isExpired && (
                            <Link
                              href={route('supplier.rfqs.edit-quote', quote.id)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Revise Quotation"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </Link>
                          )}

                          {quote.order && (
                            <Link
                              href={route('supplier.orders.show', quote.order.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200"
                              title="View Purchase Order"
                            >
                              <FiShoppingBag className="w-3 h-3" />
                              PO #{quote.order.order_number}
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {quotes.data.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <FiFileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-base font-bold text-slate-700 mb-1">No Quotations Found</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                        You have not submitted commercial quotations matching these filter parameters.
                      </p>
                      <Link
                        href={route('supplier.rfqs.index')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Browse Open RFQ Tenders
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {quotes.links && quotes.links.length > 3 && (
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <p>
                Showing {quotes.from || 0} to {quotes.to || 0} of {quotes.total || 0} quotations
              </p>
              <div className="flex gap-1.5">
                {quotes.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => router.get(link.url)}
                    disabled={!link.url || link.active}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${link.active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : link.url
                        ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    dangerouslySetInnerHTML={{
                      __html: link.label
                        .replace('Previous', '« Previous')
                        .replace('Next', 'Next »')
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}