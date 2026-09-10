// Pages/Buyer/Quotes/Compare.jsx

// React - Core React imports for component functionality
import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Layout - Buyer dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
import {
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiStar,
  FiPackage
} from 'react-icons/fi';

export default function QuoteCompare({ comparisonData }) {

  // Format currency - Converts number to BDT currency format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date - Converts ISO date to readable format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get all unique product names across all quotes for comparison
  const getAllProducts = () => {
    const products = new Set();
    comparisonData.forEach(item => {
      item.breakdown?.forEach(product => {
        products.add(product.name);
      });
    });
    return Array.from(products);
  };

  const allProducts = getAllProducts();

  return (
    <DashboardLayout>
      <Head title="Quota Compare" />

      <div className="space-y-6">
        {/* Header - Back button and page title */}
        <div className="flex items-center space-x-4">
          <Link
            href={route('buyer.quotes.index')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quota Compare</h2>
            <p className="text-gray-600 mt-1">Compare Quotas Side by Side to Make Best Decisions</p>
          </div>
        </div>

        {/* Comparison Table - Responsive with horizontal scroll */}
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full min-w-[800px]">
            {/* Table Header - Quote headers */}
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-left font-medium text-gray-700">Criterion</th>
                {comparisonData.map((item, index) => (
                  <th key={index} className="p-4 text-left font-medium text-gray-700">
                    <div className="space-y-2">
                      <p className="font-bold">Quote #{item.quote.quote_number}</p>
                      <p className="text-sm text-gray-500">{item.supplier}</p>
                      <div className="flex items-center text-sm">
                        <FiStar className="text-yellow-400 mr-1" />
                        <span>{item.supplier_rating}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body - Comparison rows */}
            <tbody>
              {/* Total Amount Row */}
              <tr className="border-b">
                <td className="p-4 font-medium">total amount</td>
                {comparisonData.map((item, index) => (
                  <td key={index} className="p-4">
                    <span className="text-lg font-bold text-indigo-600">
                      {formatCurrency(item.total)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Status Row */}
              <tr className="border-b">
                <td className="p-4 font-medium">Status</td>
                {comparisonData.map((item, index) => (
                  <td key={index} className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${item.quote.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        item.quote.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {item.quote.status === 'pending' ? 'Awaiting' :
                        item.quote.status === 'accepted' ? 'accepted' :
                          item.quote.status === 'rejected' ? 'Rejected' : item.quote.status}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Valid Until Row */}
              <tr className="border-b">
                <td className="p-4 font-medium">Expires</td>
                {comparisonData.map((item, index) => (
                  <td key={index} className="p-4">
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-gray-400" />
                      <span>{formatDate(item.valid_until)}</span>
                    </div>
                    {new Date(item.valid_until) < new Date() && (
                      <span className="text-xs text-red-600 block mt-1">Expired</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Supplier Verification Status Row */}
              <tr className="border-b">
                <td className="p-4 font-medium">Supplier Status</td>
                {comparisonData.map((item, index) => (
                  <td key={index} className="p-4">
                    {item.quote.supplier?.supplier?.verification_status === 'verified' ? (
                      <span className="flex items-center text-green-600">
                        <FiCheckCircle className="mr-2" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-500">
                        <FiXCircle className="mr-2" /> Verified
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Product Breakdown Rows - Dynamic per product */}
              {allProducts.map((productName, productIndex) => (
                <tr key={productIndex} className="border-b">
                  <td className="p-4 font-medium">{productName}</td>
                  {comparisonData.map((item, quoteIndex) => {
                    const product = item.breakdown?.find(p => p.name === productName);
                    return (
                      <td key={quoteIndex} className="p-4">
                        {product ? (
                          <div>
                            <p className="font-medium">{formatCurrency(product.price)}</p>
                            <p className="text-xs text-gray-500">
                              {product.quantity} Unit
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Action Buttons Row */}
              <tr>
                <td className="p-4"></td>
                {comparisonData.map((item, index) => (
                  <td key={index} className="p-4">
                    {item.quote.status === 'pending' && new Date(item.valid_until) >= new Date() ? (
                      <div className="space-y-2">
                        <Link
                          href={route('buyer.quotes.accept-confirm', item.quote.id)}
                          className="block w-full text-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          accept
                        </Link>
                        <Link
                          href={route('buyer.quotes.reject-confirm', item.quote.id)}
                          className="block w-full text-center px-3 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200"
                        >
                          Rejection
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href={route('buyer.quotes.show', item.quote.id)}
                        className="block w-full text-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                      >
                        for suppliers See details
                      </Link>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend/Notes */}
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
          <p className="flex items-center">
            <FiPackage className="mr-2" />
            Compare quota based on total quantity, product price and supplier details।
            Select the best quota as per your requirement।
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}