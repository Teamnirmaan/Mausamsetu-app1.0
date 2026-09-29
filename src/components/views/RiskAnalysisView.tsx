import React from 'react';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Info,
  SlidersHorizontal,
  Flame,
  CloudRain,
  Wind,
  Waves
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { SeverityLevel } from '../../types';

export const RiskAnalysisView: React.FC = () => {
  const { selectedCity, selectedArea, riskAnalysis, weather } = useLocation();

  const getLevelColor = (level: SeverityLevel) => {
    switch (level) {
      case 'Severe':
        return 'text-rose-400 bg-rose-950/60 border-rose-800';
      case 'High':
        return 'text-red-400 bg-red-950/60 border-red-800';
      case 'Moderate':
        return 'text-amber-400 bg-amber-950/60 border-amber-800';
      default:
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
    }
  };

  const getBarColor = (level: SeverityLevel) => {
    switch (level) {
      case 'Severe':
        return 'bg-rose-500';
      case 'High':
        return 'bg-red-500';
      case 'Moderate':
        return 'bg-amber-500';
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
              Multi-Hazard Vulnerability Engine
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedArea.name}, {selectedCity.name}</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">RISK ANALYSIS & HAZARD INDEX</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluates atmospheric thresholds, topography elevation ({selectedArea.elevationMeters}m), and drainage gradients.
          </p>
        </div>

        {/* Overall Composite Score Card */}
        <div className="flex items-center gap-4 bg-slate-950/90 border border-slate-800 p-4 rounded-xl">
          <div className="text-right">
            <span className="text-xs uppercase font-bold text-slate-400 block">Composite Threat</span>
            <div className="flex items-center justify-end gap-2 mt-0.5">
              <span className="text-2xl font-black text-white">{riskAnalysis.overallScore}/100</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase border ${getLevelColor(riskAnalysis.overallLevel)}`}>
                {riskAnalysis.overallLevel}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Primary: {riskAnalysis.primaryHazard}</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
            <Activity className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Breakdown Factors (Requirement 24 & 25) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskAnalysis.factors.map((factor, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Hazard Dimension
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{factor.hazard}</h3>
                </div>

                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase border ${getLevelColor(factor.level)}`}>
                  {factor.level} RISK
                </span>
              </div>

              {/* Progress Bar & Value */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                  <span>Current Metric: <strong className="text-white">{factor.metricValue}</strong></span>
                  <span className="text-slate-400">Threshold: {factor.threshold}</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all ${getBarColor(factor.level)}`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
              </div>

              {/* Detailed Reason (Requirement 25: Every hazard must have a reason) */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-slate-200">Physical Causation: </strong>
                  {factor.explanation}
                </p>
              </div>
            </div>

            {/* Mitigation Box */}
            <div className="pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-300">Action: </strong>
                <span>{factor.mitigation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scientific Principle Notice */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Relevance Filter Activated: </strong>
          Irrelevant hazards (such as snowfall in Pune or Mumbai) are dynamically excluded by the climate boundary validator. Only hazards physically plausible under current seasonal synoptics are calculated.
        </div>
      </div>
    </div>
  );
};
