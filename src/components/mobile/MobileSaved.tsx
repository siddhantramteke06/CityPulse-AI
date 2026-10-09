import React, { useState } from 'react';
import { 
  Heart, 
  Clock, 
  IndianRupee, 
  ArrowRight, 
  ChevronRight, 
  Compass, 
  Sparkles, 
  Trash2,
  Bookmark,
  MapPin,
  Star
} from 'lucide-react';
import { Place, GeneratedPlan } from '../../types';

interface MobileSavedProps {
  places: Place[];
  favouriteIds: string[];
  savedPlans: GeneratedPlan[];
  onToggleFavourite: (placeId: string) => void;
  onSelectPlace: (place: Place) => void;
  onSelectPlan: (plan: GeneratedPlan) => void;
  onNavigateToPlanner?: () => void;
  onNavigateToExplore?: () => void;
}

export const MobileSaved: React.FC<MobileSavedProps> = ({
  places,
  favouriteIds,
  savedPlans,
  onToggleFavourite,
  onSelectPlace,
  onSelectPlan,
  onNavigateToPlanner,
  onNavigateToExplore
}) => {
  const [activeTab, setActiveTab] = useState<'places' | 'trips'>('places');

  const favouritePlaces = places.filter(p => favouriteIds.includes(p.id));
  const suggestedPlaces = places.slice(0, 3); // Seed suggestions if empty

  return (
    <div className="w-full h-full min-h-[720px] bg-[#F8FAFC] pb-24 text-slate-800">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-extrabold text-slate-900 leading-tight">Saved & Bookmarks</h1>
          <p className="text-[10px] text-slate-400 font-medium">
            {favouritePlaces.length} places • {savedPlans.length} itineraries
          </p>
        </div>
        <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
          <Heart className="w-4 h-4 fill-current" />
        </div>
      </div>

      {/* Segmented Control [ Places | Trips ] */}
      <div className="bg-white px-5 py-2.5 border-b border-slate-100">
        <div className="bg-slate-100 p-1 rounded-xl flex items-center">
          <button
            onClick={() => setActiveTab('places')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition ${
              activeTab === 'places' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Saved Places ({favouritePlaces.length})
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition ${
              activeTab === 'trips' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Saved Trips ({savedPlans.length})
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        
        {activeTab === 'places' ? (
          <div className="space-y-3">
            {favouritePlaces.length > 0 ? (
              <div className="space-y-2.5">
                {favouritePlaces.map(place => (
                  <div
                    key={place.id}
                    onClick={() => onSelectPlace(place)}
                    className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-teal-400 active:scale-[0.99] transition group"
                  >
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 truncate group-hover:text-teal-700 transition">
                        {place.name}
                      </h4>
                      <p className="text-[11px] text-teal-700 font-semibold">{place.categoryLabel}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-0.5 font-bold text-slate-900">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{place.rating.toFixed(1)}</span>
                        </span>
                        <span>•</span>
                        <span className="font-bold text-slate-700">
                          {place.indicativeCostPerPerson === 0 ? 'Free' : `₹${place.indicativeCostPerPerson}`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavourite(place.id);
                      }}
                      className="p-2 text-rose-500 hover:scale-110 active:scale-95 transition"
                      title="Remove from saved"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* NEVER BLANK: Helpful empty state with 1-tap suggestions */
              <div className="space-y-4 animate-fade-in">
                <div className="p-6 text-center bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800">No Saved Places Yet</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Tap the heart icon on any landmark or cafe in Pune to access them quickly while exploring.
                  </p>
                </div>

                {/* Popular Pune Suggestions */}
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    Recommended Places to Save
                  </span>
                  <div className="space-y-2">
                    {suggestedPlaces.map(place => (
                      <div
                        key={place.id}
                        onClick={() => onSelectPlace(place)}
                        className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-teal-300 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={place.imageUrl} alt={place.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="min-w-0">
                            <h5 className="font-extrabold text-xs text-slate-900 truncate">{place.name}</h5>
                            <p className="text-[10px] text-slate-400">{place.area} • {place.categoryLabel}</p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavourite(place.id);
                          }}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* TRIPS TAB */
          <div className="space-y-3">
            {savedPlans.length > 0 ? (
              <div className="space-y-2.5">
                {savedPlans.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => onSelectPlan(plan)}
                    className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-teal-400 active:scale-[0.99] transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-lg shadow-sm border border-teal-100">
                        🗺️
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700 transition">
                          {plan.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {plan.stops.length} stops • {plan.totalDurationHours} hrs • ₹{plan.totalEstimatedCostINR}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition" />
                  </div>
                ))}
              </div>
            ) : (
              /* NEVER BLANK: Helpful empty trips state */
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">No Saved Itineraries Yet</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Use our AI Trip Planner to create and save personalized day routes optimized for your budget.
                </p>
                {onNavigateToPlanner && (
                  <button
                    onClick={onNavigateToPlanner}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold shadow-sm active:scale-95 transition"
                  >
                    Create a Trip Plan Now →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
