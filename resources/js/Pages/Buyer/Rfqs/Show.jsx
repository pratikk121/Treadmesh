// resources/js/Pages/Buyer/Rfqs/Show.jsx

// React - Core React imports for component functionality
import React, { useEffect, useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

// Layout - Buyer dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
import {
  FiX,
  FiUser,
  FiSend,
  FiClock,
  FiCheck,
  FiPackage,
  FiArrowLeft,
  FiDollarSign,
  FiShoppingBag,
  FiCheckCircle,
  FiMessageCircle,
} from 'react-icons/fi';

// Sweetalert - For beautiful alert messages
import Swal from 'sweetalert2';

export default function RfqShow({ rfq, messages: initialMessages, acceptedQuote, order }) {
  const { auth } = usePage().props;

  // State management for messages and UI interactions
  const [messages, setMessages] = useState(initialMessages || []);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [processingQuote, setProcessingQuote] = useState(null);

  // Format date - Converts ISO date to readable format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency - Converts number to USD currency format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge color based on status
  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-green-100 text-green-700',
      'closed': 'bg-blue-100 text-blue-700',
      'cancelled': 'bg-red-100 text-red-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'accepted': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  // Send message to supplier
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const receiverId = rfq.quotes?.[0]?.supplier_id;
    if (!receiverId) {
      Swal.fire({
        icon: 'warning',
        title: 'There are no suppliers',
        text: 'Wait for a quote to be reached before sending messages.',
      });
      return;
    }

    setSending(true);

    router.post(route('buyer.messages.send'), {
      rfq_id: rfq.id,
      message: newMessage,
      receiver_id: receiverId,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        router.reload({ only: ['messages'] });
        setNewMessage('');
        setSending(false);
        Swal.fire({
          icon: 'success',
          title: 'Message sent to!',
          timer: 1500,
          showConfirmButton: false
        });
      },
      onError: () => {
        setSending(false);
        Swal.fire({
          icon: 'error',
          title: 'Failed to send message',
          text: 'An error occurred. Please try again.'
        });
      }
    });
  };

  // Real-time message listener using Laravel Echo
  useEffect(() => {
    if (!window.Echo || !auth?.user?.id) return;

    const channel = window.Echo.private(`App.Models.User.${auth.user.id}`)
      .listen('.MessageSent', (payload) => {
        if (payload.rfq_id !== rfq.id) return;
        setMessages((prev) => {
          if (prev.some((m) => m.id === payload.id)) return prev;
          return [...prev, payload];
        });
      });

    return () => {
      if (channel) {
        channel.stopListening('.MessageSent');
      }
    };
  }, [auth?.user?.id, rfq.id]);

  // Accept quote with confirmation
  const acceptQuote = (quote) => {
    Swal.fire({
      icon: 'warning',
      title: 'Accept this quote?',
      text: 'This will reject all other quotess and close the RFQ.',
      showCancelButton: true,
      confirmButtonText: 'Yes, take',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setProcessingQuote(quote.id);
        router.post(route('buyer.rfqs.accept-quote', [rfq.id, quote.id]), {}, {
          onSuccess: () => {
            setProcessingQuote(null);
            Swal.fire({
              icon: 'success',
              title: 'Quote accepted!',
              timer: 1500,
              showConfirmButton: false
            });
          },
          onError: () => {
            setProcessingQuote(null);
            Swal.fire({
              icon: 'error',
              title: 'Failed to accept quote',
              text: 'Please try again.'
            });
          }
        });
      }
    });
  };

  // Reject quote with confirmation
  const rejectQuote = (quote) => {
    Swal.fire({
      icon: 'warning',
      title: 'Reject this quote?',
      text: 'Are you sure you want to decline this quote?',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setProcessingQuote(quote.id);
        router.post(route('buyer.rfqs.reject-quote', [rfq.id, quote.id]), {}, {
          onSuccess: () => {
            setProcessingQuote(null);
            Swal.fire({
              icon: 'success',
              title: 'Quote Rejected!',
              timer: 1500,
              showConfirmButton: false
            });
          },
          onError: () => {
            setProcessingQuote(null);
            Swal.fire({
              icon: 'error',
              title: 'Failed to reject quote',
              text: 'Please try again.'
            });
          }
        });
      }
    });
  };

  return (
    <DashboardLayout>
      <Head title={`RFQ #${rfq.rfq_number}`} />

      <div className="space-y-6">
        {/* Header - Back button, title and action buttons */}
        <div className="flex items-center space-x-4">
          <Link
            href={route('buyer.rfqs.index')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">RFQ Description</h2>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(rfq.status)}`}>
                {rfq.status === 'open' ? 'open' :
                  rfq.status === 'closed' ? 'off' :
                    rfq.status === 'cancelled' ? 'cancel' :
                      rfq.status === 'pending' ? 'Awaiting' : rfq.status}
              </span>
            </div>
            <p className="text-gray-600 mt-1">RFQ #{rfq.rfq_number}</p>
          </div>

          {/* Edit button for open RFQs */}
          {rfq.status === 'open' && (
            <Link
              href={route('buyer.rfqs.edit', rfq.id)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              RFQ editing
            </Link>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - RFQ Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-medium text-gray-700 mb-4">{rfq.title}</h3>

              {rfq.description && (
                <p className="text-gray-600 mb-4">{rfq.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Creation Date</p>
                  <p className="font-medium">{formatDate(rfq.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Required date</p>
                  <p className="font-medium">{formatDate(rfq.required_by_date)}</p>
                </div>
              </div>
            </div>

            {/* Products Requested */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <FiPackage className="mr-2" /> Necessary products
              </h3>

              <div className="space-y-4">
                {rfq.products_requested?.map((product, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.specifications && (
                          <p className="text-sm text-gray-500 mt-1">{product.specifications}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{product.quantity} {product.unit}</p>
                        {product.category && (
                          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded">
                            {product.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quotes Received */}
            {rfq.quotes?.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                  <FiDollarSign className="mr-2" /> Quotes Received ({rfq.quotes.length})
                </h3>

                <div className="space-y-4">
                  {rfq.quotes.map((quote) => (
                    <div key={quote.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center">
                            <FiUser className="text-gray-400 mr-2" />
                            <p className="font-medium">{quote.supplier?.name}</p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Quote #{quote.quote_number}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quote.status)}`}>
                          {quote.status === 'pending' ? 'Awaiting' :
                            quote.status === 'accepted' ? 'accepted' :
                              quote.status === 'rejected' ? 'Rejected' : quote.status}
                        </span>
                      </div>

                      {/* Quote Details */}
                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-gray-500">total amount</p>
                          <p className="font-bold text-indigo-600">{formatCurrency(quote.total_amount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Expires</p>
                          <p className="font-medium">{formatDate(quote.valid_until)}</p>
                        </div>
                      </div>

                      {/* Product Breakdown */}
                      {quote.product_breakdown && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-700 mb-2">Price analysis:</p>
                          {quote.product_breakdown.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs mb-1">
                              <span>{item.name} x {item.quantity}</span>
                              <span>{formatCurrency(item.price)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quote Actions */}
                      {rfq.status === 'open' && quote.status === 'pending' && (
                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() => acceptQuote(quote)}
                            disabled={processingQuote === quote.id}
                            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                          >
                            {processingQuote === quote.id ? (
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <>
                                <FiCheck className="mr-1" /> Accept Quote
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => rejectQuote(quote)}
                            disabled={processingQuote === quote.id}
                            className="flex-1 px-3 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center justify-center"
                          >
                            <FiX className="mr-1" /> Rejection
                          </button>
                        </div>
                      )}

                      {/* Accepted Quote Actions */}
                      {acceptedQuote && acceptedQuote.id === quote.id && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700 flex items-center">
                            <FiCheckCircle className="mr-2" /> This quote has been accepted
                          </p>
                          {!order ? (
                            <Link
                              href={route('buyer.orders.create-from-rfq', [rfq.id, quote.id])}
                              className="mt-2 inline-block px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                            >
                              Go to order
                            </Link>
                          ) : (
                            <Link
                              href={route('buyer.orders.show', order.id)}
                              className="mt-2 inline-block px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                            >
                              View order
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Information - if exists */}
            {order && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                  <FiShoppingBag className="mr-2" /> Order Information
                </h3>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order.order_number}</p>
                      <p className="text-sm text-gray-600 mt-1">Status: {order.order_status === 'pending_confirmation' ? 'Awaiting' :
                        order.order_status === 'confirmed' ? 'sure' :
                          order.order_status === 'processing' ? 'In process' :
                            order.order_status === 'shipped' ? 'Sent' :
                              order.order_status === 'delivered' ? 'Delivered' :
                                order.order_status === 'cancelled' ? 'cancel' : order.order_status}</p>
                      <p className="text-sm text-gray-600">total: {formatCurrency(order.total_amount)}</p>
                    </div>
                    <Link
                      href={route('buyer.orders.show', order.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      View order
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Messages & Timeline */}
          <div className="space-y-6">
            {/* Messages Section */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <FiMessageCircle className="mr-2" /> Message
              </h3>

              {/* Message List */}
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No message</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${message.sender_id === auth.user.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${message.sender_id === auth.user.id ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write Message..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={rfq.status === 'cancelled'}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim() || rfq.status === 'cancelled'}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <FiSend />
                </button>
              </form>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <FiClock className="mr-2" /> Timeline
              </h3>

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 mt-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Submit RFQd by</p>
                    <p className="text-xs text-gray-500">{formatDate(rfq.created_at)}</p>
                  </div>
                </div>

                {rfq.quotes?.map((quote) => (
                  <div key={quote.id} className="flex items-start">
                    <div className={`w-2 h-2 mt-2 ${quote.status === 'accepted' ? 'bg-green-500' :
                      quote.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                      } rounded-full mr-3`}></div>
                    <div>
                      <p className="text-sm font-medium">{quote.supplier?.name} Quotes Received from</p>
                      <p className="text-xs text-gray-500">{formatDate(quote.created_at)}</p>
                      <p className="text-xs text-gray-600 mt-1">Amount: {formatCurrency(quote.total_amount)}</p>
                    </div>
                  </div>
                ))}

                {acceptedQuote && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">Quote Accepted</p>
                      <p className="text-xs text-gray-500">{formatDate(acceptedQuote.updated_at)}</p>
                    </div>
                  </div>
                )}

                {order && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 bg-purple-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">Order creation</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}