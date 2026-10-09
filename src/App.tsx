/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './views/HomePage';
import { OutreachesListPage } from './views/OutreachesListPage';
import { OutreachDetailPage } from './views/OutreachDetailPage';
import { SubmitPage } from './views/SubmitPage';
import { AboutPage } from './views/AboutPage';
import { HowItWorksPage } from './views/HowItWorksPage';
import { AdminDashboard } from './views/AdminDashboard';
import { ReportModal } from './views/ReportModal';
import { outreachStore } from './services/outreachStore';
import { Outreach, OutreachFilters } from './types';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedOutreach, setSelectedOutreach] = useState<Outreach | null>(null);
  const [reportingOutreach, setReportingOutreach] = useState<Outreach | null>(null);
  const [outreaches, setOutreaches] = useState<Outreach[]>(outreachStore.getAll());
  const [activeFilters, setActiveFilters] = useState<Partial<OutreachFilters>>({});

  // Sync with store
  useEffect(() => {
    const handleStoreUpdate = () => {
      const all = outreachStore.getAll();
      setOutreaches(all);

      // If viewing an outreach detail, update its state
      if (selectedOutreach) {
        const updated = all.find((o) => o.id === selectedOutreach.id || o.slug === selectedOutreach.slug);
        if (updated) setSelectedOutreach(updated);
      }
    };

    const unsubscribe = outreachStore.subscribe(handleStoreUpdate);
    return () => unsubscribe();
  }, [selectedOutreach]);

  // Handle URL hash changes for deep linking & browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');

      if (!hash || hash === 'home') {
        setCurrentRoute('home');
      } else if (hash.startsWith('outreach-')) {
        const slug = hash.replace(/^outreach-/, '');
        const found = outreachStore.getByIdOrSlug(slug);
        if (found) {
          setSelectedOutreach(found);
          setCurrentRoute('detail');
        } else {
          setCurrentRoute('outreaches');
        }
      } else if (hash === 'outreaches') {
        setCurrentRoute('outreaches');
      } else if (hash === 'submit') {
        setCurrentRoute('submit');
      } else if (hash === 'about') {
        setCurrentRoute('about');
      } else if (hash === 'how-it-works') {
        setCurrentRoute('how-it-works');
      } else if (hash.startsWith('admin')) {
        setCurrentRoute('admin');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Safe navigation helper
  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (route === 'home') {
      window.location.hash = '';
    } else if (route === 'detail' && selectedOutreach) {
      window.location.hash = `outreach-${selectedOutreach.slug}`;
    } else {
      window.location.hash = route;
    }
  };

  const handleSelectOutreach = (outreach: Outreach) => {
    setSelectedOutreach(outreach);
    navigate('detail');
    window.location.hash = `outreach-${outreach.slug}`;
  };

  const handleHeroSearchSubmit = (filters: { service?: string; state?: string; dateRange?: string }) => {
    setActiveFilters({
      services: filters.service ? [filters.service] : [],
      state: filters.state || '',
      dateRange: (filters.dateRange as any) || 'all'
    });
    navigate('outreaches');
  };

  const handleFilterStateFromFooter = (stateName: string) => {
    setActiveFilters({
      state: stateName
    });
    navigate('outreaches');
  };

  const handleSubmissionSuccess = (id: string, slug: string) => {
    // Keep user on submit success view or navigate
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Global Navbar */}
      <Navbar currentRoute={currentRoute} navigate={navigate} />

      {/* Main View Router */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            outreaches={outreaches}
            onSelectOutreach={handleSelectOutreach}
            navigate={navigate}
            onSearchSubmit={handleHeroSearchSubmit}
          />
        )}

        {currentRoute === 'outreaches' && (
          <OutreachesListPage
            outreaches={outreaches}
            onSelectOutreach={handleSelectOutreach}
            initialFilters={activeFilters}
            navigate={navigate}
          />
        )}

        {currentRoute === 'detail' && selectedOutreach && (
          <OutreachDetailPage
            outreach={selectedOutreach}
            onBack={() => navigate('outreaches')}
            onOpenReport={(o) => setReportingOutreach(o)}
            navigate={navigate}
          />
        )}

        {currentRoute === 'submit' && (
          <SubmitPage
            onSuccess={handleSubmissionSuccess}
            navigate={navigate}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage navigate={navigate} />
        )}

        {currentRoute === 'how-it-works' && (
          <HowItWorksPage navigate={navigate} />
        )}

        {currentRoute === 'admin' && (
          <AdminDashboard
            navigate={navigate}
            onSelectOutreach={handleSelectOutreach}
          />
        )}
      </main>

      {/* Report Modal */}
      {reportingOutreach && (
        <ReportModal
          outreach={reportingOutreach}
          onClose={() => setReportingOutreach(null)}
        />
      )}

      {/* Global Footer */}
      <Footer
        navigate={navigate}
        onFilterState={handleFilterStateFromFooter}
      />
    </div>
  );
}
