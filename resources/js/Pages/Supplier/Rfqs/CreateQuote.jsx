// resources/js/Pages/Supplier/Rfqs/CreateQuote.jsx

import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  formatCurrency,
  formatIndianDate
} from '@/Utils/formatters';
import {
  FiArrowLeft,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiPackage,
  FiAlertCircle,
  FiClock,
  FiDollarSign,
  FiLayers,
  FiShield,
  FiSend
} from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function CreateQuote({ rfq, products, requestedProducts }) {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const { data, setData, post, processing, errors } = useForm({
    total_amount: 0,
    valid_until: '',
    product_breakdown: [],
    notes: '',
    delivery_estimate: '',
    payment_terms: ''
  });

  const addProduct = (product) => {
    const exists = selectedProducts.find(p => p.id === product.id);
    if (exists) return;

    const newProduct = {
      product_id: product.id,
      name: product.name,
      quantity: product.minimum_order_quantity || 1,
      unit_price: product.base_price,
      total_price: (product.minimum_order_quantity || 1) * product.base_price
    };

    const newSelected = [...selectedProducts, newProduct];
    setSelectedProducts(newSelected);
    updateTotal(newSelected);
  };

  const updateProduct = (index, field, value) => {
    const updated = [...selectedProducts];
    updated[index][field] = value;
    updated[index].total_price = (updated[index].quantity || 0) * (updated[index].unit_price || 0);

    setSelectedProducts(updated);
    updateTotal(updated);
  };

  const removeProduct = (index) => {
    const updated = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updated);
    updateTotal(updated);
  };

  const updateTotal = (products) => {
    const total = products.reduce((sum, p) => sum + (Number(p.total_price) || 0), 0);
    setData('total_amount', total);
    setData('product_breakdown', products);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Product Required",
        text: "Please add at least one line item to your quotation.",
        confirmButtonText: "OK"
      });
      return;
    }

    if (!data.valid_until) {
      Swal.fire({
        icon: "warning",
        title: "Validity Required",
        text: "Please set the validity expiration date for this quotation.",
        confirmButtonText: "OK"
      });
      return;
    }

    Swal.fire({
      title: "Submit Commercial Quotation?",
      text: `Are you sure you want to submit this quotation for ${formatCurrency(data.total_amount)} to the buyer?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit Quotation",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a"
    }).then((result) => {
      if (result.isConfirmed) {
        post(route("supplier.rfqs.store-quote", rfq.id), {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Quotation Submitted",
              text: "Your formal bid has been transmitted to the buyer.",
              timer: 2000,
              showConfirmButton: false
            });
          },
          onError: () => {
            Swal.fire({
              icon: "error",
              title: "Submission Error",
              text: "Could not submit quotation. Please check highlighted fields."
            });
          }
        });
      }
    });
  };

  const minValidUntil = new Date();
  minValidUntil.setDate(minValidUntil.getDate() + 1);
  const minValidUntilStr = minValidUntil.toISOString().split('T')[0];

  return (
    <DashboardLayout>
      <Head title={`Submit Quotation - RFQ #${rfq.rfq_number}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-4">
            <Link
              href={route('supplier.rfqs.show', rfq.id)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="Back to Tender"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Tender #{rfq.rfq_number}
                </span>
                <span className="text-xs text-slate-400">· {rfq.title}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Prepare Commercial Quotation
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={route('supplier.rfqs.show', rfq.id)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={processing || selectedProducts.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <FiSend className="w-3.5 h-3.5" />
              <span>{processing ? 'Submitting Quotation...' : 'Submit Quotation'}</span>
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Products & Itemization */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tender Scope Summary */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Buyer Scope of Work & Deliverables
                </h2>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Required Delivery Date</span>
                    <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                      {formatIndianDate(rfq.required_by_date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Requested Total Volume</span>
                    <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                      {rfq.quantity || 'Specified in Line Items'}
                    </span>
                  </div>
                </div>

                {requestedProducts.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500 block mb-1.5 font-medium">Buyer Requested Categories:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {requestedProducts.map((item, index) => (
                        <span key={index} className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 font-medium rounded-lg">
                          {item.category || item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Add Products from Catalog */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <FiPackage className="w-4 h-4 text-indigo-600" />
                    Select from Your Verified Catalog
                  </h2>
                  <span className="text-xs text-slate-400">
                    {products.length} Products Available
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                  {products.map((product) => {
                    const isAdded = selectedProducts.some(p => p.id === product.id);
                    return (
                      <div
                        key={product.id}
                        className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 text-xs">{product.name}</p>
                          <p className="text-[11px] text-slate-500">
                            Base: <strong className="text-indigo-600 font-mono">{formatCurrency(product.base_price)}</strong>/{product.unit || 'unit'} · MOQ: {product.minimum_order_quantity || 1}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addProduct(product)}
                          disabled={isAdded}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                            isAdded
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          <FiPlus className="w-3.5 h-3.5" />
                          {isAdded ? 'Added' : 'Add to Bid'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quotation Line Items Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FiLayers className="w-4 h-4 text-emerald-600" />
                  Itemized Quotation Line Items ({selectedProducts.length})
                </h2>

                {selectedProducts.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                    Add products from the catalog above to populate your quotation proposal.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedProducts.map((product, index) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{product.name}</span>
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove Line Item"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 0)}
                              min="1"
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                              Unit Price (₹)
                            </label>
                            <input
                              type="number"
                              value={product.unit_price}
                              onChange={(e) => updateProduct(index, 'unit_price', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                              Line Total (₹)
                            </label>
                            <div className="px-3 py-1.5 text-xs font-mono font-bold text-indigo-600 bg-white rounded-lg border border-slate-200 flex items-center h-[34px]">
                              {formatCurrency(product.total_price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-700 text-sm">Total Quoted Commercial Value:</span>
                      <span className="text-2xl font-extrabold text-slate-900 font-mono">
                        {formatCurrency(data.total_amount)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Validity, Delivery, & Terms */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Commercial Terms & Validity
                </h2>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Quotation Validity Deadline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={data.valid_until}
                    onChange={(e) => setData('valid_until', e.target.value)}
                    min={minValidUntilStr}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                    required
                  />
                  {errors.valid_until && (
                    <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.valid_until}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Estimated Dispatch Timeline
                  </label>
                  <input
                    type="text"
                    value={data.delivery_estimate}
                    onChange={(e) => setData('delivery_estimate', e.target.value)}
                    placeholder="e.g. 5-7 business days dispatch via E-Way Bill"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Agreed Settlement Terms
                  </label>
                  <select
                    value={data.payment_terms}
                    onChange={(e) => setData('payment_terms', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">Select settlement rail...</option>
                    <option value="advance">100% Nodal Escrow Advance</option>
                    <option value="partial">50% Advance Escrow / 50% on E-Way Bill Delivery</option>
                    <option value="delivery">100% Escrow Release upon Consignee Acceptance</option>
                    <option value="credit_15">Net 15 Days Commercial Credit (Verified Buyers)</option>
                    <option value="credit_30">Net 30 Days Commercial Credit (Corporate / MSME)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Commercial Remarks / Exclusions
                  </label>
                  <textarea
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                    placeholder="Provide freight inclusion notes, GST rates applicable, warranty details..."
                  />
                </div>
              </div>

              {/* Indian Procurement Compliance Badge */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs space-y-2 text-slate-600">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <FiShield className="w-4 h-4 text-indigo-600" />
                  <span>GST & Commercial Standards</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Submitting this quotation constitutes an official commercial offer. Upon buyer acceptance, a Purchase Order subject to E-Way bill generation and Nodal Escrow will be formed.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}