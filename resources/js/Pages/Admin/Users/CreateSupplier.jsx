// Pages/Admin/Users/CreateSupplier.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Swal from 'sweetalert2';
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiCheckCircle,
  FiShield
} from 'react-icons/fi';
import { FaBuilding } from "react-icons/fa";
import { MdOutlineStorefront } from 'react-icons/md';

export default function CreateSupplier({ user }) {
  const [formData, setFormData] = useState({
    city: '',
    company_name: '',
    company_phone: '',
    company_email: '',
    company_address: '',
    trade_license_number: '',
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    router.post(route('admin.users.store-supplier', user.id), formData, {
      onSuccess: () => {
        Swal.fire({
          title: 'Supplier Profile Created',
          text: 'Vendor manufacturing profile successfully configured and verified.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (errors) => {
        setErrors(errors);
        Swal.fire({
          title: 'Validation Error',
          text: 'Please review the highlighted fields in the supplier dossier.',
          icon: 'error',
          confirmButtonColor: '#4F46E5'
        });
      },
      onFinish: () => setProcessing(false)
    });
  };

  return (
    <DashboardLayout>
      <Head title={`Complete Vendor Profile — ${user.name} | Treadmesh Admin`} />

      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        {/* Header Banner */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Link
            href={route('admin.users.show', user.id)}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl transition shadow-xs"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Supplier Onboarding
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-medium">Step 2 of 2</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
              Complete Supplier Profile
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Configure manufacturing credentials & business registration for {user.name}
            </p>
          </div>
        </div>

        {/* User Badge Info */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-center text-blue-700 font-bold shrink-0">
            <FiUser className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="text-blue-950 font-bold">
              Target User: <span className="font-semibold text-blue-900">{user.name}</span> ({user.email})
            </p>
            <p className="text-blue-700 mt-0.5">
              Profiles provisioned directly by administrative operations are granted instant verified vendor status.
            </p>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Company Information Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MdOutlineStorefront className="w-4 h-4 text-indigo-600" />
                <span>Enterprise & Statutory Details</span>
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Registered Company Name *
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 ${
                        errors.company_name ? 'border-rose-400' : 'border-slate-200'
                      }`}
                      placeholder="e.g. Bharat Precision Engineering Pvt Ltd"
                    />
                  </div>
                  {errors.company_name && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.company_name}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    GSTIN / Trade License No. *
                  </label>
                  <div className="relative">
                    <FiFileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="trade_license_number"
                      value={formData.trade_license_number}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs uppercase font-mono focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 ${
                        errors.trade_license_number ? 'border-rose-400' : 'border-slate-200'
                      }`}
                      placeholder="e.g. 27AAAAA0000A1Z5"
                    />
                  </div>
                  {errors.trade_license_number && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.trade_license_number}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiPhone className="w-4 h-4 text-indigo-600" />
                <span>Commercial Contact Information</span>
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Company Phone *
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="company_phone"
                      value={formData.company_phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 ${
                        errors.company_phone ? 'border-rose-400' : 'border-slate-200'
                      }`}
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                  {errors.company_phone && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.company_phone}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Official Company Email *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="company_email"
                      value={formData.company_email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 ${
                        errors.company_email ? 'border-rose-400' : 'border-slate-200'
                      }`}
                      placeholder="e.g. sales@bharatprecision.in"
                    />
                  </div>
                  {errors.company_email && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.company_email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-indigo-600" />
                <span>Manufacturing & Warehouse Logistics Address</span>
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Registered Factory / Corporate Address *
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
                    <textarea
                      name="company_address"
                      value={formData.company_address}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 ${
                        errors.company_address ? 'border-rose-400' : 'border-slate-200'
                      }`}
                      placeholder="e.g. Plot 42, Sector 8, GIDC Industrial Estate, Phase II"
                    />
                  </div>
                  {errors.company_address && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.company_address}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    City / Manufacturing Hub *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 ${
                      errors.city ? 'border-rose-400' : 'border-slate-200'
                    }`}
                    placeholder="e.g. Surat, Gujarat"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.city}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-slate-50/75 border-t border-slate-100 flex justify-end gap-2.5">
            <Link
              href={route('admin.users.show', user.id)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Saving Profile...' : 'Complete Supplier Profile'}
            </button>
          </div>
        </form>

        {/* Info Note */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
          <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950">
            <p className="font-bold mb-0.5">Automated KYC & Verification</p>
            <p className="text-emerald-800 leading-relaxed">
              Supplier profiles provisioned by marketplace administration are automatically verified with full catalog publishing and RFQ response privileges.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}