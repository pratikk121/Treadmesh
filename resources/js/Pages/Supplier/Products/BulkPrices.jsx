// Pages/Supplier/Products/BulkPrices.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Supplier dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Formatters
import { formatCurrency } from '@/Utils/formatters';

// Icons - Importing icon sets for UI elements
import {
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiInfo,
  FiArrowLeft
} from 'react-icons/fi';

// Image placeholder
const NoImg = "/noImg.jpg";

export default function BulkPrices({ product }) {

  // State management for form saving
  const [saving, setSaving] = useState(false);

  // State management for bulk pricing tiers
  const [bulkPrices, setBulkPrices] = useState(
    product.bulk_prices?.length > 0
      ? product.bulk_prices.map(bp => ({
        id: bp.id,
        price: bp.price,
        min_quantity: bp.min_quantity,
        max_quantity: bp.max_quantity,
      }))
      : [{ min_quantity: '', max_quantity: '', price: '' }]
  );

  // Add new bulk pricing tier
  const addBulkPrice = () => {
    setBulkPrices([...bulkPrices, { min_quantity: '', max_quantity: '', price: '' }]);
  };

  // Remove bulk pricing tier
  const removeBulkPrice = (index) => {
    const newPrices = bulkPrices.filter((_, i) => i !== index);
    setBulkPrices(newPrices);
  };

  // Update bulk pricing field
  const updateBulkPrice = (index, field, value) => {
    const newPrices = [...bulkPrices];
    newPrices[index][field] = value;
    setBulkPrices(newPrices);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    // Filter out empty entries
    const validPrices = bulkPrices.filter(
      bp => bp.min_quantity && bp.price
    );

    router.post(route('supplier.products.bulk-prices.update', product.id), {
      bulk_prices: validPrices
    }, {
      onSuccess: () => {
        setSaving(false);
      },
      onError: () => {
        setSaving(false);
      }
    });
  };

  // Calculate discount percentage for a price tier
  const calculateDiscount = (price) => {
    if (!price || !product.base_price) return null;
    const discount = ((product.base_price - price) / product.base_price) * 100;
    return discount.toFixed(1);
  };

  return (
    <DashboardLayout>
      <Head title={`Volume Pricing: ${product.name} | Treadmesh Supplier`} />

      <div className="space-y-6">
        {/* Header - Back button, title and action buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={route('supplier.products.edit', product.id)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-plus-jakarta">Bulk Volume Pricing</h1>
              <p className="text-sm text-slate-600 mt-1">
                Configure wholesale volume-based tiers and discount brackets for <span className="font-semibold text-slate-800">{product.name}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={route('supplier.products.edit', product.id)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition text-slate-700 font-medium text-sm"
            >
              <FiX className="w-4 h-4" />
              <span>Cancel</span>
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium text-sm shadow-xs"
            >
              <FiSave className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Product Information Card */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
              <img
                src={product.main_image ? `/storage/${product.main_image}` : NoImg}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = NoImg;
                }}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 font-plus-jakarta">{product.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">Category: {product.category}</p>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-sm">
                  <span className="text-slate-500">Base Wholesale Price:</span>{' '}
                  <span className="font-bold text-indigo-600">
                    {formatCurrency(product.base_price)} / {product.unit}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-slate-500">Minimum Order:</span>{' '}
                  <span className="font-medium text-slate-800">{product.minimum_order_quantity} {product.unit}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Pricing Form */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 font-plus-jakarta">Wholesale Pricing Tiers</h2>
              <button
                type="button"
                onClick={addBulkPrice}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-xs"
              >
                <FiPlus className="w-4 h-4" />
                Add Tier
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Set graduated discount prices based on order quantities to incentivize bulk wholesale procurement.
            </p>
          </div>

          <div className="p-6">
            {/* Price Comparison Preview */}
            {bulkPrices.some(bp => bp.min_quantity && bp.price) && (
              <div className="mb-6 bg-indigo-50/70 border border-indigo-100 rounded-lg p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-900 mb-3 font-plus-jakarta">Wholesale Tier Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-indigo-700">Base Wholesale Price:</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(product.base_price)} / {product.unit}
                    </span>
                  </div>
                  {bulkPrices.filter(bp => bp.min_quantity && bp.price).map((bp, index) => {
                    const discount = calculateDiscount(bp.price);
                    return (
                      <div key={index} className="flex items-center justify-between text-sm border-t border-indigo-100/60 pt-2">
                        <span className="text-slate-600 font-medium">
                          {bp.min_quantity} - {bp.max_quantity || '∞'} {product.unit}:
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-indigo-700">
                            {formatCurrency(bp.price)} / {product.unit}
                          </span>
                          {discount > 0 && (
                            <span className="ml-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              ({discount}% savings)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bulk Price Tiers Input */}
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 px-4 py-2.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <div className="col-span-3">Min Quantity</div>
                <div className="col-span-3">Max Quantity</div>
                <div className="col-span-4">Wholesale Price (₹)</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {bulkPrices.map((price, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={price.min_quantity}
                      onChange={(e) => updateBulkPrice(index, 'min_quantity', e.target.value)}
                      placeholder="e.g. 50"
                      min="1"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={price.max_quantity}
                      onChange={(e) => updateBulkPrice(index, 'max_quantity', e.target.value)}
                      placeholder="Optional (e.g. 200)"
                      min={price.min_quantity || 1}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      value={price.price}
                      onChange={(e) => updateBulkPrice(index, 'price', e.target.value)}
                      placeholder="Price in ₹"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {bulkPrices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBulkPrice(index)}
                        className="p-2 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                        title="Delete Tier"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {bulkPrices.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No bulk pricing tiers configured yet. Click "Add Tier" to create one.
                </div>
              )}
            </div>

            {/* Information Box */}
            <div className="mt-6 bg-slate-50 border border-slate-200/80 rounded-lg p-4 flex items-start gap-3">
              <FiInfo className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-900 font-semibold font-plus-jakarta">Wholesale Volume Pricing Guidelines</p>
                <ul className="mt-2 text-xs text-slate-600 list-disc list-inside space-y-1">
                  <li>Tiered prices should offer progressive discounts below the base wholesale price.</li>
                  <li>Leaving the maximum amount blank indicates an open tier (e.g. 500+ units).</li>
                  <li>Ensure quantity tiers do not overlap and remain contiguous.</li>
                  <li>Buyer purchase orders and RFQs will automatically inherit tiered pricing for verified Indian businesses.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}