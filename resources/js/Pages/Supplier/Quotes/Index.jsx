// resources/js/Pages/Supplier/Quotes/Index.jsx

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
  FiCopy,
  FiXCircle,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiLayers,
  FiShoppingBag,
  FiPercent,
  FiShield
} from 'react-icons/fi';
import { MdPending } from 'react-icons/md';
import Swal from 'sweetalert2';

export default function QuotesIndex({ quotes, stats, statusCounts }) {
  const [dateTo, setDateTo] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [validityFilter, setValidityFilter] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  const getStatusBadge = (quote) => {
    if (quote.status === 'pending' && new Date(quote.valid_until) < new Date()) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <FiClock className="w-3 h-3 text-slate-500" />
          Validity Expired
        </span>
      );
    }

    switch (quote.status) {
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
      case 'withdrawn':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <FiXCircle className="w-3 h-3 text-slate-400" />
            Withdrawn
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
    router.get(route('supplier.quotes.index'), {
      search: searchTerm,
      status: statusFilter,
      validity: validityFilter,
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
    setSearchTerm('');
    setStatusFilter('');
    setValidityFilter('');
    setDateFrom('');
    setDateTo('');
    setSortField('created_at');
    setSortDirection('desc');

    router.get(route('supplier.quotes.index'), {}, {
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

  const handleDuplicate = (id) => {
    Swal.fire({
      title: "Duplicate Quotation?",
      text: "A new draft quotation will be generated copying these line items and terms.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Duplicate",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route("supplier.quotes.duplicate", id), {}, {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: 'Success',
              text: "Quotation duplicated successfully"
            });
          },
          onError: () => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Could not duplicate quotation."
            });
          }
        });
      }
    });
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FiChevronDown className="w-3.5 h-3.5 text-slate-400" />;
    return sortDirection === 'asc'
      ? <FiChevronUp className="w-3.5 h-3.5 text-indigo-600" />
      : <FiChevronDown className="w-3.5 h-3.5 text-indigo-600" />;
  };

  return (
    <DashboardLayout>
      <Head title="Supplier Quotations Management" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Submitted Commercial Quotations
              </h1>
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                Vendor Sales Desk
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Track quotation status, manage revisions, extend proposal validity, and convert awards into active Purchase Orders.
            </p>
          </div>
          <Link
            href={route('supplier.rfqs.index')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <FiLayers className="w-3.5 h-3.5" />
            Browse New Tenders
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-slate-500">Total Bids</p>
            <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{stats.total || 0}</p>
            <span className="text-[11px] text-slate-400">All submissions</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-amber-700">Under Review</p>
            <p className="text-2xl font-extrabold text-amber-600 font-mono mt-1">{stats.pending || 0}</p>
            <span className="text-[11px] text-slate-400">Evaluating</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-emerald-700">Awarded & PO</p>
            <p className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">{stats.accepted || 0}</p>
            <span className="text-[11px] text-slate-400">Won contracts</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-rose-700">Declined</p>
            <p className="text-2xl font-extrabold text-rose-600 font-mono mt-1">{stats.rejected || 0}</p>
            <span className="text-[11px] text-slate-400">Not selected</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-slate-500">Expired</p>
            <p className="text-2xl font-extrabold text-slate-700 font-mono mt-1">{stats.expired || 0}</p>
            <span className="text-[11px] text-slate-400">Validity lapsed</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-indigo-700">Win Rate</p>
            <p className="text-2xl font-extrabold text-indigo-600 font-mono mt-1">{stats.conversion_rate || 0}%</p>
            <span className="text-[11px] text-slate-400">Quotation conversion</span>
          </div>
        </div>

        {/* Filter Drawer */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900"
            >
              <FiFilter className="w-4 h-4 text-slate-400" />
              <span>Filter & Search Quotations</span>
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
                      placeholder="Search by quote #, tender ref, or buyer name..."
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
                    <option value="">All Statuses</option>
                    <option value="pending">Under Review ({statusCounts.pending || 0})</option>
                    <option value="accepted">Accepted ({statusCounts.accepted || 0})</option>
                    <option value="rejected">Declined ({statusCounts.rejected || 0})</option>
                  </select>
                </div>

                <div>
                  <select
                    value={validityFilter}
                    onChange={(e) => setValidityFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">All Validity</option>
                    <option value="valid">Active & Valid</option>
                    <option value="expired">Validity Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    placeholder="From Date"
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    placeholder="To Date"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quotations Table */}
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
                    Tender Reference / Buyer
                  </th>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('total_amount')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Commercial Total
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
                      Validity Deadline
                      <SortIcon field="valid_until" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('created_at')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Submission Date
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
                  const isPending = quote.status === 'pending' && !isExpired;

                  return (
                    <tr key={quote.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">
                        <Link
                          href={route('supplier.quotes.show', quote.id)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          #{quote.quote_number}
                        </Link>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="font-bold text-slate-900 line-clamp-1">{quote.rfq?.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Tender #{quote.rfq?.rfq_number} · Buyer: <strong className="text-slate-700">{quote.rfq?.buyer?.name}</strong>
                        </p>
                      </td>
                      <td className="px-5 py-4 font-mono font-extrabold text-slate-900">
                        {formatCurrency(quote.total_amount)}
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(quote)}
                      </td>
                      <td className="px-5 py-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className={isExpired ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                            {formatIndianDate(quote.valid_until)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-500 font-mono">
                        {formatIndianDate(quote.created_at)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={route('supplier.quotes.show', quote.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Quotation Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>

                          {isPending && (
                            <Link
                              href={route('supplier.quotes.edit', quote.id)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Revise Quotation"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </Link>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDuplicate(quote.id)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Duplicate Quote"
                          >
                            <FiCopy className="w-4 h-4" />
                          </button>

                          {quote.order && (
                            <Link
                              href={route('supplier.orders.show', quote.order.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200 ml-1"
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
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <FiFileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-base font-bold text-slate-700 mb-1">No Quotations Found</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                        You have not submitted commercial quotations matching these search filters.
                      </p>
                      <Link
                        href={route('supplier.rfqs.index')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Browse Open RFQs
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