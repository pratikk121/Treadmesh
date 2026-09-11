// resources/js/Pages/Buyer/Rfqs/Index.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatCurrency,
  formatIndianDate,
  formatRfqStatus
} from '@/Utils/formatters';
import {
  FiFileText,
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiFilter,
  FiDollarSign,
  FiPackage,
  FiCalendar,
  FiLayers
} from 'react-icons/fi';

export default function RfqIndex({ rfqs, counts }) {
  const [filters, setFilters] = useState({
    status: '',
    sort: 'latest'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    router.get(route('buyer.rfqs.index'), newFilters, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Tender
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <FiCheckCircle className="w-3 h-3 text-slate-500" />
            Closed Tender
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <FiXCircle className="w-3 h-3 text-rose-500" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <FiAlertCircle className="w-3 h-3 text-amber-500" />
            {formatRfqStatus(status)}
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <Head title="My RFQs & Procurement Tenders" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Procurement Tenders & RFQs
              </h1>
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Buyer Desk
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Issue requests for quotation (RFQs), receive competitive vendor bids, and issue Purchase Orders.
            </p>
          </div>
          <Link
            href={route('buyer.rfqs.create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-all hover:shadow-md"
          >
            <FiPlus className="w-4 h-4" />
            Create New Tender / RFQ
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Tenders</span>
              <FiFileText className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">{rfqs.total || 0}</p>
            <span className="text-xs text-slate-500 mt-1 block">Lifetime procurement requests</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Active Tenders</span>
              <FiClock className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-600 font-mono tracking-tight">{counts.open || 0}</p>
            <span className="text-xs text-slate-500 mt-1 block">Open for supplier bidding</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Bids Received</span>
              <FiDollarSign className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-extrabold text-indigo-600 font-mono tracking-tight">{counts.quoted || 0}</p>
            <span className="text-xs text-slate-500 mt-1 block">Quotations ready for review</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Closed / Completed</span>
              <FiCheckCircle className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-extrabold text-slate-700 font-mono tracking-tight">{counts.closed || 0}</p>
            <span className="text-xs text-slate-500 mt-1 block">Awarded or concluded RFQs</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FiFilter className="w-4 h-4 text-slate-400" />
              <span>Filter & Sort Tenders</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Tender Statuses</option>
                <option value="open">Active / Open</option>
                <option value="closed">Closed / Awarded</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="latest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="required_date">By Target Delivery Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* RFQs List */}
        {rfqs.data.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
              <FiFileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Active RFQs Found</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              Create a Request for Quotation (RFQ) to invite competitive bids from verified Indian manufacturers and distributors.
            </p>
            <Link
              href={route('buyer.rfqs.create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Publish First Tender
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rfqs.data.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center flex-wrap gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        RFQ #{rfq.rfq_number}
                      </span>
                      {getStatusBadge(rfq.status)}
                      <span className="text-xs text-slate-400">
                        Published: {formatIndianDate(rfq.created_at)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {rfq.title}
                      </h3>
                      {rfq.description && (
                        <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                          {rfq.description}
                        </p>
                      )}
                    </div>

                    {/* Bill of Quantities Preview */}
                    {rfq.products_requested && rfq.products_requested.length > 0 && (
                      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                          <FiPackage className="w-3.5 h-3.5" />
                          Requested Materials & Bill of Quantities (BOQ):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {rfq.products_requested.map((product, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1.5 text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 shadow-2xs"
                            >
                              <span className="font-medium">{product.name}</span>
                              <span className="text-slate-400">·</span>
                              <span className="font-semibold text-indigo-600 font-mono">
                                {product.quantity} {product.unit}
                              </span>
                              {product.category && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                  {product.category}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5 font-medium text-slate-600">
                        <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                        Target Delivery: <span className="font-semibold text-slate-800">{formatIndianDate(rfq.required_by_date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-indigo-700">
                        <FiFileText className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{rfq.quotes?.length || 0} Quotations Received</span>
                      </div>
                    </div>

                    {/* Latest Quote Teaser */}
                    {rfq.quotes && rfq.quotes.length > 0 && (
                      <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-emerald-50/80 rounded-xl border border-emerald-100 text-xs">
                        <span className="font-semibold text-emerald-800 flex items-center gap-1">
                          <FiDollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          Latest Bid:
                        </span>
                        <span className="font-bold text-emerald-900 font-mono">
                          {formatCurrency(rfq.quotes[0].total_amount)}
                        </span>
                        <span className="text-slate-500">
                          by <strong className="text-slate-700">{rfq.quotes[0].supplier?.name}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <Link
                      href={route('buyer.rfqs.show', rfq.id)}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      View Tender & Bids
                    </Link>

                    {rfq.status === 'open' && (
                      <>
                        <Link
                          href={route('buyer.rfqs.edit', rfq.id)}
                          className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                          Edit RFQ
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to cancel this procurement tender?')) {
                              router.delete(route('buyer.rfqs.cancel', rfq.id));
                            }
                          }}
                          className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-colors"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          Cancel RFQ
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {rfqs.links && rfqs.links.length > 3 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  {rfqs.links.map((link, index) => (
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