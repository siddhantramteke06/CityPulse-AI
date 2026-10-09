import React, { useState } from 'react';
import { Place } from '../../types';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  Navigation,
  Train,
  Volume2,
  Play,
  Pause,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { PUNE_PLACES } from '../../data/puneData';

interface MobilePlaceDetailProps {
  place: Place;
  onBack: () => void;
  isFavourite: boolean;
  onToggleFavourite: (placeId: string) => void;
  onSelectRelatedPlace?: (place: Place) => void;
}

export const MobilePlaceDetail: React.FC<MobilePlaceDetailProps> = ({
  place,
  onBack,
  isFavourite,
  onToggleFavourite,
  onSelectRelatedPlace
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Find 2 nearby places from the same dataset
  const nearbyPlaces = PUNE_PLACES
    .filter(p => p.id !== place.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${place.name} | CityPulse AI Pune`,
        text: `Check out ${place.name} in Pune on CityPulse AI: ${place.tagline}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${place.name} - ${place.tagline} (Pune Travel Guide via CityPulse AI)`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[720px] bg-white flex flex-col justify-between text-slate-800">
      
      {/* Top Floating App Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-slate-900/60 backdrop-blur-md text-white hover:bg-slate-900/80 active:scale-95 transition shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavourite(place.id)}
            className={`p-2 rounded-full backdrop-blur-md transition shadow-lg ${
              isFavourite ? 'bg-red-500 text-white' : 'bg-slate-900/60 text-white'
            }`}
            title="Save to favourites"
          >
            <Heart className={`w-4 h-4 ${isFavourite ? 'fill-current' : ''}`} />
          </button>

          <button 
            onClick={handleShare}
            className="p-2 rounded-full bg-slate-900/60 backdrop-blur-md text-white shadow-lg active:scale-95 transition"
            title="Share place"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Share Toast */}
      {copiedShare && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl">
          Link copied to clipboard!
        </div>
      )}

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 pb-24">
        
        {/* Hero Photo with Gradient Overlay */}
        <div className="relative w-full h-72 overflow-hidden">
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
          
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              {place.categoryLabel}
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1 leading-tight">{place.name}</h1>
            {place.localName && (
              <p className="text-xs text-teal-200 font-semibold">{place.localName}</p>
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5 space-y-4">
          
          {/* Rating, Area & Reviews Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 font-black text-slate-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{place.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-400 font-medium">({(place.reviewCount / 1000).toFixed(1)}k verified reviews)</span>
            </div>

            <div className="flex items-center gap-1 text-slate-600 font-bold">
              <MapPin className="w-3.5 h-3.5 text-teal-700" />
              <span>{place.area}</span>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xs font-bold text-teal-800 bg-teal-50/70 p-3 rounded-xl border border-teal-200/60 leading-relaxed">
            "{place.tagline}"
          </p>

          {/* Description */}
          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">About This Landmark</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {place.description}
            </p>
          </div>

          {/* 4 Metric Badges Grid */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-left">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Indicative Cost</span>
              <span className="text-xs font-black text-teal-800 mt-0.5 block">
                {place.entryFeeINR === 0 ? 'Free Entry' : `₹${place.entryFeeINR} Entry Fee`}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">~₹{place.indicativeCostPerPerson} with snacks</span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-left">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Ideal Visit Time</span>
              <span className="text-xs font-black text-slate-800 mt-0.5 block">
                {place.avgDurationMinutes} mins
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{place.bestTimeToVisit}</span>
            </div>
          </div>

          {/* Interactive Audio Guide & Lore Snippet */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-teal-950 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-teal-300" />
                <span className="text-xs font-black text-white">Audio Guide Preview (Pune Lore)</span>
              </div>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="flex items-center gap-1 px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-[10px] font-black transition active:scale-95"
              >
                {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{isPlayingAudio ? 'Pause' : 'Play 60s'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              {isPlayingAudio ? (
                <span className="text-teal-200 animate-pulse font-medium">
                  "Playing narrator track: Exploring the Peshwa Maratha heritage of {place.name} in 18th-century Pune..."
                </span>
              ) : (
                "Tap Play to listen to the curated architectural backstory and folklore of this landmark."
              )}
            </p>
          </div>

          {/* Highlights Checklist */}
          {place.highlights && place.highlights.length > 0 && (
            <div className="pt-1 space-y-2">
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Top Highlights to Spot</h3>
              <div className="grid grid-cols-1 gap-1.5">
                {place.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
                    <span className="font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insider Local Tips */}
          {place.tips && place.tips.length > 0 && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Insider Local Tips</span>
              </div>
              <ul className="space-y-1 text-xs text-amber-950">
                {place.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transit & Commute Info */}
          {place.transitAccess && (
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs">
                <Train className="w-3.5 h-3.5 text-teal-700" />
                <span>How to Reach via Public Transit</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                {place.transitAccess.metroStation && (
                  <p><strong>Metro:</strong> {place.transitAccess.metroStation} ({place.transitAccess.metroDistanceKm} km)</p>
                )}
                {place.transitAccess.busStop && (
                  <p><strong>PMPML Bus:</strong> {place.transitAccess.busStop}</p>
                )}
                <p><strong>Auto Rickshaws:</strong> {place.transitAccess.autoAvailability} availability around entry gate</p>
              </div>
            </div>
          )}

          {/* Nearby Places within 2 km */}
          <div className="pt-2 space-y-2">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Combine Your Trip With Nearby Spots
            </h3>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {nearbyPlaces.map(np => (
                <div
                  key={np.id}
                  onClick={() => {
                    if (onSelectRelatedPlace) onSelectRelatedPlace(np);
                  }}
                  className="min-w-[170px] w-[170px] bg-slate-50 rounded-xl p-2 border border-slate-100 flex-shrink-0 cursor-pointer hover:border-teal-500 transition"
                >
                  <img src={np.imageUrl} alt={np.name} className="w-full h-18 rounded-lg object-cover mb-1.5" />
                  <h5 className="font-extrabold text-xs text-slate-900 truncate">{np.name}</h5>
                  <p className="text-[10px] text-slate-400 truncate">{np.area}</p>
                  <p className="text-[10px] font-bold text-teal-700 mt-1">★ {np.rating.toFixed(1)} • ₹{np.indicativeCostPerPerson}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 p-3.5 flex items-center gap-3 max-w-[440px] mx-auto shadow-xl">
        <button
          onClick={() => onToggleFavourite(place.id)}
          className={`flex-1 py-3 border rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
            isFavourite 
              ? 'border-red-400 text-red-500 bg-red-50' 
              : 'border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavourite ? 'fill-current' : ''}`} />
          <span>{isFavourite ? 'Saved' : 'Save'}</span>
        </button>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.area + ' Pune')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-[2] py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-teal-900/15 flex items-center justify-center gap-2 transition active:scale-[0.98]"
        >
          <Navigation className="w-4 h-4" />
          <span>Get Directions</span>
        </a>
      </div>

    </div>
  );
};
