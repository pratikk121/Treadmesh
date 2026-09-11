// resources/js/Pages/Admin/Orders/SupplierOrders.jsx

import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiArrowLeft,
  FiEye,
  FiPackage
} from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';
import {
  formatCurrency,
  formatIndianDate,
  formatOrderStatus
} from '@/Utils/formatters';

export default function SupplierOrders({ supplier, orders }) {
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
      <Head title={`${supplier.name} — Vendor Order Ledger`} />

      <div className="space-y-6 pb-12 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 border-b border-slate-200/80 pb-6">
          <Link
            href={route('admin.orders.index')}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-700">
              <BsBuilding className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                {supplier.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                Factory Purchase Order Fulfillment & Volume Ledger
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm">Allocated Purchase Orders</h3>
            <span className="text-xs font-mono text-slate-500">{orders.total || 0} Total Orders</span>
          </div>

          {orders.data.length === 0 ? (
            <div className="p-12 text-center">
              <FiPackage className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800">No Orders Found</p>
              <p className="text-xs text-slate-400 mt-1">No purchase orders have been allocated to this supplier unit yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3">PO Number</th>
                    <th className="px-5 py-3">Procuring Buyer</th>
                    <th className="px-5 py-3">Gross Value</th>
                    <th className="px-5 py-3">Fulfillment Status</th>
                    <th className="px-5 py-3">SKUs</th>
                    <th className="px-5 py-3">Order Date</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.data.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5">
                        <Link
                          href={route('admin.orders.show', order.id)}
                          className="font-mono font-bold text-brand-600 hover:text-brand-700"
                        >
                          PO-{order.order_number}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {order.buyer?.name}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadge(order.order_status)}`}>
                          {formatOrderStatus(order.order_status)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-600">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-500">
                        {formatIndianDate(order.created_at)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={route('admin.orders.show', order.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-xs font-semibold shadow-sm transition"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {orders.links && orders.data.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <p>
                Showing {orders.from || 0} to {orders.to || 0} of {orders.total || 0} orders
              </p>
              <div className="flex gap-1">
                {orders.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => link.url && router.get(link.url)}
                    disabled={!link.url || link.active}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                      link.active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : link.url
                        ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}