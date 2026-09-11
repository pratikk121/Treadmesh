// resources/js/Pages/Buyer/Rfqs/Show.jsx

import React, { useEffect, useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatCurrency,
  formatIndianDate,
  formatRfqStatus,
  formatQuoteStatus,
  formatOrderStatus
} from '@/Utils/formatters';
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
  FiCalendar,
  FiFileText,
  FiEdit2,
  FiShield
} from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function RfqShow({ rfq, messages: initialMessages, acceptedQuote, order }) {
  const { auth } = usePage().props;

  const [messages, setMessages] = useState(initialMessages || []);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [processingQuote, setProcessingQuote] = useState(null);

  const getRfqStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Tender
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <FiCheckCircle className="w-3 h-3 text-slate-500" />
            Closed / Awarded
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <FiX className="w-3 h-3 text-rose-500" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            {formatRfqStatus(status)}
          </span>
        );
    }
  };

  const getQuoteBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FiCheckCircle className="w-3 h-3" />
            Accepted (Awarded)
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <FiX className="w-3 h-3" />
            Bid Declined
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <FiClock className="w-3 h-3" />
            Under Evaluation
          </span>
        );
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const receiverId = rfq.quotes?.[0]?.supplier_id;
    if (!receiverId) {
      Swal.fire({
        icon: 'warning',
        title: 'No Supplier Available',
        text: 'Wait for a quotation to be submitted before sending messages.',
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
          title: 'Message Sent',
          timer: 1500,
          showConfirmButton: false
        });
      },
      onError: () => {
        setSending(false);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Send',
          text: 'An error occurred while sending message. Please try again.'
        });
      }
    });
  };

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

  const acceptQuote = (quote) => {
    Swal.fire({
      icon: 'warning',
      title: 'Accept Quotation & Award Tender?',
      text: `Are you sure you want to accept Quote #${quote.quote_number} for ${formatCurrency(quote.total_amount)}? This will reject other quotes and transition this RFQ into a Purchase Order.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Accept & Award',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#16a34a',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setProcessingQuote(quote.id);
        router.post(route('buyer.rfqs.accept-quote', [rfq.id, quote.id]), {}, {
          onSuccess: () => {
            setProcessingQuote(null);
            Swal.fire({
              icon: 'success',
              title: 'Quotation Accepted!',
              text: 'The tender has been awarded. You may now generate the Purchase Order.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          onError: () => {
            setProcessingQuote(null);
            Swal.fire({
              icon: 'error',
              title: 'Acceptance Failed',
              text: 'Unable to accept quotation at this time. Please retry.'
            });
          }
        });
      }
    });
  };

  const rejectQuote = (quote) => {
    Swal.fire({
      icon: 'warning',
      title: 'Decline Quotation?',
      text: `Are you sure you want to decline Quote #${quote.quote_number}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Decline Bid',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setProcessingQuote(quote.id);
        router.post(route('buyer.rfqs.reject-quote', [rfq.id, quote.id]), {}, {
          onSuccess: () => {
            setProcessingQuote(null);
            Swal.fire({
              icon: 'success',
              title: 'Quotation Declined',
              timer: 1500,
              showConfirmButton: false
            });
          },
          onError: () => {
            setProcessingQuote(null);
            Swal.fire({
              icon: 'error',
              title: 'Action Failed',
              text: 'Unable to decline quotation. Please try again.'
            });
          }
        });
      }
    });
  };

  return (
    <DashboardLayout>
      <Head title={`RFQ #${rfq.rfq_number} - ${rfq.title}`} />

      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-4">
            <Link
              href={route('buyer.rfqs.index')}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="Back to RFQ List"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  RFQ #{rfq.rfq_number}
                </span>
                {getRfqStatusBadge(rfq.status)}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {rfq.title}
              </h1>
            </div>
          </div>

          {rfq.status === 'open' && (
            <Link
              href={route('buyer.rfqs.edit', rfq.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <FiEdit2 className="w-3.5 h-3.5" />
              Edit Tender
            </Link>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Center 2 Cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tender Scope */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FiFileText className="w-4 h-4 text-indigo-600" />
                Procurement Scope & Specifications
              </h2>

              {rfq.description ? (
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                  {rfq.description}
                </p>
              ) : (
                <p className="text-sm italic text-slate-400">No additional tender narrative specified.</p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block">Published Date</span>
                  <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                    {formatIndianDate(rfq.created_at)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Required Delivery Date</span>
                  <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                    {formatIndianDate(rfq.required_by_date)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Bidding Status</span>
                  <span className="font-semibold text-emerald-700 mt-0.5 block">
                    {formatRfqStatus(rfq.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bill of Quantities (BOQ) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FiPackage className="w-4 h-4 text-indigo-600" />
                  Bill of Quantities (BOQ)
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {rfq.products_requested?.length || 0} Line Items
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {rfq.products_requested?.map((product, index) => (
                  <div key={index} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 text-sm">{product.name}</p>
                      {product.specifications && (
                        <p className="text-xs text-slate-500">{product.specifications}</p>
                      )}
                      {product.category && (
                        <span className="inline-block text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">
                          {product.category}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-extrabold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 block">
                        {product.quantity} {product.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Received Quotations */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4 text-emerald-600" />
                  Commercial Quotations Received ({rfq.quotes?.length || 0})
                </h2>
                {rfq.quotes?.length > 1 && (
                  <Link
                    href={route('buyer.quotes.compare', { quote_ids: rfq.quotes.map(q => q.id) })}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Compare All Quotes →
                  </Link>
                )}
              </div>

              {(!rfq.quotes || rfq.quotes.length === 0) ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <FiClock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Awaiting Supplier Quotes</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Verified suppliers matching your product category have been notified and will submit commercial quotations shortly.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rfq.quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all bg-white shadow-2xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <FiUser className="w-4 h-4 text-slate-400" />
                            <h3 className="font-bold text-slate-900 text-sm">
                              {quote.supplier?.name}
                            </h3>
                            {quote.supplier?.supplier?.business_name && (
                              <span className="text-xs text-slate-500">
                                ({quote.supplier.supplier.business_name})
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-slate-400 mt-0.5 block">
                            Quote Ref: #{quote.quote_number}
                          </span>
                        </div>
                        <div>
                          {getQuoteBadge(quote.status)}
                        </div>
                      </div>

                      {/* Financials & Validity */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-500 block">Total Commercial Bid</span>
                          <span className="text-base font-extrabold text-indigo-600 font-mono mt-0.5 block">
                            {formatCurrency(quote.total_amount)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Quote Validity</span>
                          <span className="font-semibold text-slate-700 font-mono mt-0.5 block">
                            Until {formatIndianDate(quote.valid_until)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Submission Date</span>
                          <span className="font-semibold text-slate-700 font-mono mt-0.5 block">
                            {formatIndianDate(quote.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Product Breakdown */}
                      {quote.product_breakdown && quote.product_breakdown.length > 0 && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Itemized Pricing Breakdown:
                          </p>
                          <div className="divide-y divide-slate-200/60 text-xs">
                            {quote.product_breakdown.map((item, idx) => (
                              <div key={idx} className="py-1.5 first:pt-0 last:pb-0 flex justify-between">
                                <span className="text-slate-700">
                                  {item.name} <span className="text-slate-400">× {item.quantity}</span>
                                </span>
                                <span className="font-bold text-slate-900 font-mono">
                                  {formatCurrency(item.price)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {rfq.status === 'open' && quote.status === 'pending' && (
                        <div className="flex gap-2.5 pt-2">
                          <button
                            onClick={() => acceptQuote(quote)}
                            disabled={processingQuote === quote.id}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
                          >
                            <FiCheck className="w-3.5 h-3.5" />
                            Accept & Issue PO
                          </button>
                          <button
                            onClick={() => rejectQuote(quote)}
                            disabled={processingQuote === quote.id}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                          >
                            <FiX className="w-3.5 h-3.5" />
                            Decline
                          </button>
                        </div>
                      )}

                      {acceptedQuote && acceptedQuote.id === quote.id && (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Awarded Tender Winner</span>
                          </div>
                          {!order ? (
                            <Link
                              href={route('buyer.orders.create-from-rfq', [rfq.id, quote.id])}
                              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              Create Purchase Order (PO) →
                            </Link>
                          ) : (
                            <Link
                              href={route('buyer.orders.show', order.id)}
                              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              View Purchase Order #{order.order_number} →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary banner if PO exists */}
            {order && (
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-mono tracking-wider text-indigo-300">
                    Active Purchase Order
                  </span>
                  <h3 className="text-lg font-bold">
                    PO #{order.order_number} — {formatOrderStatus(order.order_status)}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Commercial Value: <strong className="text-white font-mono">{formatCurrency(order.total_amount)}</strong>
                  </p>
                </div>
                <Link
                  href={route('buyer.orders.show', order.id)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
                >
                  Manage Order & Escrow →
                </Link>
              </div>
            )}
          </div>

          {/* Right Column - Messages & Timeline */}
          <div className="space-y-6">
            {/* Direct Procurement Messages */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FiMessageCircle className="w-4 h-4 text-indigo-600" />
                Vendor Direct Desk
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {messages.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                    No procurement communication yet.
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMe = message.sender_id === auth.user.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1 ${
                            isMe
                              ? 'bg-slate-900 text-white rounded-tr-xs'
                              : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                          }`}
                        >
                          <p className="leading-relaxed">{message.message}</p>
                          <span className={`text-[10px] block ${isMe ? 'text-slate-400 text-right' : 'text-slate-500'}`}>
                            {formatIndianDate(message.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={sendMessage} className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send specification clarification..."
                  className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={rfq.status === 'cancelled'}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim() || rfq.status === 'cancelled'}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50"
                  title="Send Message"
                >
                  <FiSend className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Audit Trail & Milestones */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FiClock className="w-4 h-4 text-slate-400" />
                Tender Milestones & Audit Trail
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                  <div>
                    <p className="font-bold text-slate-800">Tender Published to Network</p>
                    <p className="text-slate-500 font-mono text-[11px]">{formatIndianDate(rfq.created_at)}</p>
                  </div>
                </div>

                {rfq.quotes?.map((quote) => (
                  <div key={quote.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                      quote.status === 'accepted' ? 'bg-emerald-500' :
                      quote.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                    }`}></div>
                    <div>
                      <p className="font-bold text-slate-800">
                        Bid Submitted: {quote.supplier?.name}
                      </p>
                      <p className="text-slate-500 font-mono text-[11px]">
                        {formatIndianDate(quote.created_at)} · {formatCurrency(quote.total_amount)}
                      </p>
                    </div>
                  </div>
                ))}

                {acceptedQuote && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-600 shrink-0"></div>
                    <div>
                      <p className="font-bold text-indigo-700">Tender Awarded to {acceptedQuote.supplier?.name}</p>
                      <p className="text-slate-500 font-mono text-[11px]">{formatIndianDate(acceptedQuote.updated_at)}</p>
                    </div>
                  </div>
                )}

                {order && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-purple-600 shrink-0"></div>
                    <div>
                      <p className="font-bold text-purple-700">Purchase Order Generated (#{order.order_number})</p>
                      <p className="text-slate-500 font-mono text-[11px]">{formatIndianDate(order.created_at)}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5 text-[11px] text-slate-500">
                <FiShield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Encrypted under Indian Procurement & IT Act compliance standards.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}