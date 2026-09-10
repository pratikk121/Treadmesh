// Pages/Admin/Orders/BuyerOrders.jsx

// React - Core React imports for component functionality
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Admin dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
import {
  FiArrowLeft,
  FiEye,
  FiPackage,
  FiUser
} from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';

export default function BuyerOrders({ buyer, orders }) {
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
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge - Returns appropriate badge based on order status
  const getOrderStatusBadge = (status) => {
    const badges = {
      pending_confirmation: { color: 'bg-yellow-100 text-yellow-800', label: 'Awaiting' },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'sure' },
      processing: { color: 'bg-indigo-100 text-indigo-800', label: 'In process' },
      shipped: { color: 'bg-purple-100 text-purple-800', label: 'has been sent' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'cancel' },
    };
    const badge = badges[status] || badges.pending_confirmation;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <Head title={`${buyer.name} - Orders`} />
      
      <div className="space-y-6">
        {/* Header - Back button and buyer information */}
        <div className="flex items-center gap-4">
          <Link
            href={route('admin.orders.index')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FiUser className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{buyer.name}</h1>
              <p className="text-sm text-gray-600 mt-1">
                View All Orders Placed by This Buyer
              </p>
            </div>
          </div>
        </div>

        {/* Orders List - Table displaying buyer's orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Customer Orders</h3>
          </div>

          {orders.data.length === 0 ? (
            // Empty state - No orders found
            <div className="p-12 text-center">
              <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders found for this customer।</p>
            </div>
          ) : (
            // Orders table
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      the date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activities
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.data.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <BsBuilding className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{order.supplier?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getOrderStatusBadge(order.order_status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{order.items?.length || 0} t item</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={route('admin.orders.show', order.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-lg hover:bg-indigo-100"
                        >
                          <FiEye className="w-4 h-4" />
                          See
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination - Navigation for order list pages */}
          {orders.links && orders.data.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  total {orders.total} of the {orders.from} from {orders.to} Showing
                </p>
                <div className="flex gap-2">
                  {orders.links.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => router.get(link.url)}
                      disabled={!link.url || link.active}
                      className={`px-3 py-1 rounded-lg text-sm ${link.active
                        ? 'bg-indigo-600 text-white'
                        : link.url
                          ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      dangerouslySetInnerHTML={{ 
                        __html: link.label
                          .replace('Previous', 'previous')
                          .replace('Next', 'next') 
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}