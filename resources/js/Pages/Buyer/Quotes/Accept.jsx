// Pages/Buyer/Quotes/Accept.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Layout - Buyer dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
import {
  FiCheckCircle,
  FiArrowLeft,
  FiPackage,
  FiUser,
  FiCalendar,
  FiAlertCircle,
  FiCheck
} from 'react-icons/fi';

export default function QuoteAccept({ quote }) {

  // State management for form data, submission status and errors
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // State management for form data
  const [formData, setFormData] = useState({
    notes: '',
    confirmation: false,
  });

  // Format currency - Converts number to USD currency format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date - Converts ISO date to readable format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate confirmation checkbox
    if (!formData.confirmation) {
      setErrors({ confirmation: 'You must confirm to accept this quote' });
      return;
    }

    setSubmitting(true);
    router.post(route('buyer.quotes.accept', quote.id), formData, {
      onSuccess: () => {
        setSubmitting(false);
      },
      onError: (errors) => {
        setErrors(errors);
        setSubmitting(false);
      }
    });
  };

  return (
    <DashboardLayout>
      <Head title="Accept Quote" />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header - Back button and page title */}
        <div className="flex items-center space-x-4">
          <Link
            href={route('buyer.quotes.show', quote.id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Accept Quote</h2>
            <p className="text-gray-600 mt-1">Confirm acceptance of this quote</p>
          </div>
        </div>

        {/* Quote Summary Section */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-medium text-gray-700 mb-4 flex items-center">
            <FiCheckCircle className="mr-2 text-green-600" /> Quote Summary
          </h3>

          {/* Quote Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Quote Number</p>
              <p className="font-medium">{quote.quote_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">RFQ Number</p>
              <p className="font-medium">{quote.rfq?.rfq_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Supplier</p>
              <p className="font-medium flex items-center">
                <FiUser className="mr-2 text-gray-400" />
                {quote.supplier?.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expires</p>
              <p className="font-medium flex items-center">
                <FiCalendar className="mr-2 text-gray-400" />
                {formatDate(quote.valid_until)}
              </p>
            </div>
          </div>

          {/* RFQ Title */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">RFQ Title</p>
            <p className="font-medium">{quote.rfq?.title}</p>
          </div>

          {/* Products List */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Product list:</p>
            <div className="space-y-2">
              {quote.rfq?.products_requested?.map((product, index) => (
                <div key={index} className="flex items-center text-sm bg-gray-50 p-2 rounded">
                  <FiPackage className="text-gray-400 mr-2" />
                  <span className="flex-1">{product.name}</span>
                  <span className="text-gray-600">{product.quantity} {product.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <span className="font-medium text-gray-700">total amount</span>
            <span className="text-2xl font-bold text-indigo-600">
              {formatCurrency(quote.total_amount)}
            </span>
          </div>
        </div>

        {/* Accept Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6">
          <h3 className="font-medium text-gray-700 mb-4">Acceptance Confirmation</h3>

          {/* Additional Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Any note about accepting this quote..."
            />
          </div>

          {/* Confirmation Checkbox */}
          <div className="mb-6">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="confirmation"
                checked={formData.confirmation}
                onChange={handleChange}
                className="mt-1 mr-3"
              />
              <span className="text-sm text-gray-600">
                I confirm that I want to accept this quote. By accepting, this quote will be marked as accepted,
                All other quotess for this RFQ will be rejected, and the RFQ will be closed .
              </span>
            </label>
            {errors.confirmation && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" /> {errors.confirmation}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Link
              href={route('buyer.quotes.show', quote.id)}
              className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  processing...
                </>
              ) : (
                <>
                  <FiCheck className="mr-2" />
                  Confirm acceptance
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}