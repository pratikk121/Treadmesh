// resources/js/Pages/Supplier/Rfqs/EditQuote.jsx

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
  FiFileText,
  FiAlertCircle,
  FiShield,
  FiClock
} from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function EditQuote({ quote, products }) {
  const [selectedProducts, setSelectedProducts] = useState(
    quote.product_breakdown?.map(item => ({
      ...item,
      isExistingProduct: products.some(p => p.id === item.product_id)
    })) || []
  );

  const { data, setData, put, processing, errors } = useForm({
    total_amount: quote.total_amount,
    product_breakdown: quote.product_breakdown || [],
    valid_until: quote.valid_until ? new Date(quote.valid_until).toISOString().split('T')[0] : '',
    notes: quote.notes || '',
    payment_terms: quote.payment_terms || '',
    delivery_estimate: quote.delivery_estimate || '',
  });

  const addProduct = (product) => {
    const exists = selectedProducts.find(p => p.product_id === product.id);
    if (exists) return;

    const newProduct = {
      product_id: product.id,
      name: product.name,
      quantity: product.minimum_order_quantity || 1,
      unit_price: product.base_price,
      total_price: (product.minimum_order_quantity || 1) * product.base_price,
      isExistingProduct: true
    };

    const newSelected = [...selectedProducts, newProduct];
    setSelectedProducts(newSelected);
    updateTotal(newSelected);
  };

  const addCustomProduct = () => {
    const newProduct = {
      product_id: null,
      name: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      isCustom: true,
      isExistingProduct: false,
    };

    const newSelected = [...selectedProducts, newProduct];
    setSelectedProducts(newSelected);
  };

  const updateProduct = (index, field, value) => {
    const updated = [...selectedProducts];
    updated[index][field] = value;
    updated[index].total_price = (Number(updated[index].quantity) || 0) * (Number(updated[index].unit_price) || 0);

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
    setData('product_breakdown', products.map(({ isExistingProduct, isCustom, ...rest }) => rest));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Product Required",
        text: "Please add at least one line item to your quotation."
      });
      return;
    }

    const invalidCustom = selectedProducts.some(
      (p) => p.isCustom && !p.name.trim()
    );

    if (invalidCustom) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please specify item names for all custom quotation line items."
      });
      return;
    }

    Swal.fire({
      title: "Update Quotation Proposal?",
      text: `Update Quote #${quote.quote_number} for revised total of ${formatCurrency(data.total_amount)}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Update Quote",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a"
    }).then((result) => {
      if (result.isConfirmed) {
        put(route("supplier.rfqs.quote.update", quote.id), {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Quotation Updated",
              text: "Revised commercial proposal submitted to buyer.",
              timer: 1800,
              showConfirmButton: false
            });
          },
          onError: () => {
            Swal.fire({
              icon: "error",
              title: "Update Error",
              text: "Could not update quotation. Please check highlighted fields."
            });
          }
        });
      }
    });
  };

  const minValidUntil = new Date();
  minValidUntil.setDate(minValidUntil.getDate() + 1);
  const minValidUntilStr = minValidUntil.toISOString().split('T')[0];

  const availableProducts = products.filter(
    p => !selectedProducts.some(sp => sp.product_id === p.id)
  );

  return (
    <DashboardLayout>
      <Head title={`Revise Quote #${quote.quote_number}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-4">
            <Link
              href={route('supplier.rfqs.my-quotes')}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="Back to My Quotes"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  Quote #{quote.quote_number}
                </span>
                <span className="text-xs text-slate-400">· Tender #{quote.rfq?.rfq_number}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Revise Commercial Quotation
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={route('supplier.rfqs.my-quotes')}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={processing || selectedProducts.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <FiSave className="w-3.5 h-3.5" />
              <span>{processing ? 'Saving Revisions...' : 'Save & Resubmit Quote'}</span>
            </button>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs">
          <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900">Active Procurement Proposal Under Evaluation</p>
            <p className="text-amber-700 mt-0.5">
              Updates to line item pricing or delivery terms will immediately reflect on the buyer's evaluation matrix.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Line Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Line Items Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <FiPackage className="w-4 h-4 text-indigo-600" />
                    Quotation Line Items & Quantities
                  </h2>
                  <button
                    type="button"
                    onClick={addCustomProduct}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    Add Custom Line Item
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedProducts.map((product, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          {product.isCustom ? (
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) => updateProduct(index, 'name', e.target.value)}
                              placeholder="Specify Item / Material Name..."
                              className="font-bold text-slate-900 text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 w-full focus:ring-2 focus:ring-indigo-500"
                              required
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">{product.name}</span>
                              {product.isExistingProduct && (
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                                  Catalog Item
                                </span>
                              )}
                            </div>
                          )}
                        </div>
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
                    <span className="font-bold text-slate-700 text-sm">Revised Total Commercial Bid:</span>
                    <span className="text-2xl font-extrabold text-slate-900 font-mono">
                      {formatCurrency(data.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add from Catalog Available Products */}
              {availableProducts.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Add Remaining Catalog Inventory
                  </h2>
                  <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                    {availableProducts.map((product) => (
                      <div key={product.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{product.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{formatCurrency(product.base_price)}/{product.unit}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addProduct(product)}
                          className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <FiPlus className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Validity & Commercials */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Proposal Parameters
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
                    placeholder="e.g. 3-5 days dispatch"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Commercial Settlement Rail
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
                    <option value="credit_15">Net 15 Days Commercial Credit</option>
                    <option value="credit_30">Net 30 Days Commercial Credit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Commercial Remarks
                  </label>
                  <textarea
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                    placeholder="Provide revision rationale or freight dispatch specifics..."
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}