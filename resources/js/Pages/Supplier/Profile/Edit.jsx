// Pages/Supplier/Profile/Edit.jsx

// React - Core React imports for component functionality
import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

// Layout - Supplier dashboard layout wrapper
import DashboardLayout from '@/Layouts/DashboardLayout';

// Icons - Importing icon sets for UI elements
import {
  FiSave,
  FiX,
  FiUpload,
  FiFile,
  FiPlus,
  FiTrash2,
  FiInfo,
  FiAlertCircle
} from 'react-icons/fi';

export default function ProfileEdit({ user, supplier, countries, businessTypes }) {

  // State management for active tab and file previews
  const [activeTab, setActiveTab] = useState('basic');
  const [logoPreview, setLogoPreview] = useState(supplier?.logo ? `/storage/${supplier.logo}` : null);
  const [licensePreview, setLicensePreview] = useState(supplier?.trade_license_document ? `/storage/${supplier.trade_license_document}` : null);
  const [certificatePreview, setCertificatePreview] = useState(supplier?.certificate_of_incorporation ? `/storage/${supplier.certificate_of_incorporation}` : null);

  // Inertia form handling
  const { data, setData, post, processing, errors, progress } = useForm({
    // User information
    new_password: '',
    current_password: '',
    name: user.name || '',
    email: user.email || '',
    new_password_confirmation: '',

    // Supplier information
    company_name: supplier?.company_name || '',
    trade_license_number: supplier?.trade_license_number || '',
    company_phone: supplier?.company_phone || '',
    company_email: supplier?.company_email || '',
    company_address: supplier?.company_address || '',
    city: supplier?.city || '',
    state: supplier?.state || '',
    postal_code: supplier?.postal_code || '',
    country: supplier?.country || '',
    business_type: supplier?.business_type || '',
    year_established: supplier?.year_established || '',
    number_of_employees: supplier?.number_of_employees || '',
    annual_revenue: supplier?.annual_revenue || '',
    website: supplier?.website || '',
    description: supplier?.description || '',
    tax_id: supplier?.tax_id || '',

    // Files
    logo: null,
    trade_license_document: null,
    certificate_of_incorporation: null,
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('supplier.profile.update'), {
      preserveScroll: true,
      onSuccess: () => {
        // Clear file inputs after successful upload
        setLogoPreview(supplier?.logo ? `/storage/${supplier.logo}` : null);
        setLicensePreview(supplier?.trade_license_document ? `/storage/${supplier.trade_license_document}` : null);
        setCertificatePreview(supplier?.certificate_of_incorporation ? `/storage/${supplier.certificate_of_incorporation}` : null);
      }
    });
  };

  // Handle file selection and preview
  const handleFileChange = (e, field, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setData(field, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected file
  const removeFile = (field, setPreview) => {
    setData(field, null);
    setPreview(null);
    // Reset file input
    document.getElementById(field).value = '';
  };

  // Tab configuration
  const tabs = [
    { id: 'basic', name: 'Basic information' },
    { id: 'business', name: 'Business Description' },
    { id: 'documents', name: 'Documents' },
    { id: 'password', name: 'Security' },
  ];

  return (
    <DashboardLayout>
      <Head title="Edit profile" />

      <div className="space-y-6">
        {/* Header - Page title and action buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit profile</h1>
            <p className="text-sm text-gray-600 mt-1">
              Update your company information and settings
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={route('supplier.profile.index')}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition"
            >
              <FiX className="w-4 h-4" />
              <span>cancel</span>
            </Link>
            <button
              onClick={handleSubmit}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>{processing ? 'Saving...' : 'Save changes'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic information</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Update your basic contact information and company details।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.company_name}
                    onChange={e => setData('company_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    required
                  />
                  {errors.company_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
                  )}
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name of contact person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    required
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    required
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Company Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={data.company_email}
                    onChange={e => setData('company_email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    required
                  />
                  {errors.company_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.company_email}</p>
                  )}
                </div>

                {/* Company Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={data.company_phone}
                    onChange={e => setData('company_phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    required
                  />
                  {errors.company_phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.company_phone}</p>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    
                  </label>
                  <input
                    type="url"
                    value={data.website}
                    onChange={e => setData('website', e.target.value)}
                    placeholder="https://"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                  {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
                </div>

                {/* Company Address */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    The street address is <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={data.company_address}
                    onChange={e => setData('company_address', e.target.value)}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    required
                  />
                  {errors.company_address && (
                    <p className="mt-1 text-sm text-red-600">{errors.company_address}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.city}
                    onChange={e => setData('city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    required
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={data.state}
                    onChange={e => setData('state', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={data.postal_code}
                    onChange={e => setData('postal_code', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    value={data.country}
                    onChange={e => setData('country', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Business Details Tab */}
          {activeTab === 'business' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Business Description</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Provide additional information about your business।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trade License Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trade License No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.trade_license_number}
                    onChange={e => setData('trade_license_number', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    required
                  />
                  {errors.trade_license_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.trade_license_number}</p>
                  )}
                </div>

                {/* Tax ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID / VAT Number
                  </label>
                  <input
                    type="text"
                    value={data.tax_id}
                    onChange={e => setData('tax_id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type
                  </label>
                  <select
                    value={data.business_type}
                    onChange={e => setData('business_type', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    <option value="">Select Business Type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Year Established */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Establishment
                  </label>
                  <input
                    type="number"
                    value={data.year_established}
                    onChange={e => setData('year_established', e.target.value)}
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>

                {/* Number of Employees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of employees
                  </label>
                  <input
                    type="number"
                    value={data.number_of_employees}
                    onChange={e => setData('number_of_employees', e.target.value)}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>

                {/* Annual Revenue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Income Range
                  </label>
                  <select
                    value={data.annual_revenue}
                    onChange={e => setData('annual_revenue', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    <option value="">Select the range</option>
                    <option value="< 1M">$Less than 1M</option>
                    <option value="1M - 5M">$1M - $5M</option>
                    <option value="5M - 10M">$5M - $10M</option>
                    <option value="10M - 50M">$10M - $50M</option>
                    <option value="> 50M">$More than 50M</option>
                  </select>
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Details
                  </label>
                  <textarea
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Tell buyers about your company, your expertise and your specialty..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum 2000 characters. This will appear on your public profile।
                  </p>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Upload required documents for verification. All documents must be clear and valid।
                </p>
              </div>

              <div className="space-y-6">
                {/* Logo Upload */}
                <div className="border-2 border-gray-200 border-dashed rounded-lg p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <div className="flex items-start gap-6">
                    {logoPreview ? (
                      <div className="relative">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('logo', setLogoPreview)}
                          className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FiUpload className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'logo', setLogoPreview)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('logo').click()}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                      >
                        Select file
                      </button>
                      <p className="mt-2 text-xs text-gray-500">
                        Recommended: Square image, at least 200x200px. Maximum 2MB।
                      </p>
                      {progress?.logo && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${progress.logo.percentage}%` }}
                          />
                        </div>
                      )}
                      {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}
                    </div>
                  </div>
                </div>

                {/* Trade License Document */}
                <div className="border-2 border-gray-200 border-dashed rounded-lg p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trade License Document
                  </label>
                  <div className="flex items-start gap-6">
                    {licensePreview ? (
                      <div className="relative">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FiFile className="w-8 h-8 text-indigo-600" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile('trade_license_document', setLicensePreview)}
                          className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FiFile className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="trade_license_document"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'trade_license_document', setLicensePreview)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('trade_license_document').click()}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                      >
                        Select file
                      </button>
                      <p className="mt-2 text-xs text-gray-500">
                        Accepted formats: PDF, JPG, PNG. Maximum 5MB।
                      </p>
                      {progress?.trade_license_document && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${progress.trade_license_document.percentage}%` }}
                          />
                        </div>
                      )}
                      {errors.trade_license_document && (
                        <p className="mt-1 text-sm text-red-600">{errors.trade_license_document}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Certificate of Incorporation */}
                <div className="border-2 border-gray-200 border-dashed rounded-lg p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate of Registration (Optional)
                  </label>
                  <div className="flex items-start gap-6">
                    {certificatePreview ? (
                      <div className="relative">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FiFile className="w-8 h-8 text-indigo-600" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile('certificate_of_incorporation', setCertificatePreview)}
                          className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FiPlus className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="certificate_of_incorporation"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'certificate_of_incorporation', setCertificatePreview)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('certificate_of_incorporation').click()}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                      >
                        Select file
                      </button>
                      <p className="mt-2 text-xs text-gray-500">
                        Accepted formats: PDF, JPG, PNG. Maximum 5MB।
                      </p>
                      {progress?.certificate_of_incorporation && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${progress.certificate_of_incorporation.percentage}%` }}
                          />
                        </div>
                      )}
                      {errors.certificate_of_incorporation && (
                        <p className="mt-1 text-sm text-red-600">{errors.certificate_of_incorporation}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">Document Requirements</p>
                  <ul className="mt-2 text-sm text-blue-600 list-disc list-inside">
                    <li>Documents must be valid and not expired</li>
                    <li>All information should be clearly visible</li>
                    <li>Accepted formats: PDF, JPG, PNG (Maximum 5MB each))</li>
                    <li>Verification usually takes 2-3 working days</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change password</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Update password to keep your account secure।
                </p>
              </div>

              <div className="max-w-md space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current password is
                  </label>
                  <input
                    type="password"
                    value={data.current_password}
                    onChange={e => setData('current_password', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                  {errors.current_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={data.new_password}
                    onChange={e => setData('new_password', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                  {errors.new_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={data.new_password_confirmation}
                    onChange={e => setData('new_password_confirmation', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-700 font-medium">Password requirements</p>
                    <ul className="mt-2 text-sm text-yellow-600 list-disc list-inside">
                      <li>Minimum 8 characters</li>
                      <li>Must contain at least one uppercase letter</li>
                      <li>Must contain at least one number</li>
                      <li>Must contain at least one special character</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}