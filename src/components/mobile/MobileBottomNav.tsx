import React from 'react';
import { Home, Compass, Calendar, Shield, Bookmark, Sparkles } from 'lucide-react';

export type MobileTab = 'home' | 'explore' | 'planner' | 'safety' | 'more';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  savedCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  savedCount = 0
}) => {
  const tabs: { id: MobileTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'planner', label: 'Planner', icon: <Calendar className="w-5 h-5" /> },
    { id: 'safety', label: 'Safety', icon: <Shield className="w-5 h-5" /> },
    { id: 'more', label: 'Saved', icon: <Bookmark className="w-5 h-5" />, badge: savedCount > 0 ? savedCount : undefined }
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 px-2 py-1.5 flex items-center justify-around shadow-[0_-8px_20px_rgba(0,0,0,0.04)] select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 relative ${
              isActive ? 'text-teal-800 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition duration-200 ${
              isActive ? 'bg-teal-50 text-teal-800' : ''
            }`}>
              {tab.icon}
              {tab.badge && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-teal-700 absolute bottom-0" />
            )}
          </button>
        );
      })}
    </div>
  );
};
