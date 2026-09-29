import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CloudRain,
  Flame,
  Wind,
  Zap,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter,
  Mail,
  ChevronRight,
  Info,
  Waves,
  SunMedium
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { HazardType, SeverityLevel, AlertStatus, LocationAlert } from '../../types';

interface ActiveAlertsViewProps {
  onOpenEmailModalForAlert: (alert: LocationAlert) => void;
}

export const ActiveAlertsView: React.FC<ActiveAlertsViewProps> = ({ onOpenEmailModalForAlert }) => {
  const { selectedCity, selectedArea, activeAlerts, lastCheckedTime, weather } = useLocation();
  const { user } = useAuth();

  // Filters (Requirement 12)
  const [selectedHazard, setSelectedHazard] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('Active');

  // Filtered alerts for the current city and area
  const filteredAlerts = useMemo(() => {
    return activeAlerts.filter(alert => {
      if (selectedHazard !== 'All' && alert.hazardType !== selectedHazard) return false;
      if (selectedSeverity !== 'All' && alert.severity !== selectedSeverity) return false;
      if (selectedStatus !== 'All' && alert.status !== selectedStatus) return false;
      return true;
    });
  }, [activeAlerts, selectedHazard, selectedSeverity, selectedStatus]);

  const getHazardIcon = (hazard: HazardType) => {
    switch (hazard) {
      case 'Heavy Rain':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'Heat Risk':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Strong Wind':
        return <Wind className="w-5 h-5 text-teal-400" />;
      case 'Thunderstorm':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Flood Risk':
        return <Waves className="w-5 h-5 text-indigo-400" />;
      case 'High UV':
        return <SunMedium className="w-5 h-5 text-amber-400" />;
      case 'Poor Air Quality':
        return <Activity className="w-5 h-5 text-purple-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
    }
  };

  const getSeverityBadgeClass = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Severe':
        return 'bg-rose-950/80 border-rose-700 text-rose-300 shadow-rose-950/50';
      case 'High':
        return 'bg-red-950/80 border-red-700 text-red-300';
      case 'Moderate':
        return 'bg-amber-950/80 border-amber-700 text-amber-300';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Location Header (Requirement 10) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-800/50">
              LOCATION HAZARD MONITOR
            </span>
            <span className="text-xs text-slate-400">
              Selected Location: <strong className="text-slate-200">{selectedCity.name}</strong> → <strong className="text-cyan-300">{selectedArea.name}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">ACTIVE ALERTS</h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing alerts for <span className="text-cyan-300 font-semibold">{selectedArea.name}, {selectedCity.name}</span> based on live meteorological telemetry and calibrated warning thresholds.
          </p>
        </div>

        {/* Status pill & Last Checked */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Last Checked: {lastCheckedTime}</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs">{weather.source}</p>
          </div>
        </div>
      </div>

      {/* Alert Filter Toolbar (Requirement 12) */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Filter Local Alerts</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Hazard Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Hazard:</span>
            <select
              value={selectedHazard}
              onChange={e => setSelectedHazard(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="All">All Hazards</option>
              <option value="Heavy Rain">Heavy Rain</option>
              <option value="Thunderstorm">Thunderstorm</option>
              <option value="Strong Wind">Strong Wind</option>
              <option value="Heat Risk">Heat Risk</option>
              <option value="Flood Risk">Flood Risk</option>
              <option value="Poor Air Quality">Poor Air Quality</option>
              <option value="High UV">High UV</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="All">All Levels</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Severe">Severe</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="Active">Active Only</option>
              <option value="Resolved">Resolved</option>
              <option value="Expired">Expired</option>
              <option value="All">All Statuses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Alerts List or NO ACTIVE ALERTS Empty State (Requirement 11) */}
      {filteredAlerts.length === 0 ? (
        <div className="py-16 px-6 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 max-w-3xl mx-auto shadow-lg">
          <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg shadow-emerald-950/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">NO ACTIVE ALERTS</h2>
          <p className="text-sm text-slate-300 mt-2 font-medium">
            Currently, no active weather alerts are available for <span className="text-cyan-300 font-semibold">{selectedArea.name}, {selectedCity.name}</span>.
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            All atmospheric parameters (rainfall, temperature, surface gusts, AQI) are operating within safe baseline ranges.
          </p>

          <div className="mt-6 pt-6 border-t border-slate-800/80 inline-flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div>
              <span className="text-slate-400 block font-mono text-[10px]">LAST CHECKED</span>
              <span className="font-semibold text-slate-200">{lastCheckedTime}</span>
            </div>
            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
            <div>
              <span className="text-slate-400 block font-mono text-[10px]">DATA SOURCE</span>
              <span className="font-semibold text-slate-200">{weather.source}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAlerts.map(alert => {
            const isHighOrSevere = alert.severity === 'Severe' || alert.severity === 'High';
            return (
              <div
                key={alert.alertId}
                className="relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all p-5 shadow-xl flex flex-col justify-between overflow-hidden"
              >
                {/* Accent top border strip */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    alert.severity === 'Severe'
                      ? 'bg-rose-500'
                      : alert.severity === 'High'
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                  }`}
                />

                {/* Card Top: Hazard Icon, Title & Severity Badge */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                        {getHazardIcon(alert.hazardType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                            {alert.hazardType}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-0.5">{alert.title}</h3>
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-extrabold uppercase border shadow-sm ${getSeverityBadgeClass(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                  </div>

                  {/* Location Tag */}
                  <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                    <span className="text-cyan-400 font-semibold">{alert.area}</span>
                    <span className="text-slate-500">,</span>
                    <span>{alert.city}</span>
                    <span className="text-slate-400">({alert.state})</span>
                  </div>

                  {/* Metric vs Threshold Breakdown (Requirement 43: What, Where, When, Why, Action) */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 text-[11px] block">{alert.weatherParameter}:</span>
                      <span className="text-white text-sm font-bold">{alert.value}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Threshold:</span>
                      <span className="text-amber-400 text-sm font-bold">{alert.threshold}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-900 col-span-2 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Detected: {alert.timestamp}</span>
                      <span className="text-slate-400">Valid Until: {alert.validUntil}</span>
                    </div>
                  </div>

                  {/* Why / Explanation */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    <strong className="text-slate-200">Why: </strong>
                    {alert.description}
                  </p>

                  {/* Recommendation Box */}
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-amber-200/90 text-xs leading-relaxed mb-4">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300 block mb-0.5">Recommended Action:</strong>
                        <span>{alert.recommendation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Source, Status, and Email Dispatch Trigger */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="text-[11px] text-slate-400">
                    <span>Source: {alert.source}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/50 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                      STATUS: {alert.status}
                    </span>

                    <button
                      onClick={() => onOpenEmailModalForAlert(alert)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Send alert notification to your registered email"
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Email Alert</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Callout regarding Location Strictness */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Location Strictness Guarantee: </strong>
          MausamSetu evaluates each alert rule independently against the selected city ({selectedCity.name}) and area ({selectedArea.name}). No global alerts are cross-contaminated. Alerts for Mumbai will never appear when Pune is selected, and vice versa.
        </div>
      </div>
    </div>
  );
};
