import React from 'react';
import {
  GitCompare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Radio,
  MapPin,
  ExternalLink,
  Info
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { VerificationStatus } from '../../types';

export const SourceComparisonView: React.FC = () => {
  const { selectedCity, selectedArea, sourceComparisons, weather } = useLocation();

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'SUPPORTED':
        return 'bg-emerald-950/80 border-emerald-700 text-emerald-300';
      case 'PARTIALLY SUPPORTED':
        return 'bg-amber-950/80 border-amber-700 text-amber-300';
      case 'NOT VERIFIED':
        return 'bg-slate-800 border-slate-700 text-slate-300';
      case 'OUTDATED':
        return 'bg-purple-950/80 border-purple-700 text-purple-300';
      case 'UNABLE TO CONFIRM':
        return 'bg-rose-950/80 border-rose-700 text-rose-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
              Cross-Source Truth Engine
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedArea.name}, {selectedCity.name}</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">SOURCE COMPARISON</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-referencing official IMD telemetry, global numerical models, regional news bureaus, and crowdsourced reports for <strong className="text-slate-200">{selectedArea.name}</strong>.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-right">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Consensus Confidence</span>
          <span className="text-lg font-black text-emerald-400">HIGH CONSENSUS (94%)</span>
        </div>
      </div>

      {/* Comparison Cards List */}
      <div className="space-y-3">
        {sourceComparisons.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 shrink-0">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white">{item.sourceName}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    {item.sourceType}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Claim / Broadcast: "{item.hazardClaim}"</p>
                <p className="text-[11px] text-slate-400 mt-1">{item.notes}</p>
              </div>
            </div>

            {/* Metrics & Status */}
            <div className="flex flex-wrap items-center gap-6 justify-between md:justify-end text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">TEMP / RAIN</span>
                <span className="text-white font-bold">{item.temperature} | {item.rainfall}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block">TIMESTAMP</span>
                <span className="text-slate-300 text-[11px]">{item.timestamp}</span>
              </div>

              <div className="text-right">
                <span className="text-slate-400 text-[10px] block mb-1">VERIFICATION STATUS</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nuanced Verification Policy */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Nuanced Scientific Verification: </strong>
          MausamSetu adheres to meteorological verification standards. We do not arbitrarily brand citizen reports as "Fake News". Instead, reports are categorized as Supported, Partially Supported, Outdated, or Unable to Confirm based on radar reflectivity and ground sensor correlation.
        </div>
      </div>
    </div>
  );
};
