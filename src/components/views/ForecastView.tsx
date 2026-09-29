import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  CloudRain,
  Wind,
  Droplets,
  Sun,
  MapPin,
  TrendingUp,
  ChevronRight,
  Compass
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

export const ForecastView: React.FC = () => {
  const { selectedCity, selectedArea, forecast, weather } = useLocation();
  const [tab, setTab] = useState<'hourly' | '7day'>('hourly');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800/60">
              IMD Numerical Guidance Model
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{selectedCity.name} / {selectedArea.name} ({selectedCity.state})</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">ATMOSPHERIC FORECAST</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            24-hour micro-hourly trajectory and 7-day synoptic outlook calibrated specifically for {selectedCity.name} / {selectedArea.name}.
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
            <span>Model Run: {forecast.generatedAt}</span> • <span>Station: {weather.stationName}</span>
          </div>
        </div>

        <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 flex items-center shrink-0">
          <button
            onClick={() => setTab('hourly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'hourly'
                ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            24-Hour Hourly
          </button>
          <button
            onClick={() => setTab('7day')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === '7day'
                ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            7-Day Synoptic Outlook
          </button>
        </div>
      </div>

      {tab === 'hourly' ? (
        /* Hourly Forecast Carousel/Cards (Requirement 9) */
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Next 24 Hours in {selectedCity.name} / {selectedArea.name}
            </span>
            <span>Forecast Timestamp: {forecast.generatedAt}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {forecast.hourly.map((h, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{h.time}</span>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-semibold">{h.rainProbability}% rain</span>
                  </div>

                  <div className="my-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{h.temperature}°</span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-1 line-clamp-1">{h.condition}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-cyan-600 dark:text-cyan-400" /> Rain:
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">{h.rainfall} mm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-teal-600 dark:text-teal-400" /> Wind:
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">{h.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Hum:
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">{h.humidity}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 7-Day Forecast */
        <div className="space-y-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider font-mono">
            7-Day Synoptic Progression for {selectedCity.name} / {selectedArea.name}
          </div>

          <div className="space-y-2">
            {forecast.daily.map((day, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4 min-w-[180px]">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-cyan-700 dark:text-cyan-400 font-bold text-xs font-mono">
                    {idx === 0 ? 'NOW' : `D+${idx}`}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{day.dayName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{day.date}</p>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{day.condition}</span>
                    <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono font-bold">({day.rainProbability}% Precip)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{day.summary}</p>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-base font-bold text-slate-900 dark:text-white">{day.maxTemp}°C</span>
                    <span className="text-slate-400 text-xs ml-1.5">{day.minTemp}°C</span>
                    <span className="block text-[10px] text-slate-400">High / Low</span>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-bold text-cyan-600 dark:text-cyan-300">{day.rainfall} mm</span>
                    <span className="block text-[10px] text-slate-400">Est. Rain</span>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-300">{day.windSpeed} km/h</span>
                    <span className="block text-[10px] text-slate-400">Peak Gusts</span>
                  </div>

                  <div className="text-right min-w-[50px]">
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-300">{day.uvIndex}</span>
                    <span className="block text-[10px] text-slate-400">UV Index</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
