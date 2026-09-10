// Pages/Admin/Users/CreateSupplier.jsx

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
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiCheckCircle
} from 'react-icons/fi';
import { FaBuilding } from "react-icons/fa";
import { MdOutlineStorefront } from 'react-icons/md';

export default function CreateSupplier({ user }) {
  // State management for form data, errors and processing status
  const [formData, setFormData] = useState({
    city: '',
    company_name: '',
    company_phone: '',
    company_email: '',
    company_address: '',
    trade_license_number: '',
  });

  // State management for form data, errors and processing status
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    router.post(route('admin.users.store-supplier', user.id), formData, {
      onSuccess: () => {
        Swal.fire({
          title: 'successful!',
          text: 'Supplier profile created successfully।',
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

  return (
    <DashboardLayout>
      <Head title={`${user.name} - Create supplier profile`} />

      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Header - Back button and page title */}
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.users.show', user.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create supplier profile</h1>
              <p className="text-sm text-gray-600 mt-1">
                {user.name} - Complete Supplier Information for
              </p>
            </div>
          </div>

          {/* User Info - Display user information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FiUser className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-700">
                <span className="font-medium">User:</span> {user.name} ({user.email})
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This profile will be automatically verified as you are created as an admin।
              </p>
            </div>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Company Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MdOutlineStorefront className="w-5 h-5 text-indigo-600" />
                  Company Information
                </h3>
                <div className="space-y-4">
                  {/* Company Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.company_name ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter the company name"
                      />
                    </div>
                    {errors.company_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
                    )}
                  </div>

                  {/* Trade License Number Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trade License No. *
                    </label>
                    <div className="relative">
                      <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="trade_license_number"
                        value={formData.trade_license_number}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.trade_license_number ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter trade license number"
                      />
                    </div>
                    {errors.trade_license_number && (
                      <p className="mt-1 text-sm text-red-600">{errors.trade_license_number}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {/* Company Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Phone *
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="company_phone"
                        value={formData.company_phone}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.company_phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter Company Phone Number"
                      />
                    </div>
                    {errors.company_phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.company_phone}</p>
                    )}
                  </div>

                  {/* Company Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Email *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="company_email"
                        value={formData.company_email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.company_email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter Company Email"
                      />
                    </div>
                    {errors.company_email && (
                      <p className="mt-1 text-sm text-red-600">{errors.company_email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address information</h3>
                <div className="space-y-4">
                  {/* Company Address Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Address *
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        name="company_address"
                        value={formData.company_address}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.company_address ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter the full company address"
                      />
                    </div>
                    {errors.company_address && (
                      <p className="mt-1 text-sm text-red-600">{errors.company_address}</p>
                    )}
                  </div>

                  {/* City Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter the city name"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions - Submit and Cancel buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <Link
                href={route('admin.users.show', user.id)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Creating...' : 'Create supplier profile'}
              </button>
            </div>
          </form>

          {/* Info Note - Auto-verification notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-700">
              <p className="font-medium mb-1">Auto-Verification:</p>
              <p>Supplier profile created by admin is automatically verified. No additional authorization required।</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}