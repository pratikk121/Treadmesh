// Pages/Auth/WaitingPage.jsx

// React
import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

// Icons
import { IoMdTime } from 'react-icons/io';
import { FiMail, FiClock, FiLogOut } from 'react-icons/fi';
import { MdError, MdPendingActions } from 'react-icons/md';
import { BsShieldCheck, BsHourglassSplit, BsBuilding } from 'react-icons/bs';

// sweetalert
import Swal from 'sweetalert2';

export default function Waiting({ user, supplier }) {

  // state
  const [showMessage, setShowMessage] = useState(false);

  // form
  const { data, setData, post, processing, errors } = useForm({
    email: user?.email || '',
    message: ''
  });

  // sweet alert
  const showSwal = (type, title, message) => {
    Swal.fire({
      icon: type,
      title: title,
      text: message,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'OK',
      background: '#ffffff',
      backdrop: `
                rgba(0,0,0,0.4)
                left top
                no-repeat
            `
    });
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    post('/mock-email', {
      preserveScroll: true,
      onSuccess: () => {
        showSwal(
          'info',
          '📧 Demo mode',
          'This is a mock email prompt. In real applications, an email will be sent to the admin. No actual email was sent।'
        );
        setData('message', '');
        setShowMessage(false);
      },
      onError: () => {
        showSwal(
          'error',
          'Error',
          'There are some problems. Try again।'
        );
      }
    });
  };

  return (
    <>
      <Head title="Awaiting Approval" />

      <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        {/* Decorative elements - Background design */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-indigo-600 to-purple-600 transform -skew-y-3"></div>

        <div className="relative w-full sm:max-w-md mt-16 px-6 py-8 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20">
          {/* Header with icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg animate-pulse">
              <IoMdTime className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Application Pending</h2>
            <p className="text-gray-600 mt-2">Thanks for your patience</p>
          </div>

          {/* Status Banner */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <BsHourglassSplit className="w-5 h-5 text-amber-600 flex-shrink-0 animate-spin-slow" />
              <div>
                <h3 className="font-semibold text-amber-800">Account under review</h3>
                <p className="text-xs text-amber-700 mt-0.5">
                  Your account is being reviewed by our administrator
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <MdError className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-700">
                {errors.message || 'There are some problems. Try again।'}
              </span>
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-5 border border-indigo-100">
              <div className="flex items-start space-x-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <MdPendingActions className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Account details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">name:</span>
                      <span className="font-medium text-gray-800">{user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium text-gray-800">{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Introduction:</span>
                      <span className="font-medium capitalize text-gray-800">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${user?.role === 'supplier' ? 'bg-purple-100 text-purple-800' :
                          user?.role === 'buyer' ? 'bg-pink-100 text-pink-800' :
                            'bg-indigo-100 text-indigo-800'
                          }`}>
                          {user?.role === 'supplier' ? 'Supplier' :
                            user?.role === 'buyer' ? 'Buyer' : user?.role}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full animate-pulse mr-1"></span>
                        Approval pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier Additional Info */}
            {user?.role === 'supplier' && supplier && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-100">
                <div className="flex items-start space-x-3">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <BsBuilding className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Company Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Company:</span>
                        <span className="font-medium text-gray-800">{supplier.company_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">City:</span>
                        <span className="font-medium text-gray-800">{supplier.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Verification:</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          {supplier.verification_status === 'pending' ? 'Pending' : supplier.verification_status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* What to Expect */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                <FiClock className="mr-1" /> what to expect
              </h4>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Admin will review your account within 24-48 hours
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  After approval you will receive email notification
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  After approval you will get full access to your dashboard
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  While waiting you can contact admin (demo feature)
                </li>
              </ul>
            </div>

            {/* Mock Email Form Toggle */}
            {!showMessage ? (
              <button
                onClick={() => setShowMessage(true)}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-indigo-300 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
              >
                <FiMail className="mr-2 h-4 w-4" />
                Contact Admin (Demo)
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700">Send message to admin</h4>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your email is
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={e => setData('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={data.message}
                    onChange={e => setData('message', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                    placeholder="Enter your message here..."
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={processing || !data.message.trim()}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    ) : (
                      'send message'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMessage(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                  >
                    cancel
                  </button>
                </div>

                {/* Demo Notice */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-700 flex items-start">
                    <BsShieldCheck className="w-4 h-4 text-blue-500 mr-1 flex-shrink-0 mt-0.5" />
                    <span>
                      <span className="font-medium">Demo mode:</span> This is a demonstration feature।
                      No actual email will be sent. Clicking the send button will display a SweetAlert confirmation।
                    </span>
                  </p>
                </div>
              </form>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-indigo-600">24-48</div>
                <div className="text-xs text-gray-500">Hours review time</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-xs text-gray-500">Safe Process</div>
              </div>
            </div>

            {/* Logout Button */}
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Log out
            </Link>

            {/* Support Text */}
            <div className="text-center text-xs text-gray-500">
              <p>Need immediate assistance? Contact support</p>
              <p className="mt-1 text-indigo-600">support@example.com</p>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}