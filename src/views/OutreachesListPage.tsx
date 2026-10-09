import React, { useState, useMemo } from 'react';
import { Outreach, OutreachFilters } from '../types';
import { OutreachCard } from '../components/OutreachCard';
import { NIGERIAN_STATES } from '../data/nigeriaLocations';
import { HEALTHCARE_SERVICES } from '../data/healthcareServices';
import { Search, MapPin, Calendar, Filter, X, SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react';

interface OutreachesListPageProps {
  outreaches: Outreach[];
  onSelectOutreach: (outreach: Outreach) => void;
  initialFilters?: Partial<OutreachFilters>;
  navigate: (route: string) => void;
}

export const OutreachesListPage: React.FC<OutreachesListPageProps> = ({
  outreaches,
  onSelectOutreach,
  initialFilters = {},
  navigate
}) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || '');
  const [selectedState, setSelectedState] = useState(initialFilters.state || '');
  const [selectedLga, setSelectedLga] = useState(initialFilters.lga || '');
  const [selectedServices, setSelectedServices] = useState<string[]>(initialFilters.services || []);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'tomorrow' | 'this_week' | 'this_month' | 'custom'>(
    initialFilters.dateRange || 'all'
  );
  const [customDate, setCustomDate] = useState(initialFilters.customDate || '');
  const [verificationStatus, setVerificationStatus] = useState<'verified_only' | 'all' | 'pending_only'>(
    initialFilters.verificationStatus || 'verified_only'
  );
  const [sortBy, setSortBy] = useState<'soonest' | 'recently_added' | 'recently_updated'>('soonest');

  // Mobile filter drawer open/close
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Available LGAs based on selected state
  const availableLgas = useMemo(() => {
    if (!selectedState) return [];
    const stateObj = NIGERIAN_STATES.find(
      (s) => s.name.toLowerCase() === selectedState.toLowerCase()
    );
    return stateObj ? stateObj.lgas : [];
  }, [selectedState]);

  // Handle state change (reset LGA)
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    setSelectedLga('');
  };

  // Service toggle helper
  const toggleService = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  // Clear all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedState('');
    setSelectedLga('');
    setSelectedServices([]);
    setDateRange('all');
    setCustomDate('');
    setVerificationStatus('verified_only');
    setSortBy('soonest');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedState !== '' ||
    selectedLga !== '' ||
    selectedServices.length > 0 ||
    dateRange !== 'all' ||
    verificationStatus !== 'verified_only';

  // Apply filtering and sorting
  const filteredOutreaches = useMemo(() => {
    return outreaches.filter((item) => {
      // Verification status filter
      if (verificationStatus === 'verified_only') {
        if (item.verification_status !== 'VERIFIED') return false;
      } else if (verificationStatus === 'pending_only') {
        if (item.verification_status !== 'PENDING') return false;
      }

      // Search query (title, organizer, venue, address, LGA, state, services)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inOrg = item.organizer_name.toLowerCase().includes(q);
        const inVenue = item.venue.toLowerCase().includes(q);
        const inAddress = item.address.toLowerCase().includes(q);
        const inLga = item.lga.toLowerCase().includes(q);
        const inState = item.state.toLowerCase().includes(q);
        const inServices = item.services.some((s) => s.toLowerCase().includes(q));

        if (!inTitle && !inOrg && !inVenue && !inAddress && !inLga && !inState && !inServices) {
          return false;
        }
      }

      // State filter
      if (selectedState && selectedState !== 'all') {
        if (item.state.toLowerCase() !== selectedState.toLowerCase()) {
          return false;
        }
      }

      // LGA filter
      if (selectedLga && selectedLga !== 'all') {
        if (item.lga.toLowerCase() !== selectedLga.toLowerCase()) {
          return false;
        }
      }

      // Services multi-select
      if (selectedServices.length > 0) {
        const hasMatchingService = selectedServices.some((targetService) =>
          item.services.some(
            (s) =>
              s.toLowerCase().includes(targetService.toLowerCase()) ||
              targetService.toLowerCase().includes(s.toLowerCase())
          )
        );
        if (!hasMatchingService) return false;
      }

      // Date Range Filter
      if (dateRange !== 'all') {
        const eventDate = new Date(item.start_datetime);
        const now = new Date();
        const todayStr = now.toISOString().substring(0, 10);
        const eventDateStr = item.start_datetime.substring(0, 10);

        if (dateRange === 'today') {
          if (eventDateStr !== todayStr) return false;
        } else if (dateRange === 'tomorrow') {
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().substring(0, 10);
          if (eventDateStr !== tomorrowStr) return false;
        } else if (dateRange === 'this_week') {
          const oneWeek = new Date(now);
          oneWeek.setDate(now.getDate() + 7);
          if (eventDate < now || eventDate > oneWeek) return false;
        } else if (dateRange === 'this_month') {
          const oneMonth = new Date(now);
          oneMonth.setMonth(now.getMonth() + 1);
          if (eventDate < now || eventDate > oneMonth) return false;
        } else if (dateRange === 'custom' && customDate) {
          if (eventDateStr !== customDate) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'recently_added') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'recently_updated') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      // default: soonest
      return new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime();
    });
  }, [
    outreaches,
    verificationStatus,
    searchQuery,
    selectedState,
    selectedLga,
    selectedServices,
    dateRange,
    customDate,
    sortBy
  ]);

  const FilterPanelContent = () => (
    <div className="space-y-6">
      {/* State Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
          <span>State</span>
          {selectedState && (
            <button
              onClick={() => handleStateChange('')}
              className="text-[11px] text-emerald-700 hover:underline font-normal"
            >
              Clear
            </button>
          )}
        </label>
        <select
          value={selectedState}
          onChange={(e) => handleStateChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
        >
          <option value="">All States</option>
          {NIGERIAN_STATES.map((s) => (
            <option key={s.code} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* LGA Filter (Dependent on State) */}
      {selectedState && (
        <div className="animate-in fade-in duration-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
            <span>LGA ({selectedState})</span>
            {selectedLga && (
              <button
                onClick={() => setSelectedLga('')}
                className="text-[11px] text-emerald-700 hover:underline font-normal"
              >
                Clear
              </button>
            )}
          </label>
          <select
            value={selectedLga}
            onChange={(e) => setSelectedLga(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            <option value="">All LGAs in {selectedState}</option>
            {availableLgas.map((lga) => (
              <option key={lga} value={lga}>
                {lga}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Date Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Date
        </label>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'Any Date' },
            { id: 'today', label: 'Today' },
            { id: 'tomorrow', label: 'Tomorrow' },
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' },
            { id: 'custom', label: 'Specific Date...' }
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                dateRange === item.id ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="dateRange"
                value={item.id}
                checked={dateRange === item.id}
                onChange={() => setDateRange(item.id as any)}
                className="text-emerald-700 focus:ring-emerald-600 h-3.5 w-3.5"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>

        {dateRange === 'custom' && (
          <div className="mt-2 pl-2">
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Verification Status Toggle */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Verification
        </label>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-50 text-slate-700">
            <input
              type="radio"
              name="verificationStatus"
              value="verified_only"
              checked={verificationStatus === 'verified_only'}
              onChange={() => setVerificationStatus('verified_only')}
              className="text-emerald-700 focus:ring-emerald-600 h-3.5 w-3.5"
            />
            <span className="font-semibold text-emerald-800">Verified only (Recommended)</span>
          </label>
          <label className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-50 text-slate-700">
            <input
              type="radio"
              name="verificationStatus"
              value="all"
              checked={verificationStatus === 'all'}
              onChange={() => setVerificationStatus('all')}
              className="text-emerald-700 focus:ring-emerald-600 h-3.5 w-3.5"
            />
            <span>All (Include pending & expired)</span>
          </label>
          <label className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-50 text-slate-700">
            <input
              type="radio"
              name="verificationStatus"
              value="pending_only"
              checked={verificationStatus === 'pending_only'}
              onChange={() => setVerificationStatus('pending_only')}
              className="text-emerald-700 focus:ring-emerald-600 h-3.5 w-3.5"
            />
            <span className="text-amber-800">Pending verification only</span>
          </label>
        </div>
      </div>

      {/* Healthcare Services Multi-Select */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
          <span>Healthcare Services</span>
          {selectedServices.length > 0 && (
            <button
              onClick={() => setSelectedServices([])}
              className="text-[11px] text-emerald-700 hover:underline font-normal"
            >
              Clear ({selectedServices.length})
            </button>
          )}
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {HEALTHCARE_SERVICES.map((s) => {
            const isChecked = selectedServices.includes(s.name);
            return (
              <label
                key={s.id}
                className={`flex items-center gap-2 p-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                  isChecked ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleService(s.name)}
                  className="rounded text-emerald-700 focus:ring-emerald-600 h-3.5 w-3.5"
                />
                <span className="truncate">{s.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Free Healthcare Outreaches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, discover and verify free medical clinics across Nigeria
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Drawer Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            )}
          </button>

          {/* Quick Submit CTA */}
          <button
            onClick={() => navigate('submit')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-2xs"
          >
            + Submit Outreach
          </button>
        </div>
      </div>

      {/* Search Bar & Sort Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, organizer, city, or service..."
            className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="soonest">Event Date (Soonest)</option>
              <option value="recently_added">Recently Added</option>
              <option value="recently_updated">Recently Updated</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs text-emerald-800 hover:text-emerald-950 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-medium">Active filters:</span>
          {selectedState && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              State: {selectedState}
              <button onClick={() => handleStateChange('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedLga && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              LGA: {selectedLga}
              <button onClick={() => setSelectedLga('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {dateRange !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              Date: {dateRange}
              <button onClick={() => setDateRange('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedServices.map((svc) => (
            <span key={svc} className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              {svc}
              <button onClick={() => toggleService(svc)}><X className="w-3 h-3" /></button>
            </span>
          ))}
          {verificationStatus !== 'verified_only' && (
            <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full border border-slate-300">
              Status: {verificationStatus}
              <button onClick={() => setVerificationStatus('verified_only')}><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* Main Grid with Sidebar Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block md:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs sticky top-24">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-700" />
                Filter Outreaches
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-emerald-700 hover:underline font-semibold"
                >
                  Clear all
                </button>
              )}
            </div>
            <FilterPanelContent />
          </div>
        </div>

        {/* Results Column */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span>
              Showing <strong>{filteredOutreaches.length}</strong> free healthcare outreach
              {filteredOutreaches.length === 1 ? '' : 'es'}
            </span>
            {verificationStatus === 'verified_only' && (
              <span className="text-emerald-800 font-medium">✓ Verified events only</span>
            )}
          </div>

          {filteredOutreaches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
              {filteredOutreaches.map((outreach) => (
                <OutreachCard
                  key={outreach.id}
                  outreach={outreach}
                  onSelect={onSelectOutreach}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No outreaches found.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                There are currently no free outreaches matching these filter criteria.
                Try widening your location, changing the healthcare service, or resetting filters.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800"
                >
                  Clear filters
                </button>
                <button
                  onClick={() => navigate('submit')}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                >
                  Submit an outreach you know
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end md:hidden">
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-5 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                  Filter Outreaches
                </h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterPanelContent />
            </div>

            <div className="pt-6 border-t border-slate-200 mt-6 flex gap-3">
              <button
                onClick={resetFilters}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs shadow-xs"
              >
                Apply ({filteredOutreaches.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
