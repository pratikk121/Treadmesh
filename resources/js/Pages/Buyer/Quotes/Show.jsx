// Pages/Buyer/Quotes/Show.jsx

// React - Core React imports for component functionality
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Buyer dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
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
  FiShoppingBag
} from 'react-icons/fi';

export default function QuoteShow({ quote, isExpired, otherQuotes, existingOrder, productBreakdown }) {

  // Format currency - Converts number to USD currency format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date - Converts ISO date to readable format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge color based on quote status
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'accepted': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <DashboardLayout>
      <Head title={`Quote #${quote.quote_number}`} />

      <div className="space-y-6">
        {/* Header - Back button, title and action buttons */}
        <div className="flex items-center space-x-4">
          <Link
            href={route('buyer.quotes.index')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">Quote Details</h2>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(quote.status)}`}>
                {quote.status === 'pending' ? 'Awaiting' :
                  quote.status === 'accepted' ? 'accepted' :
                    quote.status === 'rejected' ? 'Rejected' : quote.status}
              </span>
              {isExpired && quote.status === 'pending' && (
                <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
                  Expired
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">Quote #{quote.quote_number}</p>
          </div>

          {/* Action Buttons - Context sensitive */}
          <div className="flex space-x-2">
            {quote.status === 'pending' && !isExpired && (
              <>
                <Link
                  href={route('buyer.quotes.accept-confirm', quote.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <FiCheckCircle className="mr-2" />
                  Accept Quote
                </Link>
                <Link
                  href={route('buyer.quotes.reject-confirm', quote.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <FiXCircle className="mr-2" />
                  Reject Quote
                </Link>
              </>
            )}
            <button
              onClick={() => router.get(route('buyer.quotes.download', quote.id))}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
              <FiDownload className="mr-2" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Warning for Expired Quote */}
        {isExpired && quote.status === 'pending' && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <FiAlertCircle className="text-red-600 mr-3" />
              <div>
                <p className="text-red-700 font-medium">Quote Expired</p>
                <p className="text-red-600 text-sm mt-1">
                  This quote is {formatDate(quote.valid_until)} Expired on and can no longer be accepted.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message for Accepted Quote */}
        {quote.status === 'accepted' && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <FiCheckCircle className="text-green-600 mr-3" />
              <div className="flex-1">
                <p className="text-green-700 font-medium">Quote Accepted</p>
                <p className="text-green-600 text-sm mt-1">
                  You are this quote {formatDate(quote.accepted_at)} Received on.
                </p>
                {!existingOrder && (
                  <Link
                    href={route('buyer.orders.confirm', [quote.rfq_id, quote.id])}
                    className="mt-2 inline-block px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    Go to order
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quote Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quote Information */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <FiFileText className="mr-2" /> Quote Information
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Quote Number</p>
                  <p className="font-medium">{quote.quote_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">RFQ Number</p>
                  <Link
                    href={route('buyer.rfqs.show', quote.rfq_id)}
                    className="font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    {quote.rfq?.rfq_number}
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expires</p>
                  <p className="font-medium flex items-center">
                    <FiCalendar className="mr-2 text-gray-400" />
                    {formatDate(quote.valid_until)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submission Date</p>
                  <p className="font-medium">{formatDate(quote.created_at)}</p>
                </div>
              </div>

              {/* RFQ Title */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">RFQ Title</p>
                <p className="font-medium">{quote.rfq?.title}</p>
              </div>

              {/* Acceptance Notes - Only if quote is accepted with notes */}
              {quote.acceptance_notes && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">Note taking</p>
                  <p className="text-sm p-3 bg-green-50 rounded-lg">{quote.acceptance_notes}</p>
                </div>
              )}

              {/* Rejection Reason - Only if quote is rejected */}
              {quote.rejection_reason && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">Reason for rejection</p>
                  <p className="text-sm p-3 bg-red-50 rounded-lg">{quote.rejection_reason}</p>
                </div>
              )}
            </div>

            {/* Product Breakdown */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <FiPackage className="mr-2" /> Price analysis
              </h3>

              <div className="space-y-4">
                {productBreakdown?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Amount: {item.quantity}</p>
                      {item.specifications && (
                        <p className="text-xs text-gray-400 mt-1">{item.specifications}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price)}</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.price / item.quantity)} to generate volume discounts per unit
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <span className="font-medium text-gray-700">total amount</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(quote.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Supplier Info & Other Quotes */}
          <div className="space-y-6">
            {/* Supplier Information */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <FiUser className="mr-2" /> Supplier Information
              </h3>

              <div className="space-y-3">
                <p className="font-medium text-lg">{quote.supplier?.name}</p>

                {quote.supplier?.supplier && (
                  <>
                    <p className="text-sm text-gray-600">{quote.supplier.supplier.company_name}</p>
                    <p className="text-sm text-gray-600">{quote.supplier.supplier.company_email}</p>
                    <p className="text-sm text-gray-600">{quote.supplier.supplier.company_phone}</p>
                    <p className="text-sm text-gray-600">{quote.supplier.supplier.company_address}</p>
                  </>
                )}

                {quote.supplier?.supplier?.verification_status === 'verified' && (
                  <div className="mt-2 flex items-center text-green-600">
                    <FiCheckCircle className="mr-2" />
                    <span className="text-sm">Verified Suppliers</span>
                  </div>
                )}

                <Link
                  href={route('buyer.suppliers.show', quote.supplier_id)}
                  className="mt-3 inline-block text-sm text-indigo-600 hover:text-indigo-800"
                >
                  View Supplier Profile →
                </Link>
              </div>
            </div>

            {/* Other Quotes for Same RFQ */}
            {otherQuotes.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                  <FiBarChart2 className="mr-2" /> Other Quotes ({otherQuotes.length})
                </h3>

                <div className="space-y-3">
                  {otherQuotes.map((otherQuote) => (
                    <div key={otherQuote.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{otherQuote.supplier?.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatCurrency(otherQuote.total_amount)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(otherQuote.status)}`}>
                          {otherQuote.status === 'pending' ? 'Awaiting' :
                            otherQuote.status === 'accepted' ? 'accepted' :
                              otherQuote.status === 'rejected' ? 'Rejected' : otherQuote.status}
                        </span>
                      </div>
                      <Link
                        href={route('buyer.quotes.show', otherQuote.id)}
                        className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 inline-block"
                      >
                        View Quote →
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Compare Button - Only if there are other quotes */}
                {otherQuotes.length >= 1 && quote.status === 'pending' && (
                  <Link
                    href={route('buyer.quotes.compare', { quote_ids: [quote.id, ...otherQuotes.slice(0, 1).map(q => q.id)] })}
                    className="mt-4 block text-center px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm"
                  >
                    Compare Quotes
                  </Link>
                )}
              </div>
            )}

            {/* Existing Order - If an order was created from this quote */}
            {existingOrder && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                  <FiShoppingBag className="mr-2" /> Order created
                </h3>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium">Order #{existingOrder.order_number}</p>
                  <p className="text-sm text-gray-600 mt-1">Status: {existingOrder.order_status === 'pending_confirmation' ? 'Awaiting' :
                    existingOrder.order_status === 'confirmed' ? 'sure' :
                      existingOrder.order_status === 'processing' ? 'In process' :
                        existingOrder.order_status === 'shipped' ? 'Sent' :
                          existingOrder.order_status === 'delivered' ? 'Delivered' :
                            existingOrder.order_status === 'cancelled' ? 'cancel' : existingOrder.order_status}</p>
                  <p className="text-sm text-gray-600">total: {formatCurrency(existingOrder.total_amount)}</p>
                  <Link
                    href={route('buyer.orders.show', existingOrder.id)}
                    className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    View order
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}