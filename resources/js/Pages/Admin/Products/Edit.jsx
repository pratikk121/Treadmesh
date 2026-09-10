// Pages/Admin/Products/Edit.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Admin dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// sweetalert - For beautiful alert messages
import Swal from 'sweetalert2';

// Icons - Importing icon sets for UI elements
import {
  FiArrowLeft,
  FiSave,
  FiPackage,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';
import {
  MdOutlineAttachMoney
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
          title: 'successful!',
          text: 'Product updated successfully।',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (errors) => {
        setErrors(errors);
        Swal.fire({
          title: 'Error!',
          text: 'There is an error in the form. Please check।',
          icon: 'error',
          confirmButtonColor: '#4F46E5'
        });
      },
      onFinish: () => setProcessing(false)
    });
  };

  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <DashboardLayout>
      <Head title={`${product.name} - editing`} />

      <div className="space-y-6">
        {/* Header - Back button, title and save button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.products.show', product.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product editing</h1>
              <p className="text-sm text-gray-600 mt-1">
                Update product information: {product.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={processing}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="w-4 h-4" />
            <span>{processing ? 'Saving...' : 'Save changes'}</span>
          </button>
        </div>

        {/* Main Form - Grid layout for form fields */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiPackage className="w-5 h-5 text-indigo-600" />
                Basic information
              </h3>

              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    rows="6"
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Category and Unit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Eg: Electronics, Furniture"
                    />
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit *
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.unit ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Ex: Piece, kg, meter"
                    />
                    {errors.unit && (
                      <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing and Inventory Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MdOutlineAttachMoney className="w-5 h-5 text-indigo-600" />
                Price and stock
              </h3>

              <div className="space-y-4">
                {/* Base Price and MOQ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price ($) *
                    </label>
                    <input
                      type="number"
                      name="base_price"
                      value={formData.base_price}
                      onChange={handleChange}
                      min="0"
                      step="1000"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.base_price ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.base_price && (
                      <p className="mt-1 text-sm text-red-600">{errors.base_price}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum order quantity *
                    </label>
                    <input
                      type="number"
                      name="minimum_order_quantity"
                      value={formData.minimum_order_quantity}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.minimum_order_quantity ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.minimum_order_quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.minimum_order_quantity}</p>
                    )}
                  </div>
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock quantity *
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.stock_quantity ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.stock_quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk Pricing Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BsBoxSeam className="w-5 h-5 text-indigo-600" />
                  Bulk price level
                </h3>
                <button
                  type="button"
                  onClick={addBulkPrice}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                >
                  <FiPlus className="w-4 h-4" />
                  Add layers
                </button>
              </div>

              <div className="space-y-3">
                {bulkPrices.map((tier, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <div>
                        <input
                          type="number"
                          value={tier.min_quantity}
                          onChange={(e) => handleBulkPriceChange(index, 'min_quantity', e.target.value)}
                          placeholder="The minimum amount is"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                          min="0"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={tier.max_quantity || ''}
                          onChange={(e) => handleBulkPriceChange(index, 'max_quantity', e.target.value)}
                          placeholder="Maximum Quantity (Optional)"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                          min="0"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => handleBulkPriceChange(index, 'price', e.target.value)}
                          placeholder="Price"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                          min="0"
                          step="1000"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBulkPrice(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {bulkPrices.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No bulk price tier added. "Add layers" Click the button।
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Tips */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{formData.name || ''}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {formData.description || 'Product details can be found here...'}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-indigo-600">
                    {formatCurrency(formData.base_price || 0)}
                  </span>
                  <span className="text-xs text-gray-500">
                    Minimum Order: {formData.minimum_order_quantity || 0} {formData.unit}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-white rounded-full">
                    {formData.category || 'Category'}
                  </span>
                  <span className="px-2 py-1 bg-white rounded-full">
                    Stock: {formData.stock_quantity || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Editing tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Keep product names clear and descriptive</p>
                <p>• Give details including key features</p>
                <p>• Set competitive prices based on the market</p>
                <p>• Add bulk pricing tiers for volume discounts</p>
                <p>• Keep stock correct</p>
                <p>• Select Correct Category for Better Search</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}