import React, { useState } from 'react';
import { 
  Compass, 
  Map, 
  Sparkles, 
  ShieldCheck, 
  Megaphone, 
  ArrowLeftRight, 
  Bookmark, 
  Menu, 
  X, 
  Info,
  Activity,
  Smartphone
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'explore' 
  | 'planner' 
  | 'safety' 
  | 'reporting' 
  | 'compare' 
  | 'saved';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenDemoNotice: () => void;
  onOpenInstallModal: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenDemoNotice,
  onOpenInstallModal,
  savedCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'City Dashboard', icon: <Compass className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore Pune', icon: <Map className="w-4 h-4" /> },
    { id: 'planner', label: 'AI City Planner', icon: <Sparkles className="w-4 h-4" />, badge: 'Signature' },
    { id: 'safety', label: 'Safety Explorer', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'reporting', label: 'Citizen Reports', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare Places', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { 
      id: 'saved', 
      label: 'Saved Trips', 
      icon: <Bookmark className="w-4 h-4" />, 
      badge: savedCount > 0 ? `${savedCount}` : undefined 
    }
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Pune Label */}
          <div 
            onClick={() => handleTabClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20 group-hover:scale-105 transition">
              <Activity className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">CityPulse</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded">AI</span>
                <span className="text-[11px] font-medium text-slate-400">Pune</span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Explore smarter. Move safer. Experience more.</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-teal-300 border border-teal-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                      item.badge === 'Signature'
                        ? 'bg-teal-500/30 text-teal-200 border border-teal-400/40'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Tools & Badges */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-teal-300 bg-teal-950/60 border border-teal-500/40 rounded-lg hover:bg-teal-900/40 transition shadow-sm"
              title="Install CityPulse AI as a Mobile App"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span>Install Mobile App</span>
            </button>

            <button
              onClick={onOpenDemoNotice}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-amber-300 bg-amber-950/40 border border-amber-700/50 rounded-lg hover:bg-amber-900/40 transition"
              title="Click to view Demo Data & Verification Disclosures"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Demo Data Notice</span>
            </button>
          </div>

          {/* Mobile Header Buttons */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-teal-300 bg-teal-950/60 border border-teal-500/40 rounded-md"
              title="Install Mobile App"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Install</span>
            </button>

            <button
              onClick={onOpenDemoNotice}
              className="p-1.5 text-amber-300 bg-amber-950/40 border border-amber-800/50 rounded-md text-xs"
              title="Demo Data Disclosure"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 px-4 pt-3 pb-5 space-y-1 shadow-2xl animate-fade-in">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-teal-950/50 text-teal-300 border border-teal-500/40'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
