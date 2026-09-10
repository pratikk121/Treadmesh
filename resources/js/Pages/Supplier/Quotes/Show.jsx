// Pages/Supplier/Quotes/Show.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Supplier dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
import {
  FiArrowLeft,
  FiEdit2,
  FiCopy,
  FiXCircle,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiUser,
  FiMail,
  FiPhone,
  FiPackage,
  FiMessageSquare,
  FiSend,
  FiAlertCircle,
} from 'react-icons/fi';
import { MdPending } from 'react-icons/md';

// sweetalert - For beautiful alert messages
import Swal from 'sweetalert2';

export default function QuoteShow({
  quote,
  buyer,
  messages,
  isExpired,
  otherQuotes,
}) {
  // State management for modals and form inputs
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newValidUntil, setNewValidUntil] = useState('');
  const [withdrawReason, setWithdrawReason] = useState('');
  const [extensionReason, setExtensionReason] = useState('');
  const [showExtendValidity, setShowExtendValidity] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  // Format currency - Converts number to USD currency format
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date - Converts ISO date to readable format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format date with time
  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge based on quote status
  const getStatusBadge = () => {
    if (isExpired) {
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: FiClock,
        label: 'Expired'
      };
    }

    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: MdPending, label: 'Awaiting' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle, label: 'accepted' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle, label: 'Rejected' },
      withdrawn: { bg: 'bg-gray-100', text: 'text-gray-800', icon: FiXCircle, label: 'Withdraw' }
    };
    return badges[quote.status] || badges.pending;
  };

  const badge = getStatusBadge();
  const StatusIcon = badge.icon;

  // Handle quote withdrawal
  const handleWithdraw = () => {
    if (!withdrawReason.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Reason is necessary",
        text: "Please provide reason for withdrawal"
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "This quote will be withdrawn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, withdraw",
      cancelButtonText: "No",
      confirmButtonColor: "#dc2626"
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route("supplier.quotes.withdraw", quote.id), {
          withdrawal_reason: withdrawReason
        }, {
          onSuccess: () => {
            setShowWithdrawConfirm(false);
            setWithdrawReason("");

            Swal.fire({
              icon: "success",
              title: 'Success',
              text: "Quote successfully withdrawn"
            });
          }
        });
      }
    });
  };

  // Handle validity extension
  const handleExtendValidity = () => {
    if (!newValidUntil) {
      Swal.fire({
        icon: "warning",
        title: "Date required",
        text: "Please select a new expiration date"
      });
      return;
    }

    Swal.fire({
      title: "Extend Quote Validity?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, increase",
      cancelButtonText: "No",
      confirmButtonColor: "#16a34a"
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route("supplier.quotes.extend-validity", quote.id), {
          new_valid_until: newValidUntil,
          extension_reason: extensionReason
        }, {
          onSuccess: () => {
            setShowExtendValidity(false);
            setNewValidUntil("");
            setExtensionReason("");

            Swal.fire({
              icon: "success",
              title: 'Success',
              text: "Quote validity has been extended"
            });
          }
        });
      }
    });
  };
  // Handle quote duplication
  const handleDuplicate = () => {
    Swal.fire({
      title: "Create a Copy?",
      text: "A duplicate of this quote will be created",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, make it",
      cancelButtonText: "No",
      confirmButtonColor: "#16a34a"
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route("supplier.quotes.duplicate", quote.id), {}, {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: 'Success',
              text: "A duplicate of the quote has been created"
            });
          }
        });
      }
    });
  };

  // Handle sending message to buyer
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    router.post(route('supplier.messages.store'), {
      receiver_id: buyer.id,
      rfq_id: quote.rfq_id,
      message: newMessage
    }, {
      onSuccess: () => {
        setNewMessage('');
        setSending(false);
      },
      onError: () => setSending(false)
    });
  };

  // Check if quote is pending and not expired
  const isPending = quote.status === 'pending' && !isExpired;

  return (
    <DashboardLayout>
      <Head title={`Quote #${quote.quote_number}`} />

      <div className="space-y-6">
        {/* Header - Back button, title and action buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={route('supplier.quotes.index')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Quote #{quote.quote_number}</h1>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
                  <StatusIcon className="w-4 h-4" />
                  {badge.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {formatDateTime(quote.created_at)} Date Submitted
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {isPending && (
              <>
                <Link
                  href={route('supplier.quotes.edit', quote.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <FiEdit2 className="w-4 h-4" />
                  <span>Edit Quote</span>
                </Link>
                <button
                  onClick={() => setShowWithdrawConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <FiXCircle className="w-4 h-4" />
                  <span>Withdraw</span>
                </button>
              </>
            )}
            <button
              onClick={handleDuplicate}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
            >
              <FiCopy className="w-4 h-4" />
              <span>Duplicate</span>
            </button>
          </div>
        </div>

        {/* Expired Alert */}
        {isExpired && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-start">
              <FiAlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">
                  This quote has expired
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Expired on {formatDate(quote.valid_until)}.
                  {isPending && (
                    <button
                      onClick={() => setShowExtendValidity(true)}
                      className="ml-2 font-medium underline hover:text-red-700"
                    >
                      Extend →
                    </button>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Accepted Alert - When quote is accepted and order created */}
        {quote.status === 'accepted' && quote.order && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
            <div className="flex items-start">
              <FiCheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-green-700 font-medium">
                  Quote Accepted!
                </p>
                <p className="text-sm text-green-600 mt-1">
                  An order has been created.
                  <Link href={route('supplier.orders.show', quote.order.id)} className="ml-2 font-medium underline">
                    Order #{quote.order.order_number} See →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quote Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quote Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Quote Items</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {quote.product_breakdown.map((item, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <FiPackage className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div>
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="font-medium">{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Unit price is</p>
                            <p className="font-medium">{formatCurrency(item.unit_price)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">total</p>
                            <p className="font-bold text-indigo-600">{formatCurrency(item.total_price)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Quote Amount</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(quote.total_amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Conditions</h2>
              <div className="space-y-4">
                {quote.delivery_estimate && (
                  <div>
                    <p className="text-sm text-gray-500">Delivery time</p>
                    <p className="font-medium text-gray-900">{quote.delivery_estimate}</p>
                  </div>
                )}
                {quote.payment_terms && (
                  <div>
                    <p className="text-sm text-gray-500">Payment Terms</p>
                    <p className="font-medium text-gray-900">{quote.payment_terms}</p>
                  </div>
                )}
                {quote.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Additional Notes</p>
                    <p className="text-gray-700 whitespace-pre-line">{quote.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FiMessageSquare className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Message</h2>
                    <p className="text-sm text-gray-500">Contact Buyer</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Message List */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === quote.supplier_id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-lg rounded-lg p-4 ${message.sender_id === quote.supplier_id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                          }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${message.sender_id === quote.supplier_id
                          ? 'text-indigo-200'
                          : 'text-gray-500'
                          }`}>
                          {formatDateTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {messages.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No messages yet. Start a conversation with the buyer.
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <FiSend className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="space-y-6">
            {/* RFQ Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">RFQ Description</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">RFQ Number</p>
                  <Link
                    href={route('supplier.rfqs.show', quote.rfq.id)}
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    {quote.rfq?.rfq_number}
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="font-medium text-gray-900">{quote.rfq?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Required date</p>
                  <p className="font-medium text-gray-900">{formatDate(quote.rfq?.required_by_date)}</p>
                </div>
              </div>
            </div>

            {/* Buyer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Buyer information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiUser className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">name</p>
                    <p className="font-medium text-gray-900">{buyer.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${buyer.email}`} className="font-medium text-indigo-600 hover:text-indigo-700">
                      {buyer.email}
                    </a>
                  </div>
                </div>
                {buyer.phone && (
                  <div className="flex items-start gap-3">
                    <FiPhone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{buyer.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quote Validity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Validity Period</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Expires</p>
                  <div className="flex items-center gap-2 mt-1">
                    <FiCalendar className="w-4 h-4 text-gray-400" />
                    <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatDate(quote.valid_until)}
                    </span>
                  </div>
                </div>

                {isPending && (
                  <button
                    onClick={() => setShowExtendValidity(true)}
                    className="w-full mt-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                  >
                    Extend
                  </button>
                )}
              </div>
            </div>

            {/* Other Quotes Comparison */}
            {otherQuotes.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Other Quotes</h2>
                <p className="text-sm text-gray-500 mb-3">
                   {otherQuotes.length} other quotes
                </p>
                <div className="space-y-3">
                  {otherQuotes.map((otherQuote) => (
                    <div key={otherQuote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {otherQuote.supplier?.supplier?.company_name || 'Other suppliers'}
                        </p>
                        <p className="text-xs text-gray-500">Quote #{otherQuote.quote_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600">{formatCurrency(otherQuote.total_amount)}</p>
                        <p className={`text-xs ${otherQuote.total_amount < quote.total_amount
                          ? 'text-green-600'
                          : otherQuote.total_amount > quote.total_amount
                            ? 'text-red-600'
                            : 'text-gray-500'
                          }`}>
                          {otherQuote.total_amount < quote.total_amount
                            ? 'less than you'
                            : otherQuote.total_amount > quote.total_amount
                              ? 'More than you'
                              : 'equal to you'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Withdraw Confirmation Modal */}
        {showWithdrawConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Quote</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to withdraw this quote? This action cannot be undone.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for withdrawal <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={withdrawReason}
                  onChange={(e) => setWithdrawReason(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Explain why you are withdrawing this quote..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleWithdraw}
                  disabled={!withdrawReason}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Withdrawal confirmed
                </button>
                <button
                  onClick={() => {
                    setShowWithdrawConfirm(false);
                    setWithdrawReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Extend Validity Modal */}
        {showExtendValidity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Extend the quote period</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newValidUntil}
                    onChange={(e) => setNewValidUntil(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Increase factor
                  </label>
                  <textarea
                    value={extensionReason}
                    onChange={(e) => setExtensionReason(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Optional: Explain why you are extending..."
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleExtendValidity}
                  disabled={!newValidUntil}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Extend
                </button>
                <button
                  onClick={() => {
                    setShowExtendValidity(false);
                    setNewValidUntil('');
                    setExtensionReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}