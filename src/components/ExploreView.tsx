import React, { useState } from 'react';
import { Place, PlaceCategory } from '../types';
import { LeafletMap } from './LeafletMap';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  IndianRupee, 
  Heart, 
  ArrowLeftRight, 
  Layers, 
  Map as MapIcon, 
  ListFilter,
  Train,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface ExploreViewProps {
  places: Place[];
  favouriteIds: string[];
  onToggleFavourite: (placeId: string) => void;
  onSelectPlace: (place: Place) => void;
  onComparePlace: (place: Place) => void;
  onPlanTripFromHere: (place: Place) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  places,
  favouriteIds,
  onToggleFavourite,
  onSelectPlace,
  onComparePlace,
  onPlanTripFromHere
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'split' | 'cards' | 'map'>('split');
  const [mapCenterPlace, setMapCenterPlace] = useState<Place | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'heritage', label: 'Historical Heritage' },
    { id: 'food', label: 'Food & Cafes' },
    { id: 'nature_fort', label: 'Forts & Hill Treks' },
    { id: 'shopping', label: 'Markets & Shopping' },
    { id: 'temple', label: 'Temples & Sacred' },
    { id: 'modern_culture', label: 'Modern & Lifestyle' }
  ];

  // Filtering
  const filteredPlaces = places.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.area.toLowerCase().includes(search.toLowerCase()) ||
      (p.localName && p.localName.includes(search)) ||
      p.tagline.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    const matchesBudget = 
      selectedBudget === 'all' ||
      (selectedBudget === 'free' && p.indicativeCostPerPerson === 0) ||
      (selectedBudget === 'budget' && p.indicativeCostPerPerson > 0 && p.indicativeCostPerPerson <= 50) ||
      (selectedBudget === 'moderate' && p.indicativeCostPerPerson > 50 && p.indicativeCostPerPerson <= 150) ||
      (selectedBudget === 'premium' && p.indicativeCostPerPerson > 150);

    return matchesSearch && matchesCategory && matchesBudget;
  });

  const handleLocateOnMap = (p: Place) => {
    setMapCenterPlace(p);
    if (viewMode === 'cards') setViewMode('split');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Explore Pune</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {filteredPlaces.length} Destinations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Discover Pune's iconic forts, heritage wadas, student food corridors, and historic peth markets.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'split' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split View</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'cards' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'map' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map Only</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, area, or keywords..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 focus:border-teal-400 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm focus:border-teal-400 focus:outline-none"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Budget Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedBudget}
              onChange={e => setSelectedBudget(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm focus:border-teal-400 focus:outline-none"
            >
              <option value="all">All Indicative Budgets</option>
              <option value="free">Free Admission (₹0)</option>
              <option value="budget">Budget (≤ ₹50)</option>
              <option value="moderate">Moderate (₹50 – ₹150)</option>
              <option value="premium">Premium (&gt; ₹150)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Indicator */}
        {(search || selectedCategory !== 'all' || selectedBudget !== 'all') && (
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Filtering {filteredPlaces.length} of {places.length} places</span>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedBudget('all');
              }}
              className="text-teal-400 hover:text-teal-300 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className={`grid gap-6 ${
        viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
      }`}>
        
        {/* Map Container (Visible in split & map mode) */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className={`${
            viewMode === 'split' ? 'lg:col-span-5 order-2 lg:order-1' : 'w-full'
          }`}>
            <div className="sticky top-20">
              <LeafletMap
                places={filteredPlaces}
                selectedPlaceId={mapCenterPlace?.id}
                onSelectPlace={onSelectPlace}
                center={mapCenterPlace ? mapCenterPlace.coordinates : [18.5204, 73.8567]}
                zoom={mapCenterPlace ? 15 : 12}
                height={viewMode === 'map' ? '650px' : '580px'}
              />
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between px-1">
                <span>Click pins on map to inspect location popup</span>
                <span className="text-teal-400 font-medium">OpenStreetMap • Leaflet</span>
              </div>
            </div>
          </div>
        )}

        {/* Cards Grid (Visible in split & cards mode) */}
        {(viewMode === 'split' || viewMode === 'cards') && (
          <div className={`${
            viewMode === 'split' ? 'lg:col-span-7 order-1 lg:order-2' : 'w-full'
          }`}>
            {filteredPlaces.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                <Search className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-lg text-white">No places match your filters</h3>
                <p className="text-xs text-slate-400">Try broadening your search term or resetting category and budget filters.</p>
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('all');
                    setSelectedBudget('all');
                  }}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'cards' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
              }`}>
                {filteredPlaces.map(place => {
                  const isFav = favouriteIds.includes(place.id);
                  return (
                    <div
                      key={place.id}
                      className="bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition duration-200 shadow-md group"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                        
                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-950/80 text-teal-300 backdrop-blur border border-teal-500/30 uppercase">
                            {place.categoryLabel}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavourite(place.id);
                            }}
                            className={`p-1.5 rounded-full backdrop-blur transition ${
                              isFav ? 'bg-red-500 text-white' : 'bg-slate-950/80 text-slate-300 hover:text-red-400'
                            }`}
                            title={isFav ? 'Remove from saved' : 'Save to favourites'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Location bottom overlay */}
                        <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-[11px] font-semibold text-white">
                          <MapPin className="w-3 h-3 text-teal-400" />
                          <span>{place.area}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-baseline justify-between gap-1 mb-1">
                            <h3 className="font-bold text-base text-white group-hover:text-teal-300 transition truncate">
                              {place.name}
                            </h3>
                          </div>
                          {place.localName && (
                            <div className="text-xs text-teal-400 font-medium mb-1">{place.localName}</div>
                          )}
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {place.tagline}
                          </p>
                        </div>

                        {/* Indicators Row */}
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-amber-400 font-bold">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>{place.rating.toFixed(1)}</span>
                              <span className="text-[10px] text-slate-400 font-normal">({(place.reviewCount / 1000).toFixed(0)}k)</span>
                            </div>
                            <div className="font-semibold text-emerald-400 flex items-center">
                              <IndianRupee className="w-3.5 h-3.5" />
                              <span>{place.indicativeCostPerPerson === 0 ? 'Free' : `~₹${place.indicativeCostPerPerson}`}</span>
                            </div>
                          </div>

                          {/* Quick Metro indicator if available */}
                          {place.transitAccess.metroStation && (
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                              <Train className="w-3 h-3 text-teal-400 flex-shrink-0" />
                              <span className="truncate">Near {place.transitAccess.metroStation}</span>
                            </div>
                          )}
                        </div>

                        {/* Card Buttons */}
                        <div className="pt-2 grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => onSelectPlace(place)}
                            className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => onComparePlace(place)}
                            className="py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs rounded-lg transition flex items-center justify-center gap-1"
                            title="Compare with another Pune place"
                          >
                            <ArrowLeftRight className="w-3 h-3" />
                            <span>Compare</span>
                          </button>
                          <button
                            onClick={() => handleLocateOnMap(place)}
                            className="py-1.5 bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white font-semibold text-xs rounded-lg border border-teal-500/30 transition flex items-center justify-center gap-1"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Map</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
