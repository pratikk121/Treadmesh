// Pages/Supplier/Quotes/Edit.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

// Layout - Supplier dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
import {
  FiArrowLeft,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiAlertCircle
} from 'react-icons/fi';

// sweetalert - For beautiful alert messages
import Swal from 'sweetalert2';

export default function EditQuote({ quote }) {
  // State management for selected products from existing quote
  const [selectedProducts, setSelectedProducts] = useState(
    quote.product_breakdown.map(item => ({
      ...item,
      id: item.product_id || `temp-${Date.now()}-${Math.random()}`,
      isCustom: !item.product_id
    }))
  );

  // Inertia form handling
  const { data, setData, put, processing, errors } = useForm({
    notes: quote.notes || '',
    total_amount: quote.total_amount,
    payment_terms: quote.payment_terms || '',
    product_breakdown: quote.product_breakdown,
    delivery_estimate: quote.delivery_estimate || '',
    valid_until: quote.valid_until ? new Date(quote.valid_until).toISOString().split('T')[0] : '',
  });

  // Format currency - Converts number to USD currency format
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Add custom product (not from your catalog)
  const addCustomProduct = () => {
    const newProduct = {
      id: `temp-${Date.now()}-${Math.random()}`,
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

    // Recalculate total price
    updated[index].total_price = updated[index].quantity * updated[index].unit_price;

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
    const total = products.reduce((sum, p) => sum + p.total_price, 0);
    setData('total_amount', total);
    setData('product_breakdown', products.map(({ id, isCustom, ...rest }) => rest));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Add product',
        text: 'Please add at least one product to your quote',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validate custom product names
    const invalidCustom = selectedProducts.some(
      p => p.isCustom && !p.name.trim()
    );

    if (invalidCustom) {
      Swal.fire({
        icon: 'warning',
        title: 'Data is incomplete',
        text: 'Please provide all custom product names'
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this quote?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'No',
      confirmButtonColor: '#16a34a'
    }).then((result) => {
      if (result.isConfirmed) {
        put(route('supplier.quotes.update', quote.id), {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Quote successfully updated'
            });
          },
          onError: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Quote could not be updated'
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
      <Head title={`Quote #${quote.quote_number} - editing`} />

      <div className="space-y-6">
        {/* Header - Back button, title and action buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={route('supplier.quotes.show', quote.id)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Quote</h1>
              <p className="text-sm text-gray-600 mt-1">
                Quote #{quote.quote_number} - RFQ: {quote.rfq?.rfq_number} {quote.rfq?.title && `- ${quote.rfq?.title}`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={route('supplier.quotes.show', quote.id)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition"
            >
              <FiX className="w-4 h-4" />
              <span>cancel</span>
            </Link>
            <button
              onClick={handleSubmit}
              disabled={processing || selectedProducts.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>{processing ? 'Updating...' : 'Update Quote'}</span>
            </button>
          </div>
        </div>

        {/* Info Alert - Editing a pending quote */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <FiAlertCircle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-700 font-medium">
                You are editing a pending quote
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                Changes will be immediately visible to the buyer. Make sure all information is correct.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Quote Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Quote Items */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Quote Items</h2>
                  <button
                    type="button"
                    onClick={addCustomProduct}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add custom item
                  </button>
                </div>

                {selectedProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Add items to your quote
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedProducts.map((product, index) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            {product.isCustom ? (
                              <input
                                type="text"
                                value={product.name}
                                onChange={(e) => updateProduct(index, 'name', e.target.value)}
                                placeholder=""
                                className="font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:border-indigo-600 focus:outline-none px-1 py-0.5 w-full"
                                required
                              />
                            ) : (
                              <h3 className="font-medium text-gray-900">{product.name}</h3>
                            )}
                            {product.product_id && (
                              <p className="text-xs text-green-600 mt-1">from your catalog</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="p-1 text-red-500 hover:text-red-700 ml-2"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Amount</label>
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 0)}
                              min="1"
                              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Single price ($)</label>
                            <input
                              type="number"
                              value={product.unit_price}
                              onChange={(e) => updateProduct(index, 'unit_price', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">total</label>
                            <p className="font-medium text-indigo-600 pt-1">
                              {formatCurrency(product.total_price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Quote Total */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total Quote Amount</span>
                        <span className="text-2xl font-bold text-indigo-600">
                          {formatCurrency(data.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Quote Details */}
            <div className="space-y-6">
              {/* Quote Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Details</h2>

                <div className="space-y-4">
                  {/* Valid Until */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expires <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={data.valid_until}
                      onChange={(e) => setData('valid_until', e.target.value)}
                      min={minValidUntilStr}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      required
                    />
                    {errors.valid_until && (
                      <p className="mt-1 text-sm text-red-600">{errors.valid_until}</p>
                    )}
                  </div>

                  {/* Delivery Estimate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery time
                    </label>
                    <input
                      type="text"
                      value={data.delivery_estimate}
                      onChange={(e) => setData('delivery_estimate', e.target.value)}
                      placeholder="Eg: 5-7 working days"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>

                  {/* Payment Terms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Terms
                    </label>
                    <select
                      value={data.payment_terms}
                      onChange={(e) => setData('payment_terms', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    >
                      <option value="">Select payment terms</option>
                      <option value="advance">100% advance</option>
                      <option value="partial">50% in advance, 50% on delivery</option>
                      <option value="delivery">Payment on delivery</option>
                      <option value="credit_7">7 days credit</option>
                      <option value="credit_15">15 days credit</option>
                      <option value="credit_30">30 days credit</option>
                    </select>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      value={data.notes}
                      onChange={(e) => setData('notes', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="Any additional information for the buyer..."
                    />
                  </div>
                </div>
              </div>

              {/* Original Quote Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Basic Quote Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quote Number</span>
                    <span className="font-medium text-gray-900">{quote.quote_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submission Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(quote.created_at).toLocaleDateString('en-US')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Awaiting
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Original Expires</span>
                    <span className="font-medium text-gray-900">
                      {new Date(quote.valid_until).toLocaleDateString('en-US')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Box - Editing Tips */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Editing tips</p>
                    <ul className="mt-2 text-xs text-blue-600 list-disc list-inside space-y-1">
                      <li>You can add custom items not in your catalog</li>
                      <li>The updated quote will be re-sent to the buyer</li>
                      <li>Keep prices competitive</li>
                      <li>The expiration date must be in the future</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}