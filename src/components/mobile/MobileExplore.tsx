import React, { useState } from 'react';
import { Place } from '../../types';
import { LeafletMap } from '../LeafletMap';
import { 
  ArrowLeft, 
  SlidersHorizontal, 
  Star, 
  Heart, 
  Navigation, 
  MapPin, 
  IndianRupee,
  Search,
  Layers,
  Map as MapIcon,
  List,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface MobileExploreProps {
  places: Place[];
  onBack: () => void;
  onSelectPlace: (place: Place) => void;
  favouriteIds: string[];
  onToggleFavourite: (placeId: string) => void;
}

export const MobileExplore: React.FC<MobileExploreProps> = ({
  places,
  onBack,
  onSelectPlace,
  favouriteIds,
  onToggleFavourite
}) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedMapPlace, setSelectedMapPlace] = useState<Place | null>(places[0] || null);

  const filterChips = [
    'All',
    'Historical Forts',
    'Street Food & Cafes',
    'Spiritual & Temples',
    'Hills & Treks',
    'Bazaars'
  ];

  const filteredPlaces = places.filter(p => {
    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        p.name.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        (p.localName && p.localName.includes(q));
      if (!matchesSearch) return false;
    }

    // Category chip filter
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Historical Forts') return p.category === 'heritage';
    if (activeFilter === 'Street Food & Cafes') return p.category === 'food' || p.category === 'modern_culture';
    if (activeFilter === 'Spiritual & Temples') return p.category === 'temple';
    if (activeFilter === 'Hills & Treks') return p.category === 'nature_fort';
    if (activeFilter === 'Bazaars') return p.category === 'shopping';
    return true;
  });

  return (
    <div className="relative w-full h-full min-h-[720px] flex flex-col bg-[#F8FAFC]">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1 rounded-full text-slate-700 hover:bg-slate-100 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">Explore Pune</h2>
            <p className="text-[10px] text-slate-400 font-medium">
              {filteredPlaces.length} curated destinations
            </p>
          </div>
        </div>

        {/* View Mode Toggle Button [ Map / List ] */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('map')}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
              viewMode === 'map' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Map view"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Map</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
              viewMode === 'list' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="List view"
          >
            <List className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">List</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white px-4 py-2 border-b border-slate-100 z-20">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-teal-700 focus-within:bg-white transition">
          <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search fort, food, temple..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-2 bg-transparent text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Horizontal Pills */}
      <div className="bg-white px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-100 z-20">
        {filterChips.map(chip => {
          const isActive = activeFilter === chip;
          return (
            <button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* VIEW 1: MAP VIEW */}
      {viewMode === 'map' && (
        <div className="relative flex-1 w-full min-h-[520px] h-full overflow-hidden">
          <LeafletMap
            places={filteredPlaces}
            selectedPlaceId={selectedMapPlace?.id}
            onSelectPlace={(p) => setSelectedMapPlace(p)}
            center={selectedMapPlace ? selectedMapPlace.coordinates : [18.5204, 73.8567]}
            zoom={13}
            height="100%"
          />

          {/* Target / Recenter Floating Button */}
          <button
            onClick={() => setSelectedMapPlace(places[0])}
            className="absolute top-4 right-4 z-10 p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg text-slate-700 hover:text-teal-700 border border-slate-100 active:scale-95 transition"
            title="Recenter Map"
          >
            <Navigation className="w-4 h-4 text-teal-700" />
          </button>

          {/* Bottom Floating Horizontal Card Carousel */}
          {filteredPlaces.length > 0 ? (
            <div className="absolute bottom-4 left-0 right-0 z-10 px-4 space-y-2 overflow-x-auto no-scrollbar">
              <div className="flex gap-2.5 pb-1">
                {filteredPlaces.map(place => {
                  const isFav = favouriteIds.includes(place.id);
                  const isSelected = selectedMapPlace?.id === place.id;
                  return (
                    <div
                      key={place.id}
                      onClick={() => {
                        setSelectedMapPlace(place);
                        onSelectPlace(place);
                      }}
                      className={`min-w-[260px] w-[260px] bg-white/95 backdrop-blur-md rounded-2xl p-2.5 border shadow-xl flex items-center gap-2.5 cursor-pointer active:scale-[0.98] transition flex-shrink-0 ${
                        isSelected ? 'border-teal-600 ring-2 ring-teal-600/30' : 'border-slate-100'
                      }`}
                    >
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-extrabold text-xs text-slate-900 truncate">{place.name}</h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavourite(place.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-500"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                          </button>
                        </div>

                        <p className="text-[10px] text-teal-700 font-bold truncate">{place.categoryLabel}</p>

                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500">
                          <span className="flex items-center gap-0.5 font-bold text-slate-900">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>{place.rating.toFixed(1)}</span>
                          </span>
                          <span>•</span>
                          <span className="font-bold text-slate-800">
                            {place.indicativeCostPerPerson === 0 ? 'Free' : `₹${place.indicativeCostPerPerson}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-white/90 backdrop-blur-sm">
              <div className="text-center space-y-2">
                <p className="text-sm font-bold text-slate-700">No destinations match this filter</p>
                <button
                  onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
                  className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map(place => {
              const isFav = favouriteIds.includes(place.id);
              return (
                <div
                  key={place.id}
                  onClick={() => onSelectPlace(place)}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:border-teal-200 transition cursor-pointer active:scale-[0.99] group"
                >
                  <div className="h-36 relative overflow-hidden">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavourite(place.id);
                        }}
                        className="p-2 bg-slate-950/60 backdrop-blur-md rounded-full text-white hover:text-red-400 transition"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-white flex items-center gap-1.5">
                      <span className="text-teal-300">{place.area}</span>
                      <span>•</span>
                      <span className="text-amber-300">★ {place.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900">{place.name}</h3>
                        <p className="text-[11px] text-teal-700 font-semibold">{place.categoryLabel}</p>
                      </div>
                      <span className="text-xs font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        {place.indicativeCostPerPerson === 0 ? 'Free' : `₹${place.indicativeCostPerPerson}`}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Rec: {place.avgDurationMinutes} mins</span>
                      </span>

                      <span className="font-bold text-teal-700 group-hover:underline">
                        View details →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 space-y-3">
              <p className="text-sm font-bold text-slate-700">No destinations found matching your criteria</p>
              <button
                onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
                className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
