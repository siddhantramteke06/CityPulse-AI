import React from 'react';
import { X, ShieldCheck, AlertCircle, Info, Database, MapPin } from 'lucide-react';

interface DemoDataNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoDataNoticeModal: React.FC<DemoDataNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Data Integrity & Demo Disclosures</h3>
              <p className="text-xs text-slate-400">CityPulse AI Pune • Academic & PromptWar Competition Edition</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 py-4 text-sm leading-relaxed text-slate-300">
          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-start gap-3">
            <Info className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-100 text-sm">Strict Competition Transparency Policy</p>
              <p className="text-xs text-slate-300 mt-1">
                To prevent misinformation, CityPulse AI strictly separates verified geospatial landmarks from illustrative simulation data. No paid APIs or fabricated police/official claims are used.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
              <div className="flex items-center gap-2 font-semibold text-emerald-400 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Real & Verified Data</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                <li><strong className="text-slate-100">Pune Geospatial Anchors:</strong> Real coordinates for Shaniwar Wada, Sinhagad, FC Road, Saras Baug, etc.</li>
                <li><strong className="text-slate-100">Live Weather:</strong> Real live Pune temperature & conditions pulled directly from Open-Meteo public API (no key required).</li>
                <li><strong className="text-slate-100">OpenStreetMap:</strong> True public vector cartography via Leaflet.</li>
              </ul>
            </div>

            <div className="p-3.5 bg-amber-950/30 border border-amber-800/40 rounded-xl">
              <div className="flex items-center gap-2 font-semibold text-amber-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Demonstration & Indicative Data</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                <li><strong className="text-slate-100">Indicative Pricing:</strong> Entry tickets and average food expenditures are conservative estimates in INR, subject to actual vendor change.</li>
                <li><strong className="text-slate-100">Hazard Reports:</strong> Seeded sample alerts (potholes, waterlogging, lighting) clearly labeled as demonstration mock reports.</li>
                <li><strong className="text-slate-100">Local Citizen Submissions:</strong> Saved locally in browser localStorage without external police dispatch.</li>
              </ul>
            </div>
          </div>

          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
            <div className="flex items-center gap-2 font-semibold text-slate-200 text-xs mb-1.5">
              <Database className="w-4 h-4 text-teal-400" />
              <span>Offline-First Architecture</span>
            </div>
            <p className="text-xs text-slate-400">
              User submissions and saved plans persist across browser refreshes via encrypted JSON keys in browser <code className="text-teal-300 bg-slate-900 px-1 py-0.5 rounded">localStorage</code>. The architecture is cleanly decoupled to attach to an Express/Firebase backend without modifying UI contracts.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg text-xs transition"
          >
            Understood & Close
          </button>
        </div>

      </div>
    </div>
  );
};
