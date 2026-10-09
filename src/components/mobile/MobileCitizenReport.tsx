import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Mic, 
  Camera, 
  Plus, 
  CheckCircle2, 
  X,
  Navigation,
  AlertTriangle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { HazardReport, HazardCategory } from '../../types';

interface MobileCitizenReportProps {
  onBack: () => void;
  onSubmitReport: (report: HazardReport) => void;
}

export const MobileCitizenReport: React.FC<MobileCitizenReportProps> = ({
  onBack,
  onSubmitReport
}) => {
  const [selectedCat, setSelectedCat] = useState<HazardCategory>('road_hazard');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Karve Road near Nal Stop');
  const [coordinates, setCoordinates] = useState<[number, number]>([18.5085, 73.8315]);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [photoPreview, setPhotoPreview] = useState<string | null>('https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=300&q=80');
  const [isListening, setIsListening] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'road_hazard', label: 'Road Work / Pothole', icon: '🚧', color: 'text-amber-600 bg-amber-50' },
    { id: 'accident', label: 'Accident', icon: '🚨', color: 'text-red-600 bg-red-50' },
    { id: 'waterlogging', label: 'Flooding / Water', icon: '💧', color: 'text-blue-600 bg-blue-50' },
    { id: 'poor_lighting', label: 'Broken Streetlights', icon: '💡', color: 'text-yellow-600 bg-yellow-50' },
    { id: 'cleanliness', label: 'Sanitation / Waste', icon: '🧹', color: 'text-emerald-600 bg-emerald-50' },
    { id: 'other', label: 'Other Hazard', icon: '⚠️', color: 'text-slate-600 bg-slate-50' }
  ];

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice dictation is available in Chrome, Edge, and Android WebView.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setDescription(prev => prev ? `${prev} ${text}` : text);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your device browser.');
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lng = Number(pos.coords.longitude.toFixed(4));
        setCoordinates([lat, lng]);
        setLocationName(`Current GPS (${lat}, ${lng}) - Pune Central`);
        setIsDetectingGps(false);
      },
      () => {
        setIsDetectingGps(false);
        setLocationName('Shivajinagar / JM Road junction');
      },
      { timeout: 6000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please describe the issue.');
      return;
    }

    const catObj = categories.find(c => c.id === selectedCat);

    const newReport: HazardReport = {
      id: `rep-${Date.now()}`,
      title: `${catObj?.label || 'Hazard'} Report`,
      category: selectedCat,
      categoryLabel: catObj?.label || 'Hazard',
      severity: severity,
      description: description.trim(),
      locationName: locationName.trim(),
      coordinates: coordinates,
      timestamp: 'Just now',
      reportedBy: 'You (Citizen Volunteer)',
      verificationStatus: 'Under Review',
      upvotes: 1,
      isDemoData: false,
      photoUrl: photoPreview || undefined,
      userVoted: true
    };

    onSubmitReport(newReport);
    setSubmitted(true);
    setTimeout(() => {
      onBack();
    }, 1200);
  };

  return (
    <div className="w-full h-full min-h-[720px] bg-[#F8FAFC] pb-24 text-slate-800">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded-full text-slate-700 hover:bg-slate-100 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">Report an Issue</h2>
            <p className="text-[10px] text-slate-400 font-medium">Keep Pune commuters safe</p>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>

      {submitted ? (
        <div className="p-10 text-center space-y-3 animate-fade-in my-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-black text-lg text-slate-900">Report Published!</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Your hazard alert is now live on the Pune safety map and visible to thousands of travelers.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          
          {/* Issue Category 6-Card Grid */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
              Hazard Category *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(cat => {
                const isSelected = selectedCat === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id as any)}
                    className={`bg-white rounded-2xl p-2.5 border text-center cursor-pointer active:scale-95 transition flex flex-col items-center justify-center gap-1 shadow-sm ${
                      isSelected ? 'border-teal-700 ring-2 ring-teal-700/20 bg-teal-50/20' : 'border-slate-100'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${cat.color}`}>
                      {cat.icon}
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-800 leading-tight">{cat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgency / Severity Level */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
              Urgency Severity Level
            </label>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setSeverity('low')}
                className={`py-2 rounded-xl border transition ${
                  severity === 'low' ? 'bg-emerald-50 text-emerald-800 border-emerald-400' : 'border-slate-200 text-slate-500'
                }`}
              >
                🟢 Low
              </button>
              <button
                type="button"
                onClick={() => setSeverity('medium')}
                className={`py-2 rounded-xl border transition ${
                  severity === 'medium' ? 'bg-amber-50 text-amber-800 border-amber-400' : 'border-slate-200 text-slate-500'
                }`}
              >
                🟡 Medium
              </button>
              <button
                type="button"
                onClick={() => setSeverity('high')}
                className={`py-2 rounded-xl border transition ${
                  severity === 'high' ? 'bg-red-50 text-red-800 border-red-400' : 'border-slate-200 text-slate-500'
                }`}
              >
                🔴 Urgent
              </button>
            </div>
          </div>

          {/* Description with Voice Dictation */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                Detailed Description *
              </label>
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-lg border transition ${
                  isListening 
                    ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse' 
                    : 'bg-teal-50 text-teal-700 border-teal-200'
                }`}
              >
                <Mic className="w-3 h-3" />
                <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
              </button>
            </div>
            
            <textarea
              rows={3}
              placeholder="Describe the condition, lane, landmarks, or traffic hindrance..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-teal-700 focus:bg-white focus:outline-none"
              required
            />
          </div>

          {/* Add Photos */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm space-y-2">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
              Photo Evidence <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            
            <input
              type="file"
              accept="image/*"
              id="mobile-photo-upload"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setPhotoPreview(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />

            <div className="flex items-center gap-2.5">
              {photoPreview && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={photoPreview} alt="Upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-1 right-1 p-0.5 bg-black/70 text-white rounded-full hover:bg-black"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <label
                htmlFor="mobile-photo-upload"
                className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-teal-700 hover:text-teal-700 transition cursor-pointer"
                title="Pick photo from camera or gallery"
              >
                <Camera className="w-4 h-4" />
                <span className="text-[9px] font-bold mt-0.5">Camera</span>
              </label>
            </div>
          </div>

          {/* Location & GPS Detection */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                Location Name *
              </label>
              <button
                type="button"
                onClick={handleDetectGps}
                className="flex items-center gap-1 text-[10px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200"
              >
                <Navigation className={`w-3 h-3 ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingGps ? 'Locating...' : 'Use My GPS'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <MapPin className="w-4 h-4 text-teal-700 flex-shrink-0" />
              <input
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 font-bold focus:outline-none"
                placeholder="e.g. FC Road near Goodluck Chowk"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-teal-900/15 transition mt-2 flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Citizen Report</span>
          </button>

        </form>
      )}

    </div>
  );
};
