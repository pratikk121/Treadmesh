// Pages/Buyer/Rfqs/Create.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Buyer dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
import {
  FiPlus,
  FiTrash2,
  FiPackage,
  FiCalendar,
  FiFileText,
  FiInfo,
  FiAlertCircle,
  FiArrowLeft
} from 'react-icons/fi';

export default function RfqCreate({ recentProducts, categories }) {

  // State management for form data, errors and submission status
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Form state - Initial form structure
  const [formData, setFormData] = useState({
    notes: '',
    title: '',
    description: '',
    required_by_date: '',
    products_requested: [
      {
        name: '',
        quantity: 1,
        unit: 'pcs',
        category: '',
        specifications: '',
      }
    ],
  });

  // Handle basic input field changes (non-product fields)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle product-specific field changes
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products_requested];
    updatedProducts[index][field] = value;
    setFormData(prev => ({ ...prev, products_requested: updatedProducts }));

    // Clear product field errors
    if (errors[`products_requested.${index}.${field}`]) {
      setErrors(prev => ({ ...prev, [`products_requested.${index}.${field}`]: null }));
    }
  };

  // Add new empty product row
  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products_requested: [
        ...prev.products_requested,
        {
          name: '',
          quantity: 1,
          unit: 'pcs',
          specifications: '',
          category: ''
        }
      ]
    }));
  };

  // Remove product row (minimum one product must remain)
  const removeProduct = (index) => {
    if (formData.products_requested.length > 1) {
      setFormData(prev => ({
        ...prev,
        products_requested: prev.products_requested.filter((_, i) => i !== index)
      }));
    }
  };

  // Quick select from recent products
  const useRecentProduct = (product) => {
    setFormData(prev => ({
      ...prev,
      products_requested: [
        {
          name: product.name,
          quantity: product.minimum_order_quantity || 1,
          unit: product.unit || 'pcs',
          specifications: '',
          category: product.category || ''
        }
      ]
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    // Validate title
    if (!formData.title) {
      newErrors.title = 'Title required';
    }

    // Validate required by date
    if (!formData.required_by_date) {
      newErrors.required_by_date = 'Required date required';
    } else {
      const selectedDate = new Date(formData.required_by_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.required_by_date = 'The required date must be in the future';
      }
    }

    // Validate each product
    formData.products_requested.forEach((product, index) => {
      if (!product.name) {
        newErrors[`products_requested.${index}.name`] = 'Product name required';
      }
      if (!product.quantity || product.quantity < 1) {
        newErrors[`products_requested.${index}.quantity`] = 'Valid amount required';
      }
      if (!product.unit) {
        newErrors[`products_requested.${index}.unit`] = 'Unit required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    router.post(route('buyer.rfqs.store'), formData, {
      onSuccess: () => {
        setSubmitting(false);
      },
      onError: (errors) => {
        setErrors(errors);
        setSubmitting(false);
      }
    });
  };

  return (
    <DashboardLayout>
      <Head title="Create new RFQ" />

      <div className="space-y-6">
        {/* Header - Back button and page title */}
        <div className="flex items-center space-x-4">
          <Link
            href={route('buyer.rfqs.index')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create new RFQ</h2>
            <p className="text-gray-600 mt-1">Request Quotes from Verified Suppliers</p>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recent Products Quick Select - Optional feature */}
          {recentProducts?.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <FiPackage className="mr-2" /> Quick selection from recent products
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => useRecentProduct(product)}
                    className="px-3 py-2 bg-white rounded-lg text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors border"
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiFileText className="mr-2" /> Basic information
            </h3>

            <div className="space-y-4">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RFQ Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Eg: Office stationery supplies required"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.title ? 'border-red-500' : ''
                    }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="mr-1" /> {errors.title}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Provide additional details about your requirements..."
                  className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Products Requested Section */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700 flex items-center">
                <FiPackage className="mr-2" /> Necessary products <span className="text-red-500 ml-1">*</span>
              </h3>
              <button
                type="button"
                onClick={addProduct}
                className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm flex items-center"
              >
                <FiPlus className="mr-1" /> Add product
              </button>
            </div>

            <div className="space-y-4">
              {formData.products_requested.map((product, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                  {/* Remove button - only shown if more than one product */}
                  {formData.products_requested.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Product Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                         <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                        placeholder="For example: A4 paper"
                        className={`w-full border rounded-lg px-3 py-2 text-sm ${errors[`products_requested.${index}.name`] ? 'border-red-500' : ''
                          }`}
                      />
                      {errors[`products_requested.${index}.name`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`products_requested.${index}.name`]}</p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        className={`w-full border rounded-lg px-3 py-2 text-sm ${errors[`products_requested.${index}.quantity`] ? 'border-red-500' : ''
                          }`}
                      />
                      {errors[`products_requested.${index}.quantity`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`products_requested.${index}.quantity`]}</p>
                      )}
                    </div>

                    {/* Unit */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Unit <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={product.unit}
                        onChange={(e) => handleProductChange(index, 'unit', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm ${errors[`products_requested.${index}.unit`] ? 'border-red-500' : ''
                          }`}
                      >
                        <option value="pcs">Piece (pcs)</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="g">the village (g)</option>
                        <option value="ton">tons</option>
                        <option value="m">meter (m)</option>
                        <option value="cm">Centimeter (cm)</option>
                        <option value="l">Liter (l)</option>
                        <option value="ml">milliliter (ml)</option>
                        <option value="box">Box</option>
                        <option value="pack">pack</option>
                        <option value="set">Set</option>
                      </select>
                      {errors[`products_requested.${index}.unit`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`products_requested.${index}.unit`]}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Category (Optional)
                      </label>
                      <select
                        value={product.category}
                        onChange={(e) => handleProductChange(index, 'category', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="">Category selection</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Specifications */}
                    <div className="md:col-span-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Details (Optional)
                      </label>
                      <textarea
                        value={product.specifications}
                        onChange={(e) => handleProductChange(index, 'specifications', e.target.value)}
                        rows="2"
                        placeholder="Ex: Size: A4, Weight: 80gsm, Brand: Any"
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiInfo className="mr-2" /> Additional information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Required By Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    name="required_by_date"
                    value={formData.required_by_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-10 border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.required_by_date ? 'border-red-500' : ''
                      }`}
                  />
                </div>
                {errors.required_by_date && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="mr-1" /> {errors.required_by_date}
                  </p>
                )}
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Special requirements or instructions for suppliers..."
                  className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions - Submit and Cancel buttons */}
          <div className="flex justify-end space-x-3">
            <Link
              href={route('buyer.rfqs.index')}
              className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Submit RFQ'
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}