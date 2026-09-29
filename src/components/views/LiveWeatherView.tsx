import React from 'react';
import {
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Sun,
  Eye,
  Activity,
  Compass,
  Gauge,
  Clock,
  Radio,
  MapPin,
  TrendingUp,
  AlertCircle,
  Waves,
  Calendar
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

export const LiveWeatherView: React.FC = () => {
  const { selectedCity, selectedArea, weather, lastCheckedTime, systemTime } = useLocation();

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60';
    if (aqi <= 100) return 'text-lime-600 dark:text-lime-400 bg-lime-100 dark:bg-lime-950/40 border-lime-300 dark:border-lime-800/60';
    if (aqi <= 200) return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60';
    if (aqi <= 300) return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800/60';
    return 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/60';
  };

  const getFloodRiskBadge = (level: string) => {
    switch (level) {
      case 'Severe':
        return 'bg-[#4c0519] text-[#ffe4e6] border-[#9f1239]';
      case 'High':
        return 'bg-red-950 text-red-200 border-red-800';
      case 'Moderate':
        return 'bg-amber-950 text-amber-200 border-amber-800';
      case 'Low':
      default:
        return 'bg-emerald-950 text-emerald-200 border-emerald-800';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with City -> Area Location Identity */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800/60">
              IMD Surface Automated Station (AWS)
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{selectedArea.latitude.toFixed(4)}° N, {selectedArea.longitude.toFixed(4)}° E</span>
            </div>
          </div>

          {/* City / Area hierarchy heading */}
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-2">
            <span>{selectedCity.name}</span>
            <span className="text-slate-400 font-normal">/</span>
            <span className="text-cyan-600 dark:text-cyan-400">{selectedArea.name}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Observed: <strong className="text-slate-800 dark:text-slate-200">{weather.observationTimestamp}</strong></span>
            <span>•</span>
            <span>Synchronized: <strong className="text-slate-800 dark:text-slate-200">{weather.syncTimestamp}</strong></span>
            <span>•</span>
            <span>Elevation: {selectedArea.elevationMeters}m</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Station: <strong className="text-slate-700 dark:text-slate-300">{weather.stationName}</strong> ({weather.stationDistance})
          </p>
        </div>

        {/* Big Temperature Hero Badge */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="text-right">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{weather.temperature}°C</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Feels like {weather.feelsLike}°C</p>
            <p className="text-xs text-cyan-600 dark:text-cyan-300 font-semibold mt-1">{weather.condition}</p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400">
            <Thermometer className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Prominent Flood Geo-Risk Banner (Requirement 4) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                PROMINENT FLOOD GEO-RISK ASSESSMENT
              </span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded font-black uppercase border ${getFloodRiskBadge(weather.floodGeoRisk)}`}>
                {weather.floodGeoRisk} RISK
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              {weather.floodGeoRiskReason}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0 font-mono text-xs text-slate-500 dark:text-slate-400">
          <span>24h Influx: <strong className="text-slate-900 dark:text-white text-sm">{weather.rainfall} mm</strong></span>
          <span className="block text-[11px]">Threshold: {weather.rainfallThreshold} mm</span>
        </div>
      </div>

      {/* Grid of Weather Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Condition */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">Sky Condition</span>
            <CloudRain className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{weather.condition}</p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Calibrated Doppler class</p>
        </div>

        {/* Humidity */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">Relative Humidity</span>
            <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{weather.humidity}%</p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Dew Point: {weather.dewPoint}°C</p>
        </div>

        {/* Rainfall (24h) */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">24h Rainfall</span>
            <CloudRain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-bold ${weather.rainfall >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
              {weather.rainfall}
            </span>
            <span className="text-xs text-slate-400 font-mono">mm</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            {weather.rainfall >= 50 ? 'Exceeds 50mm safe threshold' : 'Within normal drainage limit'}
          </p>
        </div>

        {/* Rain Probability */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">Rain Probability</span>
            <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{weather.rainProbability}%</p>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all"
              style={{ width: `${weather.rainProbability}%` }}
            />
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">Wind Velocity</span>
            <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{weather.windSpeed}</span>
            <span className="text-xs text-slate-400 font-mono">km/h</span>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">({weather.windDirection})</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Surface anemometer reading</p>
        </div>

        {/* Solar UV Index */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">UV Radiation Index</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{weather.uvIndex}</span>
            <span className="text-xs text-slate-400 font-mono">/ 12</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            {weather.uvIndex >= 8 ? 'Very High (Sun protection recommended)' : 'Moderate exposure profile'}
          </p>
        </div>

        {/* Air Quality Index (AQI) */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">Air Quality (AQI)</span>
            <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{weather.aqi}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${getAqiColor(weather.aqi)}`}>
              {weather.aqiCategory}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">CPCB Continuous Monitoring Grid</p>
        </div>

        {/* Barometer */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">Atmospheric Pressure</span>
            <Gauge className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{weather.barometer}</span>
            <span className="text-xs text-slate-400 font-mono">hPa</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Calibrated to {selectedArea.elevationMeters}m MSL</p>
        </div>
      </div>
    </div>
  );
};
