import React from 'react';
import {
  MapPin,
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCheck,
  Mail,
  Zap,
  Flame,
  Sun,
  Radio,
  Waves,
  Calendar,
  Compass
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { LocationAlert, SeverityLevel } from '../../types';
import { DevelopmentTeamSection } from './DevelopmentTeamView';

interface DashboardViewProps {
  onNavigate: (viewId: string) => void;
  onOpenEmailModalForAlert: (alert: LocationAlert) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenEmailModalForAlert
}) => {
  const { selectedCity, selectedArea, weather, activeAlerts, riskAnalysis, forecast, lastCheckedTime, systemTime } = useLocation();
  const { user } = useAuth();

  // Helper for Flood Geo-Risk Badge Styling
  const getRiskBadge = (level: SeverityLevel) => {
    switch (level) {
      case 'Severe':
        return {
          bg: 'bg-[#4c0519] text-[#ffe4e6] border-[#9f1239]', // Maroon
          text: 'text-[#ffe4e6]',
          border: 'border-[#9f1239]',
          dot: 'bg-[#fda4af]'
        };
      case 'High':
        return {
          bg: 'bg-red-950 text-red-200 border-red-800', // Red
          text: 'text-red-300',
          border: 'border-red-800',
          dot: 'bg-red-500'
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-950 text-amber-200 border-amber-800', // Orange / Amber
          text: 'text-amber-300',
          border: 'border-amber-800',
          dot: 'bg-amber-500'
        };
      case 'Low':
      default:
        return {
          bg: 'bg-emerald-950 text-emerald-200 border-emerald-800', // Green
          text: 'text-emerald-300',
          border: 'border-emerald-800',
          dot: 'bg-emerald-500'
        };
    }
  };

  const floodBadge = getRiskBadge(weather.floodGeoRisk);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Real-time System Status Bar (Requirement 2 & 26: Distinct System Clock, Observed & Synchronized) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold uppercase tracking-wider text-[11px]">System Clock (IST):</span>
            <span className="text-slate-900 dark:text-white font-semibold">{systemTime}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Observed:</span>
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">{weather.observationTimestamp}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
          <span>Data synchronized:</span>
          <strong className="text-slate-800 dark:text-slate-200 font-semibold">{weather.syncTimestamp}</strong>
        </div>
      </div>

      {/* Hero Location Status Banner (Requirements 1, 2, 3, 4: City → Area, concise info, prominent flood risk) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors">
        <div className="space-y-3">
          {/* Hierarchy Tag */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800/60">
              OPERATIONAL WEATHER GRID
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Monitoring Hierarchy: <strong className="text-slate-800 dark:text-slate-200">{selectedCity.name}</strong> → <strong className="text-cyan-700 dark:text-cyan-300">{selectedArea.name}</strong> ({selectedCity.state})
            </span>
          </div>

          {/* Large dynamic location heading: City / Area (Requirement 1) */}
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex flex-wrap items-baseline gap-2">
            <span>{selectedCity.name}</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal text-2xl sm:text-3xl">/</span>
            <span className="text-cyan-600 dark:text-cyan-400">{selectedArea.name}</span>
          </h1>

          {/* Concise Useful Information (Requirement 3: Replaced marketing sentence) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>Observed: <strong className="text-slate-800 dark:text-slate-200">{weather.observationTimestamp}</strong></span>
            </div>
            <span className="hidden sm:inline text-slate-400">•</span>
            <div className="flex items-center gap-1.5 font-medium">
              <Compass className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>Data synchronized: <strong className="text-slate-800 dark:text-slate-200">{weather.syncTimestamp}</strong></span>
            </div>
          </div>

          {/* Provenance and Station Metadata (Requirement 5) */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Elevation: <strong className="text-slate-700 dark:text-slate-200">{selectedArea.elevationMeters}m</strong></span>
            <span>•</span>
            <span>Station: <strong className="text-slate-700 dark:text-slate-200">{weather.stationName}</strong></span>
            <span>•</span>
            <span className="text-cyan-700 dark:text-cyan-400 font-semibold">{weather.stationDistance}</span>
          </div>
        </div>

        {/* Right Hero Section: Prominent Flood Geo-Risk + Big Temperature Widget */}
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          {/* Prominent Flood Geo-Risk Indicator (Requirement 4) */}
          <div
            onClick={() => onNavigate('hazard-map')}
            className={`p-4 rounded-2xl border cursor-pointer hover:scale-[1.02] transition-all shadow-md flex flex-col justify-between min-w-[170px] ${floodBadge.bg}`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-90 flex items-center gap-1">
                <Waves className="w-3.5 h-3.5" />
                FLOOD GEO-RISK
              </span>
              <span className={`w-2 h-2 rounded-full ${floodBadge.dot} animate-ping`}></span>
            </div>
            
            <div className="my-1">
              <span className="text-2xl font-black uppercase tracking-wide block">
                {weather.floodGeoRisk}
              </span>
            </div>

            <p className="text-[10px] opacity-80 font-mono leading-tight mt-1 line-clamp-2">
              {weather.rainfall}mm rain / 50mm limit
            </p>
          </div>

          {/* Big Live Temperature & Condition Widget (Requirement 2: Observed timestamp with temperature) */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                  {weather.temperature}
                </span>
                <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">°C</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Feels like {weather.feelsLike}°C</p>
              <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 mt-1 max-w-[150px] truncate">
                {weather.condition}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                Observed: {weather.observationTimestamp}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400">
              <Thermometer className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Mini-Cards (Rainfall, Wind, AQI, Composite Hazard) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Rainfall */}
        <div
          onClick={() => onNavigate('live-weather')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold">24h Rainfall</span>
            <CloudRain className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-black ${weather.rainfall >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
              {weather.rainfall}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">mm</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {weather.rainfall >= 50 ? 'Threshold: 50mm (High Influx)' : 'Threshold: 50mm (Normal)'}
          </p>
        </div>

        {/* Wind */}
        <div
          onClick={() => onNavigate('live-weather')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold">Wind Velocity</span>
            <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{weather.windSpeed}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">km/h</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">Direction: {weather.windDirection}</p>
        </div>

        {/* AQI */}
        <div
          onClick={() => onNavigate('live-weather')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold">Air Quality</span>
            <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{weather.aqi}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">AQI</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{weather.aqiCategory}</p>
        </div>

        {/* Composite Hazard Level */}
        <div
          onClick={() => onNavigate('risk-analysis')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold">Composite Hazard</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{riskAnalysis.overallLevel}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Score: {riskAnalysis.overallScore}/100</p>
        </div>
      </div>

      {/* Main Two-Column Row: Active Alerts Snapshot + Key Feature Verification CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alerts for this Location (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">Active Alerts</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {selectedCity.name} / {selectedArea.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Location-specific alerts calibrated to IMD & NDMA thresholds</p>
            </div>

            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeAlerts.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">NO ACTIVE ALERTS</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Currently, no severe weather alerts are active for <strong className="text-cyan-600 dark:text-cyan-300">{selectedCity.name} / {selectedArea.name}</strong>.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 font-mono">
                <span>Observed: {weather.observationTimestamp}</span> • <span>Source: {weather.source}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map(alert => (
                <div
                  key={alert.alertId}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-rose-500 shrink-0 shadow-sm">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{alert.title}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded font-extrabold uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 line-clamp-1">
                        {alert.weatherParameter}: <strong className="text-slate-900 dark:text-white">{alert.value}</strong> (Threshold: {alert.threshold})
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{alert.recommendation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onOpenEmailModalForAlert(alert)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors shadow-sm"
                      title="Send alert email"
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>Email Alert</span>
                    </button>
                    <button
                      onClick={() => onNavigate('alerts')}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 text-xs font-semibold shadow-sm"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Verify Report Card (KEY FEATURE Callout) */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 dark:from-slate-900 via-white dark:via-slate-900 to-amber-50 dark:to-amber-950/20 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-500 text-white dark:text-slate-950 px-2 py-0.5 rounded shadow-sm">
                KEY FEATURE
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Anti-Misinformation</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verify Weather Report or Viral Post</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Received an alarming WhatsApp forward about cloudbursts or flood in {selectedCity.name}? Check claims against real IMD ground sensors and Doppler radar.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Text claims & WhatsApp forwards</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Screenshot upload with instant OCR</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Grounded against {weather.source}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('verify-report')}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            <span>OPEN VERIFICATION WORKBENCH</span>
          </button>
        </div>
      </div>

      {/* Hourly Forecast Strip Teaser (Requirement 9) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Upcoming Hours ({selectedCity.name} / {selectedArea.name})
            </h3>
          </div>
          <button
            onClick={() => onNavigate('forecast')}
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>7-Day Synoptic Forecast</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
          {forecast.hourly.slice(0, 6).map((h, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">{h.time}</span>
              <span className="text-lg font-black text-slate-900 dark:text-white block my-1">{h.temperature}°</span>
              <span className="text-[10px] text-cyan-700 dark:text-cyan-300 block truncate font-medium">{h.condition}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-mono">{h.rainProbability}% rain</span>
            </div>
          ))}
        </div>
      </div>

      {/* Development Team Section */}
      <DevelopmentTeamSection />
    </div>
  );
};
