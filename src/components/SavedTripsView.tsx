import React, { useState } from 'react';
import { Place, GeneratedPlan } from '../types';
import { 
  Bookmark, 
  Trash2, 
  Sparkles, 
  Clock, 
  IndianRupee, 
  MapPin, 
  ArrowRight, 
  Heart, 
  ExternalLink,
  Calendar,
  Layers
} from 'lucide-react';

interface SavedTripsViewProps {
  places: Place[];
  favouriteIds: string[];
  savedPlans: GeneratedPlan[];
  onToggleFavourite: (placeId: string) => void;
  onDeletePlan: (planId: string) => void;
  onSelectPlace: (place: Place) => void;
  onNavigateToTab: (tab: any) => void;
}

export const SavedTripsView: React.FC<SavedTripsViewProps> = ({
  places,
  favouriteIds,
  savedPlans,
  onToggleFavourite,
  onDeletePlan,
  onSelectPlace,
  onNavigateToTab
}) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'places'>('plans');

  const favouritePlaces = places.filter(p => favouriteIds.includes(p.id));

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400">
              <Bookmark className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Local Vault & Bookmarks
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Saved Itineraries & Favourites
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Persisted securely in browser storage. Access your custom trip itineraries and bookmarked destinations offline anytime.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'plans'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Saved Itineraries ({savedPlans.length})
          </button>

          <button
            onClick={() => setActiveTab('places')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'places'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Favourite Places ({favouritePlaces.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: SAVED ITINERARIES */}
      {activeTab === 'plans' && (
        <div>
          {savedPlans.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <Sparkles className="w-12 h-12 text-teal-400 mx-auto" />
              <h3 className="font-bold text-lg text-white">No Saved Itineraries Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Generate a custom trip with the AI Planner and click "Save Itinerary" to store it here.
              </p>
              <button
                onClick={() => onNavigateToTab('planner')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Go to AI Planner
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPlans.map(plan => (
                <div
                  key={plan.id}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                          {plan.totalDurationHours} Hours • {plan.startingLocation}
                        </span>
                        <h3 className="font-extrabold text-base text-white mt-1.5">{plan.title}</h3>
                        {plan.savedAt && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>Saved {new Date(plan.savedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onDeletePlan(plan.id)}
                        className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition"
                        title="Delete itinerary"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Cost & Stops metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Est. Expenditure</span>
                        <span className="font-bold text-emerald-400 text-sm">₹{plan.totalEstimatedCostINR}</span>
                      </div>
                      <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Curated Stops</span>
                        <span className="font-bold text-slate-200 text-sm">{plan.stops.length} Locations</span>
                      </div>
                    </div>

                    {/* Stops List Preview */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Route Sequence:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {plan.stops.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-950 text-slate-300 rounded-lg text-[11px] border border-slate-800 flex items-center gap-1"
                          >
                            <span className="text-teal-400 font-bold">{idx + 1}.</span>
                            <span>{s.place.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Target Budget: ₹{plan.budgetINR}</span>
                    <button
                      onClick={() => onNavigateToTab('planner')}
                      className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                    >
                      <span>Open in Planner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: FAVOURITE PLACES */}
      {activeTab === 'places' && (
        <div>
          {favouritePlaces.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <Heart className="w-12 h-12 text-red-400 mx-auto" />
              <h3 className="font-bold text-lg text-white">No Favourites Saved</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore Pune places and click the heart icon to bookmark spots you want to visit.
              </p>
              <button
                onClick={() => onNavigateToTab('explore')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Browse Explore View
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favouritePlaces.map(place => (
                <div
                  key={place.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    
                    <button
                      onClick={() => onToggleFavourite(place.id)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-red-500 text-white shadow"
                      title="Remove from favourites"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <div className="absolute bottom-2 left-2.5 text-xs font-bold text-white">
                      {place.area}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-base text-white group-hover:text-teal-300 transition">
                        {place.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{place.tagline}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">
                        {place.indicativeCostPerPerson === 0 ? 'Free' : `~₹${place.indicativeCostPerPerson}`}
                      </span>
                      <button
                        onClick={() => onSelectPlace(place)}
                        className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
