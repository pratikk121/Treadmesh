// Pages/Supplier/Products/BulkPrices.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Supplier dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

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

  // Format currency - Converts number to USD currency format
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

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
      <Head title={`${product.name} - Bulk price`} />

      <div className="space-y-6">
        {/* Header - Back button, title and action buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={route('supplier.products.edit', product.id)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bulk Pricing</h1>
              <p className="text-sm text-gray-600 mt-1">
                {product.name} - Determine volume based pricing for
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={route('supplier.products.edit', product.id)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition"
            >
              <FiX className="w-4 h-4" />
              <span>cancel</span>
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save changes'}</span>
            </button>
          </div>
        </div>

        {/* Product Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
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
              <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
              <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-sm">
                  <span className="text-gray-500">Original price:</span>{' '}
                  <span className="font-bold text-indigo-600">
                    {formatCurrency(product.base_price)} / {product.unit}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Minimum Order:</span>{' '}
                  <span className="font-medium">{product.minimum_order_quantity} {product.unit}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Pricing Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Price level</h2>
              <button
                type="button"
                onClick={addBulkPrice}
                className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <FiPlus className="w-4 h-4" />
                Add layers
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Set different prices based on order quantity to encourage bulk purchasing।
            </p>
          </div>

          <div className="p-6">
            {/* Price Comparison Preview */}
            {bulkPrices.some(bp => bp.min_quantity && bp.price) && (
              <div className="mb-6 bg-indigo-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-indigo-800 mb-3">Price Comparison</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-indigo-600">Original price:</span>
                    <span className="font-medium text-indigo-900">
                      {formatCurrency(product.base_price)} / {product.unit}
                    </span>
                  </div>
                  {bulkPrices.filter(bp => bp.min_quantity && bp.price).map((bp, index) => {
                    const discount = calculateDiscount(bp.price);
                    return (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-indigo-600">
                          {bp.min_quantity} - {bp.max_quantity || '∞'} {product.unit}:
                        </span>
                        <div className="text-right">
                          <span className="font-medium text-indigo-900">
                            {formatCurrency(bp.price)} / {product.unit}
                          </span>
                          {discount > 0 && (
                            <span className="ml-2 text-xs text-green-600">
                              ({discount}% discount)
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
              <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 uppercase">
                <div className="col-span-3">The minimum amount is</div>
                <div className="col-span-3">Maximum amount</div>
                <div className="col-span-4">Price Per Unit ($)</div>
                <div className="col-span-2">Activities</div>
              </div>

              {bulkPrices.map((price, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={price.min_quantity}
                      onChange={(e) => updateBulkPrice(index, 'min_quantity', e.target.value)}
                      placeholder="Minimum"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={price.max_quantity}
                      onChange={(e) => updateBulkPrice(index, 'max_quantity', e.target.value)}
                      placeholder="max (optional)"
                      min={price.min_quantity || 1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      value={price.price}
                      onChange={(e) => updateBulkPrice(index, 'price', e.target.value)}
                      placeholder="Price"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    {bulkPrices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBulkPrice(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {bulkPrices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No bulk price levels have been added yet. "Add layers" Click the button।
                </div>
              )}
            </div>

            {/* Information Box */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-700 font-medium">Information about bulk pricing</p>
                <ul className="mt-2 text-sm text-blue-600 list-disc list-inside space-y-1">
                  <li>To encourage bulk orders, the price must be lower than the price</li>
                  <li>Leaving the maximum amount blank indicates an unlimited range (eg: 100+)</li>
                  <li>Quantity Ranges Should Not Overlap</li>
                  <li>The system will automatically apply the best price for the ordered quantity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}