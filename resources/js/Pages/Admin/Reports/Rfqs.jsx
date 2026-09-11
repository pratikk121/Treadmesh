// resources/js/Pages/Admin/Reports/Rfqs.jsx

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiFileText,
  FiTrendingUp,
  FiCalendar,
  FiDownload,
  FiBarChart2,
  FiClock,
  FiCheckCircle,
  FiLayers,
  FiAlertCircle,
  FiArrowUpRight
} from 'react-icons/fi';
import {
  MdVerified,
  MdPending,
  MdOutlineAssignmentTurnedIn
} from 'react-icons/md';
import { BsShieldCheck } from 'react-icons/bs';
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  formatIndianDate
} from '@/Utils/formatters';

export default function Rfqs({ rfqData = {}, period = 'monthly', dateRange = {} }) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  // Destructure data from props
  const {
    overview = { total: 0, open: 0, quoted: 0, closed: 0 },
    by_status = [],
    conversion_rate = { total: 0, converted: 0, rate: 0 },
    response_time = 0
  } = rfqData;

  const COLORS = {
    open: '#10B981',
    quoted: '#3B82F6',
    closed: '#64748B'
  };

  const normalizeStatusLabel = (status) => {
    switch (status) {
      case 'open':
        return 'Open for Vendor Bidding';
      case 'quoted':
        return 'Quotes Under Evaluation';
      case 'closed':
        return 'Converted to PO / Finalized';
      default:
        return String(status).replace(/\b\w/g, c => c.toUpperCase());
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    router.get(route('admin.reports.rfqs'), { period: newPeriod }, { preserveState: true });
  };

  const handleExport = (format = 'csv') => {
    window.location.href = route('admin.reports.export', {
      type: 'rfqs',
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

  return (
    <DashboardLayout>
      <Head title="RFQ Procurement & Tender Intelligence | Treadmesh Admin" />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tender Lifecycle & Sourcing
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <BsShieldCheck className="w-3 h-3 text-emerald-600" />
                Live Tender Pipeline
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              RFQ Tender Velocity & Quote Turnaround
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Audit corporate sourcing tenders, quotation submission rates, and buyer conversion into purchase orders
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
              <span>Export RFQ CSV</span>
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
              <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">Tender Reporting Cycle</p>
              <p className="text-sm font-semibold text-white">
                {dateRange?.start ? formatIndianDate(dateRange.start) : 'Start Date'} &mdash; {dateRange?.end ? formatIndianDate(dateRange.end) : 'Current Date'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-slate-400">PO Conversion Rate:</span>{' '}
              <span className="font-semibold text-emerald-400">{conversion_rate.rate}%</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="text-right">
              <span className="text-slate-400">Avg First Quote:</span>{' '}
              <span className="font-semibold text-white">{response_time ? Math.round(response_time) : 0} hrs</span>
            </div>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total RFQs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Sourcing RFQs
              </span>
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition">
                <FiFileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(overview.total)}
              </span>
              <span className="text-xs text-slate-500">tenders floated</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>Demanded across buyer accounts</span>
            </p>
          </div>

          {/* Card 2: Open for Bidding */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Open for Vendor Bidding
              </span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition">
                <MdPending className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(overview.open)}
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Active Bidding
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Receiving competitive BOQ bids</span>
            </p>
          </div>

          {/* Card 3: Quotes Received */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Quotes Under Review
              </span>
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition">
                <MdVerified className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(overview.quoted)}
              </span>
              <span className="text-xs text-blue-600 font-medium">proposals logged</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>Awaiting buyer commercial acceptance</span>
            </p>
          </div>

          {/* Card 4: Converted / Closed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Converted to PO / Closed
              </span>
              <div className="p-2 bg-slate-100 rounded-xl text-slate-700 group-hover:bg-slate-200 transition">
                <MdOutlineAssignmentTurnedIn className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(overview.closed)}
              </span>
              <span className="text-xs text-slate-500">finalized</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>Directly contracted or fulfilled</span>
            </p>
          </div>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Breakdown - Pie Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <FiBarChart2 className="w-5 h-5 text-indigo-600" />
                Tender Pipeline Status Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Proportion of tenders across lifecycle stages
              </p>
            </div>

            <div className="h-56 my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={by_status}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="total"
                    nameKey="status"
                  >
                    {by_status.map((entry) => (
                      <Cell
                        key={`cell-${entry.status}`}
                        fill={COLORS[entry.status] || '#94a3b8'}
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
                    formatter={(val, name) => [`${val} Tenders`, normalizeStatusLabel(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-100">
              {by_status.map((item, index) => {
                const pct = overview.total > 0 ? ((item.total / overview.total) * 100).toFixed(1) : 0;
                return (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[item.status] || '#94a3b8' }} />
                      <span className="text-slate-600">{normalizeStatusLabel(item.status)}</span>
                    </div>
                    <span className="font-semibold text-slate-900 font-mono">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conversion Gauge Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <FiTrendingUp className="w-5 h-5 text-indigo-600" />
                Inquiry-to-PO Conversion
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Conversion of inquiry tenders into real purchase orders
              </p>
            </div>

            <div className="my-auto text-center py-4">
              <div className="relative inline-flex">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    className="text-slate-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-indigo-600 transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - Math.min(100, Math.max(0, conversion_rate.rate)) / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-slate-900 font-mono">
                    {conversion_rate.rate}%
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Success</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-left">
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <p className="text-xs text-slate-500">Total Floated</p>
                  <p className="text-base font-bold text-slate-900 font-mono mt-0.5">{formatNumber(conversion_rate.total)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50">
                  <p className="text-xs text-emerald-700">Converted POs</p>
                  <p className="text-base font-bold text-emerald-700 font-mono mt-0.5">{formatNumber(conversion_rate.converted)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <FiClock className="w-5 h-5 text-indigo-600" />
                Vendor Quote Turnaround
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Speed of vendor proposal dispatch from tender flotation
              </p>
            </div>

            <div className="my-auto text-center py-6">
              <div className="inline-flex items-baseline gap-1.5 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-5xl font-extrabold text-indigo-600 font-mono tracking-tight">
                  {response_time ? Math.round(response_time) : 0}
                </span>
                <span className="text-lg font-semibold text-indigo-900">hours</span>
              </div>
              <p className="text-xs text-slate-500 mt-4 max-w-xs mx-auto">
                Average elapsed time from tender creation to first formal commercial quote submission
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Target SLA:</span>
              <span className="font-semibold text-emerald-600">&lt; 24 Hours</span>
            </div>
          </div>
        </div>

        {/* Detailed Status Breakdown Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Comprehensive Sourcing Status Audit</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of tenders by current administrative stage
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">
              {by_status.length} status categories
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-3.5">Tender Lifecycle Status</th>
                  <th className="px-6 py-3.5 text-right">Tender Count</th>
                  <th className="px-6 py-3.5 text-right">Pipeline Share %</th>
                  <th className="px-6 py-3.5 text-center">Operational Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {by_status.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
                      No tender activity found in this period.
                    </td>
                  </tr>
                ) : (
                  by_status.map((item) => {
                    const percentage = (overview.total > 0)
                      ? ((item.total / overview.total) * 100).toFixed(1)
                      : 0;

                    return (
                      <tr key={item.status} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-900">
                            {normalizeStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">
                          {formatNumber(item.total)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <span className="text-xs font-mono text-slate-600 font-medium">{percentage}%</span>
                            <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${Math.min(100, Math.max(2, percentage))}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.status === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                            item.status === 'quoted' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                            'bg-slate-100 text-slate-700 border border-slate-200/60'
                          }`}>
                            {item.status === 'open' ? 'Open for Bids' :
                             item.status === 'quoted' ? 'Reviewing Quotes' :
                             'PO Finalized'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}