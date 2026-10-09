import React, { useState } from 'react';
import { Outreach } from '../types';
import { OutreachCard } from '../components/OutreachCard';
import { NIGERIAN_STATES, POPULAR_LOCATIONS } from '../data/nigeriaLocations';
import { HEALTHCARE_SERVICES } from '../data/healthcareServices';
import { Search, MapPin, Calendar, PlusCircle, ArrowRight, CheckCircle2, ShieldCheck, HeartHandshake, Eye, Smile, Stethoscope, Baby, Syringe, Activity, Sparkles, Filter } from 'lucide-react';

interface HomePageProps {
  outreaches: Outreach[];
  onSelectOutreach: (outreach: Outreach) => void;
  navigate: (route: string) => void;
  onSearchSubmit: (filters: { service?: string; state?: string; dateRange?: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  outreaches,
  onSelectOutreach,
  navigate,
  onSearchSubmit
}) => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');

  const now = new Date();
  const todayStr = now.toISOString().substring(0, 10);

  // Happening Today: verified items with today's date
  const happeningToday = outreaches.filter(
    (o) => o.verification_status === 'VERIFIED' && o.start_datetime.substring(0, 10) === todayStr
  );

  // Coming Soon: upcoming verified items after today
  const comingSoon = outreaches
    .filter((o) => o.verification_status === 'VERIFIED' && o.start_datetime.substring(0, 10) > todayStr)
    .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
    .slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit({
      service: selectedService || undefined,
      state: selectedState || undefined,
      dateRange: selectedDateFilter !== 'all' ? selectedDateFilter : undefined
    });
    navigate('outreaches');
  };

  const handleServiceCardClick = (serviceName: string) => {
    onSearchSubmit({ service: serviceName });
    navigate('outreaches');
  };

  const handleStateCardClick = (stateName: string) => {
    onSearchSubmit({ state: stateName });
    navigate('outreaches');
  };

  // Map icons for service cards
  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'general_medical':
        return <Stethoscope className="w-5 h-5 text-emerald-700" />;
      case 'dental':
        return <Smile className="w-5 h-5 text-emerald-700" />;
      case 'eye_care':
        return <Eye className="w-5 h-5 text-emerald-700" />;
      case 'maternal_health':
        return <HeartHandshake className="w-5 h-5 text-emerald-700" />;
      case 'child_health':
        return <Baby className="w-5 h-5 text-emerald-700" />;
      case 'vaccination':
        return <Syringe className="w-5 h-5 text-emerald-700" />;
      default:
        return <Activity className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle patterned backdrop */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-100 text-xs sm:text-sm font-medium shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Community-Driven Healthcare Discovery in Nigeria</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Find free healthcare <br className="hidden sm:inline" />
            <span className="text-emerald-300">near you.</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-emerald-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover verified medical outreaches and free healthcare services happening across Nigeria before they take place.
          </p>

          {/* PRIMARY SEARCH INTERFACE */}
          <div className="pt-4 max-w-4xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-emerald-700/40 text-slate-900 grid grid-cols-1 sm:grid-cols-12 gap-3"
            >
              {/* Service Selection */}
              <div className="sm:col-span-4 relative text-left">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 pl-1">
                  Healthcare Service
                </label>
                <div className="relative">
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none appearance-none pr-8 cursor-pointer"
                    aria-label="What service are you looking for?"
                  >
                    <option value="">All Services (Any Care)</option>
                    {HEALTHCARE_SERVICES.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <Filter className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* State Selection */}
              <div className="sm:col-span-4 relative text-left">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 pl-1">
                  Nigerian State
                </label>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none appearance-none pr-8 cursor-pointer"
                    aria-label="Select state"
                  >
                    <option value="">All 36 States + FCT</option>
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state.code} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Date Filter */}
              <div className="sm:col-span-2 relative text-left">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 pl-1">
                  When
                </label>
                <div className="relative">
                  <select
                    value={selectedDateFilter}
                    onChange={(e) => setSelectedDateFilter(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none appearance-none pr-8 cursor-pointer"
                    aria-label="Select date"
                  >
                    <option value="all">Any Date</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                  </select>
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full h-[42px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Care</span>
                </button>
              </div>
            </form>

            {/* Quick Popular Searches */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-100/90">
              <span className="text-emerald-200/70">Popular searches:</span>
              {['Eye Care', 'Dental', 'Malaria', 'Lagos', 'Abuja', 'Port Harcourt'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    if (['Lagos', 'Abuja', 'Port Harcourt'].includes(tag)) {
                      onSearchSubmit({ state: tag === 'Abuja' ? 'FCT (Abuja)' : tag === 'Port Harcourt' ? 'Rivers' : tag });
                    } else {
                      onSearchSubmit({ service: tag });
                    }
                    navigate('outreaches');
                  }}
                  className="bg-emerald-800/60 hover:bg-emerald-700/80 px-2.5 py-1 rounded-full text-xs text-emerald-100 border border-emerald-600/40 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* HAPPENING TODAY SECTION */}
        <section aria-labelledby="today-heading">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 animate-ping" />
              <h2 id="today-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Happening Today
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {happeningToday.length} outreach{happeningToday.length === 1 ? '' : 'es'} verified for today
            </span>
          </div>

          {happeningToday.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {happeningToday.map((outreach) => (
                <OutreachCard
                  key={outreach.id}
                  outreach={outreach}
                  onSelect={onSelectOutreach}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-3">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-slate-800 font-semibold text-base">
                No verified outreaches are happening today.
              </p>
              <p className="text-slate-600 text-sm">
                Check our upcoming verified events below or search by your state.
              </p>
              <button
                onClick={() => navigate('outreaches')}
                className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-4"
              >
                Browse all upcoming events →
              </button>
            </div>
          )}
        </section>

        {/* COMING SOON SECTION */}
        <section aria-labelledby="coming-soon-heading">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2 border-b border-slate-200">
            <div>
              <h2 id="coming-soon-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Coming Soon
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Verified free healthcare outreaches scheduled across Nigeria
              </p>
            </div>
            <button
              onClick={() => navigate('outreaches')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-900 group"
            >
              <span>View all {outreaches.filter(o => o.verification_status === 'VERIFIED').length} events</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoon.map((outreach) => (
              <OutreachCard
                key={outreach.id}
                outreach={outreach}
                onSelect={onSelectOutreach}
              />
            ))}
          </div>
        </section>

        {/* FIND CARE BY SERVICE */}
        <section aria-labelledby="services-heading">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 id="services-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
              Find Care by Service
            </h2>
            <p className="text-sm text-slate-600">
              Explore outreaches categorized by specific free medical interventions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              { id: 'dental', name: 'Dental Care', count: 'Clinic & Extractions' },
              { id: 'eye_care', name: 'Eye Care', count: 'Exams & Glasses' },
              { id: 'general_medical', name: 'General Medical', count: 'Doctor Checkups' },
              { id: 'maternal_health', name: 'Maternal Health', count: 'Antenatal & Scans' },
              { id: 'child_health', name: 'Child Health', count: 'Pediatric Care' },
              { id: 'malaria', name: 'Malaria & Screening', count: 'Rapid RDT & ACT' },
              { id: 'blood_pressure', name: 'Hypertension', count: 'BP Checks & Meds' },
              { id: 'blood_glucose', name: 'Diabetes Testing', count: 'Blood Sugar' },
              { id: 'vaccination', name: 'Vaccination', count: 'Immunizations' },
              { id: 'cancer_screening', name: 'Cancer Screening', count: 'Cervical & Breast' },
              { id: 'medication', name: 'Free Medication', count: 'Dispensary' },
              { id: 'mental_health', name: 'Mental Health', count: 'Counseling' },
            ].map((svc) => (
              <button
                key={svc.id}
                onClick={() => handleServiceCardClick(svc.name)}
                className="flex flex-col items-center justify-center text-center p-4 rounded-xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-md transition-all group cursor-pointer focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 flex items-center justify-center mb-2.5 transition-colors group-hover:text-white">
                  {getServiceIcon(svc.id)}
                </div>
                <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {svc.name}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  {svc.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* FIND CARE BY LOCATION (STATES) */}
        <section aria-labelledby="location-heading" className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 id="location-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Find Care by Location
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Browse free health outreaches by state across Nigeria
              </p>
            </div>
            <button
              onClick={() => navigate('outreaches')}
              className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 underline self-start sm:self-auto"
            >
              See all 36 states + FCT
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {POPULAR_LOCATIONS.map((state) => {
              const countInState = outreaches.filter(
                (o) => o.verification_status === 'VERIFIED' && o.state.toLowerCase() === state.toLowerCase()
              ).length;

              return (
                <button
                  key={state}
                  onClick={() => handleStateCardClick(state)}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-600 hover:shadow-xs transition-all text-left"
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="font-semibold text-xs sm:text-sm text-slate-800 truncate">
                      {state}
                    </span>
                  </div>
                  {countInState > 0 && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full ml-1">
                      {countInState}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section aria-labelledby="how-heading" className="py-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Simple 3-Step Process
            </span>
            <h2 id="how-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              How CareReach Nigeria Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Bridging the gap between free medical missions and the community members who need them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-lg mb-4 shadow-xs">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Discover
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Find free healthcare services near you. Filter by specific medical services, state, LGA, and upcoming dates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-lg mb-4 shadow-xs">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                Verify
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We review submitted outreach information against organizers’ evidence and official flyers before giving the <strong>✓ VERIFIED</strong> badge.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-lg mb-4 shadow-xs">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Attend
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Follow provided directions, view eligibility instructions, contact organizers if needed, and arrive early to receive care.
              </p>
            </div>
          </div>
        </section>

        {/* COMMUNITY CONTRIBUTION CTA */}
        <section className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/80 text-emerald-100 border border-emerald-500/50">
              <PlusCircle className="w-3.5 h-3.5 text-emerald-300" />
              Community Sharing
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
              Know about a free medical outreach?
            </h2>

            <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
              Help someone find care by sharing it with the community. Submit the flyer and details, and our verification team will review it.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('submit')}
                className="px-6 py-3.5 rounded-xl bg-white text-emerald-950 font-bold hover:bg-emerald-50 shadow-md transition-all active:scale-98 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <PlusCircle className="w-5 h-5 text-emerald-700" />
                Submit an Outreach
              </button>
              <button
                onClick={() => navigate('how-it-works')}
                className="text-xs sm:text-sm text-emerald-200 hover:text-white underline underline-offset-4 font-semibold"
              >
                Learn about submission guidelines →
              </button>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
            <CheckCircle2 className="w-96 h-96 text-white" />
          </div>
        </section>
      </div>
    </div>
  );
};
