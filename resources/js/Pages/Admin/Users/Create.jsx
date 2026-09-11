// Pages/Admin/Users/Create.jsx

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
  FiShield,
  FiCheckCircle
} from 'react-icons/fi';
import {
  MdOutlineAdminPanelSettings,
  MdOutlineStorefront,
  MdOutlineShoppingCart
} from 'react-icons/md';

export default function Create() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    is_active: true,
    password_confirmation: '',
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

    router.post(route('admin.users.store'), formData, {
      onSuccess: () => {
        Swal.fire({
          title: 'Account Provisioned',
          text: 'User account has been successfully created.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (errors) => {
        setErrors(errors);
        Swal.fire({
          title: 'Validation Error',
          text: 'Please review and correct the highlighted fields in the form.',
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
      label: 'Admin',
      icon: MdOutlineAdminPanelSettings,
      description: 'Full supervisory authority across all platform modules',
      color: 'purple'
    },
    {
      value: 'supplier',
      label: 'Supplier',
      icon: MdOutlineStorefront,
      description: 'Publish catalog SKUs and submit commercial bids on RFQs',
      color: 'blue'
    },
    {
      value: 'buyer',
      label: 'Buyer',
      icon: MdOutlineShoppingCart,
      description: 'Publish RFQ tenders, compare quotes, and execute POs',
      color: 'emerald'
    },
  ];

  return (
    <DashboardLayout>
      <Head title="Provision New User Account - Treadmesh Admin" />

      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        {/* Header Banner */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Link
            href={route('admin.users.index')}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl transition shadow-xs"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Identity Provisioning
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-medium">New Account</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
              Provision User Account
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Configure credentials and assign enterprise system role
            </p>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiUser className="w-4 h-4 text-indigo-600" />
                <span>Account Credentials</span>
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 ${
                        errors.name ? 'border-rose-400' : 'border-slate-200'
                      }`}
                      placeholder="e.g. Rajesh Sharma"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 ${
                        errors.email ? 'border-rose-400' : 'border-slate-200'
                      }`}
                      placeholder="e.g. rajesh@enterprise.in"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiLock className="w-4 h-4 text-indigo-600" />
                <span>Security Credentials</span>
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Account Password *
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 ${
                        errors.password ? 'border-rose-400' : 'border-slate-200'
                      }`}
                      placeholder="Create a strong password (min. 8 characters)"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder="Repeat password"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection Section */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiShield className="w-4 h-4 text-indigo-600" />
                <span>System Role & Access Privileges</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.role === option.value;
                  const activeClasses = isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white';

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: option.value }))}
                      className={`p-4 border-2 rounded-xl text-left transition ${activeClasses}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                        {isSelected && (
                          <FiCheckCircle className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <h4 className={`font-bold text-xs ${isSelected ? 'text-indigo-950' : 'text-slate-900'}`}>
                        {option.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
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
            <div className="border-t border-slate-100 pt-6">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-semibold text-xs text-gray-900">Active Account Status</span>
                  <p className="text-[11px] text-gray-500">Allow this user to authenticate and interact with platform endpoints</p>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-slate-50/75 border-t border-slate-100 flex justify-end gap-2.5">
            <Link
              href={route('admin.users.index')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Provisioning Account...' : 'Create User Account'}
            </button>
          </div>
        </form>

        {/* Info Note */}
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950">
            <p className="font-bold mb-0.5">Supplier Onboarding Workflow</p>
            <p className="text-indigo-800 leading-relaxed">
              When creating a <strong>Supplier</strong> account, you will be immediately routed to configure their industrial vendor dossier including GSTIN, company phone, and manufacturing facility address.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}