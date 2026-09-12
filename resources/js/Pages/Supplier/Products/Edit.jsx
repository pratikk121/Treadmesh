// Pages/Supplier/Products/Edit.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';

// Layout - Supplier dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Formatters
import { formatIndianDate } from '@/Utils/formatters';

// Icons - Importing icon sets for UI elements
import {
  FiSave,
  FiX,
  FiUpload,
  FiPlus,
  FiTrash2,
  FiClock
} from 'react-icons/fi';

// Image placeholder
const NoImg = "/noImg.jpg";

export default function EditProduct({ product, categories, units }) {
  // State management for bulk pricing tiers and image previews
  const [bulkPrices, setBulkPrices] = useState(
    product.bulk_prices?.length > 0
      ? product.bulk_prices.map(bp => ({
        id: bp.id,
        min_quantity: bp.min_quantity,
        max_quantity: bp.max_quantity,
        price: bp.price
      }))
      : [{ min_quantity: '', max_quantity: '', price: '' }]
  );

  // State management for main image and additional images
  const [newAdditionalImages, setNewAdditionalImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(product.main_image ? `/storage/${product.main_image}` : null);

  // State management for main image and additional images
  const [additionalImages, setAdditionalImages] = useState(
    product.additional_images
      ? JSON.parse(product.additional_images).map(img => ({ path: img, preview: `/storage/${img}` }))
      : []
  );

  // Inertia form handling
  const { data, setData, put, processing, errors, progress } = useForm({
    main_image: null,
    additional_images: [],
    bulk_prices: bulkPrices,
    name: product.name || '',
    unit: product.unit || 'piece',
    category: product.category || '',
    status: product.status || 'pending',
    base_price: product.base_price || '',
    description: product.description || '',
    stock_quantity: product.stock_quantity || 0,
    minimum_order_quantity: product.minimum_order_quantity || 1,
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Filter out empty bulk prices
    const validBulkPrices = bulkPrices.filter(
      bp => bp.min_quantity && bp.price
    );

    put(route('supplier.products.update', product.id), {
      data: {
        ...data,
        bulk_prices: validBulkPrices
      },
      preserveScroll: true
    });
  };

  // Handle main image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('main_image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle additional images selection
  const handleAdditionalImages = (e) => {
    const files = Array.from(e.target.files);
    setData('additional_images', [...data.additional_images, ...files]);

    // Create previews for new images
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAdditionalImages(prev => [...prev, { file, preview: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    if (confirm('Are you sure you want to remove this image?')) {
      const updatedImages = [...additionalImages];
      updatedImages.splice(index, 1);
      setAdditionalImages(updatedImages);

      // Update the product's additional_images
      const imagePaths = updatedImages.map(img => img.path);
      router.post(route('supplier.products.update-images', product.id), {
        additional_images: imagePaths
      }, {
        preserveScroll: true
      });
    }
  };

  // Remove newly added image (not yet saved)
  const removeNewImage = (index) => {
    const newImages = [...data.additional_images];
    newImages.splice(index, 1);
    setData('additional_images', newImages);

    const newPreviews = [...newAdditionalImages];
    newPreviews.splice(index, 1);
    setNewAdditionalImages(newPreviews);
  };

  // Add new bulk pricing tier
  const addBulkPrice = () => {
    setBulkPrices([...bulkPrices, { min_quantity: '', max_quantity: '', price: '' }]);
  };

  // Remove bulk pricing tier
  const removeBulkPrice = (index) => {
    const newPrices = bulkPrices.filter((_, i) => i !== index);
    setBulkPrices(newPrices);
    setData('bulk_prices', newPrices);
  };

  // Update bulk pricing field
  const updateBulkPrice = (index, field, value) => {
    const newPrices = [...bulkPrices];
    newPrices[index][field] = value;
    setBulkPrices(newPrices);
    setData('bulk_prices', newPrices);
  };

  // Get status badge based on product status
  const getStatusBadge = () => {
    const status = product.status;
    if (status === 'active') {
      return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">Active SKU</span>;
    } else if (status === 'pending') {
      return <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">Verification Pending</span>;
    } else {
      return <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-semibold">Delisted / Inactive</span>;
    }
  };

  return (
    <DashboardLayout>
      <Head title={`Edit Product: ${product.name} | Treadmesh Supplier`} />

      <div className="space-y-6">
        {/* Header - Page title, status badge and action buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-plus-jakarta">Edit Catalog SKU</h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage specifications, wholesale pricing tiers, and inventory levels
              </p>
            </div>
            {getStatusBadge()}
          </div>
          <div className="flex gap-2">
            <Link
              href={route('supplier.products.index')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition text-slate-700 font-medium text-sm"
            >
              <FiX className="w-4 h-4" />
              <span>Cancel</span>
            </Link>
            <button
              onClick={handleSubmit}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium text-sm shadow-xs"
            >
              <FiSave className="w-4 h-4" />
              <span>{processing ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Status Message for Pending Products */}
        {product.status === 'pending' && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
            <div className="flex items-start">
              <FiClock className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-semibold font-plus-jakarta">
                  SKU Pending Admin Verification
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Modifications will be reviewed by Treadmesh administration prior to live buyer catalog deployment. The SKU remains pending until verified.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Section */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 font-plus-jakarta">Basic Product Information</h2>

                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Product / SKU Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      required
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={data.category}
                      onChange={e => setData('category', e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Product Description & Technical Specifications <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={data.description}
                      onChange={e => setData('description', e.target.value)}
                      rows="6"
                      className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      required
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory Section */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 font-plus-jakarta">Wholesale Pricing & Inventory</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Base Price */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Wholesale Base Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={data.base_price}
                      onChange={e => setData('base_price', e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium"
                      required
                    />
                    {errors.base_price && (
                      <p className="mt-1 text-sm text-red-600">{errors.base_price}</p>
                    )}
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Unit of Measure <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={data.unit}
                      onChange={e => setData('unit', e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      required
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  {/* Minimum Order Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Minimum Order Quantity (MOQ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={data.minimum_order_quantity}
                      onChange={e => setData('minimum_order_quantity', e.target.value)}
                      min="1"
                      className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      required
                    />
                    {errors.minimum_order_quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.minimum_order_quantity}</p>
                    )}
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Available Inventory (Stock) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={data.stock_quantity}
                      onChange={e => setData('stock_quantity', e.target.value)}
                      min="0"
                      className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      required
                    />
                    {errors.stock_quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>
                    )}
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.status === 'active'}
                      onChange={(e) => setData('status', e.target.checked ? 'active' : 'inactive')}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm text-slate-700 font-medium">SKU is active and accessible across buyer procurement catalogs</span>
                  </label>
                </div>
              </div>

              {/* Bulk Pricing Section */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 font-plus-jakarta">Volume Discount Tiers (Optional)</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Incentivize bulk procurement with quantity-graded wholesale discounts</p>
                  </div>
                  <button
                    type="button"
                    onClick={addBulkPrice}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 font-medium text-xs rounded-lg hover:bg-indigo-100 transition"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    Add Tier
                  </button>
                </div>

                <div className="space-y-3">
                  {bulkPrices.map((price, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="Min Qty"
                        value={price.min_quantity}
                        onChange={(e) => updateBulkPrice(index, 'min_quantity', e.target.value)}
                        className="w-28 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      />
                      <span className="text-slate-400 font-medium">-</span>
                      <input
                        type="number"
                        placeholder="Max Qty (Blank for +)"
                        value={price.max_quantity}
                        onChange={(e) => updateBulkPrice(index, 'max_quantity', e.target.value)}
                        className="w-40 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={price.price}
                        onChange={(e) => updateBulkPrice(index, 'price', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium"
                      />
                      {bulkPrices.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBulkPrice(index)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Remove Tier"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-500 mt-3">
                  Leaving max quantity blank indicates an open tier (e.g. 500+ units). Prices are specified in Indian Rupees (₹).
                </p>
              </div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 font-plus-jakarta">Primary Product Image</h2>

                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-slate-200"
                        onError={(e) => {
                          e.currentTarget.src = NoImg;
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setData('main_image', null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                        title="Remove Image"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-slate-200 border-dashed rounded-lg p-6 text-center hover:border-indigo-300 transition">
                      <FiUpload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-700 mb-1">Primary SKU Photo</p>
                      <p className="text-xs text-slate-500 mb-3">Clear, white or neutral background recommended</p>
                      <input
                        type="file"
                        id="main_image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('main_image').click()}
                        className="px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition"
                      >
                        Browse Image
                      </button>
                    </div>
                  )}

                  {progress?.main_image && (
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${progress.main_image.percentage}%` }}
                      />
                    </div>
                  )}

                  {errors.main_image && (
                    <p className="text-sm text-red-600">{errors.main_image}</p>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 font-plus-jakarta">Gallery & Specifications</h2>

                <div className="space-y-4">
                  {/* Existing Images */}
                  {additionalImages.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-2">Active Catalog Images</p>
                      <div className="grid grid-cols-2 gap-2">
                        {additionalImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image.preview}
                              alt={`Additional ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border border-slate-200"
                              onError={(e) => {
                                e.currentTarget.src = NoImg;
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                              title="Delete Image"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images */}
                  {newAdditionalImages.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-2">Staged for Upload</p>
                      <div className="grid grid-cols-2 gap-2">
                        {newAdditionalImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image.preview}
                              alt={`New ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border border-slate-200"
                              onError={(e) => {
                                e.currentTarget.src = NoImg;
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                              title="Remove Staged Image"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-2 border-slate-200 border-dashed rounded-lg p-4 text-center hover:border-indigo-300 transition">
                    <input
                      type="file"
                      id="additional_images"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImages}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('additional_images').click()}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                    >
                      + Add Gallery Photos
                    </button>
                    <p className="text-xs text-slate-500 mt-1">
                      Upload diagrams, engineering schematics, or packaging shots
                    </p>
                  </div>

                  {errors.additional_images && (
                    <p className="text-sm text-red-600">{errors.additional_images}</p>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 font-plus-jakarta">SKU Metadata & Audit Trail</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">SKU Identifier</span>
                    <span className="font-semibold text-slate-800 font-mono">{product.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Catalog Slug</span>
                    <span className="font-medium text-slate-800 font-mono">{product.slug}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Listing Date</span>
                    <span className="font-medium text-slate-800">
                      {formatIndianDate(product.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Modified</span>
                    <span className="font-medium text-slate-800">
                      {formatIndianDate(product.updated_at)}
                    </span>
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