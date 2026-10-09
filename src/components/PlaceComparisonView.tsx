import React, { useState } from 'react';
import { Place } from '../types';
import { 
  ArrowLeftRight, 
  IndianRupee, 
  Star, 
  Clock, 
  Train, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface PlaceComparisonViewProps {
  places: Place[];
  initialPlaceAId?: string;
  initialPlaceBId?: string;
  onSelectPlace: (place: Place) => void;
}

export const PlaceComparisonView: React.FC<PlaceComparisonViewProps> = ({
  places,
  initialPlaceAId,
  initialPlaceBId,
  onSelectPlace
}) => {
  const [placeAId, setPlaceAId] = useState<string>(initialPlaceAId || places[0]?.id || 'shaniwar-wada');
  const [placeBId, setPlaceBId] = useState<string>(
    initialPlaceBId || (places.length > 1 ? places[4]?.id : 'fc-road') || 'fc-road'
  );

  const placeA = places.find(p => p.id === placeAId) || places[0];
  const placeB = places.find(p => p.id === placeBId) || places[1] || places[0];

  const comparisonAttributes = [
    {
      label: 'Indicative Cost / Person',
      renderA: () => (
        <div className="font-extrabold text-emerald-400 text-base">
          {placeA.indicativeCostPerPerson === 0 ? 'Free' : `~₹${placeA.indicativeCostPerPerson}`}
          <span className="text-[11px] text-slate-400 font-normal block">
            Entry Fee: {placeA.entryFeeINR === 0 ? 'Free' : `₹${placeA.entryFeeINR}`}
          </span>
        </div>
      ),
      renderB: () => (
        <div className="font-extrabold text-emerald-400 text-base">
          {placeB.indicativeCostPerPerson === 0 ? 'Free' : `~₹${placeB.indicativeCostPerPerson}`}
          <span className="text-[11px] text-slate-400 font-normal block">
            Entry Fee: {placeB.entryFeeINR === 0 ? 'Free' : `₹${placeB.entryFeeINR}`}
          </span>
        </div>
      )
    },
    {
      label: 'Public Ratings & Volume',
      renderA: () => (
        <div className="flex items-center gap-1.5 font-bold text-amber-400 text-sm">
          <Star className="w-4 h-4 fill-current" />
          <span>{placeA.rating.toFixed(1)} / 5.0</span>
          <span className="text-slate-400 text-xs font-normal">({(placeA.reviewCount / 1000).toFixed(0)}k reviews)</span>
        </div>
      ),
      renderB: () => (
        <div className="flex items-center gap-1.5 font-bold text-amber-400 text-sm">
          <Star className="w-4 h-4 fill-current" />
          <span>{placeB.rating.toFixed(1)} / 5.0</span>
          <span className="text-slate-400 text-xs font-normal">({(placeB.reviewCount / 1000).toFixed(0)}k reviews)</span>
        </div>
      )
    },
    {
      label: 'Cleanliness Rating (Survey)',
      renderA: () => (
        <div>
          {placeA.cleanlinessRating ? (
            <div className="font-bold text-slate-200">
              {placeA.cleanlinessRating.toFixed(1)} / 5.0
              <span className="text-[10px] text-teal-400 block">Civic & Visitor Survey</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">No verified cleanliness survey data</span>
          )}
        </div>
      ),
      renderB: () => (
        <div>
          {placeB.cleanlinessRating ? (
            <div className="font-bold text-slate-200">
              {placeB.cleanlinessRating.toFixed(1)} / 5.0
              <span className="text-[10px] text-teal-400 block">Civic & Visitor Survey</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">No verified cleanliness survey data</span>
          )}
        </div>
      )
    },
    {
      label: 'Accessibility & Mobility',
      renderA: () => (
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-slate-200">
            {placeA.accessibilityRating ? `${placeA.accessibilityRating}/5.0 Ease` : 'Not Rated'}
          </div>
          <p>{placeA.accessibilityNotes}</p>
        </div>
      ),
      renderB: () => (
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-slate-200">
            {placeB.accessibilityRating ? `${placeB.accessibilityRating}/5.0 Ease` : 'Not Rated'}
          </div>
          <p>{placeB.accessibilityNotes}</p>
        </div>
      )
    },
    {
      label: 'Pune Metro Connectivity',
      renderA: () => (
        <div className="text-xs text-slate-300">
          {placeA.transitAccess.metroStation ? (
            <div className="flex items-start gap-1.5 text-teal-300 font-medium">
              <Train className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{placeA.transitAccess.metroStation} (~{placeA.transitAccess.metroDistanceKm} km)</span>
            </div>
          ) : (
            <span className="text-slate-400">No direct Metro station within 2km</span>
          )}
        </div>
      ),
      renderB: () => (
        <div className="text-xs text-slate-300">
          {placeB.transitAccess.metroStation ? (
            <div className="flex items-start gap-1.5 text-teal-300 font-medium">
              <Train className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{placeB.transitAccess.metroStation} (~{placeB.transitAccess.metroDistanceKm} km)</span>
            </div>
          ) : (
            <span className="text-slate-400">No direct Metro station within 2km</span>
          )}
        </div>
      )
    },
    {
      label: 'Recommended Visit Duration',
      renderA: () => (
        <div className="flex items-center gap-1.5 text-xs text-slate-200 font-semibold">
          <Clock className="w-3.5 h-3.5 text-teal-400" />
          <span>{placeA.avgDurationMinutes} mins (~{(placeA.avgDurationMinutes / 60).toFixed(1)} hrs)</span>
        </div>
      ),
      renderB: () => (
        <div className="flex items-center gap-1.5 text-xs text-slate-200 font-semibold">
          <Clock className="w-3.5 h-3.5 text-teal-400" />
          <span>{placeB.avgDurationMinutes} mins (~{(placeB.avgDurationMinutes / 60).toFixed(1)} hrs)</span>
        </div>
      )
    },
    {
      label: 'Best Time to Visit',
      renderA: () => <span className="text-xs text-slate-300">{placeA.bestTimeToVisit}</span>,
      renderB: () => <span className="text-xs text-slate-300">{placeB.bestTimeToVisit}</span>
    },
    {
      label: 'Ground Safety Evidence',
      renderA: () => (
        <div className="text-xs text-slate-300 flex items-start gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{placeA.safetyNotes}</span>
        </div>
      ),
      renderB: () => (
        <div className="text-xs text-slate-300 flex items-start gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{placeB.safetyNotes}</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400">
              <ArrowLeftRight className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Objective Comparison Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Compare Pune Destinations Side-by-Side
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Evaluate cost, cleanliness evidence, metro transit ease, and crowd factors. Missing survey data is explicitly stated.
          </p>
        </div>

        {/* Quick swap button */}
        <button
          onClick={() => {
            const temp = placeAId;
            setPlaceAId(placeBId);
            setPlaceBId(temp);
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-2 self-start md:self-auto"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-teal-400" />
          <span>Swap Places</span>
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Place A Selector */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
            Select Location 1
          </label>
          <select
            value={placeAId}
            onChange={e => setPlaceAId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-sm font-bold focus:border-teal-400 focus:outline-none"
          >
            {places.map(p => (
              <option key={p.id} value={p.id} disabled={p.id === placeBId}>
                {p.name} ({p.categoryLabel} • {p.area})
              </option>
            ))}
          </select>
        </div>

        {/* Place B Selector */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
            Select Location 2
          </label>
          <select
            value={placeBId}
            onChange={e => setPlaceBId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-sm font-bold focus:border-teal-400 focus:outline-none"
          >
            {places.map(p => (
              <option key={p.id} value={p.id} disabled={p.id === placeAId}>
                {p.name} ({p.categoryLabel} • {p.area})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        
        {/* Table Header: Place Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 border-b border-slate-800">
          
          {/* Card A */}
          <div className="p-5 flex items-center gap-4">
            <img
              src={placeA.imageUrl}
              alt={placeA.name}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-700 flex-shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                {placeA.categoryLabel}
              </span>
              <h3 className="text-lg font-black text-white mt-1">{placeA.name}</h3>
              <p className="text-xs text-slate-400">{placeA.area}</p>
              <button
                onClick={() => onSelectPlace(placeA)}
                className="mt-2 text-xs text-teal-400 font-semibold hover:underline"
              >
                View full profile →
              </button>
            </div>
          </div>

          {/* Card B */}
          <div className="p-5 flex items-center gap-4">
            <img
              src={placeB.imageUrl}
              alt={placeB.name}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-700 flex-shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                {placeB.categoryLabel}
              </span>
              <h3 className="text-lg font-black text-white mt-1">{placeB.name}</h3>
              <p className="text-xs text-slate-400">{placeB.area}</p>
              <button
                onClick={() => onSelectPlace(placeB)}
                className="mt-2 text-xs text-teal-400 font-semibold hover:underline"
              >
                View full profile →
              </button>
            </div>
          </div>

        </div>

        {/* Row-by-Row Comparison */}
        <div className="divide-y divide-slate-800/80">
          {comparisonAttributes.map((attr, idx) => (
            <div key={idx} className="p-4 sm:p-5 hover:bg-slate-800/30 transition">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {attr.label}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  {attr.renderA()}
                </div>
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  {attr.renderB()}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Disclosures note */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-3 text-xs text-slate-400">
        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-300">Data Integrity Assurance</p>
          <p className="mt-0.5">
            Where independent accessibility or cleanliness audits are pending, the field is left unrated rather than simulated. All costs represent conservative indicative estimates.
          </p>
        </div>
      </div>

    </div>
  );
};
