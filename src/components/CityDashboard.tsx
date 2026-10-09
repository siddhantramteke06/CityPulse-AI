import React, { useState, useEffect } from 'react';
import { Place, HazardReport, PlannerInput } from '../types';
import { PRESET_SCENARIOS } from '../utils/plannerEngine';
import { 
  Search, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  MapPin, 
  CloudSun, 
  TrendingUp, 
  ArrowRight, 
  IndianRupee, 
  Star, 
  Clock, 
  ExternalLink,
  Train,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

interface CityDashboardProps {
  places: Place[];
  hazardReports: HazardReport[];
  onSelectPlace: (place: Place) => void;
  onNavigateToTab: (tab: any) => void;
  onLaunchPresetPlanner: (presetInput: PlannerInput) => void;
  onUpvoteHazard: (hazardId: string) => void;
  onOpenDemoNotice: () => void;
}

export const CityDashboard: React.FC<CityDashboardProps> = ({
  places,
  hazardReports,
  onSelectPlace,
  onNavigateToTab,
  onLaunchPresetPlanner,
  onUpvoteHazard,
  onOpenDemoNotice
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    description: string;
    windSpeed: number;
    isLive: boolean;
  }>({
    temp: 27,
    description: 'Pleasant & Breezy',
    windSpeed: 12,
    isLive: false
  });

  // Fetch real live Pune weather from open-meteo (no API key needed!)
  useEffect(() => {
    let isMounted = true;
    fetch('https://api.open-meteo.com/v1/forecast?latitude=18.5204&longitude=73.8567&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m')
      .then(res => res.json())
      .then(data => {
        if (!isMounted || !data?.current) return;
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        let desc = 'Clear Sky';
        if (code >= 1 && code <= 3) desc = 'Partly Cloudy';
        else if (code >= 45 && code <= 48) desc = 'Foggy / Hazy';
        else if (code >= 51 && code <= 67) desc = 'Light Rain';
        else if (code >= 80) desc = 'Showers';

        setWeatherData({
          temp,
          description: desc,
          windSpeed: Math.round(data.current.wind_speed_10m),
          isLive: true
        });
      })
      .catch(() => {
        // graceful fallback to indicative weather
      });

    return () => { isMounted = false; };
  }, []);

  // Filtered search places
  const searchResults = searchQuery.trim() === ''
    ? []
    : places.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.localName && p.localName.includes(searchQuery))
      ).slice(0, 5);

  const featuredPlaces = places.slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>Pune Urban Intelligence Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Explore smarter. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-400 to-teal-200">
              Move safer. Experience more.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Navigate the glorious chaos of Pune with intelligent budget planning, verified heritage trails, transparent crowd warnings, and citizen-powered hazard reporting.
          </p>

          {/* Quick Search Bar */}
          <div className="relative pt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Shaniwar Wada, FC Road snacks, Sinhagad, Tulshibaug..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-700 focus:border-teal-400 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-inner transition"
              />
            </div>

            {/* Live Search Instant Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-30 divide-y divide-slate-800">
                {searchResults.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectPlace(p);
                      setSearchQuery('');
                    }}
                    className="p-3.5 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{p.name}</span>
                          {p.localName && <span className="text-xs text-teal-400">{p.localName}</span>}
                        </div>
                        <p className="text-xs text-slate-400">{p.categoryLabel} • {p.area}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-emerald-400">
                        {p.indicativeCostPerPerson === 0 ? 'Free' : `₹${p.indicativeCostPerPerson}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Discovery:</span>
            {['Heritage Sites', 'Student Street Food', 'Hill Treks', 'Old Peth Bazaars'].map((tag, idx) => (
              <button
                key={idx}
                onClick={() => onNavigateToTab('explore')}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Pune Live Pulse & Atmospheric Intelligence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Weather Card */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-400">Pune Weather</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${weatherData.isLive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                {weatherData.isLive ? 'LIVE' : 'SAMPLE'}
              </span>
            </div>
            <div className="text-2xl font-black text-white">{weatherData.temp}°C</div>
            <div className="text-xs text-slate-400">{weatherData.description} • Wind {weatherData.windSpeed} km/h</div>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <CloudSun className="w-6 h-6" />
          </div>
        </div>

        {/* Pune Metro Status */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Train className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-semibold text-slate-400">Pune Metro</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-teal-950 text-teal-400 border border-teal-800">
                ACTIVE
              </span>
            </div>
            <div className="text-base font-bold text-white">Aqua & Purple Lines</div>
            <div className="text-xs text-slate-400">Civil Court Interchange • Trains every 7 min</div>
          </div>
          <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
            <Train className="w-6 h-6" />
          </div>
        </div>

        {/* Community Hazards Verified */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-400">Safety Watch</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-950 text-amber-400 border border-amber-800">
                DEMO DATA
              </span>
            </div>
            <div className="text-2xl font-black text-white">{hazardReports.length} Reports</div>
            <div className="text-xs text-slate-400">{hazardReports.filter(r => r.verificationStatus === 'Verified').length} Verified • Community monitored</div>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Rapid Citizen Reporting CTA */}
        <div 
          onClick={() => onNavigateToTab('reporting')}
          className="p-4 bg-gradient-to-br from-teal-950/40 to-slate-900 border border-teal-500/30 rounded-2xl cursor-pointer hover:border-teal-400/60 transition group flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1 text-teal-400 text-xs font-bold mb-1">
              <Flame className="w-3.5 h-3.5 text-teal-300" />
              <span>REPORT ROAD / HAZARD</span>
            </div>
            <div className="text-sm font-bold text-white group-hover:text-teal-200 transition">Spotted an issue?</div>
            <div className="text-xs text-slate-400">Submit text, photo & voice report</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 group-hover:translate-x-1 transition">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* SIGNATURE SECTION: 3 AI City Planner Scenarios */}
      <div className="p-6 sm:p-8 bg-slate-900/60 border border-teal-500/30 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Signature Feature • AI Trip Planner</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              One-Click Curated Pune Scenarios
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Budget-constrained, sequenced itineraries with calculated transit legs and timing.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('planner')}
            className="self-start sm:self-auto px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center gap-2"
          >
            <span>Open Custom Planner</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_SCENARIOS.map(preset => (
            <div
              key={preset.id}
              className="p-5 bg-slate-900 border border-slate-700/80 hover:border-teal-400/60 rounded-2xl flex flex-col justify-between transition hover:-translate-y-1 shadow-lg group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    ₹{preset.input.budgetINR} Budget
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {preset.input.durationHours} hrs
                  </span>
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-teal-300 transition mb-1.5">
                  {preset.label}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {preset.description}
                </p>
              </div>

              <button
                onClick={() => onLaunchPresetPlanner(preset.input)}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-teal-600 text-slate-200 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 hover:border-teal-500 transition flex items-center justify-center gap-2"
              >
                <span>Launch Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Places Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Must-Explore Pune Landmarks</h2>
            <p className="text-xs text-slate-400">Authentic historical monuments, buzzing food streets, and sacred sanctums</p>
          </div>
          <button
            onClick={() => onNavigateToTab('explore')}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition"
          >
            <span>View All ({places.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPlaces.map(place => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition group flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-950/80 text-teal-300 backdrop-blur border border-teal-500/30">
                  {place.categoryLabel}
                </span>
                <span className="absolute bottom-2.5 left-2.5 text-xs font-bold text-white">
                  {place.area}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="font-bold text-sm text-white group-hover:text-teal-300 transition truncate">
                      {place.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{place.tagline}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{place.rating.toFixed(1)}</span>
                  </div>
                  <div className="font-semibold text-emerald-400">
                    {place.indicativeCostPerPerson === 0 ? 'Free' : `~₹${place.indicativeCostPerPerson}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Hazard & Urban Conditions Feed */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Urban Hazard & Conditions Feed</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded">
                  Sample Demonstration Feed
                </span>
              </div>
              <p className="text-xs text-slate-400">Local community reports for roads, lighting, waterlogging, and crowds</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('safety')}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition"
          >
            <span>Safety Map</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {hazardReports.slice(0, 4).map(report => (
            <div
              key={report.id}
              className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                    report.severity === 'high' ? 'bg-red-950 text-red-400 border border-red-800' :
                    report.severity === 'medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}>
                    {report.categoryLabel}
                  </span>
                  <span className="text-slate-400">{report.timestamp}</span>
                </div>
                <h4 className="font-bold text-slate-200 text-sm">{report.title}</h4>
                <p className="text-slate-400 line-clamp-2">{report.description}</p>
                <div className="text-[11px] text-teal-400 flex items-center gap-1 pt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{report.locationName}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  onClick={() => onUpvoteHazard(report.id)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                    report.userVoted
                      ? 'bg-teal-600 text-white border-teal-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title="Upvote community verification"
                >
                  <span>▲</span>
                  <span>{report.upvotes}</span>
                </button>
                <span className="text-[10px] text-slate-400">{report.verificationStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
