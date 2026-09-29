import React, { useState } from 'react';
import {
  History,
  TrendingUp,
  BarChart3,
  Calendar,
  AlertTriangle,
  MapPin,
  ChevronDown,
  Info,
  X,
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useLocation, HistoricalPeriod } from '../../context/LocationContext';
import { MonthlyHistory, HistoricalBenchmarkEvent } from '../../types';

export const HistoricalDataView: React.FC = () => {
  const { selectedCity, selectedArea, historicalData, historicalPeriod, setHistoricalPeriod } = useLocation();

  // Interactive selected month for details inspection (Requirement 15)
  // Default to July (monsoon peak)
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(6); // July is index 6

  // Interactive Metric Card Explanations (Requirement 17)
  const [activeMetricModal, setActiveMetricModal] = useState<string | null>(null);

  const selectedMonth: MonthlyHistory = historicalData.monthlyData[selectedMonthIdx] || historicalData.monthlyData[6];

  // Calculate max rainfall for scalable chart rendering
  const maxRainfallInDataset = Math.max(
    ...historicalData.monthlyData.map(m => Math.max(m.actualRainfall, m.historicalBaseline)),
    200
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Location, Climatological Provenance & Exact Period Selector (Requirements 10, 11, 12, 22) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800/60">
              IMD Climatological Archive
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{selectedCity.name} / {selectedArea.name} ({selectedCity.state})</span>
            </div>
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            HISTORICAL WEATHER ARCHIVE
          </h1>

          {/* Date, Period & Provenance indicator (Requirements 11 & 22) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
            <span>Data updated: <strong className="text-slate-700 dark:text-slate-200">{historicalData.dataUpdated}</strong></span>
            <span>•</span>
            <span>Historical period: <strong className="text-cyan-700 dark:text-cyan-400">{historicalData.periodLabel}</strong></span>
            <span>•</span>
            <span>Station: <strong className="text-slate-700 dark:text-slate-200">{historicalData.stationName}</strong></span>
          </div>
        </div>

        {/* Historical Period Selector: Exactly 1 YEAR | 5 YEARS | 10 YEARS | 20 YEARS (Requirement 12) */}
        <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 flex items-center shrink-0">
          {([
            { id: '1y', label: '1 YEAR' },
            { id: '5y', label: '5 YEARS' },
            { id: '10y', label: '10 YEARS' },
            { id: '20y', label: '20 YEARS' }
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setHistoricalPeriod(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                historicalPeriod === id
                  ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Three Historical Metric Cards (Requirement 17) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Monsoon Rainfall Anomaly */}
        <div
          onClick={() => setActiveMetricModal('rainfall-anomaly')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-cyan-500/50 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Monsoon Rainfall Anomaly</span>
            <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-black ${historicalData.rainfallAnomalyPercent >= 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {historicalData.rainfallAnomalyPercent >= 0 ? `+${historicalData.rainfallAnomalyPercent}%` : `${historicalData.rainfallAnomalyPercent}%`}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              vs historical normal
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
            {historicalData.rainfallAnomalyPercent >= 0 ? 'Excess precipitation across regional catchments.' : 'Deficit relative to IMD 30-year climatological normal.'}
          </p>

          <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold mt-2 inline-flex items-center gap-1 group-hover:underline">
            Click to view definition →
          </span>
        </div>

        {/* Card 2: Mean Thermal Departure */}
        <div
          onClick={() => setActiveMetricModal('thermal-departure')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-cyan-500/50 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Mean Thermal Departure</span>
            <Info className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
              +{historicalData.tempAnomalyCelsius}°C
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              thermal drift
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
            Regional surface warming recorded during {historicalData.periodLabel}.
          </p>

          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-2 inline-flex items-center gap-1 group-hover:underline">
            Click to view definition →
          </span>
        </div>

        {/* Card 3: Extreme Event Frequency */}
        <div
          onClick={() => setActiveMetricModal('extreme-frequency')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-cyan-500/50 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Extreme Event Frequency</span>
            <Info className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
              {historicalData.extremeEventsCount} Events
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              in selected period
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
            Verified threshold breaches (cloudbursts, gale squalls, heatwaves).
          </p>

          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-2 inline-flex items-center gap-1 group-hover:underline">
            Click to view definition →
          </span>
        </div>
      </div>

      {/* 3. MONTH-WISE RAINFALL COMES FIRST (Requirement 13, 14, 15, 16) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                MONTHLY RAINFALL (mm) — {selectedCity.name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold">
                {historicalData.periodLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Actual / Selected period rainfall vs. IMD 30-year climatological baseline marked directly on each month.
            </p>
          </div>

          {/* Graph Legend directly on the visualization (Requirement 14) */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-cyan-500"></span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Actual / Period Rainfall</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-amber-500 rounded"></span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Historical Baseline</span>
            </div>
          </div>
        </div>

        {/* The 12-Month Interactive Bar Chart with Baseline Visibly Marked Directly On It (Requirements 13, 14, 15) */}
        <div className="relative pt-6 pb-2">
          {/* Chart Grid Area */}
          <div className="grid grid-cols-12 gap-1.5 sm:gap-3 items-end h-64 sm:h-72 border-b border-slate-300 dark:border-slate-700/80 pb-2">
            {historicalData.monthlyData.map((m, idx) => {
              const actualHeightPct = Math.min(100, Math.max(3, Math.round((m.actualRainfall / maxRainfallInDataset) * 100)));
              const baselineHeightPct = Math.min(100, Math.max(3, Math.round((m.historicalBaseline / maxRainfallInDataset) * 100)));
              const isSelected = selectedMonthIdx === idx;

              return (
                <div
                  key={m.month}
                  onClick={() => setSelectedMonthIdx(idx)}
                  className={`group relative flex flex-col items-center h-full justify-end cursor-pointer transition-all ${
                    isSelected ? 'scale-[1.03]' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Monsoon banner flag for Jun-Sep */}
                  {m.isMonsoon && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase text-cyan-600 dark:text-cyan-400 font-mono tracking-tighter">
                      MON
                    </div>
                  )}

                  {/* Value callout above bar */}
                  <span className={`text-[10px] font-mono font-bold mb-1 transition-colors ${
                    isSelected ? 'text-cyan-600 dark:text-cyan-300' : 'text-slate-400'
                  }`}>
                    {m.actualRainfall}
                  </span>

                  {/* Bar Column Container */}
                  <div className={`w-full max-w-[42px] relative rounded-t-lg overflow-visible flex items-end justify-center transition-all ${
                    isSelected ? 'ring-2 ring-cyan-500 shadow-lg' : ''
                  }`}>
                    {/* The Actual / Period Rainfall Bar */}
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        m.isMonsoon
                          ? isSelected
                            ? 'bg-gradient-to-t from-blue-600 to-cyan-400'
                            : 'bg-gradient-to-t from-blue-700 to-cyan-500'
                          : isSelected
                          ? 'bg-slate-400 dark:bg-slate-600'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      style={{ height: `${actualHeightPct}%` }}
                    />

                    {/* Historical Baseline Marker DIRECTLY ON THE GRAPH (Requirement 14) */}
                    <div
                      className="absolute left-0 right-0 z-10 pointer-events-none flex items-center"
                      style={{ bottom: `${baselineHeightPct}%` }}
                      title={`Historical Baseline: ${m.historicalBaseline} mm`}
                    >
                      <div className="w-full h-1 bg-amber-500 shadow-sm rounded-full"></div>
                    </div>
                  </div>

                  {/* Month Label */}
                  <span className={`mt-2 text-[11px] font-bold transition-colors ${
                    isSelected ? 'text-cyan-600 dark:text-cyan-300 underline font-black' : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Monsoon Bracket Guide (Requirement 13: June -> July -> August -> September clearly marked) */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 px-1">
            <span className="hidden sm:inline">Pre-Monsoon Months (Jan–May)</span>
            <div className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-200 dark:border-cyan-800/60">
              <span>Primary Southwest Monsoon Period (June → July → August → September)</span>
            </div>
            <span className="hidden sm:inline">Post-Monsoon (Oct–Dec)</span>
          </div>
        </div>

        {/* 4. Interactive Month Details Inspector Panel (Requirement 15) */}
        {selectedMonth && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {selectedMonth.fullMonthName} Details
                </span>
                {selectedMonth.isMonsoon && (
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                    Monsoon Month
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Climatological evaluation for {selectedMonth.fullMonthName} across {historicalData.periodLabel}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-xs">
              <div className="text-left sm:text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Actual / Period Rainfall</span>
                <strong className="text-slate-900 dark:text-white text-base font-black">{selectedMonth.actualRainfall} mm</strong>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Historical Baseline</span>
                <strong className="text-amber-600 dark:text-amber-400 text-base font-black">{selectedMonth.historicalBaseline} mm</strong>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Difference</span>
                <strong className={`text-base font-black ${selectedMonth.difference >= 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {selectedMonth.difference >= 0 ? `+${selectedMonth.difference} mm` : `${selectedMonth.difference} mm`}
                </strong>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Deviation from Normal</span>
                <strong className={`text-base font-black ${selectedMonth.deviationPercent >= 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {selectedMonth.deviationPercent >= 0 ? `+${selectedMonth.deviationPercent}%` : `${selectedMonth.deviationPercent}%`}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Historical Extreme Events Archive (Requirements 18 & 19: Chronological Order Oldest -> Newest & Uniform Cards) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Historical Extreme Weather Benchmark Events in {selectedCity.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chronologically ordered reference events (Oldest → Newest) calibrated against IMD centennial weather archives.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
            Chronological Sort: Oldest → Newest
          </span>
        </div>

        {/* Uniform Event Cards (Requirement 19: Identical structure, height, padding, typography, alignment) */}
        <div className="space-y-3">
          {historicalData.topExtremeEvents.map((evt: HistoricalBenchmarkEvent, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              {/* Left Column: Event Name, Date Recorded & Classification Badge */}
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {evt.eventName || evt.event}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                    {evt.classification || evt.historicalRank}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Recorded Date: <strong className="text-slate-700 dark:text-slate-200">{evt.dateRecorded || evt.date}</strong></span>
                  <span>•</span>
                  <span>Source: {evt.source || 'IMD Official Archive'}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans pt-1">
                  {evt.severityContext}
                </p>
              </div>

              {/* Right Column: Uniform Measurement Value & Unit Display */}
              <div className="md:text-right shrink-0 min-w-[140px] p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">
                  Measured Value
                </span>
                <span className="text-lg font-black text-cyan-600 dark:text-cyan-300 font-mono block mt-0.5">
                  {evt.measurement || evt.value}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">
                  {evt.unit || 'Recorded Peak'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Interactive Metric Modals (Requirement 17: User-friendly definitions) */}
      {activeMetricModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 space-y-3">
            <button
              onClick={() => setActiveMetricModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {activeMetricModal === 'rainfall-anomaly' && (
              <>
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                  <BarChart3 className="w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Monsoon Rainfall Anomaly
                  </h3>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Measures how much monsoon rainfall differs from the historical normal for this location.
                  Positive values mean more rainfall than normal; negative values mean less.
                </p>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 font-mono text-xs text-slate-600 dark:text-slate-400">
                  Current evaluation for {selectedCity.name}: <strong className="text-cyan-600 dark:text-cyan-400">{historicalData.rainfallAnomalyPercent >= 0 ? `+${historicalData.rainfallAnomalyPercent}%` : `${historicalData.rainfallAnomalyPercent}%`}</strong> relative to 1991–2020 normal.
                </div>
              </>
            )}

            {activeMetricModal === 'thermal-departure' && (
              <>
                <div className="flex items-center gap-2 text-rose-500">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Mean Thermal Departure
                  </h3>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Shows how much the average temperature differs from the historical temperature normal for this location.
                  Positive values mean warmer than normal; negative values mean cooler.
                </p>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 font-mono text-xs text-slate-600 dark:text-slate-400">
                  Current evaluation for {selectedCity.name}: <strong className="text-rose-600 dark:text-rose-400">+{historicalData.tempAnomalyCelsius}°C</strong> over {historicalData.periodLabel}.
                </div>
              </>
            )}

            {activeMetricModal === 'extreme-frequency' && (
              <>
                <div className="flex items-center gap-2 text-amber-500">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Extreme Event Frequency
                  </h3>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Shows how often defined extreme-weather events were recorded during the selected historical period for this location.
                </p>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 font-mono text-xs text-slate-600 dark:text-slate-400">
                  Total events recorded for {selectedCity.name} in {historicalData.periodLabel}: <strong className="text-amber-600 dark:text-amber-400">{historicalData.extremeEventsCount} events</strong>.
                </div>
              </>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveMetricModal(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs text-slate-800 dark:text-slate-200 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
