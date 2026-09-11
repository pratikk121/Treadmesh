// resources/js/Pages/Admin/Reports/Suppliers.jsx

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiUsers,
  FiTrendingUp,
  FiCalendar,
  FiDownload,
  FiCheckCircle,
  FiLayers,
  FiAlertCircle,
  FiClock,
  FiBriefcase
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
  MdOutlineInventory2
} from 'react-icons/md';
import { BsBuilding, BsGraphUp, BsShieldCheck } from 'react-icons/bs';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  formatCurrency,
  formatIndianScale,
  formatIndianDate
} from '@/Utils/formatters';

export default function Suppliers({ supplierData = {}, period = 'monthly', dateRange = {} }) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  // Destructure data from props
  const {
    overview = { total: 0, verified: 0, pending: 0, rejected: 0, active: 0 },
    top_performers = [],
    verification_stats = [],
    product_stats = [],
    performance_trend = []
  } = supplierData;

  const COLORS = {
    verified: '#10B981',
    pending: '#F59E0B',
    rejected: '#EF4444'
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    router.get(route('admin.reports.suppliers'), { period: newPeriod }, { preserveState: true });
  };

  const handleExport = (format = 'csv') => {
    window.location.href = route('admin.reports.export', {
      type: 'suppliers',
      format
    });
  };

  const periodOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Annually' },
  ];

  const verificationRate = overview.total > 0
    ? ((overview.verified / overview.total) * 100).toFixed(1)
    : '0.0';

  return (
    <DashboardLayout>
      <Head title="Supplier Network & Verification Intelligence | Treadmesh Admin" />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Vendor Network & Compliance
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <BsShieldCheck className="w-3 h-3 text-emerald-600" />
                GST / MSME Verified
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              Supplier Performance & Compliance Telemetry
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Audit vendor verification pipeline, active manufacturing clusters, and top GMV suppliers
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
              <span>Export Suppliers</span>
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
              <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">Accounting Window</p>
              <p className="text-sm font-semibold text-white">
                {dateRange?.start ? formatIndianDate(dateRange.start) : 'Start Date'} &mdash; {dateRange?.end ? formatIndianDate(dateRange.end) : 'Current Date'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-slate-400">KYC Verification Rate:</span>{' '}
              <span className="font-semibold text-emerald-400">{verificationRate}%</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="text-right">
              <span className="text-slate-400">Active Transacting:</span>{' '}
              <span className="font-semibold text-white">{formatNumber(overview.active)} vendors</span>
            </div>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Suppliers */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Registered Suppliers
              </span>
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition">
                <BsBuilding className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(overview.total)}
              </span>
              <span className="text-xs text-slate-500">enterprises</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>National manufacturing base</span>
            </p>
          </div>

          {/* Card 2: Verified */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                GST / MSME Verified
              </span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition">
                <MdVerified className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(overview.verified)}
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                {verificationRate}% verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Full statutory compliance approved</span>
            </p>
          </div>

          {/* Card 3: Pending KYC */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pending Verification
              </span>
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-100 transition">
                <MdPending className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(overview.pending)}
              </span>
              <span className="text-xs text-amber-600 font-medium">in KYC queue</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <FiClock className="w-3.5 h-3.5 text-amber-500" />
              <span>Awaiting admin document review</span>
            </p>
          </div>

          {/* Card 4: Active Transacting */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Transacting Accounts
              </span>
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition">
                <FiUsers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(overview.active)}
              </span>
              <span className="text-xs text-slate-500">live accounts</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>Active quotes & catalog presence</span>
            </p>
          </div>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Verification Status - Donut Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <BsShieldCheck className="w-5 h-5 text-indigo-600" />
                Supplier Verification & KYC Pipeline
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Proportion of verified vs pending supplier credentials
              </p>
            </div>

            <div className="h-64 my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={verification_stats}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="total"
                    nameKey="verification_status"
                  >
                    {verification_stats.map((entry) => (
                      <Cell
                        key={`cell-${entry.verification_status}`}
                        fill={COLORS[entry.verification_status] || '#94A3B8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090D16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    formatter={(val, name) => [
                      `${val} suppliers`,
                      name === 'verified' ? 'Verified' : name === 'pending' ? 'Pending Review' : 'Rejected'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
              <div className="p-2 rounded-lg bg-emerald-50/50">
                <span className="text-emerald-700 font-semibold block">{overview.verified}</span>
                <span className="text-slate-500">Verified</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50/50">
                <span className="text-amber-700 font-semibold block">{overview.pending}</span>
                <span className="text-slate-500">Pending</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50/50">
                <span className="text-rose-700 font-semibold block">{overview.rejected || 0}</span>
                <span className="text-slate-500">Rejected</span>
              </div>
            </div>
          </div>

          {/* Performance Trend - Dual Axis Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <FiTrendingUp className="w-5 h-5 text-indigo-600" />
                Active Suppliers vs Settled GMV Trend
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly active supplier velocity and gross platform revenue
              </p>
            </div>

            <div className="h-64 my-auto mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performance_trend} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(val) => {
                      if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
                      if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
                      if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
                      return `₹${val}`;
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090D16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    formatter={(value, name) => [
                      name === 'Active Suppliers' ? value : formatCurrency(value),
                      name
                    ]}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="active_suppliers"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    name="Active Suppliers"
                    dot={{ r: 3 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="total_revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Gross Settled GMV (₹)"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Dual Axis: Left (Count), Right (INR ₹)</span>
              <span className="font-medium text-indigo-600">Enterprise Growth Telemetry</span>
            </div>
          </div>
        </div>

        {/* Top Performing Suppliers and Product Stats Two-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers by GMV */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                  <BsGraphUp className="w-5 h-5 text-indigo-600" />
                  Top OEM Suppliers by Realized GMV
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-volume vendors driving platform fulfillment
                </p>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                Top {top_performers.length}
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {top_performers.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No supplier transaction records for this period.
                </div>
              ) : (
                top_performers.slice(0, 5).map((supplier, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                        index === 0 ? 'bg-amber-100 text-amber-800' :
                        index === 1 ? 'bg-slate-200 text-slate-700' :
                        index === 2 ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-slate-900 truncate">{supplier.company_name}</p>
                        <p className="text-xs text-slate-500">{supplier.products_count} listed SKUs</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 font-mono ml-2 flex-shrink-0">
                      {formatCurrency(supplier.total_revenue)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Supplier Product Statistics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                  <MdOutlineInventory2 className="w-5 h-5 text-indigo-600" />
                  Vendor Catalog SKU Audit
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Approval pipeline for top vendor catalogs
                </p>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                Catalog Health
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {product_stats.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No catalog items found.
                </div>
              ) : (
                product_stats.slice(0, 5).map((stat, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition flex items-center justify-between"
                  >
                    <div className="truncate">
                      <p className="text-sm font-semibold text-slate-900 truncate">{stat.company_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center text-xs font-medium text-emerald-600">
                          <FiCheckCircle className="w-3 h-3 mr-1" />
                          {stat.approved_products} Approved
                        </span>
                        {stat.pending_products > 0 && (
                          <span className="inline-flex items-center text-xs font-medium text-amber-600">
                            <FiClock className="w-3 h-3 mr-1" />
                            {stat.pending_products} Pending
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100 flex-shrink-0 ml-2">
                      {stat.total_products} SKUs
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Detailed Supplier Performance Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Top OEM Vendor Ledger & Compliance Status</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprehensive directory of top suppliers with contact details and revenue performance
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">
              {top_performers.length} suppliers listed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-3.5">Enterprise / Firm Name</th>
                  <th className="px-6 py-3.5">Primary Contact / SPOC</th>
                  <th className="px-6 py-3.5 text-right">Catalog SKUs</th>
                  <th className="px-6 py-3.5 text-right">Settled GMV (INR ₹)</th>
                  <th className="px-6 py-3.5 text-center">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {top_performers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                      No suppliers found.
                    </td>
                  </tr>
                ) : (
                  top_performers.map((supplier, index) => (
                    <tr key={index} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {supplier.company_name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block">{supplier.company_name}</span>
                            <span className="text-xs text-slate-400 font-mono">ID: SUP-{supplier.id || index + 101}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-700 font-medium">{supplier.contact_name || 'Designated Contact'}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">
                        {formatNumber(supplier.products_count)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">
                        {formatCurrency(supplier.total_revenue)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <BsShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified OEM
                        </span>
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