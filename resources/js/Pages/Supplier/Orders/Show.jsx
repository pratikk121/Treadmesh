// resources/js/Pages/Supplier/Orders/Show.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiPackage,
  FiTruck,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiMessageSquare,
  FiSend,
  FiPrinter,
  FiCheck,
  FiShield,
  FiAlertCircle,
  FiFileText
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import {
  formatCurrency,
  formatIndianDate,
  formatOrderStatus,
  formatPaymentStatus
} from '@/Utils/formatters';

export default function OrderShow({
  order,
  messages,
  timeline,
  canCancel,
  availableStatuses
}) {
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    tracking_number: '',
    shipping_carrier: '',
    estimated_delivery: '',
    notes: ''
  });

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (['delivered', 'confirmed', 'sure'].includes(s)) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10';
    }
    if (['processing', 'shipped'].includes(s)) {
      return 'bg-sky-50 text-sky-700 border-sky-200 ring-1 ring-sky-500/10';
    }
    if (['pending_confirmation', 'pending'].includes(s)) {
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/10';
    }
    if (['cancelled', 'cancel'].includes(s)) {
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/10';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const handleConfirmOrder = () => {
    if (confirm('Accept this purchase order and commit to production specifications?')) {
      router.post(route('supplier.orders.confirm', order.id));
    }
  };

  const handleUpdateStatus = (status) => {
    if (status === 'shipped' && !showShippingForm) {
      setShowShippingForm(true);
      return;
    }

    router.post(route('supplier.orders.update-status', order.id), {
      order_status: status,
      ...shippingInfo
    }, {
      onSuccess: () => {
        setShowShippingForm(false);
        setShippingInfo({
          tracking_number: '',
          shipping_carrier: '',
          estimated_delivery: '',
          notes: ''
        });
      }
    });
  };

  const handleCancelOrder = () => {
    if (!cancellationReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Cancellation Reason Required',
        text: 'Please specify the reason for cancelling this order.',
        confirmButtonText: 'OK'
      });
      return;
    }

    Swal.fire({
      title: 'Reject & Cancel PO?',
      text: 'This will notify the buyer and reverse any held funds.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel Order',
      cancelButtonText: 'Keep Order',
      confirmButtonColor: '#dc2626'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('supplier.orders.cancel', order.id), {
          cancellation_reason: cancellationReason
        }, {
          onSuccess: () => {
            setShowCancelForm(false);
            setCancellationReason('');

            Swal.fire({
              icon: 'success',
              title: 'Order Cancelled',
              text: 'Purchase order cancelled successfully.'
            });
          },
          onError: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Could not cancel order. Please try again.'
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
      receiver_id: order.buyer_id,
      rfq_id: order.rfq_id,
      message: newMessage
    }, {
      onSuccess: () => {
        setNewMessage('');
        setSending(false);
      },
      onError: () => setSending(false)
    });
  };

  return (
    <DashboardLayout>
      <Head title={`PO #${order.order_number} — Treadmesh Supplier Console`} />

      <div className="space-y-6 pb-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href={route('supplier.orders.index')}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                  PO #{order.order_number}
                </h1>
                <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadge(order.order_status)}`}>
                  {formatOrderStatus(order.order_status)}
                </span>
                <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {formatPaymentStatus(order.payment_status)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Issued on {formatIndianDate(order.created_at)} &bull; Procuring Enterprise: {order.buyer?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-semibold shadow-sm transition"
            >
              <FiPrinter className="w-4 h-4 text-slate-500" />
              <span>Print Production Slip</span>
            </button>
          </div>
        </div>

        {/* Action Banner for Pending Confirmation */}
        {order.order_status === 'pending_confirmation' && (
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <FiClock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">Purchase Order Awaiting Acceptance</h3>
                <p className="text-xs text-amber-700 mt-0.5">
                  Please review the specifications, quantities, and delivery schedule. Accept this PO to lock Nodal Escrow and begin production.
                </p>
              </div>
            </div>
            <button
              onClick={handleConfirmOrder}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 text-xs font-bold shadow-sm transition shrink-0"
            >
              Accept Purchase Order
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Items & Milestones) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Line Items Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <FiPackage className="w-5 h-5 text-brand-600" />
                  <h2 className="font-bold text-slate-900 text-base">Production Order SKUs</h2>
                </div>
                <span className="text-xs font-mono text-slate-500">{order.items?.length || 0} Line Items</span>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="p-5 hover:bg-slate-50/50 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        {item.product?.main_image ? (
                          <img
                            src={`/storage/${item.product.main_image}`}
                            alt={item.product_name}
                            className="w-12 h-12 object-cover rounded-xl"
                          />
                        ) : (
                          <FiPackage className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm">{item.product_name}</h3>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Quantity</span>
                            <span className="font-mono font-bold text-slate-800">{item.quantity} units</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Unit Price</span>
                            <span className="font-mono font-medium text-slate-700">{formatCurrency(item.unit_price)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total (INR)</span>
                            <span className="font-mono font-bold text-slate-900">{formatCurrency(item.total_price)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Total Contract Payable:</span>
                <span className="font-mono text-base text-brand-600">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>

            {/* Production & Logistics Milestones */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 text-base mb-5 flex items-center gap-2">
                <FiClock className="w-5 h-5 text-brand-600" />
                Production & Logistics Milestones
              </h2>

              <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {timeline?.map((event, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      event.completed
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {event.completed ? <FiCheck className="w-3.5 h-3.5" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${event.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {formatOrderStatus(event.status)}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{event.description}</p>
                      {event.date && (
                        <p className="text-[11px] text-slate-400 font-mono mt-1">
                          {formatIndianDate(event.date)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping / Dispatch Details Form */}
            {showShippingForm && (
              <div className="bg-white rounded-2xl border border-sky-200 p-6 shadow-sm">
                <h2 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
                  <FiTruck className="w-5 h-5 text-sky-600" />
                  E-Way Bill & Dispatch Generation
                </h2>
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        E-Way Bill / AWB No. <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.tracking_number}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, tracking_number: e.target.value })}
                        placeholder="e.g. EWB-192837465019"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Logistics Carrier <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.shipping_carrier}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, shipping_carrier: e.target.value })}
                        placeholder="e.g. Delhivery, Blue Dart, VRL, TCI"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Estimated Delivery Date</label>
                    <input
                      type="date"
                      value={shippingInfo.estimated_delivery}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, estimated_delivery: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Dispatch Notes</label>
                    <textarea
                      value={shippingInfo.notes}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                      rows="2"
                      placeholder="Vehicle number, driver contact, or pallet instructions..."
                      className="w-full border border-slate-200 rounded-xl p-3 text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus('shipped')}
                      className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-semibold"
                    >
                      Confirm Dispatch & Notify Buyer
                    </button>
                    <button
                      onClick={() => setShowShippingForm(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cancel Form */}
            {showCancelForm && (
              <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm">
                <h2 className="font-bold text-rose-700 text-base mb-3">Cancel Purchase Order</h2>
                <div className="space-y-3 text-xs">
                  <textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    rows="3"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs"
                    placeholder="Specify rejection / cancellation reason for buyer..."
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelOrder}
                      className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 font-semibold"
                    >
                      Confirm Order Cancellation
                    </button>
                    <button
                      onClick={() => setShowCancelForm(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Controls & Buyer Info) */}
          <div className="space-y-6">
            {/* Fulfillment Controls Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 text-sm mb-4">Fulfillment Status & Actions</h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Current Status:</span>
                  <span className={`inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadge(order.order_status)}`}>
                    {formatOrderStatus(order.order_status)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Escrow Settlement:</span>
                  <span className="font-semibold text-emerald-700">
                    {formatPaymentStatus(order.payment_status)}
                  </span>
                </div>

                {/* Available Status Transitions */}
                {Object.keys(availableStatuses || {}).length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Advance Workflow
                    </span>
                    {Object.entries(availableStatuses).map(([status, label]) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(status)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition"
                      >
                        Advance to: {formatOrderStatus(status)}
                      </button>
                    ))}
                  </div>
                )}

                {canCancel && (
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setShowCancelForm(true)}
                      className="w-full py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl font-semibold text-xs transition"
                    >
                      Reject / Cancel PO
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Buyer Details */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 text-sm mb-3">Procuring Buyer Enterprise</h2>
              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-900">{order.buyer?.name}</p>
                <p className="text-slate-500">{order.buyer?.email}</p>
                {order.buyer?.phone && (
                  <p className="text-slate-500">Contact: {order.buyer.phone}</p>
                )}
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Consignee Delivery Address:
                  </span>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    {order.shipping_address || 'Address provided on invoice'}
                  </p>
                </div>
              </div>
            </div>

            {/* Linked RFQ */}
            {order.rfq && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 text-sm mb-2">Originating Tender</h2>
                <p className="text-xs font-semibold text-slate-800">{order.rfq.title}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Tender #{order.rfq.rfq_number}</p>
                <Link
                  href={route('supplier.rfqs.show', order.rfq.id)}
                  className="mt-2 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  View RFQ Tender &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Messaging Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <FiMessageSquare className="w-5 h-5 text-brand-600" />
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Enterprise Trade Communications</h2>
                <p className="text-[11px] text-slate-500">Direct channel with procuring client regarding PO #{order.order_number}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
              {messages?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === order.supplier_id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md rounded-2xl p-3.5 text-xs ${
                      message.sender_id === order.supplier_id
                        ? 'bg-slate-900 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-900 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{message.message}</p>
                    <p className={`text-[10px] mt-1 font-mono ${
                      message.sender_id === order.supplier_id ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {formatIndianDate(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}

              {(!messages || messages.length === 0) && (
                <div className="text-center py-6 text-xs text-slate-400">
                  No trade messages yet. Initiate direct communication regarding technical specs or delivery scheduling.
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type dispatch updates or message for buyer..."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <FiSend className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}