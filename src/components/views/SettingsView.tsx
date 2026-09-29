import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  Save,
  RotateCcw,
  ShieldCheck,
  Bell,
  Gauge,
  Database,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { DevelopmentTeamSection } from './DevelopmentTeamView';

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [rainUnit, setRainUnit] = useState<'mm' | 'in'>('mm');
  const [windUnit, setWindUnit] = useState<'kmh' | 'mph'>('kmh');
  const [autoRefreshSecs, setAutoRefreshSecs] = useState<number>(30);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClearCache = () => {
    localStorage.removeItem('mausamsetu_verif_history');
    alert('Local telemetry and verification cache cleared successfully.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
            System Configuration
          </span>
          <span className="text-xs text-slate-400">Node Grid v3.2</span>
        </div>
        <h1 className="text-2xl font-black text-white">PLATFORM SETTINGS</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure measurement standards, display parameters, and automated synchronization.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Appearance & Theme Mode (Switch to Day Mode removed as requested) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Moon className="w-4 h-4 text-cyan-500" />
            Appearance & Theme
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            MausamSetu is optimized with institutional Dark Mode for 24/7 mission-critical weather & verification operations.
          </p>

          <div className="max-w-xs">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className="p-3 w-full rounded-xl border text-xs font-bold flex items-center justify-center gap-2 bg-slate-950 text-white border-cyan-400 ring-2 ring-cyan-500/20 shadow-md"
            >
              <Moon className="w-4 h-4 text-cyan-400" />
              <span>Dark Mode (Active)</span>
            </button>
          </div>
        </div>

        {/* Units of Measurement */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            Units of Measurement
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Temperature Unit</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTempUnit('C')}
                  className={`p-2 rounded-lg border text-xs font-bold ${
                    tempUnit === 'C' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  type="button"
                  onClick={() => setTempUnit('F')}
                  className={`p-2 rounded-lg border text-xs font-bold ${
                    tempUnit === 'F' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Rainfall Unit</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRainUnit('mm')}
                  className={`p-2 rounded-lg border text-xs font-bold ${
                    rainUnit === 'mm' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Millimeters (mm)
                </button>
                <button
                  type="button"
                  onClick={() => setRainUnit('in')}
                  className={`p-2 rounded-lg border text-xs font-bold ${
                    rainUnit === 'in' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Inches (in)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Wind Speed Unit</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWindUnit('kmh')}
                  className={`p-2 rounded-lg border text-xs font-bold ${
                    windUnit === 'kmh' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  km/h
                </button>
                <button
                  type="button"
                  onClick={() => setWindUnit('mph')}
                  className={`p-2 rounded-lg border text-xs font-bold ${
                    windUnit === 'mph' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  mph
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Polling & Refresh */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            Telemetry Auto-Refresh Interval
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {[15, 30, 60].map(secs => (
              <button
                key={secs}
                type="button"
                onClick={() => setAutoRefreshSecs(secs)}
                className={`py-3 px-4 rounded-xl border text-center transition-all ${
                  autoRefreshSecs === secs
                    ? 'bg-cyan-950/60 border-cyan-400 text-white font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-xs font-bold block">{secs} Seconds</span>
                <span className="text-[10px] text-slate-400">
                  {secs === 15 ? 'High frequency' : secs === 30 ? 'Recommended' : 'Power saving'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Data & Cache */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Local Telemetry Storage
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Purge cached weather telemetry snapshots and verification history from this browser.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearCache}
            className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-rose-500/60 text-xs text-rose-300 font-semibold transition-colors"
          >
            Clear Local Cache
          </button>
        </div>

        {/* Save button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>SAVE CONFIGURATION</span>
          </button>
        </div>
      </form>

      {/* Development Team Section */}
      <DevelopmentTeamSection />
    </div>
  );
};
