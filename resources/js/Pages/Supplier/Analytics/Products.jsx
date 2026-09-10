// Pages/Supplier/Analytics/Products.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

// Layout - Supplier dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
import {
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiCalendar
} from 'react-icons/fi';

// Recharts - Charting library components for data visualization
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function ProductsAnalytics({
  dateRange,
  products,
  categoryPerformance,
  inventoryMetrics,
  topByRevenue,
  bottomByRevenue
}) {
  // State management for sorting and filtering
  const [sortField, setSortField] = useState('total_revenue');
  const [sortDirection, setSortDirection] = useState('desc');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Format currency - Converts number to USD currency format
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format number - Adds thousand separators
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Chart colors - Color palette for pie chart segments
  const CHART_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // Process category data for chart display
  const categoryData = Array.isArray(categoryPerformance)
    ? categoryPerformance.map((item) => ({
      name: item.category || 'Uncategorized',
      revenue: Number(item.revenue || 0),
      quantity: Number(item.quantity_sold || 0),
      products: Number(item.product_count || 0)
    }))
    : Object.entries(categoryPerformance || {}).map(([category, data]) => ({
      name: category,
      revenue: Number(data?.revenue || 0),
      quantity: Number(data?.quantity || 0),
      products: Number(data?.products || 0)
    }));

  const totalCategoryRevenue = categoryData.reduce((sum, item) => sum + item.revenue, 0);

  // Format date for display
  const formatDateLabel = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format date for API parameters
  const formatDateParam = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  // Handle column sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products by selected category
  const filteredProducts = categoryFilter === 'all'
    ? products
    : products.filter(p => p.category === categoryFilter);

  // Sort products based on current sort field and direction
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aVal = a[sortField] || 0;
    let bVal = b[sortField] || 0;

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // Get stock status color based on inventory level
  const getStockStatusColor = (status) => {
    const colors = {
      'Out of Stock': 'text-red-600 bg-red-50',
      'Low Stock': 'text-orange-600 bg-orange-50',
      'Medium Stock': 'text-yellow-600 bg-yellow-50',
      'High Stock': 'text-green-600 bg-green-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  // Handle export functionality
  const handleExport = () => {
    const params = new URLSearchParams({
      type: 'products',
      format: 'csv',
      date_from: formatDateParam(dateRange.start),
      date_to: formatDateParam(dateRange.end)
    });
    window.location.href = route('supplier.analytics.export') + '?' + params.toString();
  };

  return (
    <DashboardLayout>
      <Head title="Product analysis" />

      <div className="space-y-6">
        {/* Header - Page title and export button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product analysis</h1>
            <p className="text-sm text-gray-600 mt-1">
              Analyze your product performance and inventory metrics
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition"
          >
            <FiDownload className="w-4 h-4" />
            <span>Report Export</span>
          </button>
        </div>

        {/* Period Info - Date range display */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiCalendar className="w-4 h-4" />
            <span>Duration: {formatDateLabel(dateRange.start)} - {formatDateLabel(dateRange.end)}</span>
          </div>
        </div>

        {/* Inventory Metrics - Key inventory statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(inventoryMetrics.total_products)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Active product</p>
            <p className="text-2xl font-bold text-green-600">{formatNumber(inventoryMetrics.active_products)}</p>
          </div>
          <div className="bg-orange-50 rounded-xl shadow-sm border border-orange-100 p-6">
            <p className="text-sm text-orange-600">Stock low</p>
            <p className="text-2xl font-bold text-orange-700">{formatNumber(inventoryMetrics.low_stock)}</p>
          </div>
          <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-6">
            <p className="text-sm text-red-600">Out of Stock</p>
            <p className="text-2xl font-bold text-red-700">{formatNumber(inventoryMetrics.out_of_stock)}</p>
          </div>
          <div className="bg-indigo-50 rounded-xl shadow-sm border border-indigo-100 p-6">
            <p className="text-sm text-indigo-600">Stock price</p>
            <p className="text-2xl font-bold text-indigo-700">{formatCurrency(inventoryMetrics.total_stock_value)}</p>
          </div>
        </div>

        {/* Category Performance - Charts and breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Performance Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category performance</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData.map((item) => ({
                      name: item.name,
                      value: item.revenue
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Analysis</h2>
            <div className="space-y-4">
              {categoryData.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <span className="font-bold text-indigo-600">{formatCurrency(item.revenue)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{formatNumber(item.quantity)} Units sold</span>
                    <span>•</span>
                    <span>{item.products} products</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${totalCategoryRevenue > 0 ? (item.revenue / totalCategoryRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top & Bottom Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 by Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 by Revenue</h2>
            <div className="space-y-4">
              {topByRevenue.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatNumber(product.total_quantity_sold)} Unit · {product.order_count} Order
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(product.total_revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom 5 by Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Low 5</h2>
            <div className="space-y-4">
              {bottomByRevenue.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-medium text-red-600">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatNumber(product.total_quantity_sold)} Unit · {product.order_count} Order
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{formatCurrency(product.total_revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Table - Detailed product performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Performance of all products</h2>
              <div className="flex items-center gap-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1">
                      Product
                      {sortField === 'name' && (sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    <button onClick={() => handleSort('base_price')} className="flex items-center gap-1">
                      Price
                      {sortField === 'base_price' && (sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    <button onClick={() => handleSort('stock_quantity')} className="flex items-center gap-1">
                      stock
                      {sortField === 'stock_quantity' && (sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    <button onClick={() => handleSort('total_quantity_sold')} className="flex items-center gap-1">
                      Sold Units
                      {sortField === 'total_quantity_sold' && (sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    <button onClick={() => handleSort('total_revenue')} className="flex items-center gap-1">
                      Income
                      {sortField === 'total_revenue' && (sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    <button onClick={() => handleSort('order_count')} className="flex items-center gap-1">
                      Order
                      {sortField === 'order_count' && (sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          href={route('supplier.products.edit', product.id)}
                          className="font-medium text-gray-900 hover:text-indigo-600"
                        >
                          {product.name}
                        </Link>
                        <p className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${getStockStatusColor(product.stock_status)}`}>
                          {product.stock_status === 'Out of Stock' ? 'Out of Stock' :
                            product.stock_status === 'Low Stock' ? 'Stock low' :
                              product.stock_status === 'Medium Stock' ? 'Average Stock' :
                                product.stock_status === 'High Stock' ? 'Adequate stock' : product.stock_status}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category || 'N/A'}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(product.base_price)}</td>
                    <td className="px-6 py-4 text-right">{formatNumber(product.stock_quantity)}</td>
                    <td className="px-6 py-4 text-right">{formatNumber(product.total_quantity_sold || 0)}</td>
                    <td className="px-6 py-4 text-right font-bold text-indigo-600">
                      {formatCurrency(product.total_revenue || 0)}
                    </td>
                    <td className="px-6 py-4 text-right">{formatNumber(product.order_count || 0)}</td>
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