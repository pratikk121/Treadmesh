// resources/js/Pages/Welcome.jsx
import React, { useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import {
    FiPackage,
    FiTruck,
    FiUsers,
    FiShoppingBag,
    FiShield,
    FiClock,
    FiCheckCircle,
    FiAward,
    FiTrendingUp,
    FiGlobe,
    FiHeadphones,
    FiArrowRight,
    FiStar,
    FiMail,
    FiPhone,
    FiMapPin,
    FiFacebook,
    FiTwitter,
    FiLinkedin,
    FiInstagram,
    FiSearch,
    FiSliders
} from 'react-icons/fi';
import { BsLightning, BsPeople } from 'react-icons/bs';

const NoImg = "/noImg.jpg";

export default function Welcome({
    user,
    stats,
    products,
    categories,
    suppliers,
    canLogin,
    canRegister,
    successStories,
    filters = {},
}) {
    // Local state for filters
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedSupplier, setSelectedSupplier] = useState(filters.supplier_id || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [verifiedOnly, setVerifiedOnly] = useState(filters.verified_only || false);
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');

    // Format currency in USD
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Apply Filterss to product listing
    const applyFilters = () => {
        router.get('/', {
            search: searchTerm,
            category: selectedCategory,
            supplier_id: selectedSupplier,
            min_price: minPrice,
            max_price: maxPrice,
            verified_only: verifiedOnly ? 1 : null,
            sort_by: sortBy,
            sort_order: sortOrder,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Reset all filters to default
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedSupplier('');
        setMinPrice('');
        setMaxPrice('');
        setVerifiedOnly(false);
        setSortBy('created_at');
        setSortOrder('desc');

        router.get('/', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    return (
        <>
            <Head title="Treadmesh - B2B Marketplace & Procurement Platform" />

            {/* Navigation Bar */}
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo and main navigation links */}
                        <div className="flex items-center space-x-8">
                            <Link href="/" className="text-2xl font-bold text-indigo-600">
                                Tread<span className="text-gray-800">mesh</span>
                            </Link>

                            <div className="hidden md:flex space-x-6">
                                <Link href="#products" className="text-gray-700 hover:text-indigo-600">Products</Link>
                                <Link href="#categories" className="text-gray-700 hover:text-indigo-600">Category</Link>
                                <Link href="#how-it-works" className="text-gray-700 hover:text-indigo-600">How it works</Link>
                                <Link href="#about" className="text-gray-700 hover:text-indigo-600">About Us</Link>
                                <Link href="#contact" className="text-gray-700 hover:text-indigo-600">Contact</Link>
                            </div>
                        </div>

                        {/* User authentication buttons */}
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Log In
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Banner Section - Main marketing area */}
            <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
                {/* Animated background effects */}
                <div className="absolute inset-0 bg-grid-white/[0.2] bg-grid"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left column - Hero text and CTA */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                                <BsLightning className="mr-2" />
                                <span className="text-sm font-medium">Trusted by 10,000+ merchants</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Source Wholesale Products Directly From{' '}
                                <span className="text-yellow-300">Verified Suppliers</span>
                            </h1>

                            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto lg:mx-0">
                                Treadmesh is the premier enterprise B2B marketplace connecting buyers with quality suppliers.
                                Get competitive quotes, wholesale volume discounts, and secure transactions.
                            </p>

                            {/* Call to action buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    href={route('register')}
                                    className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-colors inline-flex items-center justify-center group"
                                >
                                    Get Started
                                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="#how-it-works"
                                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors inline-flex items-center justify-center"
                                >
                                    How It Works
                                </Link>
                            </div>

                            {/* Trust badges */}
                            <div className="mt-8 flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                                <div className="flex items-center">
                                    <FiShield className="mr-2" />
                                    <span className="text-sm">Verified Suppliers</span>
                                </div>
                                <div className="flex items-center">
                                    <FiCheckCircle className="mr-2" />
                                    <span className="text-sm">Secure Payments</span>
                                </div>
                                <div className="flex items-center">
                                    <FiClock className="mr-2" />
                                    <span className="text-sm">24/7 Support</span>
                                </div>
                            </div>
                        </div>

                        {/* Right column - Stats cards */}
                        <div className="hidden lg:block relative">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/20 rounded-xl p-4">
                                        <FiPackage className="text-3xl mb-2" />
                                        <div className="text-2xl font-bold">{stats.products}+</div>
                                        <div className="text-sm opacity-80">Products</div>
                                    </div>
                                    <div className="bg-white/20 rounded-xl p-4">
                                        <FiUsers className="text-3xl mb-2" />
                                        <div className="text-2xl font-bold">{stats.suppliers}+</div>
                                        <div className="text-sm opacity-80">Suppliers</div>
                                    </div>
                                    <div className="bg-white/20 rounded-xl p-4">
                                        <FiShoppingBag className="text-3xl mb-2" />
                                        <div className="text-2xl font-bold">{stats.successfulDeals}+</div>
                                        <div className="text-sm opacity-80">Completed Orders</div>
                                    </div>
                                    <div className="bg-white/20 rounded-xl p-4">
                                        <FiTrendingUp className="text-3xl mb-2" />
                                        <div className="text-2xl font-bold">$500M+</div>
                                        <div className="text-sm opacity-80">Procurement Volume</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section - Key metrics */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">{stats.suppliers}+</div>
                            <div className="text-gray-600">Verified Suppliers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">{stats.products}+</div>
                            <div className="text-gray-600">Active Products</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">{stats.successfulDeals}+</div>
                            <div className="text-gray-600">Completed Orders</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">{stats.buyers}+</div>
                            <div className="text-gray-600">Enterprise Buyers</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section - Step by step guide */}
            <section id="how-it-works" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Easy steps to start procuring products from verified suppliers
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-indigo-600">1</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Create Account</h3>
                            <p className="text-gray-600">Register as an enterprise buyer and set up your procurement profile</p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-indigo-600">2</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Post RFQs</h3>
                            <p className="text-gray-600">Publish your specifications and invite competitive supplier bids</p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-indigo-600">3</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Compare Quotes</h3>
                            <p className="text-gray-600">Evaluate transparent volume pricing and negotiate terms directly</p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-indigo-600">4</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Execute Orders</h3>
                            <p className="text-gray-600">Select the winning quote and execute seamless procurement</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section with Filters - Main product listing */}
            <section id="products" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover high-quality commercial inventory from verified suppliers
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-6">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="flex-1 relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Find products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FiSliders className="text-xl" />
                            </button>
                        </form>
                    </div>

                    {/* Filters Panel - Advanced filtering options */}
                    {showFilters && (
                        <div className="bg-white p-6 rounded-lg border mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg">Filter products</h3>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                    Reset all filters
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat.name} value={cat.name}>
                                                {cat.name} ({cat.count})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Supplier Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Supplier
                                    </label>
                                    <select
                                        value={selectedSupplier}
                                        onChange={(e) => setSelectedSupplier(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">All suppliers</option>
                                        {suppliers?.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name} {supplier.verified ? '✓' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Min Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Minimum Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="0"
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {/* Max Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maximum Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Any"
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sort Type
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="created_at">Latest</option>
                                        <option value="name">Name</option>
                                        <option value="base_price">Price</option>
                                        <option value="minimum_order_quantity">Minimum Order</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                {/* Verified Only Checkbox */}
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={verifiedOnly}
                                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Verified Suppliers Only
                                    </span>
                                </label>

                                {/* Sort Order Toggle */}
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Order:</span>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className={`px-3 py-1 rounded text-sm ${sortOrder === 'asc'
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        Ascending
                                    </button>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                                        className={`px-3 py-1 rounded text-sm ${sortOrder === 'desc'
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        Descending
                                    </button>
                                </div>
                            </div>

                            {/* Apply Filters Button */}
                            <div className="mt-4">
                                <button
                                    onClick={applyFilters}
                                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Products Grid - Display filtered products */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.data?.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all group">
                                <div className="h-48 bg-gray-100 relative">
                                    {product.image ? (
                                        <img
                                            src={`/storage/${product.image}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.currentTarget.src = NoImg;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FiPackage className="text-4xl text-gray-400" />
                                        </div>
                                    )}
                                    {product.supplier?.verified && (
                                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                            Verified
                                        </span>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>

                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xl font-bold text-indigo-600">
                                            {formatCurrency(product.price)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Minimum Order: {product.moq} {product.unit}
                                        </span>
                                    </div>

                                    {product.supplier && (
                                        <div className="flex items-center text-sm text-gray-600 mb-3">
                                            <FiTruck className="mr-1 flex-shrink-0" />
                                            <span className="truncate">{product.supplier.name}</span>
                                        </div>
                                    )}

                                    <Link
                                        href={route('buyer.products.show', product.slug)}
                                        className="block text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        View Product Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {products.links && products.links.length > 3 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex space-x-1">
                                {products.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (link.url) {
                                                router.get(link.url, {}, { preserveScroll: true });
                                            }
                                        }}
                                        disabled={!link.url}
                                        className={`px-4 py-2 rounded ${link.active
                                            ? 'bg-indigo-600 text-white'
                                            : link.url
                                                ? 'bg-white text-gray-700 hover:bg-gray-50'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Browse All Link */}
                    <div className="text-center mt-8">
                        <Link
                            href={route('buyer.products.index')}
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium group"
                        >
                            View All Products
                            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>


            {/* About Section - Company information */}
            <section id="about" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-indigo-600 font-semibold mb-2 block">About Us</span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Next-Generation B2B Procurement & Supplier Network
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Treadmesh transforms wholesale procurement by connecting commercial buyers directly with verified enterprise suppliers. Our platform delivers a unified ecosystem where buyers discover premium inventory, compare multi-supplier bids, and execute transactions securely.
                            </p>
                            <p className="text-gray-600 mb-8">
                                Our mission is to empower growing enterprises with volume-based tiered pricing, verified supplier credentials, and transparent negotiation workflows.
                            </p>

                            <div className="flex items-center space-x-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 bg-indigo-100 rounded-full border-2 border-white"></div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <FiStar key={i} className="text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600">Trusted by 10,000+ merchants</p>
                                </div>
                            </div>
                        </div>

                        {/* Company achievement cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-indigo-600 text-white p-6 rounded-xl">
                                <FiAward className="text-3xl mb-3" />
                                <div className="text-2xl font-bold mb-1">5+ Years</div>
                                <div className="text-indigo-200">Industry Leadership</div>
                            </div>
                            <div className="bg-purple-600 text-white p-6 rounded-xl">
                                <BsPeople className="text-3xl mb-3" />
                                <div className="text-2xl font-bold mb-1">50,000+</div>
                                <div className="text-purple-200">Active Businesses</div>
                            </div>
                            <div className="bg-pink-600 text-white p-6 rounded-xl">
                                <FiGlobe className="text-3xl mb-3" />
                                <div className="text-2xl font-bold mb-1">Nationwide</div>
                                <div className="text-pink-200">Coast-to-Coast Logistics</div>
                            </div>
                            <div className="bg-green-600 text-white p-6 rounded-xl">
                                <FiHeadphones className="text-3xl mb-3" />
                                <div className="text-2xl font-bold mb-1">24/7</div>
                                <div className="text-green-200">Dedicated Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials/Success Stories - Customer feedback */}
            {successStories.length > 0 && (
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Real Business, Real Results - See How We've Helped Others
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {successStories.map((story) => (
                                <div key={story.id} className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <FiShoppingBag className="text-xl text-indigo-600" />
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="font-semibold">{story.buyer}</h4>
                                            <p className="text-sm text-gray-500">{story.date}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-3">
                                        {story.supplier} Successfully purchased from
                                    </p>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Product: {story.product}</span>
                                        <span className="font-semibold text-indigo-600">
                                            {formatCurrency(story.amount)}
                                        </span>
                                    </div>

                                    <div className="flex items-center mt-3 pt-3 border-t">
                                        <div className="flex text-yellow-400">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <FiStar key={i} className="fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500 ml-2">5.0</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section - Call to action */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Modernize Your B2B Sourcing?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Join verified enterprise buyers and suppliers trading efficiently on Treadmesh.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={route('register')}
                            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-colors inline-flex items-center justify-center"
                        >
                            Create Free Account
                        </Link>
                        <Link
                            href="#contact"
                            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>

            {/* Contact Section - Contact form and information */}
            <section id="contact" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                            <p className="text-gray-600 mb-8">
                                Have questions? Our procurement specialists are ready to help. Contact us anytime.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <FiMapPin className="text-xl text-indigo-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-semibold">Address</h4>
                                        <p className="text-gray-600">100 Commercial Plaza, Suite 400</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <FiPhone className="text-xl text-indigo-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-semibold">Phone</h4>
                                        <p className="text-gray-600">+1 (555) 234-5678</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <FiMail className="text-xl text-indigo-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-semibold">Email</h4>
                                        <p className="text-gray-600">support@treadmesh.com</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social media links */}
                            <div className="mt-8 flex space-x-4">
                                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                                    <FiFacebook />
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                                    <FiTwitter />
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                                    <FiLinkedin />
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                                    <FiInstagram />
                                </a>
                            </div>
                        </div>

                        {/* Contact form */}
                        <div className="bg-white p-8 rounded-xl border">
                            <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        className="border rounded-lg px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="border rounded-lg px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full border rounded-lg px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    className="w-full border rounded-lg px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <textarea
                                    rows="4"
                                    placeholder="Your message..."
                                    className="w-full border rounded-lg px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500"
                                ></textarea>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    send message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer - Site footer with links */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Treadmesh</h3>
                            <p className="text-gray-400 text-sm">
                                Enterprise B2B marketplace connecting verified suppliers and quality commercial buyers.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="#products" className="hover:text-white">Products</Link></li>
                                <li><Link href="#categories" className="hover:text-white">Category</Link></li>
                                <li><Link href="#how-it-works" className="hover:text-white">How it works</Link></li>
                                <li><Link href="#about" className="hover:text-white">About Us</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">For Buyers</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href={route('buyer.products.index')}>Browse Products</Link></li>
                                <li><Link href={route('buyer.rfqs.create')}>Submit RFQ</Link></li>
                                <li><Link href="#">Supplier Directory</Link></li>
                                <li><Link href="#">Buyer's Guide</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">For Suppliers</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href={route('register')}>Become a Supplier</Link></li>
                                <li><Link href="#">Supplier Benefits</Link></li>
                                <li><Link href="#">Vendor Guide</Link></li>
                                <li><Link href="#">Pricing Plans</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 text-sm">
                                &copy; {new Date().getFullYear()} Treadmesh. All rights reserved.
                            </p>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <Link href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
                                <Link href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
                                <Link href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}