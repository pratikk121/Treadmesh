// Pages/Admin/Products/Edit.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Admin dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatCurrency } from '@/Utils/formatters';

// sweetalert - For beautiful alert messages
import Swal from 'sweetalert2';

// Icons - Importing icon sets for UI elements
import {
  FiArrowLeft,
  FiSave,
  FiPackage,
  FiPlus,
  FiTrash2,
  FiLayers,
  FiCheckCircle,
} from 'react-icons/fi';
import {
  MdOutlineAttachMoney,
  MdOutlineCategory,
} from 'react-icons/md';
import { BsBoxSeam } from 'react-icons/bs';

export default function Edit({ product }) {
  // State management for form data and UI controls
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    category: product.category,
    base_price: product.base_price,
    minimum_order_quantity: product.minimum_order_quantity,
    unit: product.unit,
    stock_quantity: product.stock_quantity,
    status: product.status,
  });

  const [bulkPrices, setBulkPrices] = useState(product.bulk_prices || []);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('price') || name.includes('quantity') ? parseFloat(value) || 0 : value
    }));
  };

  // Handle bulk price tier changes
  const handleBulkPriceChange = (index, field, value) => {
    const updatedPrices = [...bulkPrices];
    updatedPrices[index] = {
      ...updatedPrices[index],
      [field]: field.includes('quantity') || field === 'price' ? parseFloat(value) || 0 : value
    };
    setBulkPrices(updatedPrices);
  };

  // Add new bulk price tier
  const addBulkPrice = () => {
    setBulkPrices([
      ...bulkPrices,
      {
        min_quantity: 0,
        max_quantity: null,
        price: formData.base_price
      }
    ]);
  };

  // Remove bulk price tier
  const removeBulkPrice = (index) => {
    setBulkPrices(bulkPrices.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    router.put(route('admin.products.update', product.id), {
      ...formData,
      bulk_prices: bulkPrices
    }, {
      onSuccess: () => {
        Swal.fire({
          title: 'Success!',
          text: 'Product specifications and pricing updated successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (errs) => {
        setErrors(errs);
        Swal.fire({
          title: 'Validation Error',
          text: 'Please review highlighted fields and correct the errors.',
          icon: 'error',
          confirmButtonColor: '#4F46E5'
        });
      },
      onFinish: () => setProcessing(false)
    });
  };

  return (
    <DashboardLayout>
      <Head title={`${product.name} - Edit Product - Treadmesh Admin`} />

      <div className="space-y-6">
        {/* Header - Back button, title and save button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.products.show', product.id)}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {product.category}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 font-medium">SKU: {product.slug || product.id}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">Edit Product Specifications</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Update commercial pricing, MOQ, inventory level, and volume discount tiers for {product.name}.
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={processing}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="w-4 h-4" />
            <span>{processing ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiPackage className="w-4 h-4 text-indigo-600" />
                <span>Core Product Information</span>
              </h3>

              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? 'border-rose-500 bg-rose-50/50' : 'border-gray-200'
                      }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Detailed Specification & Technical Scope *
                  </label>
                  <textarea
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed ${errors.description ? 'border-rose-500 bg-rose-50/50' : 'border-gray-200'
                      }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-rose-600">{errors.description}</p>
                  )}
                </div>

                {/* Category and Unit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Industrial Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.category ? 'border-rose-500 bg-rose-50/50' : 'border-gray-200'
                        }`}
                      placeholder="e.g., Industrial Electrical, Machinery Parts, Safety Equipment"
                    />
                    {errors.category && (
                      <p className="mt-1 text-xs text-rose-600">{errors.category}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Unit of Measure (UOM) *
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.unit ? 'border-rose-500 bg-rose-50/50' : 'border-gray-200'
                        }`}
                      placeholder="e.g., Piece, Metric Ton, Kg, Box, Meter"
                    />
                    {errors.unit && (
                      <p className="mt-1 text-xs text-rose-600">{errors.unit}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing and Inventory Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-indigo-600 font-bold">₹</span>
                <span>Commercial Pricing & Inventory</span>
              </h3>

              <div className="space-y-4">
                {/* Base Price and MOQ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Base Unit Price (₹ Excl. GST) *
                    </label>
                    <input
                      type="number"
                      name="base_price"
                      value={formData.base_price}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.base_price ? 'border-rose-500 bg-rose-50/50' : 'border-gray-200'
                        }`}
                    />
                    {errors.base_price && (
                      <p className="mt-1 text-xs text-rose-600">{errors.base_price}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Minimum Order Quantity (MOQ) *
                    </label>
                    <input
                      type="number"
                      name="minimum_order_quantity"
                      value={formData.minimum_order_quantity}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.minimum_order_quantity ? 'border-rose-500 bg-rose-50/50' : 'border-gray-200'
                        }`}
                    />
                    {errors.minimum_order_quantity && (
                      <p className="mt-1 text-xs text-rose-600">{errors.minimum_order_quantity}</p>
                    )}
                  </div>
                </div>

                {/* Stock Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Available Stock Quantity ({formData.unit || 'Units'}) *
                    </label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.stock_quantity ? 'border-rose-500 bg-rose-50/50' : 'border-gray-200'
                        }`}
                    />
                    {errors.stock_quantity && (
                      <p className="mt-1 text-xs text-rose-600">{errors.stock_quantity}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Marketplace Review Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved & Live</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Pricing Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <FiLayers className="w-4 h-4 text-indigo-600" />
                    <span>Tiered Volume Wholesale Discounts</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Tiered rates automatically apply when buyers purchase above MOQ thresholds.</p>
                </div>
                <button
                  type="button"
                  onClick={addBulkPrice}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Add Tier</span>
                </button>
              </div>

              <div className="space-y-3">
                {bulkPrices.map((tier, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1">Min Qty</label>
                        <input
                          type="number"
                          value={tier.min_quantity}
                          onChange={(e) => handleBulkPriceChange(index, 'min_quantity', e.target.value)}
                          placeholder="Min Qty"
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1">Max Qty (Optional)</label>
                        <input
                          type="number"
                          value={tier.max_quantity || ''}
                          onChange={(e) => handleBulkPriceChange(index, 'max_quantity', e.target.value)}
                          placeholder="Leave blank for +"
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1">Price per Unit (₹)</label>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => handleBulkPriceChange(index, 'price', e.target.value)}
                          placeholder="Unit Price"
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                          min="0"
                          step="1"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBulkPrice(index)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition mt-4"
                      title="Remove Tier"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {bulkPrices.length === 0 && (
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 border-dashed text-center text-xs text-gray-500">
                    No tiered volume discounts configured. Click <span className="font-semibold text-indigo-600">"Add Tier"</span> to define quantity-based discount pricing.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Tips */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Live Listing Preview</h3>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-900 text-base">{formData.name || 'Untitled Product'}</h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {formData.description || 'Product details will display here...'}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xl font-bold text-indigo-600">
                    {formatCurrency(formData.base_price || 0)}
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    MOQ: {formData.minimum_order_quantity || 1} {formData.unit || 'Piece'}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 bg-white border border-gray-200 rounded-full text-gray-700 font-medium">
                    {formData.category || 'Category'}
                  </span>
                  <span className="px-2.5 py-0.5 bg-white border border-gray-200 rounded-full text-emerald-700 font-medium">
                    Stock: {Number(formData.stock_quantity || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Catalog Quality Guidelines</h3>
              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Keep product names standard, avoiding generic internal codes.</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Provide comprehensive technical specs, tolerances, and certifications.</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Set competitive Indian market rates aligned with Make-in-India benchmarks.</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Add volume discount tiers to incentivize bulk institutional POs.</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Maintain real-time inventory counts to prevent procurement delays.</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}