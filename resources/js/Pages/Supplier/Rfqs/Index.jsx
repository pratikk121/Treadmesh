// resources/js/Pages/Supplier/Rfqs/Index.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatIndianDate,
  formatRfqStatus
} from '@/Utils/formatters';
import {
  FiFileText,
  FiFilter,
  FiSearch,
  FiClock,
  FiCalendar,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
  FiSend,
  FiLayers
} from 'react-icons/fi';

export default function RfqsIndex({ rfqs, stats, supplierCategories }) {
  const [dateTo, setDateTo] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterByCategory, setFilterByCategory] = useState(true);

  const getDaysRemaining = (deadline) => {
    if (!deadline) return { label: 'Open', color: 'text-slate-600' };
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', color: 'text-rose-600 font-bold' };
    if (diffDays === 0) return { label: 'Due Today', color: 'text-amber-600 font-bold animate-pulse' };
    if (diffDays === 1) return { label: 'Due Tomorrow', color: 'text-amber-600 font-semibold' };
    return { label: `${diffDays} Days Left`, color: 'text-emerald-700 font-medium' };
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    router.get(route('supplier.rfqs.index'), {
      search: searchTerm,
      date_from: dateFrom,
      date_to: dateTo,
      filter_by_category: filterByCategory,
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
    setSortDirection('desc');
    setFilterByCategory(true);
    setSortField('created_at');

    router.get(route('supplier.rfqs.index'), {}, {
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

  const hasQuoted = (rfq) => {
    return rfq.quotes && rfq.quotes.length > 0;
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FiChevronDown className="w-3.5 h-3.5 text-slate-400" />;
    return sortDirection === 'asc'
      ? <FiChevronUp className="w-3.5 h-3.5 text-indigo-600" />
      : <FiChevronDown className="w-3.5 h-3.5 text-indigo-600" />;
  };

  return (
    <DashboardLayout>
      <Head title="Procurement Tenders (RFQs) Available for Bidding" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Buyer Tender Desk (RFQs)
              </h1>
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Bidding Marketplace
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Explore active Request for Quotation (RFQ) tenders from verified Indian enterprise buyers and submit competitive quotations.
            </p>
          </div>
          <Link
            href={route('supplier.quotes.index')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <FiLayers className="w-3.5 h-3.5" />
            My Submitted Bids ({stats.my_quotes || 0})
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-slate-500">Tenders Open</p>
            <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{stats.total_available || 0}</p>
            <span className="text-[11px] text-slate-400">Available to bid</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-indigo-700">Category Match</p>
            <p className="text-2xl font-extrabold text-indigo-600 font-mono mt-1">{stats.matching_categories || 0}</p>
            <span className="text-[11px] text-slate-400">Relevant to your products</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-slate-600">My Submissions</p>
            <p className="text-2xl font-extrabold text-slate-800 font-mono mt-1">{stats.my_quotes || 0}</p>
            <span className="text-[11px] text-slate-400">Total bids placed</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-amber-700">Under Review</p>
            <p className="text-2xl font-extrabold text-amber-600 font-mono mt-1">{stats.pending_quotes || 0}</p>
            <span className="text-[11px] text-slate-400">Awaiting buyer decision</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase text-emerald-700">Won & Awarded</p>
            <p className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">{stats.accepted_quotes || 0}</p>
            <span className="text-[11px] text-slate-400">Converted to Purchase Orders</span>
          </div>
        </div>

        {/* Warning if no supplier categories */}
        {supplierCategories.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs">
            <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">No Product Categories Configured</p>
              <p className="text-amber-700 mt-0.5">
                Add products to your vendor catalog to automatically receive targeted notifications for matching buyer tenders.
                <Link href={route('supplier.products.create')} className="ml-1.5 font-bold text-amber-900 underline">
                  Add Catalog Products →
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900"
            >
              <FiFilter className="w-4 h-4 text-slate-400" />
              <span>Filter Procurement Tenders</span>
              {showFilters ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
            </button>

            {searchTerm && (
              <span className="text-xs text-slate-400">
                Searching for: <strong className="text-slate-700 font-mono">"{searchTerm}"</strong>
              </span>
            )}
          </div>

          {showFilters && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="col-span-2">
                  <form onSubmit={handleSearch} className="flex">
                    <input
                      type="text"
                      placeholder="Search by tender title, description, or RFQ #..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-l-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
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
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                    placeholder="Date From"
                  />
                </div>

                <div>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                    placeholder="Date Up To"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterByCategory}
                    onChange={(e) => setFilterByCategory(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Only show tenders matching my registered product categories
                  </span>
                </label>

                <div className="flex items-center gap-2">
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

        {/* Tenders Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('rfq_number')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      RFQ Reference
                      <SortIcon field="rfq_number" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('title')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Procurement Subject
                      <SortIcon field="title" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    Buyer Entity
                  </th>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    Required Quantity
                  </th>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('required_by_date')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      Bidding Deadline
                      <SortIcon field="required_by_date" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 font-bold text-slate-600 uppercase tracking-wider">
                    Your Bid Status
                  </th>
                  <th className="px-5 py-3.5 text-right font-bold text-slate-600 uppercase tracking-wider">
                    Procurement Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rfqs.data.map((rfq) => {
                  const deadlineInfo = getDaysRemaining(rfq.required_by_date);
                  const isQuoted = hasQuoted(rfq);
                  const isOpen = new Date(rfq.required_by_date) >= new Date();

                  return (
                    <tr key={rfq.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">
                        <Link
                          href={route('supplier.rfqs.show', rfq.id)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          #{rfq.rfq_number}
                        </Link>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="font-bold text-slate-900 line-clamp-1">{rfq.title}</p>
                        {rfq.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{rfq.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-800">{rfq.buyer?.name}</span>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-slate-700">
                        {rfq.quantity || 'Per BOQ'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 font-mono">
                          <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatIndianDate(rfq.required_by_date)}</span>
                        </div>
                        <span className={`text-[10px] block mt-0.5 ${deadlineInfo.color}`}>
                          {deadlineInfo.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {isQuoted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-200">
                            <FiCheckCircle className="w-3 h-3 text-emerald-500" />
                            Bid Submitted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[11px] font-bold border border-amber-200">
                            <FiClock className="w-3 h-3 text-amber-500" />
                            Awaiting Bid
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={route('supplier.rfqs.show', rfq.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Tender Specifications"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>

                          {!isQuoted && isOpen && (
                            <Link
                              href={route('supplier.rfqs.create-quote', rfq.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
                            >
                              <FiSend className="w-3 h-3" />
                              Submit Quotation
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {rfqs.data.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <FiFileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-base font-bold text-slate-700 mb-1">No Matching Tenders Found</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        {supplierCategories.length === 0
                          ? 'Add product categories to your catalog to view tenders matching your manufacturing capabilities.'
                          : 'Try adjusting your search criteria or date filters.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {rfqs.links && rfqs.links.length > 3 && (
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <p>
                Showing {rfqs.from || 0} to {rfqs.to || 0} of {rfqs.total || 0} procurement tenders
              </p>
              <div className="flex gap-1.5">
                {rfqs.links.map((link, index) => (
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