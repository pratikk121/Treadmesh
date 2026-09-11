// resources/js/Pages/Admin/Reports/Buyers.jsx

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiUsers,
  FiCalendar,
  FiDownload,
  FiShoppingCart,
  FiFileText,
  FiUserCheck,
  FiTrendingUp,
  FiCheckCircle,
  FiBriefcase
} from 'react-icons/fi';
import { BsGraphUp, BsShieldCheck } from 'react-icons/bs';
import {
  formatCurrency,
  formatIndianScale,
  formatIndianDate
} from '@/Utils/formatters';

export default function Buyers({ buyerData = {}, period = 'monthly', dateRange = {} }) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  // Destructure data from props
  const {
    overview = { total: 0, active: 0, with_orders: 0, with_rfqs: 0 },
    top_buyers = [],
    activity_stats = { new_buyers: 0, active_buyers: 0, average_orders_per_buyer: 0 },
    rfq_stats = { total_rfqs: 0, buyers_with_rfqs: 0, avg_rfqs_per_buyer: 0 }
  } = buyerData;

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    router.get(route('admin.reports.buyers'), { period: newPeriod }, { preserveState: true });
  };

  const handleExport = (format = 'csv') => {
    window.location.href = route('admin.reports.export', {
      type: 'buyers',
      format,
      period: selectedPeriod,
      date_from: dateRange?.start,
      date_to: dateRange?.end
    });
  };

  const periodOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Annually' },
  ];

  const buyerActivityRate = overview.total > 0
    ? ((overview.active / overview.total) * 100).toFixed(1)
    : '0.0';

  return (
    <DashboardLayout>
      <Head title="Buyer Intelligence & Corporate Procurement | Treadmesh Admin" />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Demand Side Telemetry
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <BsShieldCheck className="w-3 h-3 text-indigo-600" />
                Enterprise Accounts
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              Enterprise Buyer Analytics & Spend Velocity
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Audit corporate procurement volumes, tender participation rates, and high-value buyer cohorts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="pl-3.5 pr-8 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 border border-slate-300/80 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition cursor-pointer"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition shadow-xs cursor-pointer"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export Buyers CSV</span>
            </button>
          </div>
        </div>

        {/* Date Range Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <FiCalendar className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">Procurement Window</p>
              <p className="text-sm font-semibold text-white">
                {dateRange?.start ? formatIndianDate(dateRange.start) : 'Start Date'} &mdash; {dateRange?.end ? formatIndianDate(dateRange.end) : 'Current Date'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-slate-400">Buyer Engagement Rate:</span>{' '}
              <span className="font-semibold text-emerald-400">{buyerActivityRate}%</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="text-right">
              <span className="text-slate-400">Total Inquiries:</span>{' '}
              <span className="font-semibold text-white">{formatNumber(rfq_stats.total_rfqs)} RFQs</span>
            </div>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Registered Buyers */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Registered Buyers
              </span>
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition">
                <FiUsers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(overview.total)}
              </span>
              <span className="text-xs text-slate-500">enterprises</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>Corporate accounts registered</span>
            </p>
          </div>

          {/* Card 2: Active Buyers */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Buyers
              </span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition">
                <FiUserCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(overview.active)}
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                {buyerActivityRate}% active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Active in tender & order cycles</span>
            </p>
          </div>

          {/* Card 3: Buyers with Orders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Buyers with Fulfilled Orders
              </span>
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition">
                <FiShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(overview.with_orders)}
              </span>
              <span className="text-xs text-slate-500">transacted</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>Completed purchase orders</span>
            </p>
          </div>

          {/* Card 4: Buyers with RFQs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Buyers Sourcing via RFQ
              </span>
              <div className="p-2 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-100 transition">
                <FiFileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(overview.with_rfqs)}
              </span>
              <span className="text-xs text-purple-600 font-medium">tender buyers</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>Active RFQ tender creators</span>
            </p>
          </div>
        </div>

        {/* Activity & RFQ Diagnostic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Activity Telemetry */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base pb-3 border-b border-slate-100">
              <FiShoppingCart className="w-5 h-5 text-indigo-600" />
              Order Velocity & Buyer Conversion
            </h3>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">New Onboarded</p>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{formatNumber(activity_stats.new_buyers)}</p>
                <p className="text-xs text-slate-400 mt-0.5">this window</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                <p className="text-xs text-emerald-700 font-medium uppercase tracking-wider">Active Buyers</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1 font-mono">{formatNumber(activity_stats.active_buyers)}</p>
                <p className="text-xs text-emerald-600 mt-0.5">with orders</p>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-center">
                <p className="text-xs text-indigo-700 font-medium uppercase tracking-wider">Avg POs / Buyer</p>
                <p className="text-2xl font-bold text-indigo-700 mt-1 font-mono">{activity_stats.average_orders_per_buyer || 0}</p>
                <p className="text-xs text-indigo-600 mt-0.5">frequency</p>
              </div>
            </div>
          </div>

          {/* Sourcing & RFQ Telemetry */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base pb-3 border-b border-slate-100">
              <FiFileText className="w-5 h-5 text-indigo-600" />
              Procurement Inquiries & Tender Activity
            </h3>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total RFQs</p>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{formatNumber(rfq_stats.total_rfqs)}</p>
                <p className="text-xs text-slate-400 mt-0.5">floated tenders</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 text-center">
                <p className="text-xs text-purple-700 font-medium uppercase tracking-wider">Sourcing Buyers</p>
                <p className="text-2xl font-bold text-purple-700 mt-1 font-mono">{formatNumber(rfq_stats.buyers_with_rfqs)}</p>
                <p className="text-xs text-purple-600 mt-0.5">inquiry buyers</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-center">
                <p className="text-xs text-blue-700 font-medium uppercase tracking-wider">Avg RFQs / Buyer</p>
                <p className="text-2xl font-bold text-blue-700 mt-1 font-mono">{rfq_stats.avg_rfqs_per_buyer || 0}</p>
                <p className="text-xs text-blue-600 mt-0.5">tender density</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Spending Buyers Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <BsGraphUp className="w-5 h-5 text-indigo-600" />
                Top Enterprise Spenders by Realized GMV
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Highest procurement volume corporate accounts in the current cycle
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">
              Top {top_buyers.length} Enterprise Buyers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-3.5 w-16">Rank</th>
                  <th className="px-6 py-3.5">Enterprise Buyer / Organization</th>
                  <th className="px-6 py-3.5">Procurement Contact Email</th>
                  <th className="px-6 py-3.5 text-right">Fulfilled POs</th>
                  <th className="px-6 py-3.5 text-right">Gross Procurement Spend (INR ₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {top_buyers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                      No corporate purchases recorded for this period.
                    </td>
                  </tr>
                ) : (
                  top_buyers.map((buyer, index) => (
                    <tr key={index} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          index === 0 ? 'bg-amber-100 text-amber-800' :
                          index === 1 ? 'bg-slate-200 text-slate-700' :
                          index === 2 ? 'bg-amber-50 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {buyer.name?.charAt(0) || 'B'}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block">{buyer.name}</span>
                            <span className="text-xs text-slate-400 font-mono">UID: BUY-{buyer.id || index + 101}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`mailto:${buyer.email}`} className="text-slate-600 hover:text-indigo-600 text-sm transition">
                          {buyer.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">
                        {formatNumber(buyer.orders_count)} POs
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">
                        {formatCurrency(buyer.total_spent)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}