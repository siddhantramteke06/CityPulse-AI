import React from 'react';
import { NavTab } from './Navbar';
import { 
  Compass, 
  Map, 
  Sparkles, 
  ShieldCheck, 
  Megaphone, 
  Bookmark 
} from 'lucide-react';

interface MobileTabBarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  savedCount: number;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeTab,
  onSelectTab,
  savedCount
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode; isAccent?: boolean; badge?: number }[] = [
    { id: 'dashboard', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'explore', label: 'Map', icon: <Map className="w-5 h-5" /> },
    { id: 'planner', label: 'AI Plan', icon: <Sparkles className="w-5 h-5" />, isAccent: true },
    { id: 'safety', label: 'Safety', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'reporting', label: 'Report', icon: <Megaphone className="w-5 h-5" /> },
    { id: 'saved', label: 'Saved', icon: <Bookmark className="w-5 h-5" />, badge: savedCount }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 pb-safe shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
                isActive
                  ? tab.isAccent
                    ? 'text-teal-400 font-bold scale-105'
                    : 'text-teal-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 px-1 text-[9px] font-black rounded-full bg-teal-500 text-slate-950">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 tracking-tight leading-none">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
