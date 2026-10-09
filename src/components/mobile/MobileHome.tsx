import React, { useState, useEffect } from 'react';
import { Place } from '../../types';
import { 
  Sun, 
  Car, 
  Search, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeftRight, 
  MapPin, 
  ChevronRight, 
  Info, 
  X,
  PhoneCall,
  Train,
  Star,
  Clock,
  Flame,
  Coffee,
  Heart,
  Navigation,
  Sparkle,
  Zap,
  TrendingUp
} from 'lucide-react';

interface MobileHomeProps {
  onNavigateTo: (screen: string) => void;
  onSelectPlace: (place: Place) => void;
  places: Place[];
  onOpenDemoNotice?: () => void;
}

export const MobileHome: React.FC<MobileHomeProps> = ({
  onNavigateTo,
  onSelectPlace,
  places,
  onOpenDemoNotice
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchFilter, setActiveSearchFilter] = useState<'all' | 'food' | 'heritage' | 'budget'>('all');
  const [showSosModal, setShowSosModal] = useState(false);
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    description: string;
    isLive: boolean;
  }>({
    temp: 29,
    description: 'Pleasant & Sunny',
    isLive: false
  });

  // Dynamic greeting based on current local time
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Fetch real live weather for Pune via Open-Meteo API
  useEffect(() => {
    let mounted = true;
    fetch('https://api.open-meteo.com/v1/forecast?latitude=18.5204&longitude=73.8567&current=temperature_2m,weather_code')
      .then(res => res.json())
      .then(data => {
        if (!mounted || !data?.current) return;
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        let desc = 'Clear Sky';
        if (code >= 1 && code <= 3) desc = 'Partly Cloudy';
        else if (code >= 45 && code <= 48) desc = 'Hazy Sunshine';
        else if (code >= 51 && code <= 67) desc = 'Light Showers';
        else if (code >= 80) desc = 'Passing Showers';

        setWeatherData({
          temp,
          description: desc,
          isLive: true
        });
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const searchResults = searchQuery.trim() === ''
    ? []
    : places.filter(p => {
        const matchesQuery = 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.localName && p.localName.includes(searchQuery));
        
        if (!matchesQuery) return false;
        if (activeSearchFilter === 'food') return p.category === 'food';
        if (activeSearchFilter === 'heritage') return p.category === 'heritage';
        if (activeSearchFilter === 'budget') return p.indicativeCostPerPerson <= 50;
        return true;
      }).slice(0, 5);

  // Curated lists for travelers
  const trendingPlaces = places.slice(0, 5);
  const streetFoodPlaces = places.filter(p => p.category === 'food' || p.category === 'shopping');

  return (
    <div className="w-full bg-[#F8FAFC] min-h-full pb-24 text-slate-800 space-y-4">
      
      {/* Top Greeting & Emergency Bar */}
      <div className="px-5 pt-3 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase block">
            {greeting}, Explorer
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping inline-block" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Pune</span>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
                Live
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Emergency SOS Button */}
          <button
            onClick={() => setShowSosModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
            title="Emergency SOS Contacts"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>SOS</span>
          </button>

          {/* Data transparency notice */}
          {onOpenDemoNotice && (
            <button
              onClick={onOpenDemoNotice}
              className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs transition"
              title="Data transparency notice"
            >
              <Info className="w-4 h-4" />
            </button>
          )}

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Weather & Live Commute Pulse Cards */}
      <div className="grid grid-cols-2 gap-3 px-5">
        
        {/* Weather Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-white to-white rounded-2xl p-3.5 border border-amber-200/60 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Sun className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-base font-black text-slate-900 leading-none">
              {weatherData.temp}°C
            </div>
            <div className="text-[10px] text-amber-800 font-bold mt-1 truncate">
              {weatherData.description}
            </div>
            <div className="text-[9px] text-slate-400 font-medium">
              {weatherData.isLive ? 'Live Open-Meteo' : 'Pune forecast'}
            </div>
          </div>
        </div>

        {/* Traffic & Air Quality Card */}
        <div className="bg-gradient-to-br from-teal-500/10 via-white to-white rounded-2xl p-3.5 border border-teal-200/60 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-700 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Car className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-xs font-black text-slate-900 leading-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>Smooth Flow</span>
            </div>
            <div className="text-[10px] text-teal-800 font-bold mt-1">
              AQI 64 • Satisfactory
            </div>
            <div className="text-[9px] text-slate-400 font-medium">
              JM / FC Road normal
            </div>
          </div>
        </div>

      </div>

      {/* Pune Metro Live Transit Strip */}
      <div className="px-5">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-3 text-white shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">Pune Metro Live</span>
                <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-emerald-500/30 text-emerald-300 rounded border border-emerald-500/40">
                  On Time
                </span>
              </div>
              <p className="text-[10px] text-slate-300 mt-0.5">
                🟣 Purple (PCMC-Swargate) • 🔵 Aqua (Vanaz-Ramwadi)
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTo('explore')}
            className="text-[11px] font-bold text-teal-300 hover:text-white flex items-center gap-0.5 whitespace-nowrap pl-2"
          >
            <span>Stations</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Bar with Instant Autocomplete & Filter Pills */}
      <div className="px-5 relative z-20 space-y-2">
        <div className="relative flex items-center bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2.5 shadow-sm focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/10 transition">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search fort, street food, heritage..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-2.5 pr-2 bg-transparent text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Chips for Search */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[10px] font-bold">
          <span className="text-slate-400 flex-shrink-0 mr-0.5">Filter:</span>
          <button
            onClick={() => setActiveSearchFilter('all')}
            className={`px-2.5 py-1 rounded-full transition ${activeSearchFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveSearchFilter('food')}
            className={`px-2.5 py-1 rounded-full transition ${activeSearchFilter === 'food' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Street Food
          </button>
          <button
            onClick={() => setActiveSearchFilter('heritage')}
            className={`px-2.5 py-1 rounded-full transition ${activeSearchFilter === 'heritage' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Historical
          </button>
          <button
            onClick={() => setActiveSearchFilter('budget')}
            className={`px-2.5 py-1 rounded-full transition ${activeSearchFilter === 'budget' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Free / Budget
          </button>
        </div>

        {/* Instant Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute left-5 right-5 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-100 z-30 animate-fade-in">
            {searchResults.map(p => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPlace(p);
                  setSearchQuery('');
                }}
                className="p-3 flex items-center justify-between hover:bg-teal-50/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <h5 className="font-extrabold text-xs text-slate-900 truncate">{p.name}</h5>
                    <p className="text-[10px] text-slate-400 truncate">{p.area} • {p.categoryLabel}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="text-[11px] font-black text-teal-700 block">
                    {p.indicativeCostPerPerson === 0 ? 'Free' : `₹${p.indicativeCostPerPerson}`}
                  </span>
                  <span className="text-[9px] text-slate-400">★ {p.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4 Quick Action Circular Buttons */}
      <div className="grid grid-cols-4 gap-2.5 px-5 pt-1 text-center">
        
        <button
          onClick={() => onNavigateTo('explore')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md shadow-teal-900/15 group-active:scale-95 transition">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-700">Explore Map</span>
        </button>

        <button
          onClick={() => onNavigateTo('planner')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md shadow-teal-900/15 group-active:scale-95 transition">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-700">AI Planner</span>
        </button>

        <button
          onClick={() => onNavigateTo('safety')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md shadow-teal-900/15 group-active:scale-95 transition">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-700">Safety Hub</span>
        </button>

        <button
          onClick={() => onNavigateTo('compare')}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md shadow-teal-900/15 group-active:scale-95 transition">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-700">Compare</span>
        </button>

      </div>

      {/* Trending in Pune Right Now (Horizontal Cards Carousel) */}
      <div className="space-y-2.5 pt-2">
        <div className="px-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-teal-700" />
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Trending in Pune Today
            </h3>
          </div>
          <button 
            onClick={() => onNavigateTo('explore')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            View all
          </button>
        </div>

        <div className="flex gap-3 px-5 overflow-x-auto no-scrollbar pb-1">
          {trendingPlaces.map(place => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="min-w-[210px] w-[210px] bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer active:scale-[0.98] transition group flex-shrink-0"
            >
              <div className="h-28 overflow-hidden relative">
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 right-2 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-black text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>{place.rating.toFixed(1)}</span>
                </div>
                <div className="absolute bottom-2 left-2 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-teal-200">
                  {place.area}
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-black text-xs text-slate-900 truncate">{place.name}</h4>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{place.tagline}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 text-[11px]">
                  <span className="font-extrabold text-teal-700">
                    {place.indicativeCostPerPerson === 0 ? 'Free entry' : `~₹${place.indicativeCostPerPerson}`}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{place.avgDurationMinutes}m</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick AI Trip Plan Launcher Banner */}
      <div className="px-5">
        <div 
          onClick={() => onNavigateTo('planner')}
          className="relative rounded-2xl overflow-hidden p-4 bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-md cursor-pointer active:scale-[0.99] transition flex items-center justify-between"
        >
          <div className="space-y-1 pr-3">
            <span className="text-[10px] font-black tracking-widest uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-400/30 inline-block">
              1-Tap Smart Generator
            </span>
            <h4 className="text-sm font-black text-white">Pune in ₹500 Day Plan</h4>
            <p className="text-[11px] text-slate-300">
              Budget heritage walk + street food lunch + transit
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black flex-shrink-0 shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Discover Pune 4 Category Cards */}
      <div className="px-5 pt-1 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Discover by Theme</h3>
          <button 
            onClick={() => onNavigateTo('explore')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            See all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          
          {/* Card 1: Historical Sites */}
          <div
            onClick={() => onNavigateTo('explore')}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer active:scale-[0.98] transition group"
          >
            <div className="h-28 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=500&q=80"
                alt="Historical Sites"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-3">
              <h4 className="font-bold text-xs text-slate-900">Historical Sites</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Forts & Peshwa legacy</p>
            </div>
          </div>

          {/* Card 2: Food & Dining */}
          <div
            onClick={() => onNavigateTo('explore')}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer active:scale-[0.98] transition group"
          >
            <div className="h-28 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80"
                alt="Food & Dining"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-3">
              <h4 className="font-bold text-xs text-slate-900">Street Food & Cafes</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">FC Road & Mastani trail</p>
            </div>
          </div>

          {/* Card 3: Nature & Outdoors */}
          <div
            onClick={() => onNavigateTo('explore')}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer active:scale-[0.98] transition group"
          >
            <div className="h-28 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=500&q=80"
                alt="Nature & Outdoors"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-3">
              <h4 className="font-bold text-xs text-slate-900">Hills & Treks</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Sinhagad & Vetal Tekdi</p>
            </div>
          </div>

          {/* Card 4: Budget Friendly */}
          <div
            onClick={() => onNavigateTo('explore')}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer active:scale-[0.98] transition group"
          >
            <div className="h-28 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80"
                alt="Budget Friendly"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-3">
              <h4 className="font-bold text-xs text-slate-900">Spiritual & Gardens</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Saras Baug & Dagdusheth</p>
            </div>
          </div>

        </div>
      </div>

      {/* Emergency SOS Modal Drawer */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">Pune Emergency Helplines</h3>
                  <p className="text-[10px] text-slate-400">Direct 1-tap call assistance</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSosModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <a 
                href="tel:112"
                className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 hover:bg-rose-100 transition"
              >
                <div>
                  <span className="font-black text-xs block">National Emergency & Police</span>
                  <span className="text-[10px] text-rose-700">Pune Police Control Room</span>
                </div>
                <span className="font-black text-sm text-rose-700 bg-white px-3 py-1 rounded-xl shadow-sm">112</span>
              </a>

              <a 
                href="tel:1091"
                className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 hover:bg-purple-100 transition"
              >
                <div>
                  <span className="font-black text-xs block">Women Safety Helpline</span>
                  <span className="text-[10px] text-purple-700">Dedicated Pune Police Cell</span>
                </div>
                <span className="font-black text-sm text-purple-700 bg-white px-3 py-1 rounded-xl shadow-sm">1091</span>
              </a>

              <a 
                href="tel:108"
                className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 hover:bg-blue-100 transition"
              >
                <div>
                  <span className="font-black text-xs block">Medical & Ambulance</span>
                  <span className="text-[10px] text-blue-700">Maharashtra Emergency Medical</span>
                </div>
                <span className="font-black text-sm text-blue-700 bg-white px-3 py-1 rounded-xl shadow-sm">108</span>
              </a>

              <a 
                href="tel:1077"
                className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition"
              >
                <div>
                  <span className="font-black text-xs block">Pune Municipal Disaster Cell</span>
                  <span className="text-[10px] text-amber-700">PMC Waterlogging / Road Crisis</span>
                </div>
                <span className="font-black text-sm text-amber-700 bg-white px-3 py-1 rounded-xl shadow-sm">1077</span>
              </a>
            </div>

            <button
              onClick={() => setShowSosModal(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
