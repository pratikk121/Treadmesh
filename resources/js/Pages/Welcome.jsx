// resources/js/Pages/Welcome.jsx
import React, { useState, useMemo } from 'react';
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
    FiSearch,
    FiSliders,
    FiCheck,
    FiChevronRight,
    FiFilter,
    FiX,
    FiMenu,
    FiLayers,
    FiZap,
    FiActivity,
    FiExternalLink,
    FiRefreshCw,
    FiDollarSign,
    FiLock,
    FiFileText
} from 'react-icons/fi';
import {
    BsLightningChargeFill,
    BsShieldCheck,
    BsBuildingCheck,
    BsArrowRight
} from 'react-icons/bs';

const NoImg = "/noImg.jpg";

export default function Welcome({
    user,
    stats = { suppliers: 0, products: 0, successfulDeals: 0, buyers: 0 },
    products = { data: [], links: [] },
    categories = [],
    suppliers = [],
    canLogin = true,
    canRegister = true,
    successStories = [],
    filters = {},
}) {
    // Mobile navigation state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Filter panel toggle state
    const [showFilters, setShowFilters] = useState(false);

    // Sourcing filter form state
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedSupplier, setSelectedSupplier] = useState(filters.supplier_id || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [verifiedOnly, setVerifiedOnly] = useState(Boolean(filters.verified_only));
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');

    // Contact form feedback state
    const [contactSubmitted, setContactSubmitted] = useState(false);
    const [contactForm, setContactForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
    });

    // Calculate count of active filters for visual badge
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (searchTerm) count++;
        if (selectedCategory) count++;
        if (selectedSupplier) count++;
        if (minPrice) count++;
        if (maxPrice) count++;
        if (verifiedOnly) count++;
        if (sortBy !== 'created_at') count++;
        return count;
    }, [searchTerm, selectedCategory, selectedSupplier, minPrice, maxPrice, verifiedOnly, sortBy]);

    // Format currency in USD with clean tabular glyphs
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // Apply filters to product listing
    const applyFilters = (customCategory = null) => {
        const cat = customCategory !== null ? customCategory : selectedCategory;
        router.get('/', {
            search: searchTerm || undefined,
            category: cat || undefined,
            supplier_id: selectedSupplier || undefined,
            min_price: minPrice || undefined,
            max_price: maxPrice || undefined,
            verified_only: verifiedOnly ? 1 : undefined,
            sort_by: sortBy,
            sort_order: sortOrder,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Quick filter by category chip
    const handleCategoryClick = (categoryName) => {
        const newCat = selectedCategory === categoryName ? '' : categoryName;
        setSelectedCategory(newCat);
        applyFilters(newCat);
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

    // Handle contact form placeholder submit
    const handleContactSubmit = (e) => {
        e.preventDefault();
        setContactSubmitted(true);
        setContactForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
        setTimeout(() => setContactSubmitted(false), 6000);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFC] text-slate-900 selection:bg-brand-500 selection:text-white font-sans antialiased">
            <Head title="Treadmesh — Enterprise B2B Wholesale Marketplace & Procurement Protocol" />

            {/* ------------------------------------------------------------- */}
            {/* FLOATING GLASS ISLAND NAVIGATION BAR                          */}
            {/* ------------------------------------------------------------- */}
            <header className="fixed top-4 inset-x-0 z-50 px-4 sm:px-6 pointer-events-none">
                <nav className="max-w-6xl mx-auto pointer-events-auto bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-4 sm:px-6 py-2.5 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        {/* Brand Monogram & Name */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-sm shadow-md ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-200">
                                <span className="tracking-tight bg-gradient-to-br from-brand-300 to-indigo-500 bg-clip-text text-transparent font-black">
                                    TM
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-lg font-bold tracking-tight text-slate-950 flex items-center">
                                    Tread<span className="text-brand-600">mesh</span>
                                </div>
                                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold -mt-1 hidden sm:block">
                                    Enterprise B2B
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Links - Centered */}
                        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
                            <a
                                href="#products"
                                className="px-3 py-1.5 rounded-full hover:text-slate-950 hover:bg-slate-100/70 transition-colors"
                            >
                                Products
                            </a>
                            <a
                                href="#categories"
                                className="px-3 py-1.5 rounded-full hover:text-slate-950 hover:bg-slate-100/70 transition-colors"
                            >
                                Categories
                            </a>
                            <a
                                href="#capabilities"
                                className="px-3 py-1.5 rounded-full hover:text-slate-950 hover:bg-slate-100/70 transition-colors"
                            >
                                Capabilities
                            </a>
                            <a
                                href="#how-it-works"
                                className="px-3 py-1.5 rounded-full hover:text-slate-950 hover:bg-slate-100/70 transition-colors"
                            >
                                How It Works
                            </a>
                            <a
                                href="#about"
                                className="px-3 py-1.5 rounded-full hover:text-slate-950 hover:bg-slate-100/70 transition-colors"
                            >
                                Enterprise Trust
                            </a>
                            <a
                                href="#contact"
                                className="px-3 py-1.5 rounded-full hover:text-slate-950 hover:bg-slate-100/70 transition-colors"
                            >
                                Contact
                            </a>
                        </div>

                        {/* User Authentication Actions */}
                        <div className="flex items-center gap-3">
                            {user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="group inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span>Console</span>
                                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                                        <FiArrowRight className="text-xs" />
                                    </span>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="text-slate-700 hover:text-slate-950 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-slate-100/80 transition-colors"
                                        >
                                            Log In
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="group inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white pl-4 pr-2.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200"
                                        >
                                            <span>Get Started</span>
                                            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand-500 group-hover:translate-x-0.5 transition-all duration-200">
                                                <FiArrowRight className="text-xs text-white" />
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Mobile Hamburger Toggle */}
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 text-slate-700 hover:text-slate-950 rounded-full hover:bg-slate-100 transition-colors"
                                aria-label="Toggle navigation menu"
                            >
                                {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Drawer Dropdown */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-3 pt-3 border-t border-slate-200/80 flex flex-col gap-1 pb-2">
                            <a
                                href="#products"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                            >
                                Products
                            </a>
                            <a
                                href="#categories"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                            >
                                Categories
                            </a>
                            <a
                                href="#capabilities"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                            >
                                Enterprise Capabilities
                            </a>
                            <a
                                href="#how-it-works"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                            >
                                How It Works
                            </a>
                            <a
                                href="#about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                            >
                                About & Trust
                            </a>
                            <a
                                href="#contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                            >
                                Contact Specialists
                            </a>
                        </div>
                    )}
                </nav>
            </header>

            {/* ------------------------------------------------------------- */}
            {/* HERO SECTION: SOURCING TERMINAL & AMBIENT GLOW                */}
            {/* ------------------------------------------------------------- */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-[#FAFAFC]">
                {/* Radial ambient illumination nodes */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-gradient-to-tr from-brand-500/10 via-indigo-400/5 to-purple-400/0 blur-3xl pointer-events-none rounded-full" />
                <div className="absolute -top-10 -right-10 w-96 h-96 bg-brand-400/5 blur-3xl pointer-events-none rounded-full" />

                {/* Subtle technical background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Enterprise Trust Indicator Pill */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-xs font-semibold text-slate-800">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
                            </span>
                            <span className="font-mono text-brand-700 tracking-tight font-bold">RFQ ENGINE v2.4</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-600 font-normal">Multi-Supplier Direct Wholesale Sourcing</span>
                        </div>
                    </div>

                    {/* Editorial Headline */}
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
                            Direct Wholesale Sourcing for{' '}
                            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                                High-Velocity
                            </span>{' '}
                            Enterprises
                        </h1>
                        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Discover verified commercial suppliers, compare transparent volume-tiered bids,
                            and execute high-volume procurement contracts with escrow trade assurance.
                        </p>
                    </div>

                    {/* --------------------------------------------------------- */}
                    {/* OMNIBAR SEARCH & FILTER TERMINAL                          */}
                    {/* --------------------------------------------------------- */}
                    <div className="mt-10 max-w-3xl mx-auto">
                        {/* Outer Double-Bezel Container */}
                        <div className="p-2 rounded-2xl bg-slate-100/80 border border-slate-200/90 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.08)]">
                            <form onSubmit={handleSearch} className="bg-white rounded-xl p-1.5 sm:p-2 flex flex-col sm:flex-row items-stretch gap-2 shadow-sm border border-slate-200/60">
                                {/* Category Dropdown Quick Select */}
                                <div className="sm:w-48 relative border-b sm:border-b-0 sm:border-r border-slate-200/80 pb-2 sm:pb-0 sm:pr-2">
                                    <label htmlFor="hero-cat" className="sr-only">Category</label>
                                    <div className="flex items-center h-full px-2">
                                        <FiLayers className="text-slate-400 mr-2 shrink-0 text-sm" />
                                        <select
                                            id="hero-cat"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full bg-transparent border-0 py-1.5 pl-0 pr-6 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-0 focus:outline-none cursor-pointer truncate"
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map((cat) => (
                                                <option key={cat.name} value={cat.name}>
                                                    {cat.name} ({cat.count})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Search Query Input */}
                                <div className="flex-1 relative flex items-center px-2">
                                    <FiSearch className="text-slate-400 mr-2.5 shrink-0 text-base" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search commercial SKUs, products, or suppliers..."
                                        className="w-full bg-transparent border-0 py-2 px-0 text-sm placeholder:text-slate-400 text-slate-900 focus:ring-0 focus:outline-none"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1.5 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                                            showFilters || activeFilterCount > 0
                                                ? 'bg-brand-50 border-brand-200 text-brand-700'
                                                : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                                        }`}
                                        title="Toggle advanced procurement filters"
                                    >
                                        <FiSliders className="text-sm" />
                                        <span className="hidden sm:inline">Filters</span>
                                        {activeFilterCount > 0 && (
                                            <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </button>

                                    <button
                                        type="submit"
                                        className="group inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm"
                                    >
                                        <span>Search</span>
                                        <FiArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Top Category Chips for Fast Filtering */}
                        <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-500 no-scrollbar">
                            <span className="font-semibold text-slate-400 flex items-center gap-1 shrink-0 font-mono text-[11px] uppercase tracking-wider">
                                <FiZap className="text-amber-500" /> Hot Sectors:
                            </span>
                            <button
                                type="button"
                                onClick={() => handleCategoryClick('')}
                                className={`px-2.5 py-1 rounded-full border transition-colors shrink-0 ${
                                    selectedCategory === ''
                                        ? 'bg-slate-900 text-white border-slate-900 font-medium'
                                        : 'bg-white border-slate-200/70 hover:border-slate-300 text-slate-600'
                                }`}
                            >
                                All Items
                            </button>
                            {categories.slice(0, 6).map((cat) => (
                                <button
                                    key={cat.name}
                                    type="button"
                                    onClick={() => handleCategoryClick(cat.name)}
                                    className={`px-2.5 py-1 rounded-full border transition-colors shrink-0 flex items-center gap-1.5 ${
                                        selectedCategory === cat.name
                                            ? 'bg-brand-600 text-white border-brand-600 font-medium shadow-sm'
                                            : 'bg-white border-slate-200/70 hover:border-slate-300 text-slate-600'
                                    }`}
                                >
                                    <span>{cat.name}</span>
                                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                                        selectedCategory === cat.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {cat.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --------------------------------------------------------- */}
                    {/* LIVE PLATFORM METRICS BAR                                 */}
                    {/* --------------------------------------------------------- */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <div className="p-1 rounded-xl bg-white border border-slate-200/70 shadow-subtle hover:border-slate-300 transition-colors">
                            <div className="p-4 rounded-lg bg-slate-50/50">
                                <div className="flex items-center justify-between text-slate-400 mb-2">
                                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                                        Verified Suppliers
                                    </span>
                                    <BsShieldCheck className="text-emerald-600 text-base" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
                                    {(stats.suppliers || 0).toLocaleString()}
                                    <span className="text-brand-600 font-sans text-xl">+</span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">100% credential audited</p>
                            </div>
                        </div>

                        <div className="p-1 rounded-xl bg-white border border-slate-200/70 shadow-subtle hover:border-slate-300 transition-colors">
                            <div className="p-4 rounded-lg bg-slate-50/50">
                                <div className="flex items-center justify-between text-slate-400 mb-2">
                                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                                        Catalog Inventory
                                    </span>
                                    <FiPackage className="text-brand-600 text-base" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
                                    {(stats.products || 0).toLocaleString()}
                                    <span className="text-brand-600 font-sans text-xl">+</span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">Ready for wholesale dispatch</p>
                            </div>
                        </div>

                        <div className="p-1 rounded-xl bg-white border border-slate-200/70 shadow-subtle hover:border-slate-300 transition-colors">
                            <div className="p-4 rounded-lg bg-slate-50/50">
                                <div className="flex items-center justify-between text-slate-400 mb-2">
                                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                                        Fulfilled Orders
                                    </span>
                                    <FiCheckCircle className="text-indigo-600 text-base" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
                                    {(stats.successfulDeals || 0).toLocaleString()}
                                    <span className="text-brand-600 font-sans text-xl">+</span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">Zero escrow dispute rate</p>
                            </div>
                        </div>

                        <div className="p-1 rounded-xl bg-white border border-slate-200/70 shadow-subtle hover:border-slate-300 transition-colors">
                            <div className="p-4 rounded-lg bg-slate-50/50">
                                <div className="flex items-center justify-between text-slate-400 mb-2">
                                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                                        Enterprise Buyers
                                    </span>
                                    <FiUsers className="text-purple-600 text-base" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
                                    {(stats.buyers || 0).toLocaleString()}
                                    <span className="text-brand-600 font-sans text-xl">+</span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">Trading across 40+ regions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* ADVANCED PROCUREMENT FILTER DRAWER                            */}
            {/* ------------------------------------------------------------- */}
            {showFilters && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/90 shadow-sm">
                        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/60">
                            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <FiFilter className="text-brand-600 text-base" />
                                    <h3 className="font-bold text-slate-900 text-base">Filter Commercial Inventory</h3>
                                    {activeFilterCount > 0 && (
                                        <span className="text-xs font-mono bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200 font-medium">
                                            {activeFilterCount} active
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 transition-colors"
                                >
                                    <FiRefreshCw className="text-xs" />
                                    <span>Reset to default</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                {/* Category Dropdown */}
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-600 mb-1.5">
                                        Category
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat.name} value={cat.name}>
                                                {cat.name} ({cat.count})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Supplier Dropdown */}
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-600 mb-1.5">
                                        Direct Supplier
                                    </label>
                                    <select
                                        value={selectedSupplier}
                                        onChange={(e) => setSelectedSupplier(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    >
                                        <option value="">All Suppliers</option>
                                        {suppliers?.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name} {supplier.verified ? '✓ (Verified)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Min Price */}
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-600 mb-1.5">
                                        Min Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    />
                                </div>

                                {/* Max Price */}
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-600 mb-1.5">
                                        Max Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="No limit"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    />
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-600 mb-1.5">
                                        Sort Metric
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    >
                                        <option value="created_at">Latest Added</option>
                                        <option value="name">Product Name</option>
                                        <option value="base_price">Wholesale Price</option>
                                        <option value="minimum_order_quantity">Minimum Order (MOQ)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between mt-5 pt-4 border-t border-slate-100 gap-3">
                                {/* Verified Only Toggle */}
                                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={verifiedOnly}
                                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
                                    />
                                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        <BsShieldCheck className="text-emerald-600" />
                                        Only show verified suppliers
                                    </span>
                                </label>

                                {/* Direction and Apply */}
                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                    <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => setSortOrder('desc')}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                                                sortOrder === 'desc'
                                                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            Descending
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSortOrder('asc')}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                                                sortOrder === 'asc'
                                                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            Ascending
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => applyFilters()}
                                        className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* FEATURED PRODUCT CATALOG (DOPPELRAND ARCHITECTURE)           */}
            {/* ------------------------------------------------------------- */}
            <section id="products" className="py-16 md:py-24 border-t border-slate-200/60 bg-[#FAFAFC]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                                <span className="text-xs font-mono uppercase tracking-wider font-bold text-brand-700">
                                    Commercial Inventory
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight">
                                Featured Wholesale Products
                            </h2>
                            <p className="text-sm text-slate-500 mt-1 max-w-xl">
                                Real-time pricing with minimum order quantities, factory certifications, and direct RFQ capability.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-slate-500">
                                Showing <strong className="text-slate-900">{products.data?.length || 0}</strong> products
                            </span>
                            <Link
                                href={route('buyer.products.index')}
                                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors"
                            >
                                <span>Complete Directory</span>
                                <FiChevronRight className="text-sm group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Product Cards Grid */}
                    {products.data && products.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {products.data.map((product) => (
                                <div
                                    key={product.id}
                                    className="group p-1.5 rounded-2xl bg-slate-100/70 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:bg-brand-50/50 hover:border-brand-200/70 transition-all duration-300 flex flex-col"
                                >
                                    <div className="bg-white rounded-xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
                                        {/* Product Image Stage */}
                                        <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                            {product.image ? (
                                                <img
                                                    src={`/storage/${product.image}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                    onError={(e) => {
                                                        e.currentTarget.src = NoImg;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                                                    <FiPackage className="text-3xl mb-1 stroke-1" />
                                                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                                                        Standard Packaging
                                                    </span>
                                                </div>
                                            )}

                                            {/* Overlaid Badges */}
                                            <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                                                {product.supplier?.verified ? (
                                                    <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                                        <BsShieldCheck className="text-xs" />
                                                        <span>Verified</span>
                                                    </span>
                                                ) : (
                                                    <span />
                                                )}
                                                {product.category && (
                                                    <span className="bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-full shadow-sm">
                                                        {product.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4 flex flex-col flex-1">
                                            {/* Direct Supplier Line */}
                                            {product.supplier && (
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                                                    <BsBuildingCheck className="text-slate-400 shrink-0" />
                                                    <span className="font-medium truncate text-slate-700">
                                                        {product.supplier.name}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Product Title */}
                                            <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">
                                                {product.name}
                                            </h3>

                                            {/* Price and MOQ Section */}
                                            <div className="mt-auto pt-4 border-t border-slate-100">
                                                <div className="flex items-baseline justify-between gap-2 mb-3">
                                                    <div>
                                                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block -mb-0.5">
                                                            Unit Price
                                                        </span>
                                                        <span className="font-mono text-xl font-bold text-slate-950 tracking-tight">
                                                            {formatCurrency(product.price)}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block -mb-0.5">
                                                            Min Order
                                                        </span>
                                                        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                                            {product.moq} {product.unit || 'units'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Button-In-Button CTA */}
                                                <Link
                                                    href={route('buyer.products.show', product.slug)}
                                                    className="w-full group/btn inline-flex items-center justify-between bg-slate-900 hover:bg-brand-600 text-white pl-3.5 pr-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                                                >
                                                    <span>View Specs & Volume Tiers</span>
                                                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-brand-600 group-hover/btn:translate-x-0.5 transition-all duration-200">
                                                        <FiArrowRight className="text-xs" />
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
                            <FiPackage className="mx-auto text-4xl text-slate-300 mb-3" />
                            <h3 className="font-bold text-slate-800 text-base mb-1">No matching commercial inventory found</h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                                There are no active products that match your current filter selection. Try adjusting your search query or reset your filters.
                            </p>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {products.links && products.links.length > 3 && (
                        <div className="flex justify-center mt-12">
                            <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200/80 rounded-xl shadow-subtle">
                                {products.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (link.url) {
                                                router.get(link.url, {}, { preserveScroll: true });
                                            }
                                        }}
                                        disabled={!link.url}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                                            link.active
                                                ? 'bg-slate-950 text-white font-semibold shadow-sm'
                                                : link.url
                                                ? 'text-slate-700 hover:bg-slate-100'
                                                : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* CATEGORY EXPLORATION BENTO (#categories)                      */}
            {/* ------------------------------------------------------------- */}
            <section id="categories" className="py-16 md:py-24 bg-white border-t border-slate-200/60">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-mono uppercase tracking-wider font-bold text-brand-700">
                            Industrial Sectors
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight mt-1">
                            Browse Sourcing Categories
                        </h2>
                        <p className="text-sm text-slate-500 mt-2">
                            Explore vetted commercial suppliers categorized by manufacturing sector and material specifications.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                        {categories.map((cat, idx) => (
                            <button
                                key={cat.name}
                                type="button"
                                onClick={() => handleCategoryClick(cat.name)}
                                className={`p-4 rounded-xl border text-left transition-all duration-200 group flex flex-col justify-between h-32 ${
                                    selectedCategory === cat.name
                                        ? 'bg-brand-50/80 border-brand-300 ring-2 ring-brand-500/20 shadow-sm'
                                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-subtle'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                                        selectedCategory === cat.name
                                            ? 'bg-brand-600 text-white'
                                            : 'bg-white border border-slate-200/70 text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-600'
                                    }`}>
                                        <FiLayers />
                                    </div>
                                    <span className="text-[10px] font-mono font-semibold text-slate-400">
                                        0{idx + 1}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-brand-600 transition-colors">
                                        {cat.name}
                                    </div>
                                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                                        {cat.count} listings
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* ASYMMETRIC BENTO GRID: ENTERPRISE CAPABILITIES                */}
            {/* ------------------------------------------------------------- */}
            <section id="capabilities" className="py-16 md:py-24 bg-[#FAFAFC] border-t border-slate-200/60">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-xs font-mono uppercase tracking-wider font-bold text-brand-700">
                            Protocol Architecture
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight mt-1">
                            Engineered for Wholesale Scale
                        </h2>
                        <p className="text-sm text-slate-500 mt-2">
                            Traditional B2B procurement is plagued by fragmented emails, uncertain quality, and hidden margins. Treadmesh rebuilds the workflow from the ground up.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Bento Card 1: Multi-Supplier RFQ Engine (2 cols) */}
                        <div className="md:col-span-2 p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="p-2 rounded-lg bg-brand-50 text-brand-600 text-sm">
                                        <FiZap />
                                    </span>
                                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-700">
                                        Smart RFQ Protocol
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-950">
                                    Instant Competitive Multi-Bid Auction
                                </h3>
                                <p className="text-sm text-slate-600 mt-1.5 max-w-xl">
                                    Submit your technical procurement requirements once. Verified suppliers submit transparent bids with volume pricing curves and delivery timelines within 48 hours.
                                </p>
                            </div>

                            {/* Architectural UI Simulation */}
                            <div className="mx-6 mb-6 p-4 rounded-xl bg-slate-900 text-white font-mono text-xs shadow-inner">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                                    <span>RFQ-9824 // Precision Carbon Bearings (5,000 Units)</span>
                                    <span className="text-emerald-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        3 ACTIVE BIDS
                                    </span>
                                </div>
                                <div className="space-y-2 mt-3 text-xs">
                                    <div className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700/50">
                                        <div className="flex items-center gap-2">
                                            <BsShieldCheck className="text-emerald-400" />
                                            <span>Apex Heavy Industries Ltd.</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-400">MOQ 1,000</span>
                                            <span className="text-emerald-400 font-bold">$18.50/unit</span>
                                            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-800">
                                                Best Volume Tier
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded bg-slate-800/40 border border-slate-800 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <BsShieldCheck className="text-emerald-400" />
                                            <span>Vanguard Precision Parts</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span>MOQ 2,500</span>
                                            <span className="text-slate-200 font-bold">$19.20/unit</span>
                                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                                                4 Day Dispatch
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bento Card 2: Tiered Economics (1 col) */}
                        <div className="p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm">
                                        <FiTrendingUp />
                                    </span>
                                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-700">
                                        Transparent Economics
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-950">
                                    Dynamic Volume Tiers
                                </h3>
                                <p className="text-sm text-slate-600 mt-1.5">
                                    Real-time tier thresholds eliminate manual back-and-forth price negotiations.
                                </p>
                            </div>

                            <div className="mx-6 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                                <div className="flex justify-between items-center text-xs font-mono py-1 border-b border-slate-200/60">
                                    <span className="text-slate-600">Tier 1 (100 - 499 units)</span>
                                    <span className="font-bold text-slate-900">$240.00</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-mono py-1 border-b border-slate-200/60">
                                    <span className="text-slate-600">Tier 2 (500 - 999 units)</span>
                                    <span className="font-bold text-brand-600">$215.00 (-10%)</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-mono py-1 bg-brand-50/80 px-2 rounded border border-brand-200/60">
                                    <span className="text-brand-900 font-semibold">Tier 3 (1,000+ units)</span>
                                    <span className="font-bold text-brand-700">$185.00 (-23%)</span>
                                </div>
                            </div>
                        </div>

                        {/* Bento Card 3: Escrow Trade Protection (1 col) */}
                        <div className="p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="p-2 rounded-lg bg-purple-50 text-purple-600 text-sm">
                                        <FiLock />
                                    </span>
                                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-700">
                                        Capital Safety
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-950">
                                    Escrow & Milestone Settlement
                                </h3>
                                <p className="text-sm text-slate-600 mt-1.5">
                                    Funds remain protected in segregated escrow until goods are physically inspected and received to spec.
                                </p>
                            </div>

                            <div className="mx-6 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                    <BsShieldCheck className="text-xl" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">100% Inspection Assurance</div>
                                    <div className="text-[11px] text-slate-500">Dispute mediation guarantee under UCC standard</div>
                                </div>
                            </div>
                        </div>

                        {/* Bento Card 4: Supplier Due Diligence (2 cols) */}
                        <div className="md:col-span-2 p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 text-sm">
                                        <BsBuildingCheck />
                                    </span>
                                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700">
                                        Risk Mitigation
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-950">
                                    Vetted Factory Audits & Continuous KYC
                                </h3>
                                <p className="text-sm text-slate-600 mt-1.5 max-w-xl">
                                    Every supplier undergoes business entity verification, manufacturing capacity review, and on-time fulfillment tracking before being awarded the Verified Supplier badge.
                                </p>
                            </div>

                            <div className="mx-6 mb-6 grid grid-cols-3 gap-3">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
                                    <div className="text-lg font-bold font-mono text-slate-900">99.4%</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">On-Time SLA</div>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
                                    <div className="text-lg font-bold font-mono text-slate-900">ISO 9001</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Quality Standard</div>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
                                    <div className="text-lg font-bold font-mono text-slate-900">&lt; 0.1%</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Return Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* STEP-BY-STEP PROCUREMENT LIFECYCLE (#how-it-works)            */}
            {/* ------------------------------------------------------------- */}
            <section id="how-it-works" className="py-16 md:py-24 bg-white border-t border-slate-200/60">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-mono uppercase tracking-wider font-bold text-brand-700">
                            Workflow Process
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight mt-1">
                            How Treadmesh Operates
                        </h2>
                        <p className="text-sm text-slate-500 mt-2">
                            A streamlined 4-stage pipeline that takes your procurement order from initial requirement to verified delivery.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                        {/* Step 1 */}
                        <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 relative flex flex-col">
                            <span className="font-mono text-3xl font-extrabold text-slate-300 mb-4">01</span>
                            <h3 className="font-bold text-slate-900 text-base mb-2">Create Buyer Profile</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Complete rapid enterprise KYC to gain immediate access to wholesale pricing and custom quotes.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 relative flex flex-col">
                            <span className="font-mono text-3xl font-extrabold text-brand-500/40 mb-4">02</span>
                            <h3 className="font-bold text-slate-900 text-base mb-2">Submit RFQ Specs</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Define part specifications, required volumes, delivery deadlines, and compliance certifications.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 relative flex flex-col">
                            <span className="font-mono text-3xl font-extrabold text-indigo-500/40 mb-4">03</span>
                            <h3 className="font-bold text-slate-900 text-base mb-2">Evaluate Quotes</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Review competitive bids side-by-side with transparent tiered pricing and direct supplier messaging.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 relative flex flex-col">
                            <span className="font-mono text-3xl font-extrabold text-emerald-500/40 mb-4">04</span>
                            <h3 className="font-bold text-slate-900 text-base mb-2">Escrow Settlement</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Lock funds securely into trade escrow. Payment is released only upon post-delivery inspection approval.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* VERIFIED SUCCESS STORIES & RECENT DEALS                       */}
            {/* ------------------------------------------------------------- */}
            {successStories && successStories.length > 0 && (
                <section className="py-16 md:py-24 bg-[#FAFAFC] border-t border-slate-200/60">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="text-xs font-mono uppercase tracking-wider font-bold text-brand-700">
                                Trade Settlement Ledger
                            </span>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight mt-1">
                                Recent Executed Procurement Deals
                            </h2>
                            <p className="text-sm text-slate-500 mt-2">
                                Real transactions completed through Treadmesh's verified supplier network and escrow pipeline.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {successStories.slice(0, 3).map((story) => (
                                <div
                                    key={story.id}
                                    className="p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between"
                                >
                                    <div className="p-5">
                                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-3">
                                            <span className="text-slate-600 font-semibold">{story.order_number || `ORD-${story.id}`}</span>
                                            <span>{story.date}</span>
                                        </div>

                                        <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">
                                            {story.product}
                                        </h4>
                                        <p className="text-xs text-slate-500 mb-4">
                                            Buyer: <strong className="text-slate-700">{story.buyer}</strong>
                                        </p>

                                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500">Total Settlement</span>
                                            <span className="font-mono text-base font-bold text-slate-950">
                                                {formatCurrency(story.amount)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                        <div className="flex text-amber-400">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <FiStar key={s} className="fill-current text-xs" />
                                            ))}
                                        </div>
                                        <span className="font-mono text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                                            <FiCheck className="text-xs" /> Verified Fulfilled
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ------------------------------------------------------------- */}
            {/* ENTERPRISE TRUST & ABOUT PLATFORM (#about)                    */}
            {/* ------------------------------------------------------------- */}
            <section id="about" className="py-16 md:py-24 bg-white border-t border-slate-200/60">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-xs font-mono uppercase tracking-wider font-bold text-brand-700">
                                Mission & Governance
                            </span>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight mt-1 mb-6 leading-tight">
                                Re-Architecting Global Wholesale Sourcing for the Digital Age
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Founded to remove friction from large-scale B2B trade, Treadmesh creates a verifiable, transparent layer between global manufacturing facilities and commercial enterprises.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                We combine rigorous supplier credentialing with programmatic RFQs and multi-tiered pricing, giving purchasing departments the same speed and certainty found in modern consumer digital commerce.
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <div>
                                    <div className="text-xl font-bold font-mono text-slate-900">SOC 2 Type II</div>
                                    <div className="text-xs text-slate-500">Enterprise data security audited</div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold font-mono text-slate-900">256-Bit SSL</div>
                                    <div className="text-xs text-slate-500">Bank-grade transaction encryption</div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Right Stage: Platform Specs */}
                        <div className="p-2 rounded-2xl bg-slate-100/70 border border-slate-200/80 shadow-card">
                            <div className="bg-slate-950 text-white rounded-xl p-6 font-sans">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-mono font-semibold tracking-wider uppercase text-slate-300">
                                            Enterprise Buyer Protections
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500">STANDARD v4.1</span>
                                </div>

                                <div className="space-y-4 mt-5">
                                    <div className="flex items-start gap-3">
                                        <FiShield className="text-brand-400 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-xs font-bold text-white">Full Capital Escrow Release</h4>
                                            <p className="text-[11px] text-slate-400 mt-0.5">Funds are only disbursed after signed Bill of Lading and quality acceptance test.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FiCheckCircle className="text-emerald-400 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-xs font-bold text-white">Factory Verified Credentials</h4>
                                            <p className="text-[11px] text-slate-400 mt-0.5">Active business licenses, tax ID registrations, and facility certifications verified.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FiClock className="text-indigo-400 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-xs font-bold text-white">24/7 Procurement Specialist Support</h4>
                                            <p className="text-[11px] text-slate-400 mt-0.5">Dedicated human procurement account managers to assist with high-volume RFQs.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                                    <span>Average Quote Delivery</span>
                                    <span className="text-emerald-400 font-bold">&lt; 24 Hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* DIRECT SOURCING & SPECIALIST ADVISORY (#contact)              */}
            {/* ------------------------------------------------------------- */}
            <section id="contact" className="py-16 md:py-24 bg-[#FAFAFC] border-t border-slate-200/60">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid lg:grid-cols-12 gap-10 items-start">
                        {/* Contact Information */}
                        <div className="lg:col-span-5">
                            <span className="text-xs font-mono uppercase tracking-wider font-bold text-brand-700">
                                Commercial Advisory
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1 mb-4">
                                Connect With a Procurement Specialist
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed mb-8">
                                Have high-volume custom manufacturing requirements or need help establishing supplier contracts? Our dedicated trade specialists are on call.
                            </p>

                            <div className="space-y-4">
                                <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-subtle flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                                        <FiMapPin />
                                    </div>
                                    <div>
                                        <div className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-400">Commercial HQ</div>
                                        <div className="text-xs font-semibold text-slate-800">100 Commercial Plaza, Suite 400</div>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-subtle flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <FiPhone />
                                    </div>
                                    <div>
                                        <div className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-400">Direct Hotline</div>
                                        <div className="text-xs font-semibold text-slate-800 font-mono">+1 (555) 234-5678</div>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-subtle flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <FiMail />
                                    </div>
                                    <div>
                                        <div className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-400">Procurement Desk</div>
                                        <div className="text-xs font-semibold text-slate-800 font-mono">support@treadmesh.com</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Specialist Inquiry Form */}
                        <div className="lg:col-span-7 p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-card">
                            <div className="p-6 sm:p-8">
                                <h3 className="text-lg font-bold text-slate-950 mb-1">
                                    Submit Enterprise Sourcing Inquiry
                                </h3>
                                <p className="text-xs text-slate-500 mb-6">
                                    Our trade desk responds with qualified supplier matches within 1 business day.
                                </p>

                                {contactSubmitted ? (
                                    <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in duration-300">
                                        <FiCheckCircle className="mx-auto text-3xl text-emerald-600 mb-2" />
                                        <h4 className="font-bold text-emerald-900 text-sm">Inquiry Transmitted Successfully</h4>
                                        <p className="text-xs text-emerald-700 mt-1 max-w-sm mx-auto">
                                            A procurement advisor has been assigned to review your parameters. We will contact you at your work email shortly.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleContactSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-600 mb-1.5">
                                                    First Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={contactForm.firstName}
                                                    onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                                                    placeholder="Jane"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-600 mb-1.5">
                                                    Last Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={contactForm.lastName}
                                                    onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                                                    placeholder="Doe"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-600 mb-1.5">
                                                Corporate Email *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={contactForm.email}
                                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                                placeholder="j.doe@enterprise.com"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-600 mb-1.5">
                                                Subject / Procurement Target *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={contactForm.subject}
                                                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                                placeholder="e.g., Request for Bulk Precision Electronic Components"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-600 mb-1.5">
                                                Sourcing Specifications / Volumes *
                                            </label>
                                            <textarea
                                                rows="4"
                                                required
                                                value={contactForm.message}
                                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                                placeholder="Provide part numbers, estimated monthly volume, material specifications, or delivery timelines..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full group/btn inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200"
                                        >
                                            <span>Transmit Sourcing Request</span>
                                            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:translate-x-0.5 transition-transform duration-200">
                                                <FiArrowRight className="text-xs" />
                                            </span>
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* CALL TO ACTION ACCELERATOR BANNER                             */}
            {/* ------------------------------------------------------------- */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-300 border border-white/10 text-xs font-mono mb-4">
                        <BsLightningChargeFill className="text-amber-400" />
                        <span>ZERO COMMITMENT ONBOARDING</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                        Ready to Accelerate Your Enterprise Procurement?
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
                        Join over 10,000 businesses sourcing high-grade inventory directly from vetted manufacturers with trade assurance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href={route('register')}
                            className="group inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg shadow-brand-500/25 transition-all duration-200"
                        >
                            <span>Create Free Enterprise Account</span>
                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                                <FiArrowRight className="text-xs" />
                            </span>
                        </Link>
                        <a
                            href="#contact"
                            className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold border border-white/20 transition-all duration-200"
                        >
                            <span>Speak to an Advisor</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* ENTERPRISE DARK SLATE FOOTER                                  */}
            {/* ------------------------------------------------------------- */}
            <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                        {/* Brand Column */}
                        <div className="md:col-span-2">
                            <Link href="/" className="inline-flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                                    TM
                                </div>
                                <span className="text-base font-bold text-white tracking-tight">
                                    Tread<span className="text-brand-500">mesh</span>
                                </span>
                            </Link>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
                                Enterprise-grade wholesale procurement infrastructure connecting verified suppliers with high-volume commercial buyers under strict escrow governance.
                            </p>
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Platform Operational • Escrow Active</span>
                            </div>
                        </div>

                        {/* Quick Navigation */}
                        <div>
                            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-200 mb-3">
                                Platform
                            </h4>
                            <ul className="space-y-2">
                                <li><a href="#products" className="hover:text-white transition-colors">Products Catalog</a></li>
                                <li><a href="#categories" className="hover:text-white transition-colors">Category Sectors</a></li>
                                <li><a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a></li>
                                <li><a href="#how-it-works" className="hover:text-white transition-colors">Procurement Pipeline</a></li>
                                <li><a href="#about" className="hover:text-white transition-colors">Enterprise Trust</a></li>
                            </ul>
                        </div>

                        {/* For Buyers */}
                        <div>
                            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-200 mb-3">
                                For Buyers
                            </h4>
                            <ul className="space-y-2">
                                <li><Link href={route('buyer.products.index')} className="hover:text-white transition-colors">Browse Products</Link></li>
                                <li><Link href={route('buyer.rfqs.create')} className="hover:text-white transition-colors">Submit RFQ</Link></li>
                                <li><a href="#about" className="hover:text-white transition-colors">Escrow Guarantee</a></li>
                                <li><a href="#contact" className="hover:text-white transition-colors">Volume Purchasing</a></li>
                            </ul>
                        </div>

                        {/* For Suppliers */}
                        <div>
                            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-200 mb-3">
                                For Suppliers
                            </h4>
                            <ul className="space-y-2">
                                <li><Link href={route('register')} className="hover:text-white transition-colors">Become a Supplier</Link></li>
                                <li><a href="#about" className="hover:text-white transition-colors">Verification Audit</a></li>
                                <li><a href="#capabilities" className="hover:text-white transition-colors">RFQ Bidding Engine</a></li>
                                <li><a href="#contact" className="hover:text-white transition-colors">Supplier Support</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Legal & Copyright Bar */}
                    <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
                        <p className="font-mono text-[11px]">
                            &copy; {new Date().getFullYear()} Treadmesh B2B Inc. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-[11px]">
                            <a href="#about" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                            <a href="#about" className="hover:text-slate-300 transition-colors">Terms of Trade</a>
                            <a href="#about" className="hover:text-slate-300 transition-colors">Escrow Disclosures</a>
                            <a href="#contact" className="hover:text-slate-300 transition-colors">Security</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}