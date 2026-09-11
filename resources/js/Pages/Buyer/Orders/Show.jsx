// resources/js/Pages/Buyer/Orders/Show.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiArrowLeft,
  FiUser,
  FiMapPin,
  FiAlertCircle,
  FiCreditCard,
  FiCheck,
  FiPrinter,
  FiFileText,
  FiShield
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import {
  formatCurrency,
  formatIndianDate,
  formatOrderStatus,
  formatPaymentStatus
} from '@/Utils/formatters';

export default function OrderShow({ order, tracking }) {
  const [cancelling, setCancelling] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

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

  const handleCancel = () => {
    if (!cancellationReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Cancellation Reason Required',
        text: 'Please specify why this purchase order is being cancelled.',
      });
      return;
    }

    Swal.fire({
      title: 'Cancel Purchase Order?',
      text: 'This will notify the supplier and cancel this purchase order transaction.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel Order',
      cancelButtonText: 'Keep Order',
      confirmButtonColor: '#dc2626',
    }).then((result) => {
      if (result.isConfirmed) {
        setCancelling(true);

        router.post(route('buyer.orders.cancel', order.id), {
          cancellation_reason: cancellationReason
        }, {
          onSuccess: () => {
            setShowCancelModal(false);
            setCancelling(false);
            Swal.fire({
              icon: 'success',
              title: 'Order Cancelled',
              text: 'Purchase order cancelled successfully.'
            });
          },
          onError: () => {
            setCancelling(false);
            Swal.fire({
              icon: 'error',
              title: 'Cancellation Failed',
              text: 'Unable to cancel order. Please contact support.'
            });
          }
        });
      }
    });
  };

  const handleMarkReceived = () => {
    Swal.fire({
      title: 'Confirm Consignment Receipt?',
      text: 'Confirming receipt will verify physical inspection and authorize releasing held Nodal Escrow funds to the supplier.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Received & Inspected',
      cancelButtonText: 'Not Yet',
      confirmButtonColor: '#059669',
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('buyer.orders.mark-received', order.id), {}, {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Delivery Confirmed',
              text: 'Goods receipt verified. Nodal Escrow release initiated to supplier.'
            });
          }
        });
      }
    });
  };

  const handlePayment = () => {
    Swal.fire({
      title: 'Deposit into Nodal Escrow?',
      text: 'In production, this routes via Axis Bank RBI Nodal Escrow. In this demo, escrow deposit will be simulated instantly.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Authorize Escrow Payment',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0284c7',
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('buyer.orders.pay', order.id), {}, {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Escrow Funded',
              text: 'Funds are securely locked in Treadmesh RBI Nodal Escrow until delivery.',
              timer: 2500,
              showConfirmButton: false,
            });
          },
          onError: (errors) => {
            Swal.fire({
              icon: 'error',
              title: 'Payment Failed',
              text: errors.message || 'Please try again or select another payment rail.',
            });
          }
        });
      }
    });
  };

  return (
    <DashboardLayout>
      <Head title={`Purchase Order #${order.order_number} — Treadmesh`} />

      <div className="space-y-6 pb-12 max-w-6xl mx-auto">
        {/* Header - Back button, title and action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="flex items-center space-x-3">
            <Link
              href={route('buyer.orders.index')}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition"
            >
              <FiArrowLeft className="text-xl" />
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
                Initiated on {formatIndianDate(order.created_at)} &bull; Vendor: {order.supplier?.name}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={route('buyer.orders.invoice', order.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-semibold shadow-sm transition"
            >
              <FiFileText className="w-4 h-4 text-slate-500" />
              <span>Tax Invoice</span>
            </Link>

            {order.order_status === 'pending_confirmation' && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl hover:bg-rose-100 text-xs font-semibold transition"
              >
                <FiXCircle className="w-4 h-4" />
                <span>Cancel PO</span>
              </button>
            )}

            {order.order_status === 'shipped' && (
              <button
                onClick={handleMarkReceived}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 text-xs font-semibold shadow-sm transition"
              >
                <FiCheckCircle className="w-4 h-4" />
                <span>Confirm Delivery Receipt</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols - Items & Milestones */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <FiPackage className="w-5 h-5 text-brand-600" />
                  <h2 className="font-bold text-slate-900 text-base">Purchased Line Items</h2>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {order.items?.length || 0} SKUs
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items?.map((item, index) => (
                  <div key={index} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-600">
                        <FiPackage className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{item.product_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Order Qty: <span className="font-mono font-semibold text-slate-700">{item.quantity} units</span>
                          {' '}&bull;{' '}
                          Rate: <span className="font-mono text-slate-700">{formatCurrency(item.unit_price)}</span>/unit
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Line Total</span>
                      <span className="font-mono font-bold text-slate-900 text-base">
                        {formatCurrency(item.total_price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Cost Breakdown */}
              <div className="p-5 bg-slate-50/80 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal (Excl. Tax):</span>
                  <span className="font-mono font-semibold text-slate-900">{formatCurrency(order.total_amount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Freight & Logistics:</span>
                  <span className="font-mono text-emerald-600 font-semibold">Included</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes (GST 18% Integrated):</span>
                  <span className="font-mono text-slate-500">Included in Quote Rate</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Total Purchase Value:</span>
                  <span className="font-mono text-brand-600 text-base font-bold">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Procurement & Fulfillment Milestones */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 text-base mb-5 flex items-center gap-2">
                <FiClock className="w-5 h-5 text-brand-600" />
                Procurement & Fulfillment Milestones
              </h2>

              <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {order.timeline?.map((step, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.completed
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step.completed ? <FiCheck className="w-3.5 h-3.5" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {formatOrderStatus(step.status)}
                      </p>
                      {step.date && (
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {formatIndianDate(step.date)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Consignee, Escrow & Supplier Details */}
          <div className="space-y-6">
            {/* Nodal Escrow Status */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiShield className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Nodal Escrow Rail</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Escrow State</span>
                  <span className="font-semibold text-emerald-700">
                    {order.payment_status === 'paid' ? 'Secured in Nodal Account' : 'Awaiting Payment'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Nodal Partner</span>
                  <span className="font-medium text-slate-800">Axis Bank (RBI Escrow)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Gross Settlement</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(order.total_amount)}</span>
                </div>

                {order.payment_status === 'pending' && (
                  <div className="pt-2">
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200/80 mb-3 flex items-start gap-1.5">
                      <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      Deposit funds into the nodal account to initiate vendor production.
                    </p>
                    <button
                      onClick={handlePayment}
                      className="w-full py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-semibold text-xs transition shadow-sm"
                    >
                      Authorize Escrow Deposit (Demo)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Consignee & Shipping Destination */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <FiMapPin className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-sm">Consignee & Delivery Address</h3>
              </div>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                {order.shipping_address || 'Delivery Address on File'}
              </p>
            </div>

            {/* Manufacturer / Supplier Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <FiUser className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-sm">Verified Vendor</h3>
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-slate-900">{order.supplier?.name}</p>
                {order.supplier?.supplier && (
                  <>
                    <p className="text-slate-600">{order.supplier.supplier.company_name}</p>
                    <p className="text-slate-500 font-mono">GSTIN: {order.supplier.supplier.gstin || '27AAACG0123M1Z5'}</p>
                    <p className="text-slate-500">Contact: {order.supplier.supplier.company_phone}</p>
                  </>
                )}
                <Link
                  href={route('buyer.suppliers.show', order.supplier_id)}
                  className="mt-2 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  View Vendor Profile &rarr;
                </Link>
              </div>
            </div>

            {/* Linked RFQ */}
            {order.rfq && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 text-sm mb-2">Originating Tender</h3>
                <p className="text-xs font-semibold text-slate-800">{order.rfq.title}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Tender #{order.rfq.rfq_number}</p>
                <Link
                  href={route('buyer.rfqs.show', order.rfq.id)}
                  className="mt-2 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  View RFQ Tender &rarr;
                </Link>
              </div>
            )}

            {/* Tracking / E-Way Bill */}
            {tracking && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiTruck className="w-5 h-5 text-brand-600" />
                  <h3 className="font-bold text-slate-900 text-sm">E-Way Bill & Dispatch</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Carrier:</span>
                    <span className="font-semibold text-slate-800">{tracking.carrier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">AWB / E-Way Bill:</span>
                    <span className="font-mono font-bold text-slate-900">{tracking.tracking_number}</span>
                  </div>
                  {tracking.estimated_delivery && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Est. Delivery:</span>
                      <span className="font-semibold text-slate-800">{formatIndianDate(tracking.estimated_delivery)}</span>
                    </div>
                  )}
                  {tracking.tracking_url && (
                    <a
                      href={tracking.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      Track Consignment Live &rarr;
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cancellation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 font-display">Cancel Purchase Order</h3>
              <p className="text-xs text-slate-500 mt-1">
                Please specify the reason for cancelling PO #{order.order_number}.
              </p>

              <div className="my-4">
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  rows="3"
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Specify cancellation rationale (e.g., requirement revised, timeline mismatch)..."
                />
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling || !cancellationReason.trim()}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 text-xs font-semibold transition disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}