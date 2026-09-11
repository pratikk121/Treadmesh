// Pages/Admin/Users/Edit.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Swal from 'sweetalert2';
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiLock,
  FiAlertCircle,
  FiShield
} from 'react-icons/fi';
import {
  MdOutlineAdminPanelSettings,
  MdOutlineStorefront,
  MdOutlineShoppingCart
} from 'react-icons/md';

export default function Edit({ user }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    router.put(route('admin.users.update', user.id), formData, {
      onSuccess: () => {
        Swal.fire({
          title: 'User Updated',
          text: 'User profile and permissions have been updated successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (errs) => {
        setErrors(errs);
        Swal.fire({
          title: 'Validation Error',
          text: 'There is an error in the form. Please review the highlighted fields.',
          icon: 'error',
          confirmButtonColor: '#4F46E5'
        });
      },
      onFinish: () => setProcessing(false)
    });
  };

  const roleOptions = [
    {
      value: 'admin',
      label: 'Administrator',
      icon: MdOutlineAdminPanelSettings,
      description: 'Full governance access across catalog, escrow, and platform administration.',
      activeBorder: 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/40',
      activeText: 'text-purple-900',
      iconColor: 'text-purple-600'
    },
    {
      value: 'supplier',
      label: 'Verified Supplier',
      icon: MdOutlineStorefront,
      description: 'Catalog listing, quote submissions, and bulk order fulfillment privileges.',
      activeBorder: 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/40',
      activeText: 'text-blue-900',
      iconColor: 'text-blue-600'
    },
    {
      value: 'buyer',
      label: 'Corporate Buyer',
      icon: MdOutlineShoppingCart,
      description: 'RFQ creation, tender submission, and direct purchase order placement.',
      activeBorder: 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/40',
      activeText: 'text-emerald-900',
      iconColor: 'text-emerald-600'
    },
  ];

  return (
    <DashboardLayout>
      <Head title={`Edit User: ${user.name} | Treadmesh Admin`} />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href={route('admin.users.show', user.id)}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition text-slate-600 shadow-sm"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-plus-jakarta tracking-tight">
              Edit User Account
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-inter">
              Update credentials, role permissions, and access status for <span className="font-semibold text-slate-700">{user.name}</span>
            </p>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            {/* Basic Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FiUser className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs font-jetbrains">
                  Basic Credentials
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        errors.name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                      }`}
                      placeholder="e.g. Rajesh Kumar"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Work Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        errors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                      }`}
                      placeholder="e.g. rajesh@industrialmesh.in"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Change Password Section (Optional) */}
            <div className="border-t border-slate-100 pt-7">
              <div className="flex items-center gap-2 mb-1">
                <FiLock className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs font-jetbrains">
                  Password Reset (Optional)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Leave these fields blank if you wish to keep the existing password intact.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        errors.password ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                      }`}
                      placeholder="Minimum 8 characters"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection Section */}
            <div className="border-t border-slate-100 pt-7">
              <div className="flex items-center gap-2 mb-2">
                <FiShield className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs font-jetbrains">
                  Platform Access Role
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Select the administrative or commercial tier granted to this user.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.role === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: option.value }))}
                      className={`p-4 border-2 rounded-2xl text-left transition relative ${
                        isSelected
                          ? option.activeBorder
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-7 h-7 ${option.iconColor}`} />
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                        )}
                      </div>
                      <h4 className={`font-semibold text-sm ${isSelected ? option.activeText : 'text-slate-900'}`}>
                        {option.label}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
              {errors.role && (
                <p className="mt-2 text-xs text-rose-600 font-medium">{errors.role}</p>
              )}
            </div>

            {/* Active Status Toggle */}
            <div className="border-t border-slate-100 pt-7">
              <label className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="mt-0.5 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-semibold text-sm text-slate-900">Active Account Status</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    User can securely authenticate, manage orders, and initiate transactions on Treadmesh.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href={route('admin.users.show', user.id)}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Saving Changes...' : 'Save User Changes'}
            </button>
          </div>
        </form>

        {/* Info Note */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <p className="font-semibold mb-0.5">Important Account Role Advisory</p>
            <p className="text-amber-800">
              Modifying an account role to or from Supplier alters their verified storefront access, active RFQ quote submissions, and enterprise GSTIN verification linkages.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}