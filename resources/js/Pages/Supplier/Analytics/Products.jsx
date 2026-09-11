// resources/js/Pages/Supplier/Analytics/Products.jsx

import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiBox,
  FiLayers,
  FiAlertTriangle,
  FiSlash,
  FiCalendar,
  FiDownload,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiArrowUpRight,
  FiArrowDownRight,
  FiExternalLink,
  FiCheckCircle,
  FiPackage,
  FiShoppingBag,
  FiTrendingUp,
  FiRefreshCw
} from 'react-icons/fi';
import {
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

export default function ProductsAnalytics({
  dateRange = {},
  products = [],
  categoryPerformance = [],
  inventoryMetrics = {},
  topByRevenue = [],
  topByQuantity = [],
  bottomByRevenue = []
}) {
  // State management for sorting and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('total_revenue');
  const [sortDirection, setSortDirection] = useState('desc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Format Indian standard numbers with commas
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(value || 0);
  };

  // Safe collections
  const safeProducts = useMemo(() => {
    return Array.isArray(products) ? products : Object.values(products || {});
  }, [products]);

  const safeTopByRevenue = useMemo(() => {
    return Array.isArray(topByRevenue) ? topByRevenue : Object.values(topByRevenue || {});
  }, [topByRevenue]);

  const safeBottomByRevenue = useMemo(() => {
    return Array.isArray(bottomByRevenue) ? bottomByRevenue : Object.values(bottomByRevenue || {});
  }, [bottomByRevenue]);

  // Chart colors - refined palette matching Stripe/Linear palette
  const CHART_COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6', '#64748B'];

  // Process category data for charts and progress meters
  const categoryData = useMemo(() => {
    const data = Array.isArray(categoryPerformance)
      ? categoryPerformance.map((item) => ({
        name: item.category || 'Uncategorized',
        revenue: Number(item.revenue || 0),
        quantity: Number(item.quantity_sold || 0),
        products: Number(item.product_count || 0)
      }))
      : Object.entries(categoryPerformance || {}).map(([category, d]) => ({
        name: category || 'Uncategorized',
        revenue: Number(d?.revenue || 0),
        quantity: Number(d?.quantity || 0),
        products: Number(d?.products || 0)
      }));

    return data.sort((a, b) => b.revenue - a.revenue);
  }, [categoryPerformance]);

  const totalCategoryRevenue = useMemo(() => {
    return categoryData.reduce((sum, item) => sum + item.revenue, 0);
  }, [categoryData]);

  // Format date for API export parameters
  const formatDateParam = (date) => {
    if (!date) return '';
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Handle column sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Set(safeProducts.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [safeProducts]);

  // Filter products by search query, category, and stock status
  const filteredProducts = useMemo(() => {
    return safeProducts.filter((product) => {
      // Search matching
      const matchesSearch = !searchQuery ||
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category matching
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

      // Stock status matching
      let matchesStock = true;
      const stockQty = Number(product.stock_quantity || 0);
      if (stockFilter === 'out_of_stock') {
        matchesStock = stockQty <= 0 || product.stock_status === 'Out of Stock';
      } else if (stockFilter === 'low_stock') {
        matchesStock = (stockQty > 0 && stockQty <= 10) || product.stock_status === 'Low Stock';
      } else if (stockFilter === 'in_stock') {
        matchesStock = stockQty > 10;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [safeProducts, searchQuery, categoryFilter, stockFilter]);

  // Sort products based on current sort field and direction
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let aVal = a[sortField] ?? 0;
      let bVal = b[sortField] ?? 0;

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      aVal = Number(aVal) || 0;
      bVal = Number(bVal) || 0;

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filteredProducts, sortField, sortDirection]);

  // Stock status badge configuration
  const getStockBadgeConfig = (status, quantity) => {
    const qty = Number(quantity || 0);
    if (qty <= 0 || status === 'Out of Stock') {
      return {
        label: 'Stockout (0 Units)',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
        dotClass: 'bg-rose-500'
      };
    }
    if (qty <= 10 || status === 'Low Stock') {
      return {
        label: `Low Stock (${qty} Left)`,
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
        dotClass: 'bg-amber-500'
      };
    }
    if (status === 'Medium Stock' || (qty > 10 && qty <= 50)) {
      return {
        label: `Optimal (${formatNumber(qty)})`,
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        dotClass: 'bg-emerald-500'
      };
    }
    return {
      label: `Surplus (${formatNumber(qty)})`,
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
      dotClass: 'bg-blue-500'
    };
  };

  // Handle export functionality
  const handleExport = () => {
    const params = new URLSearchParams({
      type: 'products',
      format: 'csv',
      date_from: formatDateParam(dateRange?.start),
      date_to: formatDateParam(dateRange?.end)
    });
    window.location.href = route('supplier.analytics.export') + '?' + params.toString();
  };

  // Custom Chart Tooltip
  const CustomChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = totalCategoryRevenue > 0 ? ((data.revenue / totalCategoryRevenue) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700/60 text-xs">
          <p className="font-semibold text-slate-200 mb-1">{data.name}</p>
          <div className="space-y-1">
            <p className="flex items-center justify-between gap-4 text-emerald-400 font-mono font-medium">
              <span>Gross GMV:</span>
              <span>{formatCurrency(data.revenue)}</span>
            </p>
            <p className="flex items-center justify-between gap-4 text-slate-300">
              <span>Units Dispatched:</span>
              <span className="font-mono">{formatNumber(data.quantity)}</span>
            </p>
            <p className="flex items-center justify-between gap-4 text-slate-400">
              <span>Catalog Share:</span>
              <span>{percent}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <Head title="Product Catalog & Inventory Intelligence" />

      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* Header - Modern Executive Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.02]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <FiBox className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Product Catalog & Inventory Intelligence
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Real-time SKU velocity, Make-in-India warehouse valuation, stockout alerts, and sales volume by product category.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Badge */}
            <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
              <FiCalendar className="w-4 h-4 text-slate-500" />
              <span>
                Window: {dateRange?.start ? formatIndianDate(dateRange.start) : 'All Time'} – {dateRange?.end ? formatIndianDate(dateRange.end) : 'Present'}
              </span>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition duration-150 active:scale-[0.98]"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export Catalog CSV</span>
            </button>
          </div>
        </div>

        {/* 5-Column Executive Inventory Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total SKUs */}
          <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total SKUs</span>
              <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                <FiBox className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                {formatNumber(inventoryMetrics?.total_products || safeProducts.length)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Registered catalog entries</p>
            </div>
          </div>

          {/* Card 2: Active Products */}
          <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Catalog</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <FiCheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-emerald-600 font-mono">
                {formatNumber(inventoryMetrics?.active_products || 0)}
              </p>
              <p className="text-xs text-emerald-700/80 mt-1 flex items-center gap-1 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                Live on B2B Marketplace
              </p>
            </div>
          </div>

          {/* Card 3: Low Stock Alerts */}
          <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-amber-200/80 bg-gradient-to-b from-amber-50/40 to-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-800 uppercase tracking-wider">Low Stock SKUs</span>
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <FiAlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-amber-700 font-mono">
                {formatNumber(inventoryMetrics?.low_stock || 0)}
              </p>
              <p className="text-xs text-amber-700 mt-1 flex items-center gap-1 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
                Requires Replenishment (≤10)
              </p>
            </div>
          </div>

          {/* Card 4: Critical Stockouts */}
          <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-rose-200/80 bg-gradient-to-b from-rose-50/40 to-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-rose-800 uppercase tracking-wider">Stockouts (0 Units)</span>
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <FiSlash className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-rose-700 font-mono">
                {formatNumber(inventoryMetrics?.out_of_stock || 0)}
              </p>
              <p className="text-xs text-rose-700 mt-1 flex items-center gap-1 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 inline-block" />
                Zero Inventory Available
              </p>
            </div>
          </div>

          {/* Card 5: Inventory Valuation */}
          <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-indigo-200/80 bg-gradient-to-b from-indigo-50/40 to-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-indigo-900 uppercase tracking-wider">Inventory Value</span>
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                <FiTrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-indigo-700 font-mono">
                {formatIndianScale(inventoryMetrics?.total_stock_value || 0)}
              </p>
              <p className="text-xs text-indigo-700 mt-1 font-mono font-medium">
                {formatCurrency(inventoryMetrics?.total_stock_value || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Category Performance & Analytics Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Category Performance Donut Visualizer */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <FiLayers className="w-4 h-4 text-indigo-600" />
                    Revenue Share by Product Category
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gross contribution of each product category to realized sales revenue
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-mono font-medium">
                  Total: {formatIndianScale(totalCategoryRevenue)}
                </span>
              </div>

              {categoryData.length > 0 ? (
                <div className="h-72 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData.map(item => ({
                          name: item.name,
                          value: item.revenue,
                          ...item
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={105}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cat-cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                            className="stroke-white stroke-2 focus:outline-none"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 flex flex-col items-center justify-center text-slate-400 text-xs">
                  <FiBox className="w-8 h-8 mb-2 stroke-[1.5]" />
                  <span>No category sales records in this period</span>
                </div>
              )}
            </div>

            {/* Quick Category Legend */}
            {categoryData.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-100 text-xs">
                {categoryData.slice(0, 6).map((cat, idx) => {
                  const share = totalCategoryRevenue > 0 ? ((cat.revenue / totalCategoryRevenue) * 100).toFixed(1) : 0;
                  return (
                    <div key={cat.name} className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                      />
                      <span className="truncate text-slate-600 font-medium">{cat.name}</span>
                      <span className="font-mono text-slate-400 ml-auto">{share}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category Breakdown Progress Bars */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <FiShoppingBag className="w-4 h-4 text-indigo-600" />
                  Category Dispatch & Volume Breakdown
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed SKU count, quantity dispatched, and revenue realization
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {categoryData.length} Categories
              </span>
            </div>

            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
              {categoryData.length > 0 ? (
                categoryData.map((item, idx) => {
                  const pct = totalCategoryRevenue > 0 ? (item.revenue / totalCategoryRevenue) * 100 : 0;
                  return (
                    <div key={item.name} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                          />
                          <span className="font-semibold text-slate-800 text-sm truncate">{item.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">({item.products} SKUs)</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span>Dispatched: <strong className="font-mono text-slate-700">{formatNumber(item.quantity)} Units</strong></span>
                        <span className="font-mono font-medium text-indigo-600">{pct.toFixed(1)}% of GMV</span>
                      </div>

                      <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(pct, 2)}%`,
                            backgroundColor: CHART_COLORS[idx % CHART_COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No categories recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* High vs Low Velocity SKU Intelligence Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 High-Velocity SKUs by Revenue */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <FiArrowUpRight className="w-5 h-5 text-emerald-600" />
                  Top 5 Revenue Generating SKUs
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Highest grossing products across confirmed Indian B2B purchase orders
                </p>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200/80">
                Top Performers
              </span>
            </div>

            <div className="space-y-3">
              {safeTopByRevenue.length > 0 ? (
                safeTopByRevenue.map((product, index) => (
                  <div
                    key={product.id || index}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                        #{index + 1}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={route('supplier.products.edit', product.id)}
                          className="font-semibold text-slate-900 hover:text-indigo-600 text-sm truncate block transition"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-slate-700">{formatNumber(product.total_quantity_sold || 0)} Units Sold</span>
                          <span>•</span>
                          <span>{product.order_count || 0} PO Orders</span>
                          {product.category && (
                            <>
                              <span>•</span>
                              <span className="text-slate-400 truncate">{product.category}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <p className="font-bold text-emerald-600 font-mono text-sm">
                        {formatCurrency(product.total_revenue || 0)}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {formatIndianScale(product.total_revenue || 0)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No high-velocity product data recorded.
                </div>
              )}
            </div>
          </div>

          {/* Bottom 5 Slower Velocity SKUs */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <FiArrowDownRight className="w-5 h-5 text-amber-600" />
                  Lowest 5 by Revenue (Attention Required)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Products with sluggish order conversion that may benefit from price or MOQ review
                </p>
              </div>
              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full border border-amber-200/80">
                Low Velocity
              </span>
            </div>

            <div className="space-y-3">
              {safeBottomByRevenue.length > 0 ? (
                safeBottomByRevenue.map((product, index) => (
                  <div
                    key={product.id || index}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                        #{index + 1}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={route('supplier.products.edit', product.id)}
                          className="font-semibold text-slate-900 hover:text-indigo-600 text-sm truncate block transition"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-slate-700">{formatNumber(product.total_quantity_sold || 0)} Units Sold</span>
                          <span>•</span>
                          <span>{product.order_count || 0} PO Orders</span>
                          {product.category && (
                            <>
                              <span>•</span>
                              <span className="text-slate-400 truncate">{product.category}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <p className="font-bold text-slate-700 font-mono text-sm">
                        {formatCurrency(product.total_revenue || 0)}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Base: {formatCurrency(product.base_price || 0)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No underperforming product alerts currently triggered.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comprehensive Product Performance Ledger */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Comprehensive Catalog Performance Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {sortedProducts.length} of {safeProducts.length} registered SKUs
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search SKU or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Status Filter */}
              <div className="relative">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="in_stock">Optimal / In Stock</option>
                  <option value="low_stock">Low Stock (≤10 Units)</option>
                  <option value="out_of_stock">Critical Stockout (0 Units)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1.5 hover:text-slate-900 transition"
                    >
                      <span>Product & SKU</span>
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <FiChevronUp className="w-3.5 h-3.5 text-indigo-600" /> : <FiChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3.5">Category</th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleSort('base_price')}
                      className="flex items-center justify-end gap-1.5 w-full hover:text-slate-900 transition"
                    >
                      <span>Base Price (₹)</span>
                      {sortField === 'base_price' && (
                        sortDirection === 'asc' ? <FiChevronUp className="w-3.5 h-3.5 text-indigo-600" /> : <FiChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleSort('stock_quantity')}
                      className="flex items-center justify-end gap-1.5 w-full hover:text-slate-900 transition"
                    >
                      <span>Available Stock</span>
                      {sortField === 'stock_quantity' && (
                        sortDirection === 'asc' ? <FiChevronUp className="w-3.5 h-3.5 text-indigo-600" /> : <FiChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleSort('total_quantity_sold')}
                      className="flex items-center justify-end gap-1.5 w-full hover:text-slate-900 transition"
                    >
                      <span>Units Dispatched</span>
                      {sortField === 'total_quantity_sold' && (
                        sortDirection === 'asc' ? <FiChevronUp className="w-3.5 h-3.5 text-indigo-600" /> : <FiChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleSort('total_revenue')}
                      className="flex items-center justify-end gap-1.5 w-full hover:text-slate-900 transition"
                    >
                      <span>Realized GMV (₹)</span>
                      {sortField === 'total_revenue' && (
                        sortDirection === 'asc' ? <FiChevronUp className="w-3.5 h-3.5 text-indigo-600" /> : <FiChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleSort('order_count')}
                      className="flex items-center justify-end gap-1.5 w-full hover:text-slate-900 transition"
                    >
                      <span>PO Orders</span>
                      {sortField === 'order_count' && (
                        sortDirection === 'asc' ? <FiChevronUp className="w-3.5 h-3.5 text-indigo-600" /> : <FiChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => {
                    const badge = getStockBadgeConfig(product.stock_status, product.stock_quantity);
                    return (
                      <tr key={product.id} className="hover:bg-slate-50/80 transition group">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                              <FiPackage className="w-4 h-4" />
                            </div>
                            <div>
                              <Link
                                href={route('supplier.products.edit', product.id)}
                                className="font-semibold text-slate-900 group-hover:text-indigo-600 transition"
                              >
                                {product.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${badge.badgeClass}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                                  {badge.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px]">
                            {product.category || 'General Sourcing'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-medium text-slate-900">
                          {formatCurrency(product.base_price)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-slate-700 font-medium">
                          {formatNumber(product.stock_quantity)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-slate-700">
                          {formatNumber(product.total_quantity_sold || 0)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(product.total_revenue || 0)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-slate-700">
                          {formatNumber(product.order_count || 0)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={route('supplier.products.edit', product.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-xs font-medium border border-slate-200/70 transition"
                          >
                            <span>Manage SKU</span>
                            <FiExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FiBox className="w-8 h-8 stroke-[1.5] text-slate-300" />
                        <p className="text-sm font-medium text-slate-600">No matching products found</p>
                        <p className="text-xs text-slate-400 max-w-sm">
                          Try adjusting your search criteria or resetting filters to view your registered catalog.
                        </p>
                        {(searchQuery || categoryFilter !== 'all' || stockFilter !== 'all') && (
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setCategoryFilter('all');
                              setStockFilter('all');
                            }}
                            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                          >
                            <FiRefreshCw className="w-3 h-3" />
                            <span>Reset Filters</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}