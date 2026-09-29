import React, { useState } from 'react';
import {
  GitCompare,
  Plus,
  X,
  Check,
  MapPin,
  Thermometer,
  CloudRain,
  Activity,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { INDIAN_CITIES, getCityById, getAreaById } from '../../data/citiesData';
import { getWeatherData, getActiveAlerts, getRiskAnalysis, getCityHistoricalData } from '../../services/weatherEngine';

export const CityComparisonView: React.FC = () => {
  const { selectedCity } = useLocation();

  // Selected cities to compare (up to 5 cities)
  const [comparedCityIds, setComparedCityIds] = useState<string[]>(['pune', 'mumbai', 'delhi', 'bengaluru']);

  const addCity = (cityId: string) => {
    if (comparedCityIds.length < 5 && !comparedCityIds.includes(cityId)) {
      setComparedCityIds([...comparedCityIds, cityId]);
    }
  };

  const removeCity = (cityId: string) => {
    if (comparedCityIds.length > 2) {
      setComparedCityIds(comparedCityIds.filter(id => id !== cityId));
    }
  };

  // Compute metrics for each city using their primary area
  const comparisonData = comparedCityIds.map(cityId => {
    const city = getCityById(cityId);
    const primaryArea = city.areas[0];
    const weather = getWeatherData(city, primaryArea);
    const alerts = getActiveAlerts(city, primaryArea, weather);
    const risk = getRiskAnalysis(city, primaryArea, weather);
    const history = getCityHistoricalData(city);

    return {
      city,
      primaryArea,
      weather,
      alerts,
      risk,
      history
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
              Cross-Metro Intelligence
            </span>
            <span className="text-xs text-slate-400">Multi-City Comparative Matrix</span>
          </div>
          <h1 className="text-2xl font-black text-white">COMPARE CITIES</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Select up to 5 major Indian cities to compare temperature, precipitation, AQI, and real-time active alerts.
          </p>
        </div>

        {/* City Selector Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-semibold mr-1">Add City:</span>
          {INDIAN_CITIES.filter(c => !comparedCityIds.includes(c.id)).slice(0, 4).map(c => (
            <button
              key={c.id}
              onClick={() => addCity(c.id)}
              disabled={comparedCityIds.length >= 5}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-xs text-slate-300 hover:text-cyan-300 flex items-center gap-1 transition-colors disabled:opacity-40"
            >
              <Plus className="w-3 h-3" />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/90 text-slate-400 font-mono">
              <th className="p-4 w-44 font-semibold uppercase text-[11px]">Parameter</th>
              {comparisonData.map(({ city, primaryArea }) => (
                <th key={city.id} className="p-4 min-w-[190px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-white block">{city.name}</span>
                      <span className="text-[11px] text-cyan-400 font-sans font-normal">
                        Locality: {primaryArea.name}
                      </span>
                    </div>
                    {comparedCityIds.length > 2 && (
                      <button
                        onClick={() => removeCity(city.id)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400"
                        title="Remove city"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80 font-mono">
            {/* Temperature */}
            <tr className="hover:bg-slate-950/40">
              <td className="p-4 text-slate-300 font-sans font-semibold flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-400" />
                <span>Temperature</span>
              </td>
              {comparisonData.map(({ city, weather }) => (
                <td key={city.id} className="p-4">
                  <span className="text-base font-bold text-white">{weather.temperature}°C</span>
                  <span className="text-slate-400 text-[11px] block font-sans">Feels {weather.feelsLike}°C</span>
                </td>
              ))}
            </tr>

            {/* Rainfall */}
            <tr className="hover:bg-slate-950/40">
              <td className="p-4 text-slate-300 font-sans font-semibold flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-400" />
                <span>Rainfall (24h)</span>
              </td>
              {comparisonData.map(({ city, weather }) => (
                <td key={city.id} className="p-4">
                  <span className={`text-base font-bold ${weather.rainfall >= 50 ? 'text-amber-400' : 'text-white'}`}>
                    {weather.rainfall} mm
                  </span>
                  <span className="text-slate-400 text-[11px] block font-sans">{weather.rainProbability}% probability</span>
                </td>
              ))}
            </tr>

            {/* AQI */}
            <tr className="hover:bg-slate-950/40">
              <td className="p-4 text-slate-300 font-sans font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span>Air Quality (AQI)</span>
              </td>
              {comparisonData.map(({ city, weather }) => (
                <td key={city.id} className="p-4">
                  <span className="text-base font-bold text-white">{weather.aqi} AQI</span>
                  <span className="text-slate-400 text-[11px] block font-sans">{weather.aqiCategory}</span>
                </td>
              ))}
            </tr>

            {/* Risk Index */}
            <tr className="hover:bg-slate-950/40">
              <td className="p-4 text-slate-300 font-sans font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Hazard Risk Level</span>
              </td>
              {comparisonData.map(({ city, risk }) => (
                <td key={city.id} className="p-4">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-slate-950 border border-slate-700 text-white">
                    {risk.overallLevel} ({risk.overallScore}/100)
                  </span>
                  <span className="text-slate-400 text-[11px] block font-sans mt-0.5">{risk.primaryHazard}</span>
                </td>
              ))}
            </tr>

            {/* Active Alerts Count */}
            <tr className="hover:bg-slate-950/40">
              <td className="p-4 text-slate-300 font-sans font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Active Alerts</span>
              </td>
              {comparisonData.map(({ city, alerts }) => (
                <td key={city.id} className="p-4">
                  {alerts.length > 0 ? (
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-rose-950/80 text-rose-300 border border-rose-700">
                      {alerts.length} Active ({alerts[0].hazardType})
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-400 font-sans">✓ No Active Alerts</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Climate & Historical Anomaly */}
            <tr className="hover:bg-slate-950/40">
              <td className="p-4 text-slate-300 font-sans font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>Rainfall Anomaly</span>
              </td>
              {comparisonData.map(({ city, history }) => (
                <td key={city.id} className="p-4">
                  <span className="text-slate-200 font-bold">
                    {history.rainfallAnomalyPercent >= 0 ? `+${history.rainfallAnomalyPercent}%` : `${history.rainfallAnomalyPercent}%`}
                  </span>
                  <span className="text-slate-400 text-[11px] block font-sans">vs 30-year normal</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
