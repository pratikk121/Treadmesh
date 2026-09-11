// resources/js/Pages/Supplier/Quotes/Edit.jsx

import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiArrowLeft,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiAlertCircle,
  FiShield,
  FiCalendar,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiInfo
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import { formatCurrency, formatIndianDate, formatQuoteStatus } from '@/Utils/formatters';

export default function EditQuote({ quote }) {
  // State management for selected products from existing quote
  const [selectedProducts, setSelectedProducts] = useState(
    (quote.product_breakdown || []).map(item => ({
      ...item,
      id: item.product_id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isCustom: !item.product_id
    }))
  );

  // Inertia form handling
  const { data, setData, put, processing, errors } = useForm({
    notes: quote.notes || '',
    total_amount: quote.total_amount || 0,
    payment_terms: quote.payment_terms || '',
    product_breakdown: quote.product_breakdown || [],
    delivery_estimate: quote.delivery_estimate || '',
    valid_until: quote.valid_until ? new Date(quote.valid_until).toISOString().split('T')[0] : '',
  });

  // Add custom product (not from catalog)
  const addCustomProduct = () => {
    const newProduct = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      product_id: null,
      name: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      isCustom: true
    };

    const newSelected = [...selectedProducts, newProduct];
    setSelectedProducts(newSelected);
    updateTotal(newSelected);
  };

  // Update product in breakdown
  const updateProduct = (index, field, value) => {
    const updated = [...selectedProducts];
    updated[index][field] = value;

    // Recalculate total price for this line item
    const qty = parseFloat(updated[index].quantity) || 0;
    const price = parseFloat(updated[index].unit_price) || 0;
    updated[index].total_price = Math.round(qty * price * 100) / 100;

    setSelectedProducts(updated);
    updateTotal(updated);
  };

  // Remove product from breakdown
  const removeProduct = (index) => {
    const updated = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updated);
    updateTotal(updated);
  };

  // Update total amount
  const updateTotal = (products) => {
    const total = products.reduce((sum, p) => sum + (parseFloat(p.total_price) || 0), 0);
    setData(prevData => ({
      ...prevData,
      total_amount: Math.round(total * 100) / 100,
      product_breakdown: products.map(({ id, isCustom, ...rest }) => rest)
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Line Items Required',
        text: 'Please specify at least one Bill of Quantities item in your quotation.',
        confirmButtonText: 'Understood',
        confirmButtonColor: '#0F172A'
      });
      return;
    }

    // Validate custom product names
    const invalidCustom = selectedProducts.some(
      p => p.isCustom && (!p.name || !p.name.trim())
    );

    if (invalidCustom) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Item Description',
        text: 'Please provide specifications / product title for all custom line items.',
        confirmButtonColor: '#0F172A'
      });
      return;
    }

    Swal.fire({
      title: 'Submit Revised Quotation?',
      text: `Are you sure you want to update Quote #${quote.quote_number}? The revised pricing and commercial terms will be updated on the buyer's evaluation dashboard.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Submit Revision',
      cancelButtonText: 'Review Details',
      confirmButtonColor: '#16A34A',
      cancelButtonColor: '#64748B'
    }).then((result) => {
      if (result.isConfirmed) {
        put(route('supplier.quotes.update', quote.id), {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Quotation Revised',
              text: `Quotation #${quote.quote_number} updated and transmitted to buyer.`,
              confirmButtonColor: '#0F172A'
            });
          },
          onError: () => {
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: 'Could not update the quotation. Please review the highlighted fields and retry.',
              confirmButtonColor: '#EF4444'
            });
          }
        });
      }
    });
  };

  // Set minimum valid until date (tomorrow)
  const minValidUntil = new Date();
  minValidUntil.setDate(minValidUntil.getDate() + 1);
  const minValidUntilStr = minValidUntil.toISOString().split('T')[0];

  return (
    <DashboardLayout>
      <Head title={`Edit Quotation #${quote.quote_number} | Treadmesh Supplier Desk`} />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header - Back button, title, actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-4">
            <Link
              href={route('supplier.quotes.show', quote.id)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              title="Return to quotation details"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Vendor Quotation Revision
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                  Draft Revision
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                Edit Quotation #{quote.quote_number}
              </h1>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <span>Associated Tender:</span>
                <Link
                  href={route('supplier.rfqs.show', quote.rfq_id)}
                  className="font-mono font-medium text-indigo-600 hover:underline"
                >
                  {quote.rfq?.rfq_number}
                </Link>
                {quote.rfq?.title && <span className="text-slate-400">• {quote.rfq.title}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href={route('supplier.quotes.show', quote.id)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition"
            >
              <FiX className="w-4 h-4 text-slate-500" />
              <span>Cancel</span>
            </Link>
            <button
              onClick={handleSubmit}
              disabled={processing || selectedProducts.length === 0}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="w-4 h-4" />
              <span>{processing ? 'Saving Revisions...' : 'Submit Revisions'}</span>
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4.5 flex items-start gap-3.5">
          <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900">Active Commercial Bid Modification</p>
            <p className="text-amber-800/90 mt-0.5">
              You are revising a submitted proposal. Any adjustments to rates, tax treatment, or delivery milestones will immediately reflect in the buyer's procurement comparison matrix. Ensure unit rates comply with applicable HSN and GST slabs.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Bill of Quantities Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Bill of Quantities (BOQ)</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Specify itemized pricing and line specifications in Indian Rupees (₹ INR)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addCustomProduct}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs rounded-xl transition border border-indigo-200/60"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    <span>Add Custom Line Item</span>
                  </button>
                </div>

                {selectedProducts.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <FiPackage className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-700">No Line Items Defined</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Click the "Add Custom Line Item" button to add products or specifications to this quotation.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 mt-2">
                    {selectedProducts.map((product, index) => (
                      <div key={product.id} className="py-4 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                Item #{index + 1}
                              </span>
                              {product.product_id ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                                  <FiCheckCircle className="w-3 h-3" />
                                  Verified Catalog Item
                                </span>
                              ) : (
                                <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                  Custom Tender Item
                                </span>
                              )}
                            </div>

                            {product.isCustom ? (
                              <input
                                type="text"
                                value={product.name || ''}
                                onChange={(e) => updateProduct(index, 'name', e.target.value)}
                                placeholder="Enter item title, grade, or material specifications..."
                                className="w-full text-sm font-medium text-slate-900 border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition placeholder:text-slate-400"
                                required
                              />
                            ) : (
                              <h3 className="font-semibold text-slate-900 text-sm">
                                {product.name || 'Catalog Item'}
                              </h3>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Remove line item"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                              Quantity / Lot Units
                            </label>
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 0)}
                              min="1"
                              className="w-full px-3 py-1.5 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                              Unit Rate (₹ INR)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                              <input
                                type="number"
                                value={product.unit_price}
                                onChange={(e) => updateProduct(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.01"
                                className="w-full pl-7 pr-3 py-1.5 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                              Line Total
                            </label>
                            <div className="h-9 px-3 flex items-center bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-mono font-bold text-slate-900">
                              {formatCurrency(product.total_price || 0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Total Summary Footer */}
                    <div className="pt-6 mt-4 border-t border-slate-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900 rounded-xl text-white">
                        <div>
                          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Total Quoted Value
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Cumulative base quote across {selectedProducts.length} line items
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                            {formatCurrency(data.total_amount)}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                            INR (Subject to applicable GST)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Commercial Terms & Validity */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Commercial Terms
                </h2>

                {/* Expiry Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bid Validity Deadline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={data.valid_until}
                      onChange={(e) => setData('valid_until', e.target.value)}
                      min={minValidUntilStr}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Date until which offered rates remain locked.
                  </p>
                  {errors.valid_until && (
                    <p className="mt-1 text-xs text-red-600">{errors.valid_until}</p>
                  )}
                </div>

                {/* Delivery Time */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Lead Time / Delivery Schedule
                  </label>
                  <input
                    type="text"
                    value={data.delivery_estimate}
                    onChange={(e) => setData('delivery_estimate', e.target.value)}
                    placeholder="e.g. 5-7 Working Days via Road Freight"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition placeholder:text-slate-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Transit estimate post dispatch clearance.
                  </p>
                </div>

                {/* Payment Terms */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Payment & Settlement Rails
                  </label>
                  <select
                    value={data.payment_terms}
                    onChange={(e) => setData('payment_terms', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition bg-white"
                  >
                    <option value="">Select Settlement Terms</option>
                    <option value="advance">100% Advance via RBI Nodal Escrow</option>
                    <option value="partial">50% Advance / 50% Post Dispatch Inspection</option>
                    <option value="delivery">100% on Dispatch / E-Way Bill Verification</option>
                    <option value="credit_7">Net 7 Days Credit (Trade Finance / LC)</option>
                    <option value="credit_15">Net 15 Days Credit</option>
                    <option value="credit_30">Net 30 Days Credit (MSME / Enterprise Terms)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Escrow payouts processed via Treadmesh Nodal Account.
                  </p>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Commercial Notes & Freight Terms
                  </label>
                  <textarea
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    rows="3"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition placeholder:text-slate-400"
                    placeholder="Provide details on GST applicability, freight inclusion (FOR/Ex-Factory), batch inspection, or packaging standards..."
                  />
                </div>
              </div>

              {/* Quotation Metadata Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Quotation Metadata
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Quotation ID</span>
                    <span className="font-mono font-semibold text-slate-800">{quote.quote_number}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Initial Submission</span>
                    <span className="font-medium text-slate-800">{formatIndianDate(quote.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Current Status</span>
                    <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full font-medium text-[11px]">
                      {formatQuoteStatus(quote.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Original Validity</span>
                    <span className="font-medium text-slate-800">{formatIndianDate(quote.valid_until)}</span>
                  </div>
                </div>
              </div>

              {/* Enterprise Bidding Standards */}
              <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-5 flex items-start gap-3">
                <FiShield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-900">
                  <p className="font-semibold text-indigo-950">B2B Compliance Note</p>
                  <ul className="mt-1.5 space-y-1 text-indigo-800/80 list-disc list-inside">
                    <li>Prices must reflect applicable HSN / GST brackets.</li>
                    <li>Freight insurance & transit damage liability must be agreed.</li>
                    <li>Dispatches require valid GST E-Way Bill generation.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}