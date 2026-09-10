// Pages/Admin/Reports/Buyers.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Admin dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
import {
  FiUsers,
  FiCalendar,
  FiDownload,
  FiShoppingCart,
  FiFileText,
  FiUserCheck,
} from 'react-icons/fi';
import { BsGraphUp } from 'react-icons/bs';

export default function Buyers({ buyerData, period, dateRange }) {
  // State management for selected period
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  // Destructure data from props
  const { overview, top_buyers, activity_stats, rfq_stats } = buyerData;

  // Format currency - Converts number to USD currency format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format number - Adds thousand separators
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Handle period change - Update report period
  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    router.get(route('admin.reports.buyers'), { period: newPeriod }, { preserveState: true });
  };

  // Handle export - Download report in specified format
  const handleExport = (format = 'csv') => {
    window.location.href = route('admin.reports.export', {
      type: 'buyers',
      format,
      period: selectedPeriod,
      date_from: dateRange.start,
      date_to: dateRange.end
    });
  };

  // Period options for dropdown
  const periodOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Annually' },
  ];

  return (
    <DashboardLayout>
      <Head title="Buyer reports" />

      <div className="space-y-6">
        {/* Header - Page title, period selector and export button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buyer reports</h1>
            <p className="text-sm text-gray-600 mt-1">
              Analyze customer activity and engagement
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Date Range Display */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-center gap-2 text-indigo-700">
          <FiCalendar className="w-4 h-4" />
          <span className="text-sm font-medium">
            Report period: {new Date(dateRange.start).toLocaleDateString('en-US')} - {new Date(dateRange.end).toLocaleDateString('en-US')}
          </span>
        </div>

        {/* Overview Cards - Key buyer metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total buyers</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{formatNumber(overview.total)}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active buyer</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{formatNumber(overview.active)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Buyer with order</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{formatNumber(overview.with_orders)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">RFQ Co-buyer</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{formatNumber(overview.with_rfqs)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiFileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Activity Stats - Buyer engagement metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">New Buyer</p>
            <p className="text-3xl font-bold text-indigo-600">{formatNumber(activity_stats.new_buyers)}</p>
            <p className="text-xs text-gray-500 mt-1">During this period</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Active buyer</p>
            <p className="text-3xl font-bold text-green-600">{formatNumber(activity_stats.active_buyers)}</p>
            <p className="text-xs text-gray-500 mt-1">Ordered</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Average order/buyer</p>
            <p className="text-3xl font-bold text-purple-600">{activity_stats.average_orders_per_buyer}</p>
            <p className="text-xs text-gray-500 mt-1">During this period</p>
          </div>
        </div>

        {/* RFQ Stats - Quote request metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">total RFQ</p>
            <p className="text-3xl font-bold text-indigo-600">{formatNumber(rfq_stats.total_rfqs)}</p>
            <p className="text-xs text-gray-500 mt-1">During this period</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">RFQ Co-buyer</p>
            <p className="text-3xl font-bold text-green-600">{formatNumber(rfq_stats.buyers_with_rfqs)}</p>
            <p className="text-xs text-gray-500 mt-1">Active RFQ generator</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Average RFQ/Buyer</p>
            <p className="text-3xl font-bold text-purple-600">{rfq_stats.avg_rfqs_per_buyer}</p>
            <p className="text-xs text-gray-500 mt-1">Among active buyers is</p>
          </div>
        </div>

        {/* Top Buyers - Highest spending buyers table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Table header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <BsGraphUp className="w-5 h-5 text-indigo-600" />
              Top buyer by spend
            </h3>
          </div>

            {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">

              {/* Table header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">sequence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">total cost</th>
                </tr>
              </thead>

              {/* Table body */}
              <tbody className="divide-y divide-gray-100">
                {top_buyers.map((buyer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                            'bg-indigo-50 text-indigo-600'
                        }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{buyer.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${buyer.email}`} className="text-sm text-indigo-600 hover:text-indigo-700">
                        {buyer.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900">{formatNumber(buyer.orders_count)}</td>
                    <td className="px-6 py-4 text-right text-green-600 font-medium">
                      {formatCurrency(buyer.total_spent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}