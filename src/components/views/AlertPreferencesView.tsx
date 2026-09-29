import React, { useState } from 'react';
import {
  BellRing,
  Mail,
  ShieldAlert,
  CheckCircle2,
  Save,
  Send,
  CloudRain,
  Flame,
  Wind,
  Zap,
  Activity,
  Waves,
  SunMedium,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { HazardType, SeverityLevel } from '../../types';

interface AlertPreferencesViewProps {
  onOpenEmailModal: () => void;
}

export const AlertPreferencesView: React.FC<AlertPreferencesViewProps> = ({ onOpenEmailModal }) => {
  const { preferences, updatePreferences, user } = useAuth();
  const { selectedCity, selectedArea } = useLocation();

  const [emailAlerts, setEmailAlerts] = useState(preferences.emailAlertsEnabled);
  const [inAppAlerts, setInAppAlerts] = useState(preferences.inAppAlertsEnabled);
  const [minSeverity, setMinSeverity] = useState<SeverityLevel>(preferences.minimumSeverity);
  const [selectedHazards, setSelectedHazards] = useState<HazardType[]>(preferences.subscribedHazards);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const allHazards: Array<{ id: HazardType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'Heavy Rain', label: 'Heavy Rain', icon: CloudRain },
    { id: 'Thunderstorm', label: 'Thunderstorm', icon: Zap },
    { id: 'Strong Wind', label: 'Strong Wind', icon: Wind },
    { id: 'Heat Risk', label: 'Heat Risk', icon: Flame },
    { id: 'Flood Risk', label: 'Flood Risk', icon: Waves },
    { id: 'Poor Air Quality', label: 'Poor Air Quality (AQI)', icon: Activity },
    { id: 'High UV', label: 'High UV Radiation', icon: SunMedium },
    { id: 'Coastal Surge', label: 'Official Warning / Coastal Surge', icon: ShieldAlert }
  ];

  const toggleHazard = (hazard: HazardType) => {
    if (selectedHazards.includes(hazard)) {
      setSelectedHazards(selectedHazards.filter(h => h !== hazard));
    } else {
      setSelectedHazards([...selectedHazards, hazard]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      emailAlertsEnabled: emailAlerts,
      inAppAlertsEnabled: inAppAlerts,
      minimumSeverity: minSeverity,
      subscribedHazards: selectedHazards
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
              Notification Subscriptions
            </span>
            <span className="text-xs text-slate-400">Target Email: {user?.email || 'mausamsetu@gmail.com'}</span>
          </div>
          <h1 className="text-2xl font-black text-white">EMAIL ALERT PREFERENCES</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure which atmospheric hazard types trigger automated email dispatches for <strong className="text-slate-200">{selectedArea.name}, {selectedCity.name}</strong>.
          </p>
        </div>

        <button
          onClick={onOpenEmailModal}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
        >
          <Mail className="w-4 h-4 text-cyan-400" />
          <span>Preview Alert Email</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Notification preferences saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Toggle master channels */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Delivery Channels</h3>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Email Alerts Toggle */}
            <div
              onClick={() => setEmailAlerts(!emailAlerts)}
              className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${
                emailAlerts
                  ? 'bg-cyan-950/50 border-cyan-500/60 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  EMAIL ALERTS
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                    emailAlerts ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {emailAlerts ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Direct dispatch from <strong className="text-cyan-400 font-mono">mausamsetu@gmail.com</strong> to your registered address.
              </p>
            </div>

            {/* In-App Alerts Toggle */}
            <div
              onClick={() => setInAppAlerts(!inAppAlerts)}
              className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${
                inAppAlerts
                  ? 'bg-cyan-950/50 border-cyan-500/60 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-cyan-400" />
                  IN-APP NOTIFICATIONS
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                    inAppAlerts ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {inAppAlerts ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Interactive status notifications on dashboard bell when thresholds are crossed.
              </p>
            </div>
          </div>
        </div>

        {/* Hazard Types Selection (Requirement 21) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Alert Hazard Types</h3>
              <p className="text-xs text-slate-400">Select which risk categories should trigger notifications</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedHazards(allHazards.map(h => h.id))}
              className="text-xs text-cyan-400 hover:underline"
            >
              Select All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {allHazards.map(hazard => {
              const Icon = hazard.icon;
              const isSelected = selectedHazards.includes(hazard.id);
              return (
                <div
                  key={hazard.id}
                  onClick={() => toggleHazard(hazard.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-500/80 text-white ring-1 ring-cyan-500/30 shadow-md'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-semibold">{hazard.label}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                      isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimum Severity (Requirement 21: Moderate, High, Severe) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Minimum Severity Threshold</h3>
            <p className="text-xs text-slate-400">Only receive dispatches when danger reaches or exceeds this severity level</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(['Moderate', 'High', 'Severe'] as SeverityLevel[]).map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setMinSeverity(level)}
                className={`py-3 px-4 rounded-xl border text-center transition-all ${
                  minSeverity === level
                    ? 'bg-cyan-950/60 border-cyan-400 text-white font-bold ring-1 ring-cyan-400/40 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider block">{level}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {level === 'Moderate' ? 'Advisories & warnings' : level === 'High' ? 'Significant threat' : 'Emergency deluge/heat only'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>SAVE PREFERENCES</span>
          </button>
        </div>
      </form>
    </div>
  );
};
