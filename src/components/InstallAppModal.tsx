import React from 'react';
import { X, Smartphone, Download, Share, PlusSquare, CheckCircle2 } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onTriggerInstall: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstall
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/20 text-teal-300 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Install CityPulse Mobile App</h3>
              <p className="text-[11px] text-slate-400">Zero App Store downloads required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click install if Android / Chrome has native prompt */}
        {deferredPrompt ? (
          <div className="p-4 bg-teal-950/40 border border-teal-500/40 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
              <Download className="w-4 h-4" />
              <span>Direct 1-Tap Installation Ready</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Install CityPulse directly to your home screen. Opens in standalone fullscreen mode without browser URL bars.
            </p>
            <button
              onClick={onTriggerInstall}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Install to Home Screen Now</span>
            </button>
          </div>
        ) : null}

        {/* iOS (iPhone / Safari) Guide */}
        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-slate-100 font-bold">
            <Share className="w-4 h-4 text-teal-400" />
            <span>iPhone / iOS Users (Safari)</span>
          </div>
          <ol className="space-y-2 list-decimal list-inside text-slate-300">
            <li>Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline text-teal-400" /> at bottom of Safari.</li>
            <li>Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline text-teal-400" />.</li>
            <li>Tap <strong>Add</strong> at top right. CityPulse AI appears on your phone screen!</li>
          </ol>
        </div>

        {/* Android / Chrome Manual Guide */}
        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-slate-100 font-bold">
            <Smartphone className="w-4 h-4 text-teal-400" />
            <span>Android / Chrome Users</span>
          </div>
          <p className="text-slate-300">
            Tap the 3 dots menu (⋮) in Chrome and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
          </p>
        </div>

        {/* Features */}
        <div className="text-[11px] text-slate-400 grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fullscreen App Mode</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Offline Saved Trips</span>
          </div>
        </div>

      </div>
    </div>
  );
};
