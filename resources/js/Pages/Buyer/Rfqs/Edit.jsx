// resources/js/Pages/Buyer/Rfqs/Edit.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiPackage,
  FiCalendar,
  FiFileText,
  FiInfo,
  FiAlertCircle,
  FiArrowLeft,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';

export default function RfqEdit({ rfq }) {
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: rfq.title,
    notes: rfq.notes || '',
    description: rfq.description || '',
    required_by_date: rfq.required_by_date ? rfq.required_by_date.split('T')[0] : '',
    products_requested: rfq.products_requested || [
      {
        name: '',
        quantity: 1,
        unit: 'pcs',
        category: '',
        specifications: '',
      }
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products_requested];
    updatedProducts[index][field] = value;
    setFormData(prev => ({ ...prev, products_requested: updatedProducts }));

    if (errors[`products_requested.${index}.${field}`]) {
      setErrors(prev => ({ ...prev, [`products_requested.${index}.${field}`]: null }));
    }
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products_requested: [
        ...prev.products_requested,
        {
          name: '',
          quantity: 1,
          unit: 'pcs',
          category: '',
          specifications: '',
        }
      ]
    }));
  };

  const removeProduct = (index) => {
    if (formData.products_requested.length > 1) {
      setFormData(prev => ({
        ...prev,
        products_requested: prev.products_requested.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Tender title is required';
    }

    if (!formData.required_by_date) {
      newErrors.required_by_date = 'Target delivery date is required';
    } else {
      const selectedDate = new Date(formData.required_by_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.required_by_date = 'Target delivery date must be in the future';
      }
    }

    formData.products_requested.forEach((product, index) => {
      if (!product.name?.trim()) {
        newErrors[`products_requested.${index}.name`] = 'Item name is required';
      }
      if (!product.quantity || product.quantity < 1) {
        newErrors[`products_requested.${index}.quantity`] = 'Valid positive quantity required';
      }
      if (!product.unit) {
        newErrors[`products_requested.${index}.unit`] = 'Unit of measurement required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    router.put(route('buyer.rfqs.update', rfq.id), formData, {
      onSuccess: () => {
        setSubmitting(false);
      },
      onError: (errs) => {
        setErrors(errs);
        setSubmitting(false);
      }
    });
  };

  return (
    <DashboardLayout>
      <Head title={`Edit RFQ #${rfq.rfq_number} — Treadmesh`} />

      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <div className="flex items-center space-x-3 border-b border-slate-200/80 pb-6">
          <Link
            href={route('buyer.rfqs.show', rfq.id)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              Edit Commercial RFQ Tender
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Tender #{rfq.rfq_number}</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <FiAlertCircle className="text-amber-600 w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-900">Editing Active Commercial Tender</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Updates will be immediately broadcast to participating suppliers. If quotations are already finalized, consider issuing a separate addendum.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FiFileText className="w-5 h-5 text-brand-600" />
              Tender Overview & Purpose
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tender Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full text-xs border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
                  errors.title ? 'border-rose-500' : ''
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-rose-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Technical Specifications & Scope (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FiPackage className="w-5 h-5 text-brand-600" />
                Required Bill of Materials (BOM) <span className="text-rose-500">*</span>
              </h2>
              <button
                type="button"
                onClick={addProduct}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition"
              >
                <FiPlus className="w-3.5 h-3.5" /> Add Line Item
              </button>
            </div>

            <div className="space-y-4">
              {formData.products_requested.map((product, index) => (
                <div key={index} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 relative">
                  {formData.products_requested.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="Remove Item"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="lg:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Item / SKU Description <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Quantity <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Unit <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={product.unit}
                        onChange={(e) => handleProductChange(index, 'unit', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                      >
                        <option value="pcs">Pieces (pcs)</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="ton">Metric Tons (MT)</option>
                        <option value="m">Meters (m)</option>
                        <option value="box">Boxes</option>
                        <option value="pack">Packs</option>
                        <option value="set">Sets</option>
                      </select>
                    </div>

                    <div className="lg:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Technical Parameters / Notes
                      </label>
                      <input
                        type="text"
                        value={product.specifications || ''}
                        onChange={(e) => handleProductChange(index, 'specifications', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FiCalendar className="w-5 h-5 text-brand-600" />
              Delivery Schedule & Terms
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Required By Date (Target Consignment Delivery) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="required_by_date"
                  value={formData.required_by_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Special Dispatch Instructions
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="w-full border border-slate-200 rounded-xl p-2.5"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-3 pt-2">
            <Link
              href={route('buyer.rfqs.show', rfq.id)}
              className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Saving Changes...' : 'Update RFQ Tender'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}