import React, { useState, useEffect } from 'react';
import { NIGERIAN_STATES } from '../data/nigeriaLocations';
import { HEALTHCARE_SERVICES } from '../data/healthcareServices';
import { outreachStore } from '../services/outreachStore';
import { Outreach } from '../types';
import { 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Image as ImageIcon, 
  X, 
  Info, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface SubmitPageProps {
  onSuccess: (outreachId: string, slug: string) => void;
  navigate: (route: string) => void;
}

export const SubmitPage: React.FC<SubmitPageProps> = ({ onSuccess, navigate }) => {
  // Form fields
  const [title, setTitle] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [description, setDescription] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('16:00');
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [organizerUrl, setOrganizerUrl] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [whatToBring, setWhatToBring] = useState('');
  
  // Contributor details
  const [contributorName, setContributorName] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [contributorPhone, setContributorPhone] = useState('');

  // Evidence / Flyer Upload
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceName, setEvidenceName] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  // Checkbox confirmation
  const [confirmedAccuracy, setConfirmedAccuracy] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ id: string; slug: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Duplicate detection state
  const [duplicateMatches, setDuplicateMatches] = useState<Outreach[]>([]);

  // Derived LGAs
  const stateObj = NIGERIAN_STATES.find((s) => s.name.toLowerCase() === state.toLowerCase());
  const availableLgas = stateObj ? stateObj.lgas : [];

  // Toggle healthcare service
  const handleToggleService = (serviceName: string) => {
    if (services.includes(serviceName)) {
      setServices(services.filter((s) => s !== serviceName));
    } else {
      setServices([...services, serviceName]);
    }
  };

  // Duplicate Detection Trigger
  useEffect(() => {
    if (title.length > 4 && organizerName.length > 3 && state) {
      const checkResult = outreachStore.checkPotentialDuplicates({
        title,
        organizer_name: organizerName,
        state,
        start_datetime: date || new Date().toISOString()
      });
      setDuplicateMatches(checkResult.matches);
    } else {
      setDuplicateMatches([]);
    }
  }, [title, organizerName, state, date]);

  // Handle Flyer File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File exceeds 5MB limit. Please select a smaller flyer image.');
      return;
    }

    setUploadLoading(true);
    setEvidenceName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setEvidenceUrl(reader.result as string);
      setUploadLoading(false);
    };
    reader.onerror = () => {
      alert('Failed to read file. Please try another image.');
      setUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!title.trim()) return setErrorMsg('Outreach title is required.');
    if (!organizerName.trim()) return setErrorMsg('Organizer name is required.');
    if (!description.trim()) return setErrorMsg('Event description is required.');
    if (services.length === 0) return setErrorMsg('Select at least one healthcare service.');
    if (!date) return setErrorMsg('Event date is required.');
    if (!startTime) return setErrorMsg('Event start time is required.');
    if (!state) return setErrorMsg('Nigerian state is required.');
    if (!lga) return setErrorMsg('Local Government Area (LGA) is required.');
    if (!venue.trim()) return setErrorMsg('Venue name is required.');
    if (!address.trim()) return setErrorMsg('Full address is required.');
    if (!contributorName.trim()) return setErrorMsg('Your name as contributor is required.');
    if (!contributorEmail.trim()) return setErrorMsg('Your email address is required.');
    if (!confirmedAccuracy) return setErrorMsg('Please confirm that the information is accurate to the best of your knowledge.');

    setSubmitting(true);

    try {
      const result = outreachStore.submitOutreach({
        title,
        organizer_name: organizerName,
        description,
        services,
        date,
        start_time: startTime,
        end_time: endTime || undefined,
        state,
        lga,
        venue,
        address,
        contact_phone: contactPhone || undefined,
        contact_email: contactEmail || undefined,
        organizer_url: organizerUrl || undefined,
        source_url: sourceUrl || undefined,
        eligibility: eligibility || undefined,
        what_to_bring: whatToBring || undefined,
        evidence_url: evidenceUrl || undefined,
        evidence_name: evidenceName || undefined,
        contributor_name: contributorName,
        contributor_email: contributorEmail,
        contributor_phone: contributorPhone || undefined
      });

      setSubmittedData(result);
      onSuccess(result.id, result.slug);
    } catch {
      setErrorMsg('An error occurred submitting the outreach. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW (Spec Item 13)
  if (submittedData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Submission received.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            Your outreach has been sent for review. It will not appear as verified until our moderation team confirms the information.
          </p>
        </div>

        {/* Reference ID Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto space-y-2 text-left">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-500 block">
            Submission Reference ID
          </span>
          <p className="font-mono text-base font-bold text-emerald-800 select-all">
            {submittedData.id}
          </p>
          <p className="text-xs text-slate-500 pt-1 border-t border-slate-200">
            Keep this ID for your records. A moderator will review the flyer and contact the organizer before public publication.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              setSubmittedData(null);
              setTitle('');
              setDescription('');
              setOrganizerName('');
              setServices([]);
              setVenue('');
              setAddress('');
              setEvidenceUrl('');
              setConfirmedAccuracy(false);
            }}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50"
          >
            Submit another outreach
          </button>

          <button
            onClick={() => navigate('outreaches')}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-800 shadow-xs"
          >
            Browse all outreaches
          </button>

          <button
            onClick={() => navigate('admin')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-emerald-300 font-semibold text-xs hover:bg-slate-800"
          >
            Open Moderator Queue →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Share a free medical outreach
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Know about an upcoming free healthcare outreach? Submit the details and our team will review them before publication.
        </p>
      </div>

      {/* Trust Callout */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-900">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p>
          <strong>Moderation Guarantee:</strong> Contributor submissions do not automatically become verified. Our volunteers verify the date, location, and organizer authenticity before publishing to the public feed.
        </p>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 rounded-xl p-4 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* DUPLICATE WARNING ALERT (Spec Item 19) */}
      {duplicateMatches.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>A similar outreach may already exist. Please check these results before submitting:</span>
          </div>
          <div className="space-y-1.5 pl-6">
            {duplicateMatches.map((match) => (
              <div key={match.id} className="text-slate-800 bg-white/80 p-2 rounded border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold">{match.title}</span> — {match.venue}, {match.state} ({match.start_datetime.substring(0, 10)})
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 ml-2">
                  {match.verification_status}
                </span>
              </div>
            ))}
          </div>
          <p className="text-amber-800 text-[11px] pl-6 pt-1">
            If your outreach is for a different date or organizer, you may proceed with submitting below.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {/* SECTION 1: EVENT DETAILS */}
        <div className="space-y-5">
          <h2 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100">
            1. Outreach Information
          </h2>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Outreach Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Free Eye Screening & Cataract Surgery Camp"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          {/* Organizer */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Organizer Name / NGO / Hospital / Church <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              placeholder="e.g. Rotary Club of Ikeja & Lagos State Ministry of Health"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description <span className="text-rose-600">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Provide full details of the outreach: who is conducting it, free treatments provided, schedule, and guidelines..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          {/* Healthcare Services Multi-Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Healthcare Services Offered <span className="text-rose-600">*</span></span>
              <span className="text-[11px] text-slate-500 font-normal">Select all that apply</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-56 overflow-y-auto">
              {HEALTHCARE_SERVICES.map((s) => {
                const checked = services.includes(s.name);
                return (
                  <label
                    key={s.id}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                      checked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleService(s.name)}
                      className="rounded text-emerald-700 focus:ring-emerald-600 h-3.5 w-3.5"
                    />
                    <span className="truncate">{s.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 2: DATE & TIME */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100">
            2. Date & Timing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Event Date <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Start Time <span className="text-rose-600">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                End Time (Optional)
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: LOCATION */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100">
            3. Location Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                State <span className="text-rose-600">*</span>
              </label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setLga('');
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              >
                <option value="">Select Nigerian State</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Local Government Area (LGA) <span className="text-rose-600">*</span>
              </label>
              <select
                value={lga}
                onChange={(e) => setLga(e.target.value)}
                disabled={!state}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none disabled:opacity-50"
                required
              >
                <option value="">{state ? 'Select LGA' : 'Select state first'}</option>
                {availableLgas.map((lg) => (
                  <option key={lg} value={lg}>
                    {lg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Venue Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Ikeja Primary Health Care Center Pavilion"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Physical Address <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 15 Community Road, off Awolowo Way, Ikeja"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* SECTION 4: ELIGIBILITY & WHAT TO BRING */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100">
            4. Eligibility & Guidelines (Optional)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Eligibility (e.g. Open to everyone, children under 12, pregnant women)
              </label>
              <input
                type="text"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                placeholder="e.g. Open to all residents, elderly priority"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                What to Bring
              </label>
              <input
                type="text"
                value={whatToBring}
                onChange={(e) => setWhatToBring(e.target.value)}
                placeholder="e.g. Existing eye glasses or hospital card"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: ORGANIZER CONTACTS & EVIDENCE FLYER */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100">
            5. Evidence & Organizer Verification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Organizer Phone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Organizer Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@organizer.org"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Organizer Website / Social
              </label>
              <input
                type="url"
                value={organizerUrl}
                onChange={(e) => setOrganizerUrl(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Source URL — Where did you get this information? <span className="text-emerald-700">(Recommended)</span>
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://instagram.com/p/... or WhatsApp group link or website announcement"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* FLYER / EVIDENCE UPLOAD (Spec Item 13) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Upload Flyer or Evidence Document (Image)
            </label>

            {evidenceUrl ? (
              <div className="relative rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 flex items-center gap-4">
                <img
                  src={evidenceUrl}
                  alt="Flyer Evidence Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                />
                <div className="flex-1 truncate">
                  <span className="font-semibold text-xs sm:text-sm text-slate-900 block truncate">
                    {evidenceName || 'Uploaded Flyer'}
                  </span>
                  <span className="text-xs text-emerald-700">✓ Ready for moderator inspection</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEvidenceUrl('');
                    setEvidenceName('');
                  }}
                  className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200"
                  title="Remove flyer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 text-center bg-slate-50 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  Click to select outreach flyer or drag and drop
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  JPG, PNG, WebP up to 5MB. This flyer is shown side-by-side to moderators during verification.
                </p>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="mt-3 block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* SECTION 6: CONTRIBUTOR DETAILS */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100">
            6. Your Contributor Details
          </h2>
          <p className="text-xs text-slate-500">
            Your personal contact details are kept strictly private and never exposed on the public page.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Your Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                placeholder="e.g. Aminat Olufemi"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Your Email Address <span className="text-rose-600">*</span>
              </label>
              <input
                type="email"
                value={contributorEmail}
                onChange={(e) => setContributorEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Your Phone Number
              </label>
              <input
                type="tel"
                value={contributorPhone}
                onChange={(e) => setContributorPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* CONFIRMATION CHECKBOX (Spec Item 13) */}
        <div className="pt-4 border-t border-slate-100">
          <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmedAccuracy}
              onChange={(e) => setConfirmedAccuracy(e.target.checked)}
              className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600 h-4 w-4"
              required
            />
            <span className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
              I confirm that this information is accurate to the best of my knowledge and that this is a genuine free healthcare outreach.
            </span>
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || !confirmedAccuracy}
            className="w-full py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <span>Submitting for verification...</span>
            ) : (
              <>
                <span>Submit for verification</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
