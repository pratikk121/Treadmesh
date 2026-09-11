// resources/js/Pages/Buyer/Orders/Invoice.jsx

import React, { useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiArrowLeft,
  FiDownload,
  FiPrinter,
  FiCheckCircle,
  FiShield
} from 'react-icons/fi';
import { formatCurrency, formatIndianDate } from '@/Utils/formatters';

export default function OrderInvoice({ order }) {
  const invoiceRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Tax Invoice - ${order.order_number} - Treadmesh</title>
            <style>
              body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; }
              .header { border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 24px; }
              .company-name { font-size: 24px; font-weight: 800; color: #0284c7; }
              .invoice-badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #047857; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 9999px; }
              .details { margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
              table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13px; }
              th { background: #f8fafc; padding: 10px 12px; text-align: left; font-weight: 700; border-bottom: 2px solid #e2e8f0; text-transform: uppercase; font-size: 11px; color: #475569; }
              td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
              .total-box { margin-left: auto; width: 320px; margin-top: 20px; }
              .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #475569; }
              .grand-total { display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #0f172a; font-size: 16px; font-weight: 800; color: #0f172a; }
              .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; }
            </style>
          </head>
          <body>
            ${invoiceRef.current?.innerHTML || ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <DashboardLayout>
      <Head title={`Tax Invoice #${order.order_number}`} />

      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header - Navigation & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href={route('buyer.orders.show', order.id)}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition"
            >
              <FiArrowLeft className="text-xl" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                  Tax Invoice
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <FiCheckCircle className="w-3 h-3" />
                  GST Compliant
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5 font-mono">
                Order #{order.order_number} &bull; Generated on {formatIndianDate(order.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition text-sm font-semibold shadow-sm"
            >
              <FiPrinter className="w-4 h-4 text-slate-500" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={() => router.get(route('buyer.orders.download-invoice', order.id))}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition text-sm font-semibold shadow-sm"
            >
              <FiDownload className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Invoice Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 text-slate-900" ref={invoiceRef}>
          {/* Company & GST Legal Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-8 border-b-2 border-slate-900 gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-brand-600 font-display">
                  TREADMESH
                </span>
                <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                  B2B INDIA
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">
                Treadmesh Technologies India Pvt. Ltd. &bull; CIN: U72900MH2024PTC394812
              </p>
              <p className="text-xs text-slate-500">
                Trade Centre, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051
              </p>
              <p className="text-xs font-mono text-slate-600 mt-1">
                GSTIN: 27AABCT8842P1ZG &bull; MSME Reg: UDYAM-MH-19-0048129
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 mb-2">
                Original for Recipient
              </span>
              <h2 className="text-xl font-bold font-display text-slate-900">
                TAX INVOICE
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-1">
                (Under Section 31 of Central Goods and Services Tax Act, 2017)
              </p>
            </div>
          </div>

          {/* Invoice & Order Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block uppercase text-[10px] font-bold tracking-wider">Invoice Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm">INV-{order.order_number}</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase text-[10px] font-bold tracking-wider">Purchase Order No.</span>
              <span className="font-mono font-semibold text-brand-600 text-sm">PO-{order.order_number}</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase text-[10px] font-bold tracking-wider">Invoice Date</span>
              <span className="font-semibold text-slate-800 text-sm">{formatIndianDate(order.created_at)}</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase text-[10px] font-bold tracking-wider">Place of Supply</span>
              <span className="font-semibold text-slate-800 text-sm">Maharashtra (State Code 27)</span>
            </div>
          </div>

          {/* Parties: Billed By (Supplier) vs Billed To (Buyer) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-slate-100 text-xs">
            {/* Supplier / Seller */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                Billed By (Seller / Manufacturer)
              </span>
              <h3 className="font-bold text-slate-900 text-sm">{order.supplier?.name}</h3>
              {order.supplier?.supplier && (
                <>
                  <p className="text-slate-600 font-medium mt-0.5">{order.supplier.supplier.company_name}</p>
                  <p className="text-slate-500 mt-1">Email: {order.supplier.supplier.company_email}</p>
                  <p className="text-slate-500">Contact: {order.supplier.supplier.company_phone}</p>
                  <p className="text-slate-700 font-mono mt-1 font-semibold">
                    GSTIN: {order.supplier.supplier.gstin || '27AAACG0123M1Z5'}
                  </p>
                </>
              )}
            </div>

            {/* Buyer / Consignee */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                Billed To (Purchasing Enterprise / Consignee)
              </span>
              <h3 className="font-bold text-slate-900 text-sm">{order.buyer?.name}</h3>
              <p className="text-slate-500 mt-0.5">{order.buyer?.email}</p>
              <p className="text-slate-600 mt-1.5 whitespace-pre-line leading-relaxed">
                {order.shipping_address || 'Registered Corporate Office, India'}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Description of Goods / SKU</th>
                  <th className="py-3 px-3">HSN Code</th>
                  <th className="py-3 px-3 text-center">Quantity</th>
                  <th className="py-3 px-3 text-right">Unit Rate (₹)</th>
                  <th className="py-3 px-3 text-right">Taxable Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items?.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-3 font-mono text-slate-400">{index + 1}</td>
                    <td className="py-3.5 px-3 font-medium text-slate-900">
                      {item.product_name}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">8471.30.10</td>
                    <td className="py-3.5 px-3 font-mono text-center font-semibold text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-right text-slate-700">
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-right text-slate-900">
                      {formatCurrency(item.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total & Tax Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-6 border-t border-slate-200 gap-8">
            {/* Escrow Settlement & Payment Terms */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 max-w-sm">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                <FiShield className="w-4 h-4 text-emerald-600" />
                RBI Nodal Escrow Settlement
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Funds deposited into Treadmesh Nodal Escrow Account (Axis Bank IFSC: UTIB0000004). Released to seller upon signed Delivery Acceptance Receipt.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {order.payment_status === 'paid' ? 'Paid (Escrow Held)' : 'Awaiting Settlement'}
                </span>
              </div>
            </div>

            {/* Calculations Box */}
            <div className="w-full sm:w-80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. Tax):</span>
                <span className="font-mono font-semibold text-slate-900">{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Freight & Transit Insurance:</span>
                <span className="font-mono font-semibold text-emerald-600">Included (Free)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Integrated GST (IGST 18%):</span>
                <span className="font-mono text-slate-500">Included in PO Rate</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-slate-900 text-base font-bold text-slate-900">
                <span>Total Invoice Value:</span>
                <span className="font-mono text-brand-600 text-lg">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Footer Terms & Signoff */}
          <div className="mt-12 pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400 space-y-1">
            <p>This is a computer generated tax invoice. No signature required under Rule 46 of CGST Rules, 2017.</p>
            <p>Questions or discrepancies? Contact Treadmesh Trade Desk at support@treadmesh.com or +91 (022) 6982-1100.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}