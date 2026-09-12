// Pages/Auth/Register.jsx

// React
import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

// Icons
import { MdPending } from 'react-icons/md';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { IoMdPersonAdd, IoMdBusiness } from 'react-icons/io';
import { BsShieldCheck, BsTruck, BsBuilding } from 'react-icons/bs';
import {
    FiUser, FiMail, FiLock, FiCheckCircle, FiArrowLeft, FiArrowRight,
    FiFileText, FiPhone, FiMapPin, FiGlobe, FiAward
} from 'react-icons/fi';

export default function Register() {

    // States
    const [step, setStep] = useState(1);
    const [userType, setUserType] = useState('buyer');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form state
    const { data, setData, post, processing, errors, reset } = useForm({
        // User account fields
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'buyer',
        is_active: false,

        // Supplier specific fields
        company_name: '',
        trade_license_number: '',
        company_phone: '',
        company_email: '',
        company_address: '',
        city: '',
        verification_status: 'pending',
    });

    // Reset password and password_confirmation on unmount
    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    // Update role when userType changes
    useEffect(() => {
        setData('role', userType);
    }, [userType]);

    // Password strength checker
    useEffect(() => {
        let strength = 0;
        if (data.password.length >= 8) strength += 1;
        if (data.password.match(/[a-z]+/)) strength += 1;
        if (data.password.match(/[A-Z]+/)) strength += 1;
        if (data.password.match(/[0-9]+/)) strength += 1;
        if (data.password.match(/[$@#&!]+/)) strength += 1;
        setPasswordStrength(strength);
    }, [data.password]);

    // Get password strength color
    const getStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-500';
        if (passwordStrength <= 4) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    // Get password strength text
    const getStrengthText = () => {
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 4) return 'Medium';
        return 'Strong';
    };

    // Next step
    const nextStep = () => {
        setStep(step + 1);
    };

    // Previous step
    const prevStep = () => {
        setStep(step - 1);
    };

    // Handle form submission
    const submit = (e) => {
        e.preventDefault();

        if (userType === 'supplier' && step < 3) {
            nextStep();
            return;
        }

        post(route('register'));
    };

    // Select user type
    const selectUserType = (type) => {
        setUserType(type);
        setData('role', type);
        setStep(1);
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
                {/* Decorative elements - Background design */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-indigo-600 to-purple-600 transform -skew-y-3"></div>

                <div className="relative w-full sm:max-w-2xl mt-6 px-6 py-8 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20">
                    {/* Header with icon */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg">
                            {userType === 'buyer' ? (
                                <IoMdPersonAdd className="w-10 h-10 text-white" />
                            ) : (
                                <IoMdBusiness className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            {userType === 'buyer' ? 'Create Buyer Account' : 'Register as a Manufacturer / Supplier'}
                        </h2>
                        <p className="text-gray-600 mt-2">
                            {userType === 'buyer'
                                ? 'Source wholesale industrial components directly from verified Indian factories'
                                : 'Expand your manufacturing distribution across Pan-India enterprise buyers'}
                        </p>
                    </div>

                    {/* User Type Selector */}
                    <div className="flex justify-center space-x-4 mb-8">
                        <button
                            type="button"
                            onClick={() => selectUserType('buyer')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${userType === 'buyer'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <FiUser className="w-5 h-5" />
                            <span>Enterprise Buyer</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => selectUserType('supplier')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${userType === 'supplier'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <BsTruck className="w-5 h-5" />
                            <span>Manufacturer / Supplier</span>
                        </button>
                    </div>

                    {/* Progress Steps - For supplier registration */}
                    {userType === 'supplier' && (
                        <div className="mb-8">
                            <div className="flex justify-between items-center">
                                {[1, 2, 3].map((stepNumber) => (
                                    <div key={stepNumber} className="flex-1 text-center">
                                        <div className={`relative ${stepNumber < 3 ? 'after:content-[""] after:absolute after:w-full after:h-1 after:bg-gray-200 after:top-5 after:left-1/2' : ''}`}>
                                            <div className={`relative z-10 w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold ${step >= stepNumber
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                {step > stepNumber ? '✓' : stepNumber}
                                            </div>
                                            <p className="text-xs mt-2 font-medium text-gray-600">
                                                {stepNumber === 1 ? 'Account' : stepNumber === 2 ? 'Company' : 'Verification'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Role/Status Indicator for Buyer */}
                    {userType === 'buyer' && (
                        <div className="mb-6 p-3 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center space-x-2">
                            <BsShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                            <span className="text-sm text-indigo-800">
                                Registering as an <span className="font-semibold">Enterprise Buyer</span>. Instant access to wholesale catalog prices, GST invoices, and RFQ tenders.
                            </span>
                        </div>
                    )}

                    {/* Verification Notice for Supplier */}
                    {userType === 'supplier' && step === 3 && (
                        <div className="mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-100 flex items-center space-x-2">
                            <MdPending className="w-5 h-5 text-yellow-600 shrink-0" />
                            <span className="text-sm text-yellow-800">
                                Your supplier credentials and GSTIN will be reviewed by our compliance team within 1-2 business days.
                            </span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">

                        {/* Error Display - For multi-step supplier form */}
                        {userType === 'supplier' && step > 1 && Object.keys(errors).length > 0 && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            Correct the following errors:
                                        </h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <ul className="list-disc list-inside">
                                                {Object.entries(errors).map(([field, message]) => (
                                                    <li key={field}>
                                                        <span className="font-medium capitalize">{field.replace('_', ' ')}:</span> {message}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Account Information (Common for both) */}
                        {(userType === 'buyer' || step === 1) && (
                            <div className="space-y-5">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Account Information</h3>

                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiUser className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                            placeholder="Vikram Sharma"
                                            autoComplete="name"
                                            autoFocus
                                            required
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <span className="mr-1">•</span> {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Official Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiMail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                            placeholder="you@company.com"
                                            autoComplete="username"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <span className="mr-1">•</span> {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiLock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    {/* Password strength indicator */}
                                    {data.password && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex space-x-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`h-1 w-6 rounded-full transition-colors duration-300 ${i < passwordStrength ? getStrengthColor() : 'bg-gray-200'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-600' :
                                                    passwordStrength <= 4 ? 'text-yellow-600' : 'text-green-600'
                                                    }`}>
                                                    {getStrengthText()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Use at least 8 characters (including uppercase letters, numbers, and special symbols)
                                            </p>
                                        </div>
                                    )}

                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <span className="mr-1">•</span> {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiCheckCircle className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            {showConfirmPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    {/* Password match indicator */}
                                    {data.password && data.password_confirmation && (
                                        <p className={`mt-2 text-sm ${data.password === data.password_confirmation
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            }`}>
                                            {data.password === data.password_confirmation
                                                ? '✓ Passwords Match'
                                                : '✗ Passwords do not match'}
                                        </p>
                                    )}

                                    {errors.password_confirmation && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <span className="mr-1">•</span> {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Company Information (Supplier only) */}
                        {userType === 'supplier' && step === 2 && (
                            <div className="space-y-5">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Company Information</h3>

                                {/* Company Name */}
                                <div>
                                    <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <BsBuilding className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="company_name"
                                            type="text"
                                            name="company_name"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                            placeholder="e.g. Bharat Precision Engineering Pvt Ltd"
                                            required
                                        />
                                    </div>
                                    {errors.company_name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.company_name}</p>
                                    )}
                                </div>

                                {/* Trade License Number */}
                                <div>
                                    <label htmlFor="trade_license_number" className="block text-sm font-medium text-gray-700 mb-1">
                                        GSTIN / Trade License No. <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiFileText className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="trade_license_number"
                                            type="text"
                                            name="trade_license_number"
                                            value={data.trade_license_number}
                                            onChange={(e) => setData('trade_license_number', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                            placeholder="e.g. 27AAAAA0000A1Z5"
                                            required
                                        />
                                    </div>
                                    {errors.trade_license_number && (
                                        <p className="mt-2 text-sm text-red-600">{errors.trade_license_number}</p>
                                    )}
                                </div>

                                {/* Company Phone */}
                                <div>
                                    <label htmlFor="company_phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Official Contact / WhatsApp Phone <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiPhone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="company_phone"
                                            type="tel"
                                            name="company_phone"
                                            value={data.company_phone}
                                            onChange={(e) => setData('company_phone', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                            placeholder="+91 98765 43210"
                                            required
                                        />
                                    </div>
                                    {errors.company_phone && (
                                        <p className="mt-2 text-sm text-red-600">{errors.company_phone}</p>
                                    )}
                                </div>

                                {/* Company Email */}
                                <div>
                                    <label htmlFor="company_email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Enterprise Billing Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiMail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="company_email"
                                            type="email"
                                            name="company_email"
                                            value={data.company_email}
                                            onChange={(e) => setData('company_email', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                            placeholder="billing@yourcompany.com"
                                            required
                                        />
                                    </div>
                                    {errors.company_email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.company_email}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Address & Verification (Supplier only) */}
                        {userType === 'supplier' && step === 3 && (
                            <div className="space-y-5">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Address and Verification</h3>

                                {/* Company Address */}
                                <div>
                                    <label htmlFor="company_address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Registered Factory / Office Address <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                                            <FiMapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            id="company_address"
                                            name="company_address"
                                            value={data.company_address}
                                            onChange={(e) => setData('company_address', e.target.value)}
                                            rows="3"
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                            placeholder="Plot 42, MIDC Industrial Area, Phase II"
                                            required
                                        ></textarea>
                                    </div>
                                    {errors.company_address && (
                                        <p className="mt-2 text-sm text-red-600">{errors.company_address}</p>
                                    )}
                                </div>

                                {/* City */}
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                        City & State <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiGlobe className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="city"
                                            type="text"
                                            name="city"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                            placeholder="e.g. Pune, Maharashtra"
                                            required
                                        />
                                    </div>
                                    {errors.city && (
                                        <p className="mt-2 text-sm text-red-600">{errors.city}</p>
                                    )}
                                </div>

                                {/* Verification Status (Hidden, set to pending) */}
                                <input type="hidden" name="verification_status" value="pending" />

                                {/* Verification Info */}
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-start space-x-3">
                                        <FiAward className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-blue-800">Verification Process</h4>
                                            <p className="text-sm text-blue-600 mt-1">
                                                Your supplier account will be reviewed within 1-2 business days.
                                                Once verification is complete you will receive an email confirmation.
                                            </p>
                                            <ul className="mt-2 text-sm text-blue-600 list-disc list-inside">
                                                <li>GSTIN & Statutory Trade License Verification</li>
                                                <li>Company Address & Premises Confirmation</li>
                                                <li>Enterprise Contact Validation</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Terms and Conditions */}
                        {((userType === 'buyer') || (userType === 'supplier' && step === 3)) && (
                            <div className="flex items-start mt-4">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="h-4 w-4 mt-1 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    required
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            {userType === 'supplier' && step > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition duration-200"
                                >
                                    <FiArrowLeft className="w-5 h-5" />
                                    <span>Previous</span>
                                </button>
                            )}

                            <div className={userType === 'supplier' && step > 1 ? 'ml-auto' : 'w-full'}>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <>
                                            <span>
                                                {userType === 'buyer'
                                                    ? 'Create Buyer Account'
                                                    : step === 3
                                                        ? 'Submit Supplier Registration'
                                                        : 'Continue'}
                                            </span>
                                            {userType === 'supplier' && step < 3 && <FiArrowRight className="w-5 h-5" />}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>

                        {/* Account activation notice */}
                        {userType === 'buyer' && (
                            <div className="text-center text-xs text-gray-500 mt-4 border-t pt-4">
                                <p>Registering gives you instant access to India wholesale pricing and direct RFQ tenders.</p>
                                <p className="mt-1">Enterprise compliance verification applies for large volume procurement.</p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}