// Pages/Buyer/Products/SupplierProducts.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { FiPackage, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { formatCurrency } from '@/Utils/formatters';

const NoImg = "/noImg.jpg";

export default function SupplierProducts({ products }) {
  return (
    <DashboardLayout>
      <Head title="Supplier Catalog | Treadmesh Wholesale" />

      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-500">
                Verified Manufacturer Catalog
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display mt-1">
              Supplier Wholesale Inventory
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct factory-gate SKUs available for bulk institutional procurement and RFQ bidding.
            </p>
          </div>
          <Link
            href={route('buyer.products.index')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs transition hover:bg-slate-50"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </Link>
        </div>

        {/* Products Grid */}
        {!products?.data || products.data.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <FiPackage className="text-2xl" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No SKUs Listed Yet</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              This manufacturer has not yet listed standard catalog items. You can still initiate a custom RFQ tender directly with them.
            </p>
            <Link
              href={route('buyer.rfqs.create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition shadow-xs"
            >
              <span>Publish Custom RFQ Tender</span>
              <FiArrowRight className="text-xs" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.data.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  {/* Product Image */}
                  <div className="h-44 bg-slate-100 rounded-xl mb-3.5 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={product.main_image ? `/storage/${product.main_image}` : NoImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = NoImg;
                      }}
                    />
                    {product.category && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-slate-700 shadow-xs">
                        {product.category}
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1 group-hover:text-brand-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-lg font-extrabold text-slate-950 font-mono">
                      {formatCurrency(product.base_price)}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      / {product.unit || 'Unit'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-4 font-mono">
                    MOQ: <span className="font-semibold text-slate-800">{product.minimum_order_quantity || 1} {product.unit || 'Units'}</span>
                  </div>
                </div>

                {/* View Details Button */}
                <Link
                  href={route('buyer.products.show', product.slug || product.id)}
                  className="block text-center px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition active:scale-[0.98] shadow-xs"
                >
                  View SKU Specifications
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}