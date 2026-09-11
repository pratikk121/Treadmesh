// resources/js/Pages/Buyer/Products/Index.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiChevronDown,
  FiPackage,
  FiTruck,
  FiEye,
  FiShield,
  FiX
} from 'react-icons/fi';
import { BsGraphUp } from 'react-icons/bs';
import { formatCurrency } from '@/Utils/formatters';

const NoImg = "/noImg.jpg";

export default function ProductsIndex({ products, categories, filters }) {
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    moq: filters?.moq || '',
    search: filters?.search || '',
    sort: filters?.sort || 'newest',
    category: filters?.category || '',
    min_price: filters?.min_price || '',
    max_price: filters?.max_price || '',
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...selectedFilters, [key]: value };
    setSelectedFilters(newFilters);
  };

  const applyFilters = () => {
    router.get(route('buyer.products.index'), selectedFilters, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const resetFilters = () => {
    const resetValues = {
      search: '',
      category: '',
      min_price: '',
      max_price: '',
      moq: '',
      sort: 'newest'
    };
    setSelectedFilters(resetValues);
    router.get(route('buyer.products.index'), resetValues, {
      preserveState: true
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <DashboardLayout>
      <Head title="National B2B Catalog — Treadmesh" />

      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              National Wholesale Catalog
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Source direct factory-gate wholesale inventory from verified Make-in-India suppliers.
            </p>
          </div>
          <Link
            href={route('buyer.rfqs.create')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-xs font-semibold shadow-sm transition active:scale-[0.98]"
          >
            <FiPackage className="w-4 h-4" />
            <span>Publish Custom RFQ Tender</span>
          </Link>
        </div>

        {/* Omnibar Sourcing Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-navy to-slate-950 rounded-2xl p-6 text-white shadow-sm">
          <h2 className="text-lg font-bold font-display tracking-tight">Direct Factory Sourcing Terminal</h2>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">
            Search verified Indian industrial manufacturers by product keyword, category, or specifications.
          </p>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by SKU name, raw material, or specification (e.g. Spun Polyester, Kraft Paper)..."
                value={selectedFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Search Catalog
            </button>
          </form>
        </div>

        {/* Layout & Filter Controls */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <FiFilter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
            <span className="text-xs text-slate-500">
              Showing <span className="font-bold text-slate-900 font-mono">{products.total || 0}</span> wholesale SKUs
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}
              title="Grid View"
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}
              title="List View"
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content with Sidebar Filters */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm sticky top-24 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FiFilter className="w-3.5 h-3.5 text-brand-600" />
                  Filter Catalog
                </span>
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700"
                >
                  Reset
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Product Category
                </label>
                <select
                  value={selectedFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2 text-xs"
                >
                  <option value="">All Industry Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Price Bracket (INR ₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={selectedFilters.min_price}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2 text-xs font-mono"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={selectedFilters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2 text-xs font-mono"
                    min="0"
                  />
                </div>
              </div>

              {/* MOQ */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Max Minimum Order Qty (MOQ)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500 units"
                  value={selectedFilters.moq}
                  onChange={(e) => handleFilterChange('moq', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2 text-xs font-mono"
                  min="1"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sort Ordering
                </label>
                <select
                  value={selectedFilters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2 text-xs"
                >
                  <option value="newest">Latest First</option>
                  <option value="price_low">Rate: Low to High</option>
                  <option value="price_high">Rate: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>

              <button
                onClick={applyFilters}
                className="w-full py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-semibold text-xs transition shadow-sm"
              >
                Apply Parameters
              </button>
            </div>
          </div>

          {/* Product Items Display */}
          <div className="flex-1 min-w-0">
            {products.data.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <FiPackage className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No Wholesale Products Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search terms or clearing price and category filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {products.data.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {products.links && products.links.length > 3 && (
              <div className="pt-6 flex items-center justify-between text-xs text-slate-500">
                <p>
                  Showing {products.from || 0} to {products.to || 0} of {products.total || 0} products
                </p>
                <div className="flex gap-1">
                  {products.links.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => link.url && router.get(link.url)}
                      disabled={!link.url || link.active}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                        link.active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : link.url
                          ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between">
      <div>
        <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
          <img
            src={product.main_image ? `/storage/${product.main_image}` : NoImg}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.currentTarget.src = NoImg; }}
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-800 backdrop-blur shadow-sm">
              {product.category}
            </span>
          </div>
          {product.bulk_prices?.length > 0 && (
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
              Tiered Volume
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <div className="flex items-center text-xs text-slate-500 mt-2">
            <FiTruck className="mr-1.5 text-slate-400 shrink-0" />
            <span className="truncate">{product.supplier?.user?.name || 'Verified Indian Manufacturer'}</span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Factory Rate</span>
              <span className="text-base font-bold font-mono text-slate-900">
                {formatCurrency(product.base_price)}
              </span>
              <span className="text-[11px] text-slate-400">/{product.unit}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Min Batch</span>
              <span className="text-xs font-mono font-semibold text-slate-700">
                {product.minimum_order_quantity} {product.unit}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Link
          href={route('buyer.products.show', product.slug)}
          className="py-2 text-center bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
        >
          View Specs
        </Link>
        <Link
          href={route('buyer.rfqs.create', { product: product.id })}
          className="py-2 text-center bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition"
        >
          Tender RFQ
        </Link>
      </div>
    </div>
  );
}

function ProductListItem({ product }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
            <img
              src={product.main_image ? `/storage/${product.main_image}` : NoImg}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = NoImg; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                {product.category}
              </span>
              <span className="text-xs text-slate-500">&bull;</span>
              <span className="text-xs text-slate-500 truncate">
                {product.supplier?.user?.name || 'Verified Manufacturer'}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mt-1 truncate">{product.name}</h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{product.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right">
            <span className="text-base font-bold font-mono text-slate-900 block">
              {formatCurrency(product.base_price)}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              MOQ: {product.minimum_order_quantity} {product.unit}
            </span>
          </div>
          <div className="flex gap-2">
            <Link
              href={route('buyer.products.show', product.slug)}
              className="px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
            >
              View Specs
            </Link>
            <Link
              href={route('buyer.rfqs.create', { product: product.id })}
              className="px-3.5 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition"
            >
              RFQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}