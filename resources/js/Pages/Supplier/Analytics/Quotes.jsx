// resources/js/Pages/Supplier/Analytics/Quotes.jsx

import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiCheckCircle,
  FiCalendar,
  FiDownload,
  FiClock,
  FiFileText,
  FiTrendingUp,
  FiAlertCircle,
  FiLayers,
  FiZap
} from 'react-icons/fi';
import { BsShieldCheck, BsGraphUp } from 'react-icons/bs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  formatCurrency,
  formatIndianScale,
  formatIndianDate
} from '@/Utils/formatters';

export default function QuotesAnalytics({
  dateRange = {},
  totalQuotes = 0,
  pendingQuotes = 0,
  expiredQuotes = 0,
  acceptedValue = 0,
  quotesByMonth = {},
  quotesByBuyer = {},
  rejectedQuotes = 0,
  acceptedQuotes = 0,
  conversionRate = 0,
  avgResponseDays = 0,
  totalQuoteValue = 0,
  avgResponseHours = 0,
  valueDistribution = {},
  revenueFromQuotes = 0,
  successByResponseTime = {},
}) {
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(value || 0);
  };

  const formatPercentage = (value) => {
    return `${Number(value || 0).toFixed(1)}%`;
  };

  const handleExport = () => {
    const params = new URLSearchParams({
      type: 'quotes',
      format: 'csv',
      date_from: dateRange?.start || '',
      date_to: dateRange?.end || ''
    });
    window.location.href = route('supplier.analytics.export') + '?' + params.toString();
  };

  const statusData = [
    { name: 'Accepted', value: acceptedQuotes, color: '#10B981' },
    { name: 'Under Review', value: pendingQuotes, color: '#F59E0B' },
    { name: 'Rejected', value: rejectedQuotes, color: '#EF4444' },
    { name: 'Expired', value: expiredQuotes, color: '#64748B' }
  ].filter(item => item.value > 0);

  return (
    <DashboardLayout>
      <Head title="Supplier Quotation Analytics & Win Rates | Treadmesh" />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Bid Management & Win Rates
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <BsShieldCheck className="w-3 h-3 text-emerald-600" />
                Live Bidding Analytics
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              RFQ Quotation Performance & Conversion
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Audit proposal conversion rates, response turnaround SLAs, and realized contract value
            </p>
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition shadow-xs cursor-pointer"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export Quotations CSV</span>
          </button>
        </div>

        {/* Date Window Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <FiCalendar className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">Evaluation Window</p>
              <p className="text-sm font-semibold text-white">
                {dateRange?.start ? formatIndianDate(dateRange.start) : 'Start'} &mdash; {dateRange?.end ? formatIndianDate(dateRange.end) : 'Current Date'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-slate-400">Total Bidding Pipeline:</span>{' '}
              <span className="font-semibold text-white">{formatCurrency(totalQuoteValue)}</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="text-right">
              <span className="text-slate-400">Win Rate:</span>{' '}
              <span className="font-semibold text-emerald-400">{formatPercentage(conversionRate)}</span>
            </div>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Submitted Quotes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Submitted Quotations
              </span>
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition">
                <FiFileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(totalQuotes)}
              </span>
              <span className="text-xs text-slate-500">proposals</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Pipeline Value: <span className="font-semibold text-slate-800">{formatCurrency(totalQuoteValue)}</span>
            </p>
          </div>

          {/* Card 2: Conversion Rate */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Win / Conversion Rate
              </span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition">
                <FiCheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600 tracking-tight font-mono">
                {formatPercentage(conversionRate)}
              </span>
              <span className="text-xs text-slate-500 font-medium">bids won</span>
            </div>
            <p className="text-xs text-emerald-700 mt-2 flex items-center gap-1 font-medium">
              <span>{acceptedQuotes} proposals converted to POs</span>
            </p>
          </div>

          {/* Card 3: Response Turnaround */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Avg Response Speed
              </span>
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-100 transition">
                <FiClock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                {Number(avgResponseHours || 0).toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">hours</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Approx. <span className="font-semibold text-slate-700">{Number(avgResponseDays || 0).toFixed(1)} days</span> turnaround
            </p>
          </div>

          {/* Card 4: Converted GMV */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Converted Contract GMV
              </span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition">
                <BsGraphUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                {formatCurrency(revenueFromQuotes)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Accepted Tender Value: <span className="font-semibold text-emerald-600">{formatCurrency(acceptedValue)}</span>
            </p>
          </div>
        </div>

        {/* Visual Charts Grid 1: Status Breakdown & Monthly Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Breakdown - Donut Chart */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Quotation Status Breakdown</h2>
              <p className="text-xs text-slate-500 mt-0.5">Distribution across negotiation lifecycle</p>
            </div>

            <div className="h-64 my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090D16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    formatter={(value) => [`${formatNumber(value)} Quotes`, 'Volume']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
              <div className="p-2 rounded-lg bg-emerald-50">
                <span className="text-emerald-700 font-bold block font-mono">{acceptedQuotes}</span>
                <span className="text-slate-500">Won</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50">
                <span className="text-amber-700 font-bold block font-mono">{pendingQuotes}</span>
                <span className="text-slate-500">Review</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50">
                <span className="text-rose-700 font-bold block font-mono">{rejectedQuotes}</span>
                <span className="text-slate-500">Rejected</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-100">
                <span className="text-slate-700 font-bold block font-mono">{expiredQuotes}</span>
                <span className="text-slate-500">Expired</span>
              </div>
            </div>
          </div>

          {/* Monthly Bidding Trend - Bar Chart */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Monthly Quotations vs Won POs</h2>
              <p className="text-xs text-slate-500 mt-0.5">Bid volume velocity vs buyer acceptance</p>
            </div>

            <div className="h-64 my-auto mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(quotesByMonth).map(([month, data]) => ({
                  month,
                  total: data.total,
                  accepted: data.accepted
                }))} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090D16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    formatter={(value, name) => [value, name === 'accepted' ? 'Accepted POs' : 'Total Quotes']}
                  />
                  <Legend />
                  <Bar dataKey="total" name="Total Quotes" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="accepted" name="Accepted POs" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Monthly Win Trajectory</span>
              <span className="font-medium text-emerald-600 font-mono">{formatPercentage(conversionRate)} conversion</span>
            </div>
          </div>
        </div>

        {/* Charts Grid 2: Turnaround Win Rate & Price Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Win Rate by Response Speed */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 flex flex-col justify-between">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Win Rate by Turnaround Speed</h2>
              <p className="text-xs text-slate-500 mt-0.5">Correlation between fast bid dispatch and buyer acceptance</p>
            </div>

            <div className="h-64 my-auto mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(successByResponseTime).map(([time, rate]) => ({
                  time,
                  rate: Number(rate || 0)
                }))} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090D16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    formatter={(val) => [`${val.toFixed(1)}%`, 'Win Probability']}
                  />
                  <Bar dataKey="rate" name="Acceptance Rate %" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2">
              <FiZap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Quotes submitted within 24 hours exhibit up to 3x higher contract closure</span>
            </div>
          </div>

          {/* Quote Price Distribution */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Quotation Ticket Size Distribution</h2>
                <p className="text-xs text-slate-500 mt-0.5">Volume and win rate across price brackets</p>
              </div>
              <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                INR Scale
              </span>
            </div>

            <div className="space-y-3.5 mt-4">
              {Object.entries(valueDistribution).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No pricing data available.
                </div>
              ) : (
                Object.entries(valueDistribution).map(([range, data]) => {
                  const pct = totalQuotes > 0 ? ((data.count / totalQuotes) * 100).toFixed(1) : 0;
                  return (
                    <div key={range} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-900 font-mono">{range}</span>
                        <div className="text-right">
                          <span className="text-xs font-medium text-slate-700">{data.count} Quotes</span>
                          <span className="text-xs font-semibold text-emerald-600 ml-2">
                            ({data.rate.toFixed(1)}% won)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Top Buyers by Quotation Activity */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Top Buyers by Quotation Activity</h2>
              <p className="text-xs text-slate-500 mt-0.5">Corporate accounts requesting tenders with proposal win-loss ledger</p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">
              {Object.keys(quotesByBuyer).length} buyers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-3.5">Enterprise Buyer</th>
                  <th className="px-4 py-3.5 text-right">Total Quotes</th>
                  <th className="px-4 py-3.5 text-right">Accepted</th>
                  <th className="px-4 py-3.5 text-right">Rejected</th>
                  <th className="px-4 py-3.5 text-right">Under Review</th>
                  <th className="px-6 py-3.5 text-right">Floated Value (₹)</th>
                  <th className="px-6 py-3.5 text-right">Converted Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {Object.keys(quotesByBuyer).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-sm">
                      No quotation history recorded with corporate buyers.
                    </td>
                  </tr>
                ) : (
                  Object.values(quotesByBuyer).map((buyer) => (
                    <tr key={buyer.buyer?.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {buyer.buyer?.name?.charAt(0) || 'B'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{buyer.buyer?.name || 'Enterprise Buyer'}</p>
                            <p className="text-xs text-slate-400">{buyer.buyer?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-mono font-medium text-slate-700">{buyer.total_quotes}</td>
                      <td className="px-4 py-4 text-right font-mono font-bold text-emerald-600">{buyer.accepted}</td>
                      <td className="px-4 py-4 text-right font-mono font-medium text-rose-600">{buyer.rejected}</td>
                      <td className="px-4 py-4 text-right font-mono font-medium text-amber-600">{buyer.pending}</td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-slate-900">
                        {formatCurrency(buyer.total_value)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">
                        {formatCurrency(buyer.accepted_value)}
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