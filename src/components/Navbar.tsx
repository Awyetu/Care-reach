import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, PlusCircle, Search, Info, HelpCircle, Shield, RefreshCw } from 'lucide-react';
import { outreachStore } from '../services/outreachStore';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      const stats = outreachStore.getStats();
      setPendingCount(stats.pending);
    };

    updateStats();
    const unsubscribe = outreachStore.subscribe(updateStats);
    return () => unsubscribe();
  }, []);

  const navItems = [
    { label: 'Find Outreach', route: 'outreaches', icon: Search },
    { label: 'Submit Outreach', route: 'submit', icon: PlusCircle, highlight: true },
    { label: 'How It Works', route: 'how-it-works', icon: HelpCircle },
    { label: 'About', route: 'about', icon: Info },
  ];

  const handleNav = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs backdrop-blur-md">
      {/* Top Banner: Verification commitment & Demo reminder */}
      <div className="bg-emerald-950 text-emerald-100 text-[11px] sm:text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            <strong>CareReach Nigeria:</strong> Centralized verified directory of free medical outreaches across Nigeria.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-[11px] text-emerald-300/80 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-800">
            Demo Mode Active
          </span>
          <button
            onClick={() => {
              if (confirm('Reset demo outreach records to initial seed data?')) {
                outreachStore.resetToSeedData();
                alert('Reset complete. Sample outreaches restored.');
              }
            }}
            className="text-[11px] text-emerald-300 hover:text-white flex items-center gap-1 underline underline-offset-2"
            title="Reset sample outreaches"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Demo Data
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-lg p-1"
            aria-label="CareReach Nigeria Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs font-black text-xl tracking-tighter">
              CR
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                CareReach <span className="text-emerald-700">Nigeria</span>
              </span>
              <span className="block text-[11px] text-slate-500 font-medium tracking-tight">
                Find free healthcare near you
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              if (item.highlight) {
                return (
                  <button
                    key={item.route}
                    onClick={() => handleNav(item.route)}
                    className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs transition-colors focus:ring-2 focus:ring-emerald-600"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              }

              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Admin Moderator Portal */}
            <div className="ml-3 pl-3 border-l border-slate-200">
              <button
                onClick={() => handleNav('admin')}
                className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  currentRoute.startsWith('admin')
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                title="Moderation & Verification Dashboard"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Moderator</span>
                {pendingCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.2 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => handleNav('submit')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800"
            >
              + Submit
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-left ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5 text-emerald-700" />
                  {item.label}
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-slate-200">
              <button
                onClick={() => handleNav('admin')}
                className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium bg-slate-900 text-white"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span>Moderator Dashboard</span>
                </div>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                    {pendingCount} Pending
                  </span>
                )}
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  outreachStore.resetToSeedData();
                  alert('Reset complete. Sample outreaches restored.');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-700 underline py-2"
              >
                Reset Demo Sample Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
