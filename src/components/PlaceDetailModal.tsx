import React from 'react';
import { Place } from '../types';
import { X, MapPin, Clock, IndianRupee, Star, Compass, Train, Bus, ShieldAlert, Heart, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

interface PlaceDetailModalProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  isFavourite: boolean;
  onToggleFavourite: (placeId: string) => void;
  onPlanTripFromHere?: (place: Place) => void;
  onComparePlace?: (place: Place) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  isOpen,
  onClose,
  isFavourite,
  onToggleFavourite,
  onPlanTripFromHere,
  onComparePlace
}) => {
  if (!isOpen || !place) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-100">
        
        {/* Hero Image Section */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden flex-shrink-0">
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          {/* Top action buttons */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-3 py-1 bg-teal-500/90 text-slate-950 text-xs font-bold rounded-full backdrop-blur-md uppercase tracking-wider">
              {place.categoryLabel}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavourite(place.id)}
                className={`p-2 rounded-full backdrop-blur-md transition ${
                  isFavourite
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-900/80 text-slate-300 hover:text-red-400'
                }`}
                title={isFavourite ? 'Remove from saved' : 'Save to favourites'}
              >
                <Heart className={`w-4 h-4 ${isFavourite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-slate-900/80 text-slate-300 hover:text-white rounded-full backdrop-blur-md transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Place Title on Hero */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{place.name}</h2>
              {place.localName && (
                <span className="text-base text-teal-300 font-medium">{place.localName}</span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 line-clamp-1">{place.tagline}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Indicative Cost</span>
              <div className="flex items-center font-bold text-emerald-400 text-base">
                <IndianRupee className="w-4 h-4" />
                <span>{place.indicativeCostPerPerson === 0 ? 'Free' : `~₹${place.indicativeCostPerPerson}`}</span>
              </div>
              <span className="text-[10px] text-slate-400">Entry: {place.entryFeeINR === 0 ? 'Free' : `₹${place.entryFeeINR}`}</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Rating</span>
              <div className="flex items-center gap-1 font-bold text-amber-400 text-base">
                <Star className="w-4 h-4 fill-current" />
                <span>{place.rating.toFixed(1)}</span>
                <span className="text-[11px] text-slate-400 font-normal">({(place.reviewCount / 1000).toFixed(0)}k)</span>
              </div>
              <span className="text-[10px] text-slate-400">Public Reviews</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Best Duration</span>
              <div className="flex items-center gap-1 font-bold text-teal-300 text-base">
                <Clock className="w-4 h-4" />
                <span>{Math.round(place.avgDurationMinutes / 60 * 10) / 10} hrs</span>
              </div>
              <span className="text-[10px] text-slate-400">Recommended visit</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Area</span>
              <div className="flex items-center gap-1 font-bold text-slate-200 text-xs truncate">
                <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span className="truncate">{place.area}</span>
              </div>
              <span className="text-[10px] text-slate-400">Pune Core District</span>
            </div>
          </div>

          {/* About / Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Overview & Cultural Context</h4>
            <p className="text-slate-300 leading-relaxed text-sm">{place.description}</p>
          </div>

          {/* Highlights & Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
              <h5 className="font-semibold text-xs text-teal-300 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Key Highlights</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {place.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
              <h5 className="font-semibold text-xs text-amber-300 flex items-center gap-1.5 mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Local Explorer Advice</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {place.tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Transit & Accessibility */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Transit Access & Urban Mobility</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Train className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>
                  <strong>Metro:</strong> {place.transitAccess.metroStation || 'No direct station within 2km'}
                  {place.transitAccess.metroDistanceKm && ` (~${place.transitAccess.metroDistanceKm} km)`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Bus className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span><strong>Bus:</strong> {place.transitAccess.busStop || 'PMPML network'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 text-xs text-slate-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Safety & Ground Conditions: </span>
                {place.safetyNotes}
              </div>
            </div>

            <div className="text-xs text-slate-400">
              <span className="font-medium text-slate-300">Accessibility: </span>
              {place.accessibilityNotes}
            </div>
          </div>

          {/* Timing Note */}
          <div className="p-3 bg-teal-950/20 border border-teal-800/30 rounded-xl text-xs flex items-center justify-between text-slate-300">
            <span className="text-teal-300 font-medium">Recommended Time Window:</span>
            <span className="font-semibold text-white">{place.bestTimeToVisit}</span>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' Pune')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <span>Open in Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            {onComparePlace && (
              <button
                onClick={() => {
                  onComparePlace(place);
                  onClose();
                }}
                className="px-3.5 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium rounded-lg border border-teal-500/30 transition"
              >
                Compare Location
              </button>
            )}

            {onPlanTripFromHere && (
              <button
                onClick={() => {
                  onPlanTripFromHere(place);
                  onClose();
                }}
                className="px-4 py-2 text-xs bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg shadow transition"
              >
                Plan Itinerary Here
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
