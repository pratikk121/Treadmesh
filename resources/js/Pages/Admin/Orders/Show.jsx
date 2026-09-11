// resources/js/Pages/Admin/Orders/Show.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Swal from 'sweetalert2';
import {
  FiArrowLeft,
  FiPackage,
  FiUser,
  FiMapPin,
  FiMail,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiPrinter,
  FiShield,
  FiDollarSign,
  FiFileText
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
  MdOutlineLocalShipping,
  MdOutlinePayment,
  MdOutlineReceipt
} from 'react-icons/md';
import { BsBuilding, BsBoxSeam } from 'react-icons/bs';
import {
  formatCurrency,
  formatIndianDate,
  formatOrderStatus,
  formatPaymentStatus
} from '@/Utils/formatters';

export default function Show({ order, timeline, paymentInfo }) {
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [statusData, setStatusData] = useState({
    order_status: order.order_status,
    notes: ''
  });

  const [paymentData, setPaymentData] = useState({
    payment_status: order.payment_status,
    payment_method: order.payment_method || '',
    payment_reference: order.payment_reference || '',
    payment_notes: ''
  });

  const [cancelData, setCancelData] = useState({
    cancellation_reason: '',
    refund_required: order.payment_status === 'paid'
  });

  const handleStatusUpdate = () => {
    router.post(route('admin.orders.update-status', order.id), statusData, {
      onSuccess: () => {
        setShowStatusForm(false);
        Swal.fire({
          title: 'Status Updated',
          text: 'Order fulfillment status successfully adjusted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handlePaymentUpdate = () => {
    router.post(route('admin.orders.update-payment', order.id), paymentData, {
      onSuccess: () => {
        setShowPaymentForm(false);
        Swal.fire({
          title: 'Escrow Updated',
          text: 'Payment and Nodal Escrow state adjusted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handleCancelOrder = () => {
    if (!cancelData.cancellation_reason) {
      Swal.fire({
        title: 'Reason Required',
        text: 'Please specify the reason for administrative order cancellation.',
        icon: 'warning',
        confirmButtonColor: '#0284c7'
      });
      return;
    }

    router.post(route('admin.orders.cancel', order.id), cancelData, {
      onSuccess: () => {
        setShowCancelForm(false);
        Swal.fire({
          title: 'Order Cancelled',
          text: 'Purchase order administratively cancelled and logged.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (['delivered', 'confirmed', 'sure', 'paid'].includes(s)) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10';
    }
    if (['processing', 'shipped'].includes(s)) {
      return 'bg-sky-50 text-sky-700 border-sky-200 ring-1 ring-sky-500/10';
    }
    if (['pending_confirmation', 'pending', 'unpaid'].includes(s)) {
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/10';
    }
    if (['cancelled', 'cancel'].includes(s)) {
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/10';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <DashboardLayout>
      <Head title={`Supervision: PO #${order.order_number} — Central Ops`} />

      <div className="space-y-6 pb-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href={route('admin.orders.index')}
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
                Initiated: {formatIndianDate(order.created_at)} &bull; Buyer: {order.buyer?.name} &bull; Vendor: {order.supplier?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-semibold shadow-sm transition"
            >
              <FiPrinter className="w-4 h-4 text-slate-500" />
              <span>Print Audit Slip</span>
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Admin Operations:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowStatusForm(true)}
              className="px-3.5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-xs font-semibold shadow-sm transition"
            >
              Override Status
            </button>
            <button
              onClick={() => setShowPaymentForm(true)}
              className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 text-xs font-semibold shadow-sm transition"
            >
              Update Escrow Settlement
            </button>
            {order.canBeCancelled && (
              <button
                onClick={() => setShowCancelForm(true)}
                className="px-3.5 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl hover:bg-rose-100 text-xs font-semibold transition"
              >
                Cancel PO
              </button>
            )}
          </div>
        </div>

        {/* Status Override Modal */}
        {showStatusForm && (
          <div className="bg-white rounded-2xl border border-brand-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 font-display mb-3">Administrative Status Override</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Order Status</label>
                <select
                  value={statusData.order_status}
                  onChange={(e) => setStatusData({ ...statusData, order_status: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5"
                >
                  <option value="pending_confirmation">Awaiting Confirmation</option>
                  <option value="confirmed">PO Confirmed</option>
                  <option value="processing">In Production</option>
                  <option value="shipped">Dispatched (E-Way Bill)</option>
                  <option value="delivered">Delivered & Accepted</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Audit Log Note (Optional)</label>
                <textarea
                  value={statusData.notes}
                  onChange={(e) => setStatusData({ ...statusData, notes: e.target.value })}
                  rows="2"
                  className="w-full border border-slate-200 rounded-xl p-3"
                  placeholder="Reason for manual status modification..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowStatusForm(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-semibold"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Override Modal */}
        {showPaymentForm && (
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 font-display mb-3">Nodal Escrow & Payment Update</h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Settlement Status</label>
                  <select
                    value={paymentData.payment_status}
                    onChange={(e) => setPaymentData({ ...paymentData, payment_status: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5"
                  >
                    <option value="pending">Awaiting Settlement</option>
                    <option value="paid">Paid (Nodal Escrow Held)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <input
                    type="text"
                    value={paymentData.payment_method}
                    onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5"
                    placeholder="e.g. RTGS / NEFT / Escrow Rail"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank UTR / Reference ID</label>
                <input
                  type="text"
                  value={paymentData.payment_reference}
                  onChange={(e) => setPaymentData({ ...paymentData, payment_reference: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-mono"
                  placeholder="Axis Bank / Nodal transaction reference"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Settlement Note</label>
                <textarea
                  value={paymentData.payment_notes}
                  onChange={(e) => setPaymentData({ ...paymentData, payment_notes: e.target.value })}
                  rows="2"
                  className="w-full border border-slate-200 rounded-xl p-3"
                  placeholder="Notes regarding bank reconciliation..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentUpdate}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
                >
                  Save Escrow Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Form */}
        {showCancelForm && (
          <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-rose-700 font-display mb-3">Administrative Order Cancellation</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cancellation Rationale *</label>
                <textarea
                  value={cancelData.cancellation_reason}
                  onChange={(e) => setCancelData({ ...cancelData, cancellation_reason: e.target.value })}
                  rows="3"
                  className="w-full border border-slate-200 rounded-xl p-3"
                  placeholder="Provide detailed compliance or legal grounds for cancelling this order..."
                />
              </div>
              {order.payment_status === 'paid' && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={cancelData.refund_required}
                    onChange={(e) => setCancelData({ ...cancelData, refund_required: e.target.checked })}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-slate-700 font-semibold">Initiate refund from Nodal Escrow back to buyer</span>
                </label>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCancelForm(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-semibold"
                >
                  Execute Cancellation
                </button>
              </div>
            </div>
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
                  <h2 className="font-bold text-slate-900 text-base">Purchased Line Items</h2>
                </div>
                <span className="text-xs font-mono text-slate-500">{order.items?.length || 0} Line Items</span>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items?.map((item, index) => (
                  <div key={index} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                        {item.product?.main_image ? (
                          <img
                            src={item.product.main_image}
                            alt={item.product_name}
                            className="w-11 h-11 object-cover rounded-xl"
                          />
                        ) : (
                          <BsBoxSeam className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-xs">{item.product_name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.quantity} units &bull; {formatCurrency(item.unit_price)}/unit
                        </p>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-slate-900 text-xs">
                      {formatCurrency(item.total_price)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-slate-50/80 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-slate-900">{formatCurrency(order.total_amount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Freight & Insurance:</span>
                  <span className="font-mono text-emerald-600 font-semibold">Included in PO Rate</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Total PO Value:</span>
                  <span className="font-mono text-brand-600 text-base">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Consignee Address */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-brand-600" />
                Consignee & Delivery Address
              </h3>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                {order.shipping_address || 'No address provided'}
              </p>
            </div>

            {/* Milestones Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <FiClock className="w-4 h-4 text-brand-600" />
                Procurement Milestones & History
              </h3>
              <div className="relative pl-6 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {timeline?.map((event, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className="absolute -left-6 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-xs">
                      <FiCheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900">
                        {formatOrderStatus(event.status)}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {formatIndianDate(event.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Parties & Escrow Ledger) */}
          <div className="space-y-6">
            {/* Buyer Details */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <FiUser className="w-4 h-4 text-brand-600" />
                Procuring Buyer Enterprise
              </h3>
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-slate-900">{order.buyer?.name}</p>
                <p className="text-slate-500">{order.buyer?.email}</p>
                <Link
                  href={route('admin.orders.buyer', order.buyer_id)}
                  className="mt-2 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  View All Orders by Buyer &rarr;
                </Link>
              </div>
            </div>

            {/* Supplier Details */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <BsBuilding className="w-4 h-4 text-brand-600" />
                Manufacturing Vendor
              </h3>
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-slate-900">{order.supplier?.name}</p>
                <p className="text-slate-500">{order.supplier?.email}</p>
                <Link
                  href={route('admin.orders.supplier', order.supplier_id)}
                  className="mt-2 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  View All Orders by Vendor &rarr;
                </Link>
              </div>
            </div>

            {/* Payment & Escrow Settlement */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <FiShield className="w-4 h-4 text-emerald-600" />
                Nodal Escrow Settlement
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-semibold text-emerald-700">{formatPaymentStatus(paymentInfo?.status)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Rail Method:</span>
                  <span className="font-medium text-slate-800">{paymentInfo?.method || 'Nodal Escrow (Axis Bank)'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">UTR / Reference:</span>
                  <span className="font-mono text-slate-900 font-semibold">{paymentInfo?.reference || 'N/A'}</span>
                </div>
                {paymentInfo?.paid_at && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Deposit Date:</span>
                    <span className="font-mono text-slate-700">{formatIndianDate(paymentInfo.paid_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Linked RFQ */}
            {order.rfq && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                  <FiFileText className="w-4 h-4 text-brand-600" />
                  Originating RFQ Tender
                </h3>
                <p className="text-xs font-semibold text-slate-800">{order.rfq.title}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Tender #{order.rfq.rfq_number}</p>
                <Link
                  href={route('admin.rfqs.show', order.rfq.id)}
                  className="mt-2.5 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  View Linked Tender Details &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}