import React, { useState } from 'react';
import { Place, GeneratedPlan, HazardReport } from '../../types';
import { PUNE_PLACES } from '../../data/puneData';
import { 
  getStoredReports, 
  saveNewReport, 
  toggleVoteReport, 
  getFavouritePlaceIds, 
  toggleFavouritePlaceId, 
  getSavedPlans, 
  savePlanToStorage 
} from '../../utils/storage';
import { generateSmartItinerary } from '../../utils/plannerEngine';

import { SplashScreen } from './SplashScreen';
import { MobileHome } from './MobileHome';
import { MobileExplore } from './MobileExplore';
import { MobilePlaceDetail } from './MobilePlaceDetail';
import { MobileAiPlanner } from './MobileAiPlanner';
import { MobileItineraryResult } from './MobileItineraryResult';
import { MobileSafety } from './MobileSafety';
import { MobileCitizenReport } from './MobileCitizenReport';
import { MobileCompare } from './MobileCompare';
import { MobileSaved } from './MobileSaved';
import { MobileBottomNav, MobileTab } from './MobileBottomNav';
import { DemoDataNoticeModal } from '../DemoDataNoticeModal';

import { 
  Wifi, 
  Battery, 
  Signal, 
  Download, 
  Smartphone, 
  Maximize2, 
  Minimize2,
  CheckCircle2
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';

export type ScreenId = 
  | 'splash'
  | 'home'
  | 'explore'
  | 'place_detail'
  | 'planner'
  | 'itinerary'
  | 'safety'
  | 'reporting'
  | 'compare'
  | 'saved';

export const MobileAppShell: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [activeBottomTab, setActiveBottomTab] = useState<MobileTab>('home');
  const [places] = useState<Place[]>(PUNE_PLACES);
  const [hazardReports, setHazardReports] = useState<HazardReport[]>(() => getStoredReports());
  const [favouriteIds, setFavouriteIds] = useState<string[]>(() => getFavouritePlaceIds());
  const [savedPlans, setSavedPlans] = useState<GeneratedPlan[]>(() => getSavedPlans());
  const [isDemoNoticeOpen, setIsDemoNoticeOpen] = useState(false);

  // Selected place for details
  const [selectedPlace, setSelectedPlace] = useState<Place>(PUNE_PLACES[0]);
  
  // Active generated plan
  const [activePlan, setActivePlan] = useState<GeneratedPlan>(() => 
    generateSmartItinerary({
      startingLocation: 'swargate',
      budgetINR: 500,
      durationHours: 4,
      interests: ['heritage', 'food', 'temple', 'shopping'],
      groupSize: 'couple',
      pace: 'balanced'
    })
  );

  // Desktop view toggle: phone chassis frame vs fullscreen
  const [isChassisMode, setIsChassisMode] = useState<boolean>(true);

  const handleToggleFavourite = (placeId: string) => {
    const updated = toggleFavouritePlaceId(placeId);
    setFavouriteIds(updated);
  };

  const handleUpvoteHazard = (hazardId: string) => {
    const { reports } = toggleVoteReport(hazardId);
    setHazardReports([...reports]);
  };

  const handleSubmitReport = (report: HazardReport) => {
    const updated = saveNewReport(report);
    setHazardReports(updated);
  };

  const handleSavePlan = (plan: GeneratedPlan) => {
    const updated = savePlanToStorage(plan);
    setSavedPlans(updated);
  };

  const handleRemoveStop = (stopNumber: number) => {
    if (!activePlan || activePlan.stops.length <= 2) return;
    const newStops = activePlan.stops
      .filter(s => s.stopNumber !== stopNumber)
      .map((s, idx) => ({
        ...s,
        stopNumber: idx + 1
      }));
    const newCost = newStops.reduce((sum, s) => sum + s.estimatedCostINR, 0);
    setActivePlan({
      ...activePlan,
      stops: newStops,
      totalEstimatedCostINR: newCost,
    });
  };

  const handleBottomTabSelect = (tab: MobileTab) => {
    setActiveBottomTab(tab);
    if (tab === 'home') setCurrentScreen('home');
    else if (tab === 'explore') setCurrentScreen('explore');
    else if (tab === 'planner') setCurrentScreen('planner');
    else if (tab === 'safety') setCurrentScreen('safety');
    else if (tab === 'more') setCurrentScreen('saved');
  };

  const isNative = Capacitor.isNativePlatform();

  // If running inside native Android APK directly on a phone:
  if (isNative) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
        <div className="flex-1 w-full bg-[#F8FAFC]">
          {currentScreen === 'splash' && (
            <SplashScreen onGetStarted={() => { setCurrentScreen('home'); setActiveBottomTab('home'); }} />
          )}
          {currentScreen === 'home' && (
            <MobileHome
              places={places}
              onNavigateTo={(screen) => {
                if (screen === 'explore') { setCurrentScreen('explore'); setActiveBottomTab('explore'); }
                else if (screen === 'planner') { setCurrentScreen('planner'); setActiveBottomTab('planner'); }
                else if (screen === 'safety') { setCurrentScreen('safety'); setActiveBottomTab('safety'); }
                else if (screen === 'compare') { setCurrentScreen('compare'); }
              }}
              onSelectPlace={(place) => { setSelectedPlace(place); setCurrentScreen('place_detail'); }}
              onOpenDemoNotice={() => setIsDemoNoticeOpen(true)}
            />
          )}
          {currentScreen === 'explore' && (
            <MobileExplore
              places={places}
              onBack={() => { setCurrentScreen('home'); setActiveBottomTab('home'); }}
              onSelectPlace={(place) => { setSelectedPlace(place); setCurrentScreen('place_detail'); }}
              favouriteIds={favouriteIds}
              onToggleFavourite={handleToggleFavourite}
            />
          )}
          {currentScreen === 'place_detail' && (
            <MobilePlaceDetail
              place={selectedPlace}
              onBack={() => setCurrentScreen('explore')}
              isFavourite={favouriteIds.includes(selectedPlace.id)}
              onToggleFavourite={handleToggleFavourite}
              onSelectRelatedPlace={(place) => { setSelectedPlace(place); setCurrentScreen('place_detail'); }}
            />
          )}
          {currentScreen === 'planner' && (
            <MobileAiPlanner
              onBack={() => { setCurrentScreen('home'); setActiveBottomTab('home'); }}
              onPlanGenerated={(plan) => { setActivePlan(plan); setCurrentScreen('itinerary'); }}
            />
          )}
          {currentScreen === 'itinerary' && (
            <MobileItineraryResult
              plan={activePlan}
              onBack={() => setCurrentScreen('planner')}
              onSavePlan={handleSavePlan}
              onRemoveStop={handleRemoveStop}
            />
          )}
          {currentScreen === 'safety' && (
            <MobileSafety
              hazards={hazardReports}
              onBack={() => { setCurrentScreen('home'); setActiveBottomTab('home'); }}
              onUpvoteHazard={handleUpvoteHazard}
              onNavigateToReport={() => setCurrentScreen('reporting')}
            />
          )}
          {currentScreen === 'reporting' && (
            <MobileCitizenReport
              onBack={() => setCurrentScreen('safety')}
              onSubmitReport={handleSubmitReport}
            />
          )}
          {currentScreen === 'compare' && (
            <MobileCompare places={places} onBack={() => { setCurrentScreen('home'); setActiveBottomTab('home'); }} />
          )}
          {currentScreen === 'saved' && (
            <MobileSaved
              places={places}
              favouriteIds={favouriteIds}
              savedPlans={savedPlans}
              onToggleFavourite={handleToggleFavourite}
              onSelectPlace={(place) => { setSelectedPlace(place); setCurrentScreen('place_detail'); }}
              onSelectPlan={(plan) => { setActivePlan(plan); setCurrentScreen('itinerary'); }}
              onNavigateToPlanner={() => { setCurrentScreen('planner'); setActiveBottomTab('planner'); }}
              onNavigateToExplore={() => { setCurrentScreen('explore'); setActiveBottomTab('explore'); }}
            />
          )}
        </div>

        {['home', 'explore', 'planner', 'safety', 'saved', 'compare'].includes(currentScreen) && (
          <MobileBottomNav 
            activeTab={activeBottomTab} 
            onSelectTab={handleBottomTabSelect}
            savedCount={favouriteIds.length}
          />
        )}

        <DemoDataNoticeModal
          isOpen={isDemoNoticeOpen}
          onClose={() => setIsDemoNoticeOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* Top Desktop Action Toolbar */}
      <header className="w-full bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-base">CityPulse AI</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-500 text-slate-950 uppercase tracking-wider">
              Native Mobile App
            </span>
          </div>

          <span className="text-xs text-slate-400 hidden sm:inline">
            • Exact 1:1 Mobile UI Experience
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Direct APK Download Button */}
          <a
            href="/CityPulse-AI.apk"
            download="CityPulse-AI.apk"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 transition active:scale-95"
            title="Download compiled Android APK (8.2 MB)"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Download Android APK (8.2 MB)</span>
          </a>

          {/* Quick Screen Switcher Dropdown */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 text-[11px] font-bold">Screen:</span>
            <select
              value={currentScreen}
              onChange={e => setCurrentScreen(e.target.value as ScreenId)}
              className="bg-transparent text-teal-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="splash" className="bg-slate-900 text-white">1. Splash Screen</option>
              <option value="home" className="bg-slate-900 text-white">2. Home / Dashboard</option>
              <option value="explore" className="bg-slate-900 text-white">3. Explore / Map View</option>
              <option value="place_detail" className="bg-slate-900 text-white">4. Place Details</option>
              <option value="planner" className="bg-slate-900 text-white">5. AI Trip Planner</option>
              <option value="itinerary" className="bg-slate-900 text-white">6. Generated Itinerary</option>
              <option value="safety" className="bg-slate-900 text-white">7. Safety Explorer</option>
              <option value="reporting" className="bg-slate-900 text-white">8. Citizen Reporting</option>
              <option value="compare" className="bg-slate-900 text-white">9. Compare Places</option>
              <option value="saved" className="bg-slate-900 text-white">10. Saved Places & Trips</option>
            </select>
          </div>

          {/* Chassis / Fullscreen toggle for desktop */}
          <button
            onClick={() => setIsChassisMode(!isChassisMode)}
            className="hidden lg:flex items-center gap-1.5 p-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold"
            title="Toggle Smartphone Chassis Frame"
          >
            {isChassisMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{isChassisMode ? 'Full Width' : 'Phone Frame'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className={`w-full flex-1 flex items-center justify-center ${isChassisMode ? 'py-4 sm:py-8' : ''}`}>
        
        {/* Smartphone Chassis Device Mockup (Auto full-width on mobile) */}
        <div className={`relative w-full overflow-hidden transition-all duration-300 ${
          isChassisMode
            ? 'max-w-[430px] sm:rounded-[52px] sm:border-[10px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700 sm:shadow-[0_25px_70px_rgba(0,0,0,0.8)] bg-white'
            : 'max-w-2xl bg-white min-h-screen'
        }`}>
          
          {/* iOS Status Bar (9:41, Dynamic Island, Battery) */}
          <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-6 pt-3 pb-1 flex items-center justify-between text-slate-900 text-xs font-black select-none border-b border-slate-50">
            <span>9:41</span>
            
            {/* Dynamic Island Pill */}
            <div className="w-24 h-4.5 bg-black rounded-full mx-auto hidden sm:block" />

            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
              <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
              <Battery className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          {/* Screen Switcher Body */}
          <div className="relative w-full min-h-[760px] bg-[#F8FAFC]">
            
            {/* Screen 1: Splash Screen */}
            {currentScreen === 'splash' && (
              <SplashScreen
                onGetStarted={() => {
                  setCurrentScreen('home');
                  setActiveBottomTab('home');
                }}
              />
            )}

            {/* Screen 2: Home Dashboard */}
            {currentScreen === 'home' && (
              <MobileHome
                places={places}
                onNavigateTo={(screen) => {
                  if (screen === 'explore') {
                    setCurrentScreen('explore');
                    setActiveBottomTab('explore');
                  } else if (screen === 'planner') {
                    setCurrentScreen('planner');
                    setActiveBottomTab('planner');
                  } else if (screen === 'safety') {
                    setCurrentScreen('safety');
                    setActiveBottomTab('safety');
                  } else if (screen === 'compare') {
                    setCurrentScreen('compare');
                  }
                }}
                onSelectPlace={(place) => {
                  setSelectedPlace(place);
                  setCurrentScreen('place_detail');
                }}
                onOpenDemoNotice={() => setIsDemoNoticeOpen(true)}
              />
            )}

            {/* Screen 3: Explore / Map View */}
            {currentScreen === 'explore' && (
              <MobileExplore
                places={places}
                onBack={() => {
                  setCurrentScreen('home');
                  setActiveBottomTab('home');
                }}
                onSelectPlace={(place) => {
                  setSelectedPlace(place);
                  setCurrentScreen('place_detail');
                }}
                favouriteIds={favouriteIds}
                onToggleFavourite={handleToggleFavourite}
              />
            )}

            {/* Screen 4: Place Details */}
            {currentScreen === 'place_detail' && (
              <MobilePlaceDetail
                place={selectedPlace}
                onBack={() => setCurrentScreen('explore')}
                isFavourite={favouriteIds.includes(selectedPlace.id)}
                onToggleFavourite={handleToggleFavourite}
                onSelectRelatedPlace={(place) => { setSelectedPlace(place); setCurrentScreen('place_detail'); }}
              />
            )}

            {/* Screen 5: AI Trip Planner */}
            {currentScreen === 'planner' && (
              <MobileAiPlanner
                onBack={() => {
                  setCurrentScreen('home');
                  setActiveBottomTab('home');
                }}
                onPlanGenerated={(plan) => {
                  setActivePlan(plan);
                  setCurrentScreen('itinerary');
                }}
              />
            )}

            {/* Screen 6: Generated Itinerary */}
            {currentScreen === 'itinerary' && (
              <MobileItineraryResult
                plan={activePlan}
                onBack={() => setCurrentScreen('planner')}
                onSavePlan={handleSavePlan}
                onRemoveStop={handleRemoveStop}
              />
            )}

            {/* Screen 7: Safety Explorer */}
            {currentScreen === 'safety' && (
              <MobileSafety
                hazards={hazardReports}
                onBack={() => {
                  setCurrentScreen('home');
                  setActiveBottomTab('home');
                }}
                onUpvoteHazard={handleUpvoteHazard}
                onNavigateToReport={() => setCurrentScreen('reporting')}
              />
            )}

            {/* Screen 8: Citizen Reporting */}
            {currentScreen === 'reporting' && (
              <MobileCitizenReport
                onBack={() => setCurrentScreen('safety')}
                onSubmitReport={handleSubmitReport}
              />
            )}

            {/* Screen 9: Compare Places */}
            {currentScreen === 'compare' && (
              <MobileCompare
                places={places}
                onBack={() => {
                  setCurrentScreen('home');
                  setActiveBottomTab('home');
                }}
              />
            )}

            {/* Screen 10: Saved Places & Trips */}
            {currentScreen === 'saved' && (
              <MobileSaved
                places={places}
                favouriteIds={favouriteIds}
                savedPlans={savedPlans}
                onToggleFavourite={handleToggleFavourite}
                onSelectPlace={(place) => {
                  setSelectedPlace(place);
                  setCurrentScreen('place_detail');
                }}
                onSelectPlan={(plan) => {
                  setActivePlan(plan);
                  setCurrentScreen('itinerary');
                }}
                onNavigateToPlanner={() => {
                  setCurrentScreen('planner');
                  setActiveBottomTab('planner');
                }}
                onNavigateToExplore={() => {
                  setCurrentScreen('explore');
                  setActiveBottomTab('explore');
                }}
              />
            )}

          </div>

          {/* Screen Bottom Tab Bar (Shown on primary tab screens) */}
          {['home', 'explore', 'planner', 'safety', 'saved', 'compare'].includes(currentScreen) && (
            <MobileBottomNav
              activeTab={activeBottomTab}
              onSelectTab={handleBottomTabSelect}
              savedCount={favouriteIds.length}
            />
          )}

          {/* iPhone Home Bar Pill indicator */}
          <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto my-2" />

        </div>

      </div>

      <DemoDataNoticeModal
        isOpen={isDemoNoticeOpen}
        onClose={() => setIsDemoNoticeOpen(false)}
      />
    </div>
  );
};
