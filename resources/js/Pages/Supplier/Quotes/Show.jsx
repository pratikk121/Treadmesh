// resources/js/Pages/Supplier/Quotes/Show.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatCurrency,
  formatIndianDate,
  formatQuoteStatus
} from '@/Utils/formatters';
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
  FiLayers,
  FiShield,
  FiShoppingBag,
  FiTrendingDown,
  FiTrendingUp
} from 'react-icons/fi';
import { MdPending } from 'react-icons/md';
import Swal from 'sweetalert2';

export default function QuoteShow({
  quote,
  buyer,
  messages,
  isExpired,
  otherQuotes,
}) {
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newValidUntil, setNewValidUntil] = useState('');
  const [withdrawReason, setWithdrawReason] = useState('');
  const [extensionReason, setExtensionReason] = useState('');
  const [showExtendValidity, setShowExtendValidity] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  const getStatusBadge = () => {
    if (isExpired) {
      return {
        bg: 'bg-slate-100 border-slate-200',
        text: 'text-slate-700',
        icon: FiClock,
        label: 'Validity Expired'
      };
    }

    const badges = {
      pending: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: MdPending, label: 'Under Buyer Review' },
      accepted: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: FiCheckCircle, label: 'Accepted & Awarded' },
      rejected: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', icon: FiXCircle, label: 'Bid Declined' },
      withdrawn: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', icon: FiXCircle, label: 'Withdrawn by Vendor' }
    };
    return badges[quote.status] || badges.pending;
  };

  const badge = getStatusBadge();
  const StatusIcon = badge.icon;

  const handleWithdraw = () => {
    if (!withdrawReason.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Reason Required",
        text: "Please specify why you are withdrawing this quotation proposal."
      });
      return;
    }

    Swal.fire({
      title: "Confirm Quotation Withdrawal?",
      text: "This quotation will be retracted from the buyer's tender portal. This action cannot be reversed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Withdraw Quote",
      cancelButtonText: "Cancel",
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
              title: 'Quotation Withdrawn',
              text: "Proposal has been removed from buyer evaluation.",
              timer: 1800,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  const handleExtendValidity = () => {
    if (!newValidUntil) {
      Swal.fire({
        icon: "warning",
        title: "Date Required",
        text: "Please select a new expiration date."
      });
      return;
    }

    Swal.fire({
      title: "Extend Quotation Validity?",
      text: `Extend price validity until ${formatIndianDate(newValidUntil)}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Extend Validity",
      cancelButtonText: "Cancel",
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
              title: 'Validity Extended',
              text: "The buyer has been notified of the extended validity.",
              timer: 1800,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  const handleDuplicate = () => {
    Swal.fire({
      title: "Duplicate Quotation?",
      text: "A new draft quotation will be created based on these line items.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Duplicate",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a"
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route("supplier.quotes.duplicate", quote.id), {}, {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: 'Quotation Duplicated',
              timer: 1800,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

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

  const isPending = quote.status === 'pending' && !isExpired;

  return (
    <DashboardLayout>
      <Head title={`Quote #${quote.quote_number} - ${quote.rfq?.title}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-4">
            <Link
              href={route('supplier.quotes.index')}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="Back to Quotations"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  Quote #{quote.quote_number}
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {badge.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Submitted on {formatIndianDate(quote.created_at)} · Tender: <strong className="text-slate-800">{quote.rfq?.title}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isPending && (
              <>
                <Link
                  href={route('supplier.quotes.edit', quote.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <FiEdit2 className="w-3.5 h-3.5" />
                  Revise Bid
                </Link>
                <button
                  onClick={() => setShowWithdrawConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-colors"
                >
                  <FiXCircle className="w-3.5 h-3.5" />
                  Withdraw Bid
                </button>
              </>
            )}
            <button
              onClick={handleDuplicate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              <FiCopy className="w-3.5 h-3.5" />
              Duplicate
            </button>
          </div>
        </div>

        {/* Expired Warning */}
        {isExpired && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">Quotation Validity Expired</p>
                <p className="text-amber-700 mt-0.5">
                  The commercial validity of this quote expired on {formatIndianDate(quote.valid_until)}. You may extend the price guarantee to keep this proposal active for buyer selection.
                </p>
              </div>
            </div>
            {isPending && (
              <button
                onClick={() => setShowExtendValidity(true)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
              >
                Extend Validity →
              </button>
            )}
          </div>
        )}

        {/* Order Converted Banner */}
        {quote.status === 'accepted' && quote.order && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-emerald-900">Quotation Awarded & Converted to Purchase Order</p>
                <p className="text-emerald-700 mt-0.5">
                  The buyer has generated formal Purchase Order #{quote.order.order_number}.
                </p>
              </div>
            </div>
            <Link
              href={route('supplier.orders.show', quote.order.id)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              View Purchase Order →
            </Link>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Scope & Price Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quotation Line Items */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FiPackage className="w-4 h-4 text-indigo-600" />
                  Itemized Quotation Line Items
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {quote.product_breakdown?.length || 0} Materials
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {quote.product_breakdown?.map((item, index) => (
                  <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        Quantity: <span className="font-semibold font-mono text-slate-700">{item.quantity}</span>
                        {item.unit_price && (
                          <span> · Unit Rate: <strong className="font-mono text-slate-800">{formatCurrency(item.unit_price)}</strong></span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-base font-extrabold text-indigo-600 block">
                        {formatCurrency(item.total_price || (item.quantity * item.unit_price))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/70 -mx-6 -mb-6 p-6 rounded-b-2xl">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">
                    Total Quoted Commercial Bid
                  </span>
                  <span className="text-[11px] text-slate-400">All prices in Indian National Rupee (INR)</span>
                </div>
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {formatCurrency(quote.total_amount)}
                </span>
              </div>
            </div>

            {/* Commercial Terms & Conditions */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FiShield className="w-4 h-4 text-emerald-600" />
                Commercial Terms & Fulfillment Conditions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {quote.delivery_estimate && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Estimated Dispatch Timeline</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{quote.delivery_estimate}</p>
                  </div>
                )}
                {quote.payment_terms && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Settlement & Escrow Terms</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{quote.payment_terms}</p>
                  </div>
                )}
              </div>

              {quote.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="text-slate-500 block mb-1 font-semibold">Vendor Remarks & Commercial Exclusions:</span>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{quote.notes}</p>
                </div>
              )}
            </div>

            {/* Direct Buyer Communication */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FiMessageSquare className="w-4 h-4 text-indigo-600" />
                  Direct Buyer Procurement Messaging
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {buyer.name}
                </span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {messages.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                    No direct procurement messages exchanged yet.
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMe = message.sender_id === quote.supplier_id;
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

              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send specification clarification to buyer..."
                  className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <FiSend className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Buyer Info & Market Benchmark */}
          <div className="space-y-6">
            {/* Tender Reference Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Tender Context
              </h2>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">RFQ Tender Number</span>
                  <Link
                    href={route('supplier.rfqs.show', quote.rfq.id)}
                    className="font-bold text-indigo-600 hover:text-indigo-800 font-mono"
                  >
                    #{quote.rfq?.rfq_number}
                  </Link>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tender Subject</span>
                  <p className="font-bold text-slate-800 mt-0.5">{quote.rfq?.title}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Target Delivery Date</span>
                  <p className="font-medium text-slate-700 font-mono mt-0.5">
                    {formatIndianDate(quote.rfq?.required_by_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Buyer Contact Profile */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FiUser className="w-4 h-4 text-slate-500" />
                Buyer Procurement Officer
              </h2>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{buyer.name}</p>
                  <a href={`mailto:${buyer.email}`} className="text-slate-500 hover:text-indigo-600 block mt-0.5">
                    {buyer.email}
                  </a>
                </div>
                {buyer.phone && (
                  <p className="text-slate-600">{buyer.phone}</p>
                )}
              </div>
            </div>

            {/* Validity Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FiClock className="w-4 h-4 text-slate-400" />
                Quotation Validity
              </h2>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex justify-between items-center">
                <span className="text-slate-500">Expires:</span>
                <span className={`font-mono font-bold ${isExpired ? 'text-rose-600' : 'text-slate-800'}`}>
                  {formatIndianDate(quote.valid_until)}
                </span>
              </div>
              {isPending && (
                <button
                  onClick={() => setShowExtendValidity(true)}
                  className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Extend Validity Deadline
                </button>
              )}
            </div>

            {/* Blind Competitive Market Benchmarks */}
            {otherQuotes.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Competitive Benchmark ({otherQuotes.length} Competing Bids)
                </h2>
                <div className="space-y-2 text-xs">
                  {otherQuotes.map((otherQuote) => {
                    const isLower = otherQuote.total_amount < quote.total_amount;
                    const isHigher = otherQuote.total_amount > quote.total_amount;

                    return (
                      <div key={otherQuote.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">Verified Bidder</p>
                          <p className="font-mono text-slate-400 text-[10px]">Quote #{otherQuote.quote_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-slate-900">{formatCurrency(otherQuote.total_amount)}</p>
                          <p className={`text-[10px] font-semibold flex items-center justify-end gap-1 ${
                            isLower ? 'text-rose-600' : isHigher ? 'text-emerald-600' : 'text-slate-500'
                          }`}>
                            {isLower ? (
                              <>
                                <FiTrendingDown className="w-3 h-3" />
                                Lower than your bid
                              </>
                            ) : isHigher ? (
                              <>
                                <FiTrendingUp className="w-3 h-3" />
                                Higher than your bid
                              </>
                            ) : (
                              'Equal to your bid'
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Withdraw Confirmation Modal */}
        {showWithdrawConfirm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Withdraw Quotation Proposal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to retract Quote #{quote.quote_number}? This will permanently remove this commercial offer from the buyer's tender evaluation.
              </p>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Reason for Withdrawal <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={withdrawReason}
                  onChange={(e) => setWithdrawReason(e.target.value)}
                  rows="3"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-rose-500"
                  placeholder="e.g. Raw material cost fluctuations, inventory stockout, delivery schedule conflict..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => {
                    setShowWithdrawConfirm(false);
                    setWithdrawReason('');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={!withdrawReason.trim()}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Extend Validity Modal */}
        {showExtendValidity && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Extend Quotation Price Validity</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    New Expiration Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newValidUntil}
                    onChange={(e) => setNewValidUntil(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Extension Rationale (Optional)
                  </label>
                  <textarea
                    value={extensionReason}
                    onChange={(e) => setExtensionReason(e.target.value)}
                    rows="2"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Price lock extended per buyer request..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => {
                    setShowExtendValidity(false);
                    setNewValidUntil('');
                    setExtensionReason('');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtendValidity}
                  disabled={!newValidUntil}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  Confirm Extension
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}