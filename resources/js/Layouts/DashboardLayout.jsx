// resources/js/Layouts/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiMessageSquare,
  FiFileText,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiChevronDown,
  FiChevronRight,
  FiSearch,
  FiCheckCircle,
  FiActivity,
  FiBarChart2,
  FiExternalLink
} from 'react-icons/fi';
import {
  BsShieldCheck,
  BsBuildingCheck,
  BsBoxSeam,
  BsGraphUp,
  BsCartCheck,
  BsEnvelope
} from 'react-icons/bs';
import { IoMdBusiness } from 'react-icons/io';
import { MdVerified, MdOutlineInventory } from 'react-icons/md';

const DashboardLayout = ({ children }) => {
  const { props, url } = usePage();
  const { auth, flash } = props;
  const [openMenus, setOpenMenus] = useState({});
  const [currentRoute, setCurrentRoute] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Authenticated user
  const user = auth?.user;

  // Track current route URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentRoute(url || window.location.pathname);
    }
  }, [url]);

  // Realistic India B2B procurement notifications
  useEffect(() => {
    if (user?.role === 'admin') {
      setNotifications([
        { id: 1, title: 'GSTIN Verification Pending', desc: 'Rajkot Precision Eng submitted factory audit documents', time: '10m ago', unread: true },
        { id: 2, title: 'Bulk Catalog Approval', desc: '5 new industrial CNC products awaiting technical review', time: '1h ago', unread: true },
        { id: 3, title: 'Escrow Milestone Released', desc: 'Order ORD-8921 settlement disbursed post-inspection', time: '3h ago', unread: false },
      ]);
    } else if (user?.role === 'supplier') {
      setNotifications([
        { id: 1, title: 'New RFQ Received', desc: 'Buyer posted RFQ for 10,000 Precision Bushings (Chakan)', time: '15m ago', unread: true },
        { id: 2, title: 'Quote Shortlisted', desc: 'Your bid for RFQ-8412 was shortlisted by EPC Buyer', time: '2h ago', unread: true },
        { id: 3, title: 'E-Way Bill Generated', desc: 'E-Way bill verified for dispatched shipment ORD-4920', time: '1d ago', unread: false },
      ]);
    } else if (user?.role === 'buyer') {
      setNotifications([
        { id: 1, title: 'Competitive Quote Submitted', desc: 'Hosur Auto-Components submitted bid for RFQ-8412', time: '5m ago', unread: true },
        { id: 2, title: 'Escrow Secured', desc: '₹2,45,000 locked into Nodal Escrow for Order ORD-9821', time: '2h ago', unread: true },
        { id: 3, title: 'Shipment Dispatched', desc: 'Lorry Receipt #LR-49821 uploaded with tracking details', time: '1d ago', unread: false },
      ]);
    }
  }, [user]);

  // Open active submenu groups based on route
  useEffect(() => {
    if (currentRoute.includes('/admin/reports')) {
      setOpenMenus(prev => ({ ...prev, Reports: true }));
    }
    if (currentRoute.includes('/supplier/analytics')) {
      setOpenMenus(prev => ({ ...prev, Analytics: true }));
    }
  }, [currentRoute]);

  const handleLogout = () => {
    router.post(route('logout'));
  };

  const isRouteActive = (routeName) => {
    if (!routeName) return false;
    try {
      if (route().current(routeName)) return true;
      const routeUrl = route(routeName);
      const baseUrl = window.location.origin;
      const routePath = routeUrl.replace(baseUrl, '');
      const currentPath = window.location.pathname;

      if (currentPath === routePath) return true;
      if (routeName.includes('index') && currentPath.includes(routePath.replace('/index', ''))) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const isMenuItemActive = (item) => {
    if (item.subItems) {
      return item.subItems.some(sub => isRouteActive(sub.route));
    }
    return isRouteActive(item.route);
  };

  // Structured Navigation Groups
  const getNavSections = () => {
    const role = user?.role || 'buyer';

    if (role === 'admin') {
      return [
        {
          heading: 'PLATFORM GOVERNANCE',
          items: [
            { name: 'Console Overview', icon: FiHome, route: 'admin.dashboard' },
            { name: 'Manage Suppliers', icon: IoMdBusiness, route: 'admin.suppliers.index' },
            { name: 'Verify GSTIN / Factory', icon: MdVerified, route: 'admin.supplier-verification.index' },
            { name: 'Product Approvals', icon: MdOutlineInventory, route: 'admin.product-approval.index' },
            { name: 'All Products', icon: FiPackage, route: 'admin.products.index' },
          ]
        },
        {
          heading: 'COMMERCE & ESCROW',
          items: [
            { name: 'All Orders', icon: FiShoppingCart, route: 'admin.orders.index' },
            { name: 'All RFQs', icon: FiFileText, route: 'admin.rfqs.index' },
            { name: 'Manage Users', icon: FiUsers, route: 'admin.users.index' },
          ]
        },
        {
          heading: 'FINANCIAL INTELLIGENCE',
          items: [
            {
              name: 'Audit Reports',
              icon: FiBarChart2,
              route: 'admin.reports.sales',
              subItems: [
                { name: 'Sales Ledger', route: 'admin.reports.sales' },
                { name: 'Supplier Reports', route: 'admin.reports.suppliers' },
                { name: 'Buyer Reports', route: 'admin.reports.buyers' },
                { name: 'Product Volume', route: 'admin.reports.products' },
                { name: 'RFQ Analytics', route: 'admin.reports.rfqs' },
                { name: 'Escrow & Financial', route: 'admin.reports.financial' },
              ]
            }
          ]
        }
      ];
    }

    if (role === 'supplier') {
      return [
        {
          heading: 'MANUFACTURING CONSOLE',
          items: [
            { name: 'Dashboard Overview', icon: FiHome, route: 'supplier.dashboard' },
            { name: 'Factory Profile & GST', icon: BsBuildingCheck, route: 'supplier.profile.index' },
            { name: 'Catalog Inventory', icon: FiPackage, route: 'supplier.products.index' },
            { name: 'Publish SKU', icon: BsBoxSeam, route: 'supplier.products.create' },
          ]
        },
        {
          heading: 'SALES & BIDDING',
          items: [
            { name: 'Incoming RFQs', icon: FiFileText, route: 'supplier.rfqs.index' },
            { name: 'Submitted Bids', icon: BsGraphUp, route: 'supplier.quotes.index' },
            { name: 'Orders & Dispatch', icon: FiShoppingCart, route: 'supplier.orders.index' },
            { name: 'Buyer Messages', icon: FiMessageSquare, route: 'supplier.messages.index' },
          ]
        },
        {
          heading: 'PERFORMANCE METRICS',
          items: [
            {
              name: 'Sales Analytics',
              icon: FiBarChart2,
              route: 'supplier.analytics.sales',
              subItems: [
                { name: 'Revenue & Volume', route: 'supplier.analytics.sales' },
                { name: 'Product Demand', route: 'supplier.analytics.products' },
                { name: 'Quote Conversion', route: 'supplier.analytics.quotes' },
              ]
            }
          ]
        }
      ];
    }

    // Default: Buyer Console
    return [
      {
        heading: 'BUYER CONSOLE',
        items: [
          { name: 'Procurement Console', icon: FiHome, route: 'buyer.dashboard' },
          { name: 'Browse Wholesale Catalog', icon: FiPackage, route: 'buyer.products.index' },
        ]
      },
      {
        heading: 'RFQ & NEGOTIATION',
        items: [
          { name: 'Post New RFQ', icon: BsEnvelope, route: 'buyer.rfqs.create' },
          { name: 'My Active RFQs', icon: FiFileText, route: 'buyer.rfqs.index' },
          { name: 'Received Quotes', icon: BsCartCheck, route: 'buyer.quotes.index' },
        ]
      },
      {
        heading: 'ORDERS & ESCROW',
        items: [
          { name: 'My Orders', icon: FiShoppingCart, route: 'buyer.orders.index' },
          { name: 'Supplier Messages', icon: FiMessageSquare, route: 'buyer.messages.index' },
        ]
      }
    ];
  };

  const navSections = getNavSections();

  const toggleSubmenu = (name) => {
    setOpenMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const roleLabels = {
    admin: 'Platform Admin',
    supplier: 'Manufacturer / Supplier',
    buyer: 'Enterprise Buyer'
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-brand-500 selection:text-white flex">
      {/* ------------------------------------------------------------- */}
      {/* FLASH NOTIFICATION TOASTS                                      */}
      {/* ------------------------------------------------------------- */}
      {flash?.success && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-emerald-500 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <FiCheckCircle className="text-base shrink-0" />
          <span>{flash.success}</span>
        </div>
      )}
      {flash?.error && (
        <div className="fixed top-4 right-4 z-50 bg-rose-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-rose-500 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <FiX className="text-base shrink-0" />
          <span>{flash.error}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* ARCHITECTURAL SLATE SIDEBAR (DESKTOP & MOBILE DRAWER)         */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-950 text-slate-300 border-r border-slate-800/80 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs shadow-inner">
                <span className="bg-gradient-to-br from-brand-400 to-indigo-500 bg-clip-text text-transparent font-black">
                  TM
                </span>
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  Tread<span className="text-brand-500">mesh</span>
                  <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded border border-amber-500/30">
                    IN
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 -mt-0.5">
                  B2B Wholesale Portal
                </div>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* User Profile Card in Sidebar */}
          {user && (
            <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center font-mono">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {user.name}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    <span className="truncate">{roleLabels[user.role] || user.role}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
            {navSections.map((section) => (
              <div key={section.heading}>
                <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500">
                  {section.heading}
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = isMenuItemActive(item);

                    if (item.subItems) {
                      const isOpen = openMenus[item.name];
                      const subActive = item.subItems.some(sub => isRouteActive(sub.route));

                      return (
                        <div key={item.name}>
                          <button
                            type="button"
                            onClick={() => toggleSubmenu(item.name)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              subActive
                                ? 'bg-slate-900 text-white border border-slate-800 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <item.icon className={`text-sm ${subActive ? 'text-brand-400' : 'text-slate-500'}`} />
                              <span>{item.name}</span>
                            </div>
                            <FiChevronDown
                              className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            />
                          </button>

                          {isOpen && (
                            <div className="pl-6 pr-2 py-1 mt-1 space-y-1 border-l border-slate-800 ml-4">
                              {item.subItems.map((sub) => {
                                const subRouteActive = isRouteActive(sub.route);
                                return (
                                  <Link
                                    key={sub.name}
                                    href={route(sub.route)}
                                    className={`block px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                                      subRouteActive
                                        ? 'bg-brand-500/10 text-brand-400 font-semibold'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                                    }`}
                                  >
                                    {sub.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.name}
                        href={route(item.route)}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          active
                            ? 'bg-slate-900 text-white font-semibold border border-slate-800 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon className={`text-sm ${active ? 'text-brand-400' : 'text-slate-500'}`} />
                          <span>{item.name}</span>
                        </div>
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: System Status & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
          <div className="px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Nodal Escrow Rail
            </span>
            <span className="text-slate-500">v3.4</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <FiLogOut className="text-xs" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONSOLE AREA                                              */}
      {/* ------------------------------------------------------------- */}
      <div className="lg:ml-64 flex-1 flex flex-col min-w-0">
        {/* Sticky Glass Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile Trigger & Quick Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <FiMenu className="text-lg" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-900">
                {roleLabels[user?.role] || 'Console'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 hidden sm:inline">
                GST E-Invoicing Ready
              </span>
            </div>
          </div>

          {/* Right: Operational Status, Notifications & Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Sourcing Action */}
            <Link
              href={route('home')}
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span>Public Marketplace</span>
              <FiExternalLink className="text-[11px]" />
            </Link>

            {/* Notification Center Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors relative"
                aria-label="View notifications"
              >
                <FiBell className="text-base" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 px-1">
                    <span className="text-xs font-bold text-slate-900">Procurement Activity</span>
                    <span className="text-[10px] font-mono text-brand-600 font-semibold">Live Feed</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-xs transition-colors ${
                          n.unread ? 'bg-brand-50/70 border border-brand-100' : 'bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-900 text-[11px]">
                          <span>{n.title}</span>
                          <span className="text-[10px] font-mono text-slate-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Account Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <FiChevronDown className="text-xs text-slate-500 hidden sm:block" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200/90 rounded-2xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900 truncate">{user?.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                  </div>
                  <Link
                    href={route(user?.role === 'supplier' ? 'supplier.profile.edit' : 'profile.edit')}
                    onClick={() => setProfileMenuOpen(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    Enterprise Profile & GST
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium border-t border-slate-100 mt-1"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Main Content Stage */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
