// Pages/Buyer/Quotes/Index.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Buyer dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
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
  FiBarChart2
} from 'react-icons/fi';

export default function QuotesIndex({ quotes, counts, rfqs }) {

  // State management for filters and selected quotes
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

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    router.get(route('buyer.quotes.index'), newFilters, {
      preserveState: true,
      preserveScroll: true
    });
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('buyer.quotes.index'), filters, {
      preserveState: true,
      preserveScroll: true
    });
  };

  // Reset all filters to default
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

  // Handle quote selection for comparison (max 5 quotes)
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

  // Compare selected quotes
  const compareQuotes = () => {
    if (selectedQuotes.length >= 2) {
      router.get(route('buyer.quotes.compare'), { quote_ids: selectedQuotes });
    }
  };

  // Format currency - Converts number to BDT currency format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date - Converts ISO date to readable format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color based on quote status
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'accepted': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700',
      'expired': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  // Get status icon based on quote status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-600" />;
      case 'accepted':
        return <FiCheckCircle className="text-green-600" />;
      case 'rejected':
        return <FiXCircle className="text-red-600" />;
      case 'expired':
        return <FiAlertCircle className="text-gray-600" />;
      default:
        return <FiFileText className="text-gray-600" />;
    }
  };

  // Check if quote is still valid based on valid_until date
  const isQuoteValid = (quote) => {
    if (!quote?.valid_until) return false;
    const validUntil = new Date(quote.valid_until);
    if (Number.isNaN(validUntil.getTime())) return false;
    return validUntil >= new Date();
  };

  return (
    <DashboardLayout>
      <Head title="Received Quota" />

      <div className="space-y-6">
        {/* Header - Page title and compare button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Received Quota</h2>
            <p className="text-gray-600 mt-1">Review and compare quotes from suppliers</p>
          </div>

          {/* Compare Button - Shows when quotes are selected */}
          {selectedQuotes.length >= 2 && (
            <button
              onClick={compareQuotes}
              className="mt-3 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <FiBarChart2 className="mr-2" />
              Selected comparison ({selectedQuotes.length})
            </button>
          )}
        </div>

        {/* Stats Cards - Quote status counts */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500">Total Quota</p>
            <p className="text-2xl font-bold">{quotes.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500">Awaiting</p>
            <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500">accepted</p>
            <p className="text-2xl font-bold text-green-600">{counts.accepted}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{counts.rejected}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500">Expired</p>
            <p className="text-2xl font-bold text-gray-600">{counts.expired}</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl p-4 border">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">search</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Quota #, RFQ #, Title..."
                    className="w-full pl-10 border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All statuses are</option>
                  <option value="pending">Awaiting</option>
                  <option value="accepted">accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* RFQ Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RFQ</label>
                <select
                  value={filters.rfq_id}
                  onChange={(e) => handleFilterChange('rfq_id', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All RFQ</option>
                  {rfqs.map((rfq) => (
                    <option key={rfq.id} value={rfq.id}>
                      {rfq.title} ({rfq.rfq_number})
                    </option>
                  ))}
                </select>
              </div>

              {/* Validity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                <select
                  value={filters.validity}
                  onChange={(e) => handleFilterChange('validity', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  <option value="valid">Valid</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Date Range Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date from</label>
                <input
                  type="date"
                  value={filters.from_date}
                  onChange={(e) => handleFilterChange('from_date', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date up to</label>
                <input
                  type="date"
                  value={filters.to_date}
                  onChange={(e) => handleFilterChange('to_date', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="latest">Last is first</option>
                  <option value="oldest">Old first</option>
                  <option value="amount_high">Amount: More to less</option>
                  <option value="amount_low">Amount: Low to High</option>
                  <option value="valid_until">Expires</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                >
                  Apply Filter
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Quotes List */}
        {quotes.data.length === 0 ? (
          // Empty State - No quotes
          <div className="bg-white rounded-xl p-12 text-center border">
            <FiFileText className="mx-auto text-5xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Quota</h3>
            <p className="text-gray-500 mb-6">When suppliers respond to your RFQ, the quota will show here</p>
            <Link
              href={route('buyer.rfqs.create')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center"
            >
              Create new RFQ
            </Link>
          </div>
        ) : (
          // Quote Items List
          <div className="space-y-4">
            {quotes.data.map((quote) => (
              <div key={quote.id} className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                  {/* Selection Checkbox */}
                  <div className="flex items-start lg:items-center mr-4">
                    <input
                      type="checkbox"
                      checked={selectedQuotes.includes(quote.id)}
                      onChange={() => toggleQuoteSelection(quote.id)}
                      disabled={quote.status !== 'pending' || !isQuoteValid(quote)}
                      className="mt-1 lg:mt-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex items-start mb-3">
                      {getStatusIcon(quote.status)}
                      <div className="ml-2 flex-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <h3 className="font-semibold text-lg text-gray-800">
                            Quote #{quote.quote_number}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quote.status)}`}>
                            {quote.status === 'pending' ? 'Awaiting' :
                              quote.status === 'accepted' ? 'accepted' :
                                quote.status === 'rejected' ? 'Rejected' :
                                  quote.status === 'expired' ? 'Expired' : quote.status}
                          </span>
                          {!isQuoteValid(quote) && quote.status === 'pending' && (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                              Expired
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RFQ Info */}
                    <div className="mb-3">
                      <Link
                        href={route('buyer.rfqs.show', quote.rfq.id)}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        RFQ: {quote.rfq.title} (#{quote.rfq.rfq_number})
                      </Link>
                    </div>

                    {/* Supplier Info */}
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <FiUser className="mr-1" />
                      <span>Supplier: {quote.supplier?.name}</span>
                      {quote.supplier?.supplier?.verification_status === 'verified' && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded">
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Quote Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">total amount</p>
                        <p className="font-bold text-indigo-600">{formatCurrency(quote.total_amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Expires</p>
                        <p className="text-sm flex items-center">
                          <FiCalendar className="mr-1 text-gray-400" />
                          {formatDate(quote.valid_until)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date of receipt</p>
                        <p className="text-sm">{formatDate(quote.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Item</p>
                        <p className="text-sm">{quote.rfq?.products_requested?.length || 0} t product</p>
                      </div>
                    </div>

                    {/* Product Breakdown Preview */}
                    {quote.product_breakdown && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-700 mb-2">Price analysis:</p>
                        <div className="space-y-1">
                          {quote.product_breakdown.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex justify-between text-xs">
                              <span>{item.name} x {item.quantity}</span>
                              <span>{formatCurrency(item.price)}</span>
                            </div>
                          ))}
                          {quote.product_breakdown.length > 2 && (
                            <p className="text-xs text-gray-500">+{quote.product_breakdown.length - 2} more items</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 mt-4 lg:mt-0 lg:ml-6">
                    <Link
                      href={route('buyer.quotes.show', quote.id)}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center justify-center"
                    >
                      <FiEye className="mr-2" />
                      for suppliers See details
                    </Link>

                    {quote.status === 'pending' && isQuoteValid(quote) && (
                      <>
                        <Link
                          href={route('buyer.quotes.accept-confirm', quote.id)}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors inline-flex items-center justify-center"
                        >
                          <FiCheckCircle className="mr-2" />
                          accept
                        </Link>
                        <Link
                          href={route('buyer.quotes.reject-confirm', quote.id)}
                          className="px-4 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors inline-flex items-center justify-center"
                        >
                          <FiXCircle className="mr-2" />
                          Rejection
                        </Link>
                      </>
                    )}

                    <button
                      onClick={() => router.get(route('buyer.quotes.download', quote.id))}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
                    >
                      <FiDownload className="mr-2" />
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}

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
                          .replace('Previous', 'previous')
                          .replace('Next', 'next')
                      }}
                      className={`px-4 py-2 rounded-lg ${link.active
                        ? 'bg-indigo-600 text-white'
                        : link.url
                          ? 'bg-white border hover:bg-gray-50'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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