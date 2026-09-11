// Pages/Admin/Users/Show.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Swal from 'sweetalert2';
import { formatCurrency, formatIndianDate } from '@/Utils/formatters';
import {
  FiArrowLeft,
  FiMail,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiLock,
  FiPackage,
  FiShoppingCart,
  FiClock,
  FiShield,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
  MdWarning,
  MdOutlineAdminPanelSettings,
  MdOutlineStorefront,
  MdOutlineShoppingCart,
  MdOutlineAccountBalanceWallet
} from 'react-icons/md';
import { BsBuilding, BsGraphUp, BsPeople } from 'react-icons/bs';

export default function Show({ user, activity = {} }) {
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ password: '', password_confirmation: '' });
  const [resetting, setResetting] = useState(false);

  // Handle toggle user status (activate/deactivate)
  const handleToggleStatus = () => {
    const action = user.is_active ? 'Deactivate' : 'Activate';
    Swal.fire({
      title: `${action} User Account?`,
      text: `Are you sure you want to ${action.toLowerCase()} platform access for "${user.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: user.is_active ? '#EF4444' : '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: `Yes, ${action} Account`,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('admin.users.toggle-status', user.id), {}, {
          onSuccess: () => {
            Swal.fire({
              title: 'Status Updated',
              text: `User account has been successfully ${user.is_active ? 'deactivated' : 'activated'}.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  // Handle reset password
  const handleResetPassword = (e) => {
    e.preventDefault();
    setResetting(true);

    router.post(route('admin.users.reset-password', user.id), passwordData, {
      onSuccess: () => {
        setShowResetPassword(false);
        setPasswordData({ password: '', password_confirmation: '' });
        setPasswordErrors({});
        Swal.fire({
          title: 'Password Updated',
          text: 'The password for this user has been reset successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      onError: (errs) => {
        setPasswordErrors(errs);
      },
      onFinish: () => setResetting(false)
    });
  };

  // Handle delete user
  const handleDelete = () => {
    Swal.fire({
      title: 'Delete User Account?',
      text: `Are you sure you want to permanently delete "${user.name}"? All associated commercial permissions will be revoked. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Delete Permanently',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('admin.users.destroy', user.id), {
          onSuccess: () => {
            router.get(route('admin.users.index'));
          }
        });
      }
    });
  };

  // Get role info
  const getRoleInfo = (role) => {
    const roles = {
      admin: {
        icon: MdOutlineAdminPanelSettings,
        label: 'Administrator',
        badge: 'bg-purple-50 text-purple-700 border-purple-200',
        avatarBg: 'bg-purple-600',
      },
      supplier: {
        icon: MdOutlineStorefront,
        label: 'Verified Supplier',
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        avatarBg: 'bg-blue-600',
      },
      buyer: {
        icon: MdOutlineShoppingCart,
        label: 'Corporate Buyer',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        avatarBg: 'bg-emerald-600',
      },
    };
    return roles[role] || roles.buyer;
  };

  const roleInfo = getRoleInfo(user.role);
  const RoleIcon = roleInfo.icon;

  return (
    <DashboardLayout>
      <Head title={`User Dossier: ${user.name} | Treadmesh Admin`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.users.index')}
              className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition text-slate-600 shadow-sm"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 font-plus-jakarta tracking-tight">
                  User Account Dossier
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleInfo.badge}`}>
                  <RoleIcon className="w-3.5 h-3.5" />
                  {roleInfo.label}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1 font-inter">
                Detailed profile, platform engagement metrics, and credential management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleToggleStatus}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition ${
                user.is_active
                  ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {user.is_active ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
              <span>{user.is_active ? 'Deactivate Account' : 'Activate Account'}</span>
            </button>
            <Link
              href={route('admin.users.edit', user.id)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition shadow-sm"
            >
              <FiEdit2 className="w-4 h-4 text-slate-500" />
              <span>Edit Account</span>
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl transition"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* User Avatar */}
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md ${roleInfo.avatarBg} font-plus-jakarta`}>
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-plus-jakarta">
                      {user.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        user.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {user.is_active ? <FiCheckCircle className="w-3.5 h-3.5" /> : <FiXCircle className="w-3.5 h-3.5" />}
                        {user.is_active ? 'Active User' : 'Suspended Account'}
                      </span>
                      <span className="text-xs text-slate-400 font-jetbrains">
                        UID: #{user.id.toString().padStart(5, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Reset Password Button */}
                  <button
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                  >
                    <FiLock className="w-3.5 h-3.5" />
                    <span>{showResetPassword ? 'Close Password Form' : 'Reset Password'}</span>
                  </button>
                </div>

                {/* Contact and Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                      <FiMail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Email Address</p>
                      <a href={`mailto:${user.email}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 font-inter">
                        {user.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                      <FiCalendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Onboarding Date</p>
                      <p className="text-sm font-semibold text-slate-800 font-jetbrains">
                        {formatIndianDate(user.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                      <FiClock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Last Login Recorded</p>
                      <p className="text-sm font-semibold text-slate-800 font-jetbrains">
                        {activity.last_login ? formatIndianDate(activity.last_login) : 'Never Authenticated'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reset Password Form */}
          {showResetPassword && (
            <div className="border-t border-slate-100 p-6 md:p-8 bg-slate-50/80">
              <div className="max-w-md space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-jetbrains">
                    Direct Administrative Password Reset
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Assign a new secure authentication password directly for this user.
                  </p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      New Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.password}
                      onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                      placeholder="Minimum 8 characters"
                      className={`w-full px-3.5 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition ${
                        passwordErrors.password ? 'border-rose-500' : 'border-slate-300'
                      }`}
                    />
                    {passwordErrors.password && (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{passwordErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Confirm New Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.password_confirmation}
                      onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                      placeholder="Repeat new password"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={resetting}
                      className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition disabled:opacity-50"
                    >
                      {resetting ? 'Resetting Password...' : 'Save New Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-jetbrains">
                  Published RFQ Tenders
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-jetbrains">
                  {activity.rfqs_count ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <FiPackage className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-jetbrains">
                  Quotations Submitted
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-jetbrains">
                  {activity.quotes_count ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <BsGraphUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-jetbrains">
                  Purchase Orders (Buyer)
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-jetbrains">
                  {activity.orders_as_buyer ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <FiShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-jetbrains">
                  Orders Fulfilled (Supplier)
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-jetbrains">
                  {activity.orders_as_supplier ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <BsPeople className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Stats */}
        {(user.role === 'buyer' || user.role === 'supplier') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.role === 'buyer' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <MdOutlineAccountBalanceWallet className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-jetbrains">
                    Cumulative Procurement Spend
                  </h3>
                </div>
                <p className="text-3xl font-bold text-slate-900 font-jetbrains">
                  {formatCurrency(activity.total_spent || 0)}
                </p>
                <p className="text-xs text-slate-400 mt-2 font-inter">
                  Settled via RBI-compliant escrow for dispatched & accepted consignments
                </p>
              </div>
            )}
            {user.role === 'supplier' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <MdOutlineAccountBalanceWallet className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-jetbrains">
                    Gross Revenue Fulfilled
                  </h3>
                </div>
                <p className="text-3xl font-bold text-emerald-600 font-jetbrains">
                  {formatCurrency(activity.total_earned || 0)}
                </p>
                <p className="text-xs text-slate-400 mt-2 font-inter">
                  Disbursed payments across verified purchase orders and delivered lots
                </p>
              </div>
            )}
          </div>
        )}

        {/* Supplier Profile Details */}
        {user.role === 'supplier' && user.supplier && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2 font-plus-jakarta">
                <BsBuilding className="w-4 h-4 text-indigo-600" />
                Verified Supplier Enterprise Profile
              </h3>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                user.supplier.verification_status === 'verified'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : user.supplier.verification_status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {user.supplier.verification_status === 'verified' ? <MdVerified className="w-3.5 h-3.5 text-emerald-600" /> :
                  user.supplier.verification_status === 'pending' ? <MdPending className="w-3.5 h-3.5 text-amber-600" /> :
                    <MdWarning className="w-3.5 h-3.5 text-rose-600" />}
                {user.supplier.verification_status === 'verified' ? 'KYC Verified Enterprise' :
                  user.supplier.verification_status === 'pending' ? 'Verification Pending' : 'KYC Rejected'}
              </span>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-jetbrains">
                    Registered Business Entity
                  </p>
                  <p className="font-bold text-slate-900 text-sm mt-1">
                    {user.supplier.company_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-jetbrains">
                    GSTIN / Trade License
                  </p>
                  <p className="font-bold text-slate-900 text-sm mt-1 font-jetbrains">
                    {user.supplier.trade_license_number || 'Not Provided'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-jetbrains">
                    Primary Contact Number
                  </p>
                  <a href={`tel:${user.supplier.company_phone}`} className="font-semibold text-indigo-600 hover:text-indigo-700 text-sm mt-1 block font-jetbrains">
                    {user.supplier.company_phone || 'N/A'}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-jetbrains">
                    Official Procurement Email
                  </p>
                  <a href={`mailto:${user.supplier.company_email}`} className="font-semibold text-indigo-600 hover:text-indigo-700 text-sm mt-1 block">
                    {user.supplier.company_email || 'N/A'}
                  </a>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-jetbrains">
                    Registered Facility & Warehouse Address
                  </p>
                  <p className="font-medium text-slate-800 text-sm mt-1">
                    {user.supplier.company_address}
                  </p>
                  {user.supplier.city && (
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Industrial Hub / Cluster: {user.supplier.city}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}