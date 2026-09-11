// resources/js/Pages/Buyer/Products/Show.jsx

import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
  FiPackage,
  FiTruck,
  FiShoppingCart,
  FiCheckCircle,
  FiArrowLeft,
  FiClock,
  FiShield,
  FiAward,
  FiFileText,
  FiLayers
} from 'react-icons/fi';
import { BsGraphUp } from 'react-icons/bs';
import { formatCurrency } from '@/Utils/formatters';

const NoImg = "/noImg.jpg";

export default function ProductShow({ product, relatedProducts, bulkTiers }) {
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(product.minimum_order_quantity || 1);

  const [priceInfo, setPriceInfo] = useState({
    unitPrice: product.base_price,
    totalPrice: product.base_price * (product.minimum_order_quantity || 1),
    savings: 0
  });

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    if (value === '') {
      setQuantity('');
      return;
    }

    const newQuantity = parseInt(value) || 0;
    setQuantity(newQuantity);

    if (newQuantity >= (product.minimum_order_quantity || 1)) {
      calculatePrice(newQuantity);
    }
  };

  const calculatePrice = (qty) => {
    let unitPrice = product.base_price;
    let savings = 0;
    let matchedTier = null;

    if (bulkTiers && bulkTiers.length > 0) {
      for (const tier of bulkTiers) {
        if (qty >= tier.quantity) {
          unitPrice = tier.price;
          savings = tier.savings || 0;
          matchedTier = tier;
        }
      }
    }

    setSelectedTier(matchedTier);

    setPriceInfo({
      unitPrice,
      totalPrice: unitPrice * qty,
      savings
    });
  };

  const handleOrderNow = () => {
    setLoading(true);

    router.post(route('buyer.orders.order-now'), {
      product_id: product.id,
      quantity: quantity,
      shipping_address: "Registered Corporate Consignee Address"
    }, {
      onSuccess: () => {
        setLoading(false);
        router.get(route('buyer.orders.index'));
      },
      onError: () => {
        setLoading(false);
      }
    });
  };

  const createRFQ = () => {
    router.get(route('buyer.rfqs.create'), {
      product_id: product.id,
      quantity: quantity
    });
  };

  useEffect(() => {
    calculatePrice(quantity);
  }, []);

  return (
    <DashboardLayout>
      <Head title={`${product.name} — Treadmesh Wholesale`} />

      <div className="space-y-6 pb-12 max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Link href={route('buyer.dashboard')} className="hover:text-slate-800">
            Console
          </Link>
          <span>/</span>
          <Link href={route('buyer.products.index')} className="hover:text-slate-800">
            Wholesale Catalog
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900 truncate max-w-xs">{product.name}</span>
        </div>

        {/* Back Link */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <FiArrowLeft className="mr-1.5" /> Back to Catalog
        </button>

        {/* Main Product Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gallery / Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={product.main_image ? `/storage/${product.main_image}` : NoImg}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = NoImg; }}
                />
              </div>
            </div>
          </div>

          {/* Details & Procurement Console */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {product.category}
                </span>
                {bulkTiers?.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <BsGraphUp className="w-3 h-3" />
                    Tiered Volume Pricing Available
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                {product.name}
              </h1>

              {/* Vendor Card */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Manufacturer</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <FiTruck className="text-slate-400" />
                    <span className="font-bold text-slate-900">{product.supplier?.user?.name || 'Verified Supplier'}</span>
                    <FiCheckCircle className="text-emerald-600" title="GSTIN Verified" />
                  </div>
                </div>
                <Link
                  href={route('buyer.suppliers.show', product.supplier_id)}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Factory Profile &rarr;
                </Link>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Product Overview
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {product.description || 'Standard industrial specifications as per catalog submission.'}
                </p>
              </div>

              {/* Pricing & Volume Calculator */}
              <div className="mt-6 p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Procurement Rate Calculator</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">
                      Order Quantity ({product.unit})
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={quantity}
                        min={product.minimum_order_quantity || 1}
                        onChange={handleQuantityChange}
                        className="w-28 border border-slate-300 rounded-lg p-2 font-mono text-center font-bold text-slate-900"
                      />
                      <span className="text-[11px] text-slate-400">
                        (Min: {product.minimum_order_quantity} {product.unit})
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="block text-slate-500 mb-1 font-medium">Unit Rate</span>
                    <div className="font-mono text-xl font-bold text-brand-600">
                      {formatCurrency(priceInfo.unitPrice)}
                      <span className="text-xs font-normal text-slate-400">/{product.unit}</span>
                    </div>
                    {priceInfo.savings > 0 && (
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        Volume Discount: {priceInfo.savings}% off
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="block text-slate-500 mb-1 font-medium">Estimated PO Value</span>
                    <div className="font-mono text-xl font-bold text-slate-900">
                      {quantity < product.minimum_order_quantity ? (
                        <span className="text-rose-600 text-xs font-bold">
                          Below MOQ ({product.minimum_order_quantity})
                        </span>
                      ) : (
                        formatCurrency(priceInfo.totalPrice)
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">Excl. GST & Transit</span>
                  </div>
                </div>
              </div>

              {/* Bulk Pricing Tier Schedule */}
              {bulkTiers?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <BsGraphUp className="w-3.5 h-3.5 text-brand-600" />
                    Wholesale Volume Pricing Schedule
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                      <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5">Volume Tier</th>
                          <th className="px-4 py-2.5">Unit Rate (INR)</th>
                          <th className="px-4 py-2.5">Lot Value</th>
                          <th className="px-4 py-2.5">Savings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bulkTiers.map((tier, index) => (
                          <tr
                            key={index}
                            className={selectedTier?.quantity === tier.quantity ? 'bg-emerald-50/70 font-semibold' : ''}
                          >
                            <td className="px-4 py-2 font-mono">
                              {tier.quantity}+ {product.unit}
                            </td>
                            <td className="px-4 py-2 font-mono text-brand-600 font-bold">
                              {formatCurrency(tier.price)}/{product.unit}
                            </td>
                            <td className="px-4 py-2 font-mono text-slate-700">
                              {formatCurrency(tier.total)}
                            </td>
                            <td className="px-4 py-2 text-emerald-600 font-medium">
                              {tier.savings ? `${tier.savings}% Off` : 'Standard'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleOrderNow}
                  disabled={loading || quantity < (product.minimum_order_quantity || 1)}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-semibold text-xs flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  <span>Direct Procurement PO</span>
                </button>
                <button
                  onClick={createRFQ}
                  className="flex-1 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <FiPackage className="w-4 h-4" />
                  <span>Request Custom RFQ Quote</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Compliance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Technical Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Minimum Batch</span>
                <span className="font-mono font-bold text-slate-900">{product.minimum_order_quantity} {product.unit}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Inventory Status</span>
                <span className={`font-semibold ${product.stock_quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} units)` : 'Made to Order'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Unit of Measure</span>
                <span className="font-medium text-slate-800">{product.unit}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Industry Category</span>
                <span className="font-medium text-slate-800">{product.category}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Vendor Quality Assurances</h3>
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <FiShield className="w-4 h-4 text-emerald-600" />
              <span>Verified Vendor (GSTIN Active)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <FiAward className="w-4 h-4 text-brand-600" />
              <span>Make-in-India Manufacturing Unit</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <FiClock className="w-4 h-4 text-slate-500" />
              <span>Quote Response SLA: &lt; 24 Hours</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Related Wholesale Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={route('buyer.products.show', p.slug)}
                  className="group rounded-xl border border-slate-200/80 p-3 hover:shadow-sm transition"
                >
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-2">
                    <img
                      src={p.main_image ? `/storage/${p.main_image}` : NoImg}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => { e.currentTarget.src = NoImg; }}
                    />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs truncate group-hover:text-brand-600 transition">
                    {p.name}
                  </h4>
                  <p className="text-[11px] font-mono font-bold text-slate-900 mt-1">
                    {formatCurrency(p.base_price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}