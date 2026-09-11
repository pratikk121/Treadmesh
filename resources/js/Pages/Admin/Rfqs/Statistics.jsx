// resources/js/Pages/Admin/Rfqs/Statistics.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiArrowLeft,
  FiFileText,
  FiTrendingUp,
  FiCalendar,
  FiPieChart,
  FiUsers,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiBarChart2
} from 'react-icons/fi';
import { BsGraphUp, BsPeople } from 'react-icons/bs';
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

export default function Statistics({ stats }) {
  const { by_status = [], by_buyer = [], monthly_trend = [], response_rate = {}, popular_products = [] } = stats;

  // Status mapping for Indian B2B context
  const getStatusLabel = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'open':
        return 'Open Tender';
      case 'quoted':
        return 'Quotes Received';
      case 'closed':
        return 'Closed / Awarded';
      default:
        return status;
    }
  };

  // Status based color mapping
  const COLORS = {
    open: '#10B981',    // Emerald
    quoted: '#3B82F6',  // Blue
    closed: '#64748B'   // Slate
  };

  // Format month string
  const formatChartDate = (month) => {
    if (!month) return '';
    const parts = month.split('-');
    if (parts.length < 2) return month;
    const [year, monthNum] = parts;
    return new Date(year, monthNum - 1).toLocaleDateString('en-IN', {
      month: 'short',
      year: '2-digit'
    });
  };

  // Calculate totals
  const totalRfqs = by_status.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const responseRate = totalRfqs > 0
    ? (((response_rate.with_quotes || 0) / totalRfqs) * 100).toFixed(1)
    : 0;

  return (
    <DashboardLayout>
      <Head title="RFQ Procurement Analytics | Treadmesh Admin" />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-4">
            <Link
              href={route('admin.rfqs.index')}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              title="Return to tender ledger"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Procurement Intelligence
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Real-Time Telemetry
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                RFQ & Tender Analytics
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Quantitative metrics on enterprise procurement pipelines, vendor quoting velocity, and category demand.
              </p>
            </div>
          </div>

          <Link
            href={route('admin.rfqs.index')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
          >
            <FiFileText className="w-4 h-4 text-slate-500" />
            <span>View All Tenders</span>
          </Link>
        </div>

        {/* Summary Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Tenders</p>
                <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalRfqs}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Cumulative platform tenders</p>
              </div>
              <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                <FiFileText className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Vendor Bid Rate</p>
                <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">{responseRate}%</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Tenders with ≥ 1 submitted bid</p>
              </div>
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                <BsGraphUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Bids / Tender</p>
                <p className="text-2xl font-bold font-mono text-purple-600 mt-1">
                  {response_rate.avg_quotes_per_rfq ? response_rate.avg_quotes_per_rfq.toFixed(1) : '0.0'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Supplier competition index</p>
              </div>
              <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100">
                <BsPeople className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">High-Demand Items</p>
                <p className="text-2xl font-bold font-mono text-amber-600 mt-1">{popular_products.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Active catalog request lines</p>
              </div>
              <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100">
                <FiTrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution Pie */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FiPieChart className="w-4 h-4 text-indigo-600" />
                Tender Lifecycle Breakdown
              </h3>
              <span className="text-xs text-slate-500 font-medium">{totalRfqs} Tenders Total</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={by_status}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, percent }) => `${getStatusLabel(status)}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                    nameKey="status"
                  >
                    {by_status.map((entry) => (
                      <Cell key={`cell-${entry.status}`} fill={COLORS[entry.status] || '#94A3B8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, getStatusLabel(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              {by_status.map((item) => (
                <div key={item.status} className="text-center p-2 rounded-xl bg-slate-50">
                  <span className="text-lg font-bold font-mono" style={{ color: COLORS[item.status] || '#64748B' }}>
                    {item.total}
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {getStatusLabel(item.status)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend Line */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FiCalendar className="w-4 h-4 text-indigo-600" />
                Monthly Tender Velocity (12 Months)
              </h3>
              <span className="text-xs text-slate-500 font-medium">New RFQs Published</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly_trend} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickFormatter={formatChartDate} stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip
                    labelFormatter={(label) => formatChartDate(label)}
                    formatter={(val) => [val, 'Published Tenders']}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    dot={{ fill: '#4F46E5', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Tenders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="text-xs text-slate-400 text-center pt-2 border-t border-slate-100">
              Procurement velocity reflects aggregate buyer purchasing cycles and seasonal demand
            </p>
          </div>

          {/* Top Enterprise Buyers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiUsers className="w-4 h-4 text-indigo-600" />
              Top Enterprise Buyers by Volume
            </h3>
            <div className="space-y-2">
              {by_buyer.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No buyer activity data recorded.</p>
              ) : (
                by_buyer.map((buyer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-mono font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {buyer.buyer?.name || 'Enterprise Buyer'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Avg. Lot Size: {Math.round(buyer.avg_quantity || 0)} Units
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      {buyer.total_rfqs} Tenders
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Popular Products */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiPackage className="w-4 h-4 text-indigo-600" />
              Top Requested Products & Materials
            </h3>
            <div className="space-y-2">
              {popular_products.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No specific product data recorded.</p>
              ) : (
                popular_products.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-mono font-bold">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {product.product}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      {product.count} Requests
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Vendor Response Analytics */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Vendor Bidding & Engagement Velocity</h3>
              <p className="text-xs text-slate-500 mt-0.5">Metrics evaluating supplier competition and quote turnaround</p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              {responseRate}% Conversion
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tenders with Active Bids</p>
              <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">{response_rate.with_quotes || 0}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {totalRfqs > 0 ? (((response_rate.with_quotes || 0) / totalRfqs) * 100).toFixed(1) : 0}% of total tenders
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tenders Awaiting Bids</p>
              <p className="text-2xl font-bold font-mono text-amber-600 mt-1">{response_rate.without_quotes || 0}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {totalRfqs > 0 ? (((response_rate.without_quotes || 0) / totalRfqs) * 100).toFixed(1) : 0}% of total tenders
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Average Bids per Tender</p>
              <p className="text-2xl font-bold font-mono text-indigo-600 mt-1">
                {response_rate.avg_quotes_per_rfq?.toFixed(2) || '0.00'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Competitive depth index</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Overall Bid Response Coverage</span>
              <span className="font-mono">{responseRate}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${responseRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Status Breakdown Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Procurement Lifecycle Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Lifecycle Stage</th>
                  <th className="px-6 py-3.5">Tender Count</th>
                  <th className="px-6 py-3.5">Percentage Share</th>
                  <th className="px-6 py-3.5">Volume Share Visual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {by_status.map((item) => {
                  const percentage = totalRfqs > 0 ? ((item.total / totalRfqs) * 100).toFixed(1) : 0;
                  return (
                    <tr key={item.status} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-slate-900">{item.total}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-slate-600">{percentage}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-48 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: COLORS[item.status] || '#4F46E5'
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}