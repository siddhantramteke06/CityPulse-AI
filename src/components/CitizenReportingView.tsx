import React, { useState, useRef } from 'react';
import { HazardReport, HazardCategory, VerificationStatus } from '../types';
import { PUNE_PLACES } from '../data/puneData';
import { 
  Megaphone, 
  MapPin, 
  Camera, 
  Mic, 
  MicOff, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon, 
  ThumbsUp, 
  Clock, 
  ShieldCheck, 
  X,
  FileText
} from 'lucide-react';

interface CitizenReportingViewProps {
  reports: HazardReport[];
  onSubmitReport: (report: HazardReport) => void;
  onUpvoteHazard: (hazardId: string) => void;
}

export const CitizenReportingView: React.FC<CitizenReportingViewProps> = ({
  reports,
  onSubmitReport,
  onUpvoteHazard
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HazardCategory>('road_hazard');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Karve Road near Nal Stop');
  const [coords, setCoords] = useState<[number, number]>([18.5085, 73.8315]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: { id: HazardCategory; label: string }[] = [
    { id: 'road_hazard', label: 'Pothole / Road Hazard' },
    { id: 'metro_work', label: 'Metro / Construction Work' },
    { id: 'poor_lighting', label: 'Broken / Dim Streetlights' },
    { id: 'waterlogging', label: 'Monsoon Waterlogging' },
    { id: 'crowding', label: 'Pedestrian Chokepoint' },
    { id: 'cleanliness', label: 'Sanitation / Debris' },
    { id: 'other', label: 'General Civic Issue' }
  ];

  const puneHotspots = [
    { label: 'Karve Road near Nal Stop', coords: [18.5085, 73.8315] },
    { label: 'Swargate Chowk Underpass', coords: [18.5015, 73.8582] },
    { label: 'Deccan Gymkhana Riverside Lane', coords: [18.5185, 73.8440] },
    { label: 'Alka Talkies Chowk Intersection', coords: [18.5126, 73.8475] },
    { label: 'Tulshibaug Main Bazaar Alley', coords: [18.5152, 73.8540] },
    { label: 'Pune Station South Exit Gate', coords: [18.5289, 73.8744] },
    { label: 'FC Road Goodluck Chowk', coords: [18.5246, 73.8407] },
    { label: 'Shivajinagar Bus Stand Frontage', coords: [18.5314, 73.8446] }
  ];

  // Voice Input Speech Recognition via Web Speech API
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      alert('Speech recognition is not supported in this browser engine. Please type your description.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech start error', e);
      setIsListening(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleIncidentPhotos = [
    { label: 'Pothole / Road damage', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=400&q=80' },
    { label: 'Waterlogging', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=400&q=80' },
    { label: 'Dim street', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=400&q=80' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please provide both a title and description for the report.');
      return;
    }

    const catObj = categories.find(c => c.id === category);

    const newReport: HazardReport = {
      id: `rep-${Date.now()}`,
      title: title.trim(),
      category,
      categoryLabel: catObj ? catObj.label : 'Civic Hazard',
      severity,
      description: description.trim(),
      locationName: locationName.trim(),
      coordinates: coords,
      timestamp: 'Just now',
      reportedBy: 'Citizen Contributor (You)',
      verificationStatus: 'Under Review',
      upvotes: 1,
      isDemoData: false,
      photoUrl: photoPreview || undefined,
      userVoted: true
    };

    onSubmitReport(newReport);
    setSubmitSuccess(true);

    // Reset Form
    setTitle('');
    setDescription('');
    setPhotoPreview(null);

    setTimeout(() => {
      setSubmitSuccess(false);
      setActiveTab('history');
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400">
              <Megaphone className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Citizen Reporting & Civic Voice
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Report Pune Urban Hazards & Disruptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Spot a pothole, unlit dark stretch, or metro barricade issue? File a verified report with photos, voice dictation, and pin location.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'submit'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Submit Report
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'history'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Report History ({reports.length})
          </button>
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {submitSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-700 rounded-2xl text-emerald-200 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-white">Report Successfully Submitted & Saved!</h4>
            <p className="text-xs text-emerald-300">
              Your report is now logged locally with status <strong>Under Review</strong> and added to the community map.
            </p>
          </div>
        </div>
      )}

      {/* VIEW: SUBMIT FORM */}
      {activeTab === 'submit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Category & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Report Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as HazardCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 text-slate-100 rounded-xl text-xs sm:text-sm focus:border-teal-400 focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Disruption Severity</label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['low', 'medium', 'high'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSeverity(s)}
                        className={`py-2 rounded-xl font-bold uppercase transition ${
                          severity === s
                            ? s === 'high' ? 'bg-red-600 text-white' : s === 'medium' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Incident Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Deep pothole causing skidding near Nal Stop flyover"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs sm:text-sm placeholder-slate-400 focus:border-teal-400 focus:outline-none"
                  required
                />
              </div>

              {/* Location Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    <span>Pune Location / Hotspot *</span>
                  </span>
                  <span className="text-[11px] text-teal-400">Preset Hotspots</span>
                </label>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {puneHotspots.map(h => (
                    <button
                      key={h.label}
                      type="button"
                      onClick={() => {
                        setLocationName(h.label);
                        setCoords(h.coords as [number, number]);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                        locationName === h.label
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Type specific road, landmark, or intersection in Pune"
                  value={locationName}
                  onChange={e => setLocationName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs sm:text-sm placeholder-slate-400 focus:border-teal-400 focus:outline-none"
                  required
                />
              </div>

              {/* Description with Voice Dictation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 block">Detailed Description *</label>
                  <button
                    type="button"
                    onClick={handleToggleVoiceInput}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                      isListening
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListening ? 'Listening (Speak now)...' : 'Voice Dictate'}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  placeholder="Describe the issue, time observed, exact obstacle, and caution for two-wheelers or pedestrians..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-3.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs sm:text-sm placeholder-slate-400 focus:border-teal-400 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Photo Upload & Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Attach Photo (Optional)</label>
                
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-2 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-teal-400" />
                    <span>Upload Local File</span>
                  </button>

                  <span className="text-xs text-slate-400">or pick sample demonstration evidence:</span>

                  {sampleIncidentPhotos.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoPreview(sample.url)}
                      className="text-[11px] px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 hover:text-white"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>

                {photoPreview && (
                  <div className="relative inline-block mt-2">
                    <img
                      src={photoPreview}
                      alt="Report preview"
                      className="w-40 h-28 object-cover rounded-xl border border-teal-500/40 shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2"
                >
                  <Megaphone className="w-4 h-4 text-slate-950" />
                  <span>Submit Citizen Report</span>
                </button>
              </div>

            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 text-xs text-slate-300">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Verification Policy</span>
              </h3>
              <p>
                Every report submitted by citizens enters a transparent verification pipeline:
              </p>
              <ul className="space-y-2 list-disc list-inside text-slate-400">
                <li><strong className="text-slate-200">Submitted:</strong> Stored locally and instantly visible to community.</li>
                <li><strong className="text-slate-200">Under Review:</strong> Community members can upvote and corroborate details.</li>
                <li><strong className="text-slate-200">Resolved:</strong> Marked complete once civic work or road resurfacing is finished.</li>
              </ul>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-400">
                ⚠️ Academic promptwar simulation: Reports are stored in browser localStorage. No live police emergency calls are dispatched.
              </div>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
              <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Quick Community Stats</h4>
              <div className="text-2xl font-black text-white">{reports.length} Reports Logged</div>
              <p className="text-xs text-slate-400">
                Contributing helps fellow students, tourists, and commuters avoid bottlenecks.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* VIEW: REPORT HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing all local community hazard reports ({reports.length})</span>
            <button
              onClick={() => setActiveTab('submit')}
              className="text-teal-400 font-bold hover:underline"
            >
              + Submit Another Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(report => (
              <div
                key={report.id}
                className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      report.severity === 'high' ? 'bg-red-950 text-red-400 border border-red-800' :
                      report.severity === 'medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {report.categoryLabel}
                    </span>
                    <span className="text-[11px] text-slate-400">{report.timestamp}</span>
                  </div>

                  <h3 className="font-bold text-base text-white mb-1">{report.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{report.description}</p>

                  {report.photoUrl && (
                    <img
                      src={report.photoUrl}
                      alt={report.title}
                      className="w-full h-36 object-cover rounded-xl border border-slate-800 mb-3"
                    />
                  )}

                  <div className="text-xs text-teal-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{report.locationName}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                      report.verificationStatus === 'Verified' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      report.verificationStatus === 'Resolved' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {report.verificationStatus}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
                      By {report.reportedBy}
                    </span>
                  </div>

                  <button
                    onClick={() => onUpvoteHazard(report.id)}
                    className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                      report.userVoted
                        ? 'bg-teal-600 text-white border-teal-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{report.upvotes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
