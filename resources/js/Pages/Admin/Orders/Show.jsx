// Pages/Admin/Orders/Show.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Admin dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// sweetalert - For beautiful alert messages
import Swal from 'sweetalert2';

// Icons - Importing icon sets for UI elements
import {
  FiArrowLeft,
  FiPackage,
  FiUser,
  FiMapPin,
  FiMail,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiPrinter
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
  MdOutlineLocalShipping,
  MdOutlinePayment,
  MdOutlineReceipt
} from 'react-icons/md';
import { BsBuilding, BsBoxSeam } from 'react-icons/bs';

export default function Show({ order, timeline, paymentInfo }) {
  // State management for forms and UI controls
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Status update form state
  const [statusData, setStatusData] = useState({
    order_status: order.order_status,
    notes: ''
  });

  // Payment update form state
  const [paymentData, setPaymentData] = useState({
    payment_status: order.payment_status,
    payment_method: order.payment_method || '',
    payment_reference: order.payment_reference || '',
    payment_notes: ''
  });

  // Cancel order form state
  const [cancelData, setCancelData] = useState({
    cancellation_reason: '',
    refund_required: order.payment_status === 'paid'
  });

  // Handle order status update
  const handleStatusUpdate = () => {
    router.post(route('admin.orders.update-status', order.id), statusData, {
      onSuccess: () => {
        setShowStatusForm(false);
        Swal.fire({
          title: 'successful!',
          text: 'Order status updated successfully।',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  // Handle payment status update
  const handlePaymentUpdate = () => {
    router.post(route('admin.orders.update-payment', order.id), paymentData, {
      onSuccess: () => {
        setShowPaymentForm(false);
        Swal.fire({
          title: 'successful!',
          text: 'Payment status successfully updated।',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  // Handle order cancellation
  const handleCancelOrder = () => {
    if (!cancelData.cancellation_reason) {
      Swal.fire({
        title: 'Error!',
        text: 'Please specify the reason for cancellation।',
        icon: 'error',
        confirmButtonColor: '#4F46E5'
      });
      return;
    }

    router.post(route('admin.orders.cancel', order.id), cancelData, {
      onSuccess: () => {
        setShowCancelForm(false);
        Swal.fire({
          title: 'cancel!',
          text: 'Order successfully canceled।',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
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

  // Format date - Converts ISO date to readable format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get order status badge with appropriate styling
  const getOrderStatusBadge = (status) => {
    const badges = {
      pending_confirmation: { color: 'bg-yellow-100 text-yellow-800', icon: MdPending, label: 'Awaiting' },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: MdVerified, label: 'sure' },
      processing: { color: 'bg-indigo-100 text-indigo-800', icon: FiClock, label: 'In process' },
      shipped: { color: 'bg-purple-100 text-purple-800', icon: MdOutlineLocalShipping, label: 'has been sent' },
      delivered: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle, label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: FiXCircle, label: 'cancel' },
    };
    const badge = badges[status] || badges.pending_confirmation;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {badge.label}
      </span>
    );
  };

  // Get payment status badge with appropriate styling
  const getPaymentStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock, label: 'Awaiting' },
      paid: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle, label: 'Paid' },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {badge.label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <Head title={`Order #${order.order_number}`} />

      <div className="space-y-6">
        {/* Header - Back button and page title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.orders.index')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Order Details and Management
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <FiPrinter className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Order Status Bar - Current status and action buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {getOrderStatusBadge(order.order_status)}
              {getPaymentStatusBadge(order.payment_status)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowStatusForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
              >
                Status Update
              </button>
              <button
                onClick={() => setShowPaymentForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Payment Update
              </button>
              {order.canBeCancelled && (
                <button
                  onClick={() => setShowCancelForm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Update Form - Modal-like form for status changes */}
        {showStatusForm && (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Status Update</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={statusData.order_status}
                  onChange={(e) => setStatusData({ ...statusData, order_status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="pending_confirmation">Awaiting</option>
                  <option value="confirmed">sure</option>
                  <option value="processing">In process</option>
                  <option value="shipped">has been sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">cancel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={statusData.notes}
                  onChange={(e) => setStatusData({ ...statusData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="to your contacts Add note about this status change..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowStatusForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Status Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Update Form - Modal-like form for payment changes */}
        {showPaymentForm && (
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment status update</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={paymentData.payment_status}
                  onChange={(e) => setPaymentData({ ...paymentData, payment_status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="pending">Awaiting</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <input
                  type="text"
                  value={paymentData.payment_method}
                  onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Eg: Bank Transfer, Credit Card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment reference
                </label>
                <input
                  type="text"
                  value={paymentData.payment_reference}
                  onChange={(e) => setPaymentData({ ...paymentData, payment_reference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Transaction ID or reference number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={paymentData.payment_notes}
                  onChange={(e) => setPaymentData({ ...paymentData, payment_notes: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Add note regarding payment..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  cancel
                </button>
                <button
                  onClick={handlePaymentUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Payment Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Order Form - Modal-like form for order cancellation */}
        {showCancelForm && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
            <h3 className="font-semibold text-red-600 mb-4">Cancel Order</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation *
                </label>
                <textarea
                  value={cancelData.cancellation_reason}
                  onChange={(e) => setCancelData({ ...cancelData, cancellation_reason: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Explain why this order is being canceled..."
                />
              </div>
              {order.payment_status === 'paid' && (
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={cancelData.refund_required}
                      onChange={(e) => setCancelData({ ...cancelData, refund_required: e.target.checked })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Process a refund for this order</span>
                  </label>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCancelForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  cancel
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Order details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main order content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items - List of products in the order */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiPackage className="w-5 h-5 text-indigo-600" />
                Order Item
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                        {item.product?.main_image ? (
                          <img
                            src={item.product.main_image}
                            alt={item.product_name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <BsBoxSeam className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-indigo-600">{formatCurrency(item.total_price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary - Total calculations */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(order.total_amount)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Includes</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">total</span>
                  <span className="text-lg font-bold text-indigo-600">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information - Delivery address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiMapPin className="w-5 h-5 text-indigo-600" />
                Shipping information
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{order.shipping_address}</p>
            </div>

            {/* Order Timeline - Status history */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiClock className="w-5 h-5 text-indigo-600" />
                Order timeline
              </h3>
              <div className="space-y-4">
                {timeline.map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <FiCheckCircle className="w-4 h-4 text-indigo-600" />
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="absolute top-8 left-4 w-0.5 h-12 bg-indigo-200"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-gray-900">
                        {event.status === 'pending_confirmation' ? 'Awaiting' :
                          event.status === 'confirmed' ? 'sure' :
                            event.status === 'processing' ? 'In process' :
                              event.status === 'shipped' ? 'has been sent' :
                                event.status === 'delivered' ? 'Delivered' :
                                  event.status === 'cancelled' ? 'cancel' : event.status}
                      </p>
                      <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar with additional information */}
          <div className="space-y-6">
            {/* Customer Information - Buyer details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="w-5 h-5 text-indigo-600" />
                Buyer information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-medium text-blue-600">
                      {order.buyer?.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.buyer?.name}</p>
                    <p className="text-sm text-gray-500">Buyer</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${order.buyer?.email}`} className="text-indigo-600 hover:text-indigo-700">
                    {order.buyer?.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Supplier Information - Seller details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BsBuilding className="w-5 h-5 text-indigo-600" />
                Supplier Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="font-medium text-purple-600">
                      {order.supplier?.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.supplier?.name}</p>
                    <p className="text-sm text-gray-500">Supplier</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${order.supplier?.email}`} className="text-indigo-600 hover:text-indigo-700">
                    {order.supplier?.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Payment Information - Payment details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MdOutlinePayment className="w-5 h-5 text-indigo-600" />
                Payment information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span>{getPaymentStatusBadge(paymentInfo.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Procedure</span>
                  <span className="text-sm font-medium text-gray-900">{paymentInfo.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">is closed Reference</span>
                  <span className="text-sm font-mono text-gray-900">{paymentInfo.reference}</span>
                </div>
                {paymentInfo.paid_at && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Date of Payment</span>
                    <span className="text-sm text-gray-900">{formatDate(paymentInfo.paid_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* RFQ Information - Related RFQ if any */}
            {order.rfq && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MdOutlineReceipt className="w-5 h-5 text-indigo-600" />
                  RFQ Information
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">RFQ Number:</span>{' '}
                    <span className="font-medium text-gray-900">{order.rfq.rfq_number}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Title:</span>{' '}
                    <span className="text-gray-900">{order.rfq.title}</span>
                  </p>
                  <Link
                    href={route('admin.rfqs.show', order.rfq.id)}
                    className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mt-2"
                  >
                    RFQ for suppliers See details
                    <FiArrowLeft className="w-3 h-3 rotate-180" />
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