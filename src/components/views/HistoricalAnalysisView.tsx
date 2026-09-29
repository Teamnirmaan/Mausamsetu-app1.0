import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sliders,
  ChevronDown,
  X,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCheck,
  BarChart3,
  Layers,
  Sparkles,
  Droplets,
  Thermometer,
  CloudLightning,
  Wind,
  Sun,
  Flame,
  Waves,
  RefreshCw,
  ExternalLink,
  Share2,
  Printer,
  Check
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import {
  ALL_INDIA_CITIES,
  searchIndianCities,
  getIndianCityRecord,
  IndianCityRecord
} from '../../data/allIndiaCities';
import {
  generateCityHistoricalAnalysis,
  compareCitiesHistorical,
  compareTwoYears,
  CityHistoricalPayload,
  YearComparisonResult,
  CityComparisonData
} from '../../services/historicalWeatherService';

interface HistoricalAnalysisViewProps {
  onNavigate?: (view: string) => void;
  onNavigateToVerify?: (prefill?: { location?: string; hazard?: string; text?: string }) => void;
  initialCityId?: string;
}

export const HistoricalAnalysisView: React.FC<HistoricalAnalysisViewProps> = ({
  onNavigate,
  onNavigateToVerify,
  initialCityId
}) => {
  const { selectedCity } = useLocation();

  // 1. City Search and Selection State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IndianCityRecord[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [currentCityId, setCurrentCityId] = useState<string>(
    initialCityId || selectedCity.id || 'pune'
  );

  // Export & Share toast state
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // 2. Time Range State (Last 5y, 10y, 20y, Custom)
  const [rangePreset, setRangePreset] = useState<'5y' | '10y' | '20y' | 'custom'>('10y');
  const [startYear, setStartYear] = useState<number>(2015);
  const [endYear, setEndYear] = useState<number>(2025);

  // 3. Demo Data / Verification mode
  const [isDemoMode, setIsDemoMode] = useState(false);

  // 4. Graph specific states
  const [tempTrendMode, setTempTrendMode] = useState<'annual' | 'monthly'>('annual');
  const [hazardFilter, setHazardFilter] = useState<string>('All hazards');
  const [hoveredRainYear, setHoveredRainYear] = useState<number | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // 5. Year-to-Year comparison state
  const [compareYear1, setCompareYear1] = useState<number>(2023);
  const [compareYear2, setCompareYear2] = useState<number>(2025);

  // 6. Multi-City Comparison State
  const [comparisonCityIds, setComparisonCityIds] = useState<string[]>([
    'pune',
    'mumbai',
    'nashik',
    'nagpur',
    'bengaluru'
  ]);
  const [comparisonMetric, setComparisonMetric] = useState<
    'rainfall' | 'temperature' | 'rainEvents' | 'heatwave' | 'flood'
  >('rainfall');

  // Handle Preset Changes
  const handlePresetChange = (preset: '5y' | '10y' | '20y' | 'custom') => {
    setRangePreset(preset);
    const currentMaxYear = 2025;
    if (preset === '5y') {
      setStartYear(2021);
      setEndYear(currentMaxYear);
    } else if (preset === '10y') {
      setStartYear(2016);
      setEndYear(currentMaxYear);
    } else if (preset === '20y') {
      setStartYear(2006);
      setEndYear(currentMaxYear);
    }
  };

  // Search input handler
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = searchIndianCities(searchQuery);
      setSearchResults(results);
      setIsSearchOpen(true);
    } else {
      setSearchResults(ALL_INDIA_CITIES.slice(0, 8));
    }
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update selected city if initialCityId changes
  useEffect(() => {
    if (initialCityId) {
      setCurrentCityId(initialCityId);
    }
  }, [initialCityId]);

  // Generate historical analysis payload dynamically
  const analysisData: CityHistoricalPayload = useMemo(() => {
    return generateCityHistoricalAnalysis(currentCityId, startYear, endYear);
  }, [currentCityId, startYear, endYear]);

  // Year to Year Comparison result
  const yearComparison: YearComparisonResult = useMemo(() => {
    return compareTwoYears(currentCityId, compareYear1, compareYear2);
  }, [currentCityId, compareYear1, compareYear2]);

  // Multi-city comparison data
  const multiCityComparison: CityComparisonData[] = useMemo(() => {
    return compareCitiesHistorical(comparisonCityIds, comparisonMetric);
  }, [comparisonCityIds, comparisonMetric]);

  // Export Data as CSV
  const handleExportCSV = () => {
    const headers = ['Year', 'Rainfall_mm', 'Baseline_mm', 'Departure_Percent', 'AvgTemp_C', 'MaxTemp_C', 'MinTemp_C', 'ExtremeEventsCount'];
    const rows = analysisData.annualRainfallTrend.map((rain, idx) => {
      const temp = analysisData.temperatureTrendAnnual[idx] || { avgTemp: 26, maxTemp: 34, minTemp: 18 };
      const events = analysisData.extremeEventsByYear.find(e => e.year === rain.year)?.totalEvents || 0;
      return [
        rain.year,
        rain.rainfall,
        rain.baseline,
        rain.departurePercent,
        temp.avgTemp,
        temp.maxTemp,
        temp.minTemp,
        events
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mausamsetu_${analysisData.city.id}_historical_${startYear}_${endYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Data as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysisData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mausamsetu_${analysisData.city.id}_climatology.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  // Print Summary Report
  const handlePrintReport = () => {
    window.print();
  };

  // Share Link
  const handleShareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?view=historical-analysis&city=${currentCityId}&range=${rangePreset}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 3000);
    }).catch(() => {
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 3000);
    });
  };

  // Navigate to Verify Report prefilled with this city
  const handleTriggerVerificationForCity = () => {
    if (onNavigateToVerify) {
      onNavigateToVerify({
        location: `${analysisData.city.name}, ${analysisData.city.state}`,
        hazard: analysisData.city.primaryHazards[0] || 'Heavy Rainfall',
        text: `Alert: Heavy rainfall reported in ${analysisData.city.name} with expected deluges exceeding normal seasonal baselines.`
      });
    } else if (onNavigate) {
      onNavigate('verify-report');
    }
  };

  // Select a city from search
  const handleSelectCity = (city: IndianCityRecord) => {
    setCurrentCityId(city.id);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // Toggle city in multi-city comparison
  const handleToggleCompareCity = (cityId: string) => {
    if (comparisonCityIds.includes(cityId)) {
      if (comparisonCityIds.length > 2) {
        setComparisonCityIds(comparisonCityIds.filter(id => id !== cityId));
      }
    } else {
      if (comparisonCityIds.length < 5) {
        setComparisonCityIds([...comparisonCityIds, cityId]);
      }
    }
  };

  // Quick pick cities
  const quickPicks = [
    { id: 'pune', label: 'Pune' },
    { id: 'mumbai', label: 'Mumbai' },
    { id: 'nashik', label: 'Nashik' },
    { id: 'delhi', label: 'Delhi' },
    { id: 'bengaluru', label: 'Bengaluru' },
    { id: 'hyderabad', label: 'Hyderabad' },
    { id: 'chennai', label: 'Chennai' },
    { id: 'kolkata', label: 'Kolkata' },
    { id: 'jaipur', label: 'Jaipur' },
    { id: 'srinagar', label: 'Srinagar' }
  ];

  // Helper for max rainfall in trend
  const maxAnnualRain = useMemo(() => {
    return Math.max(
      ...analysisData.annualRainfallTrend.map(d => Math.max(d.rainfall, d.baseline)),
      300
    );
  }, [analysisData.annualRainfallTrend]);

  // Helper for max monthly rainfall
  const maxMonthlyRain = useMemo(() => {
    return Math.max(
      ...analysisData.monthlyRainfallPattern.map(d => Math.max(d.rainfall, d.baseline)),
      100
    );
  }, [analysisData.monthlyRainfallPattern]);

  // Filtered extreme events by hazard category
  const filteredExtremeEvents = useMemo(() => {
    return analysisData.extremeEventsByYear.map(item => {
      if (hazardFilter === 'All hazards') {
        return { year: item.year, count: item.totalEvents };
      }
      return {
        year: item.year,
        count: item.hazardBreakdown[hazardFilter] || 0
      };
    });
  }, [analysisData.extremeEventsByYear, hazardFilter]);

  const maxExtremeEventCount = useMemo(() => {
    return Math.max(...filteredExtremeEvents.map(e => e.count), 5);
  }, [filteredExtremeEvents]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Platform Mission & Context Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-300">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-semibold">
              MausamSetu Climatological Intelligence & Baseline Context
            </strong>
            <span className="text-slate-400">
              Historical analysis contextualizes current weather signals and enables verification of whether reported anomalies deviate from documented regional normals.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border transition-colors ${
              isDemoMode
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isDemoMode ? 'DEMO MODE: ON' : 'OFFICIAL IMD NORMALS'}
          </button>
        </div>
      </div>

      {/* Demo Mode Notice Banner (Requirement 25) */}
      {isDemoMode && (
        <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-600/60 text-xs text-amber-200 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>DEMO MODE:</strong> Demo data is shown for interface demonstration. Connect a verified historical weather data source for real-world operational decision making.
          </span>
        </div>
      )}

      {/* Main Title, Search & Selected Location (Sections 1 & 2) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800/60">
                City-Wise Archive
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                All-India Meteorological Grid
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              HISTORICAL WEATHER & RISK ANALYSIS
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Select or search any Indian city to inspect climatological baselines, hazard recurrence patterns, and multi-year anomalies.
            </p>
          </div>

          {/* Time Range Selector: 5 Years | 10 Years | 20 Years | Custom (Section 3) */}
          <div className="flex flex-col sm:flex-end gap-2">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Historical Range
            </label>
            <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 flex items-center">
              {(['5y', '10y', '20y', 'custom'] as const).map(preset => (
                <button
                  key={preset}
                  onClick={() => handlePresetChange(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    rangePreset === preset
                      ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {preset === '5y'
                    ? 'Last 5 yrs'
                    : preset === '10y'
                    ? 'Last 10 yrs'
                    : preset === '20y'
                    ? 'Last 20 yrs'
                    : 'Custom'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Range Sliders if Custom is selected */}
        {rangePreset === 'custom' && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Custom Year Span:</span>
            <div className="flex items-center gap-3">
              <span className="text-slate-500 dark:text-slate-400">From:</span>
              <select
                value={startYear}
                onChange={e => setStartYear(parseInt(e.target.value, 10))}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 font-mono font-bold"
              >
                {Array.from({ length: 20 }, (_, i) => 2005 + i).map(yr => (
                  <option key={yr} value={yr} disabled={yr >= endYear}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-500 dark:text-slate-400">To:</span>
              <select
                value={endYear}
                onChange={e => setEndYear(parseInt(e.target.value, 10))}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 font-mono font-bold"
              >
                {Array.from({ length: 20 }, (_, i) => 2006 + i).map(yr => (
                  <option key={yr} value={yr} disabled={yr <= startYear}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-cyan-600 dark:text-cyan-400 font-mono">
              Displaying {endYear - startYear + 1} years of climatology
            </span>
          </div>
        )}

        {/* City Search Bar & Quick Picks (Section 2) */}
        <div className="space-y-3">
          <div className="relative" ref={searchContainerRef}>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Search Indian City</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search any city in India (e.g. Pune, Mumbai, Nashik, Kolhapur, Nagpur, Delhi)..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 pl-11 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-950/60">
                  {searchQuery ? `Matching Cities in India (${searchResults.length})` : 'Popular Meteorological Stations'}
                </div>
                {searchResults.map(city => (
                  <button
                    key={city.id}
                    onClick={() => handleSelectCity(city)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{city.name}</span>
                        <span className="text-slate-400 font-normal">, {city.state}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Zone: {city.climateZone}</span>
                        <span>•</span>
                        <span>Elevation: {city.elevationMeters}m</span>
                        <span>•</span>
                        <span>Normal: {city.annualRainfallNormalMm} mm/yr</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Select <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Pick Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              Quick Picks:
            </span>
            {quickPicks.map(p => (
              <button
                key={p.id}
                onClick={() => setCurrentCityId(p.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  currentCityId.toLowerCase() === p.id
                    ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-400 text-cyan-700 dark:text-cyan-300 font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Location Card & Data Provenance (Sections 1, 16, 17) */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/10 dark:bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Selected Location
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {analysisData.city.name}, {analysisData.city.state}
              </h2>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-0.5 font-mono">
                <span>District: {analysisData.city.district}</span>
                <span>•</span>
                <span>Coords: {analysisData.city.latitude.toFixed(2)}°N, {analysisData.city.longitude.toFixed(2)}°E</span>
                <span>•</span>
                <span>Zone: {analysisData.city.climateZone}</span>
              </div>
            </div>
          </div>

          {/* Data Quality & Coverage Badge (Section 17) */}
          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-3 md:pt-0 md:pl-5">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Coverage</span>
              <strong className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                {analysisData.timeRange.periodLabel}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Data Quality</span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <strong className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {analysisData.dataQuality.status}
                </strong>
                <span className="text-[10px] text-slate-400 font-mono">(1.4% missing)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Export, Share & Cross-Verification Toolbar (Section 12 & 22) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
              Data Tools:
            </span>
            <button
              onClick={handlePrintReport}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Print-friendly view of this city's historical risk profile"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              <span>Print Report</span>
            </button>
            <button
              onClick={handleShareLink}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Copy shareable link with city and period parameters"
            >
              {copiedShareLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Share Analysis</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Cross-Verification CTA */}
          <button
            onClick={handleTriggerVerificationForCity}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/80 hover:bg-cyan-100 dark:hover:bg-cyan-900 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700 font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <CheckCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Cross-Verify Claim for {analysisData.city.name}</span>
          </button>
        </div>
      </div>

      {/* 4 Key Historical Indicators (Section 21 Layout) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Indicator 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Average Annual Rainfall</span>
            <Droplets className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {analysisData.keyIndicators.avgAnnualRainfall}
            </span>
            <span className="text-xs font-mono text-slate-500">mm / yr</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Baseline normal: {analysisData.city.annualRainfallNormalMm} mm
          </span>
        </div>

        {/* Indicator 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Average Temperature</span>
            <Thermometer className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {analysisData.keyIndicators.avgTemperature}
            </span>
            <span className="text-xs font-mono text-slate-500">°C</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Annual thermal average ({analysisData.timeRange.periodLabel})
          </span>
        </div>

        {/* Indicator 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Extreme Events</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {analysisData.keyIndicators.extremeEventsTotal}
            </span>
            <span className="text-xs font-mono text-slate-500">events logged</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Documented hazards in {analysisData.timeRange.periodLabel}
          </span>
        </div>

        {/* Indicator 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Highest Rainfall Year</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {analysisData.keyIndicators.highestRainfallYear.year}
            </span>
            <span className="text-xs font-mono text-slate-500">
              ({analysisData.keyIndicators.highestRainfallYear.amountMm} mm)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Record wet spell in period
          </span>
        </div>
      </div>

      {/* ========================================================
          GRAPH 1: ANNUAL RAINFALL TREND (Interactive Line/Area)
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Annual Rainfall Trend
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Yearly precipitation measured against the official IMD climatological baseline ({analysisData.city.annualRainfallNormalMm} mm).
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-cyan-500"></span>
              <span className="text-slate-600 dark:text-slate-300">Annual Rainfall</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-500"></span>
              <span className="text-slate-600 dark:text-slate-300">Historical Baseline</span>
            </span>
          </div>
        </div>

        {/* SVG Interactive Trend Chart */}
        <div className="relative pt-6 pb-2">
          <div className="h-64 sm:h-72 w-full flex items-end gap-1.5 sm:gap-2.5 px-2">
            {analysisData.annualRainfallTrend.map((item, idx) => {
              const rainHeightPercent = Math.min(100, (item.rainfall / maxAnnualRain) * 100);
              const baselineHeightPercent = Math.min(100, (item.baseline / maxAnnualRain) * 100);
              const isHovered = hoveredRainYear === item.year;

              return (
                <div
                  key={item.year}
                  onMouseEnter={() => setHoveredRainYear(item.year)}
                  onMouseLeave={() => setHoveredRainYear(null)}
                  className="flex-1 h-full flex flex-col justify-end items-center relative group cursor-pointer"
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-3 bg-slate-950 text-white text-[11px] p-2.5 rounded-xl border border-slate-700 shadow-2xl z-30 pointer-events-none whitespace-nowrap min-w-32 animate-in fade-in zoom-in-95">
                      <div className="font-bold text-cyan-400">{item.year}</div>
                      <div className="flex items-center justify-between gap-3 text-slate-300 mt-1">
                        <span>Rainfall:</span>
                        <strong className="text-white font-mono">{item.rainfall} mm</strong>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-slate-400">
                        <span>Normal:</span>
                        <span className="font-mono">{item.baseline} mm</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-slate-300 pt-1 border-t border-slate-800 mt-1">
                        <span>Departure:</span>
                        <strong
                          className={
                            item.departurePercent >= 0 ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'
                          }
                        >
                          {item.departurePercent >= 0 ? `+${item.departurePercent}%` : `${item.departurePercent}%`}
                        </strong>
                      </div>
                    </div>
                  )}

                  {/* Baseline Indicator Line Marker */}
                  <div
                    style={{ bottom: `${baselineHeightPercent}%` }}
                    className="absolute w-full h-[2px] bg-amber-500/80 z-10 pointer-events-none"
                    title={`Baseline: ${item.baseline} mm`}
                  />

                  {/* Rainfall Bar / Area Column */}
                  <div
                    style={{ height: `${rainHeightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-200 ${
                      isHovered
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-500/30'
                        : item.rainfall >= item.baseline
                        ? 'bg-cyan-600/80 dark:bg-cyan-500/80 hover:bg-cyan-500'
                        : 'bg-cyan-700/50 dark:bg-cyan-700/60 hover:bg-cyan-600'
                    }`}
                  />

                  {/* Year Label */}
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-2 transform -rotate-45 sm:rotate-0 truncate">
                    {item.year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
          <span>Source: IMD Automated Surface Network & Rain Gauges</span>
          <span>Units: Millimetres (mm)</span>
        </div>
      </div>

      {/* ========================================================
          GRAPH 2 & 3: MONTHLY RAINFALL PATTERN & TEMPERATURE TREND
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRAPH 2: MONTHLY RAINFALL PATTERN */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-500" />
                Monthly Rainfall Pattern
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Climatological distribution across months (Jan–Dec).
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 font-mono font-bold">
              Monsoon: Jun–Sep
            </span>
          </div>

          <div className="h-60 flex items-end gap-1.5 sm:gap-2 px-1 pt-6">
            {analysisData.monthlyRainfallPattern.map(m => {
              const heightPct = Math.min(100, (m.rainfall / maxMonthlyRain) * 100);
              const baselinePct = Math.min(100, (m.baseline / maxMonthlyRain) * 100);
              const isHovered = hoveredMonth === m.month;

              return (
                <div
                  key={m.month}
                  onMouseEnter={() => setHoveredMonth(m.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className="flex-1 h-full flex flex-col justify-end items-center relative group cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-2 bg-slate-950 text-white text-[11px] p-2.5 rounded-xl border border-slate-700 shadow-2xl z-30 pointer-events-none whitespace-nowrap min-w-28 animate-in fade-in">
                      <div className="font-bold text-cyan-400">{m.month}</div>
                      <div className="text-slate-300">Measured: <strong className="text-white">{m.rainfall} mm</strong></div>
                      <div className="text-slate-400">Baseline: <span className="font-mono">{m.baseline} mm</span></div>
                      <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 mt-1">
                        Historical Range: {m.minRecorded} – {m.maxRecorded} mm
                      </div>
                    </div>
                  )}

                  {/* Baseline hash */}
                  <div
                    style={{ bottom: `${baselinePct}%` }}
                    className="absolute w-full h-[2px] bg-amber-500/70 z-10 pointer-events-none"
                  />

                  {/* Monthly Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-sm transition-all duration-150 ${
                      m.isMonsoon
                        ? isHovered
                          ? 'bg-blue-400 shadow-md shadow-blue-500/30'
                          : 'bg-blue-600 dark:bg-blue-500'
                        : isHovered
                        ? 'bg-slate-400'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-mono mt-2 ${
                      m.isMonsoon
                        ? 'font-bold text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800 pt-2">
            <span>Blue bars = Southwest / Primary Monsoon</span>
            <span>Amber line = Baseline Normal</span>
          </div>
        </div>

        {/* GRAPH 3: HISTORICAL TEMPERATURE TREND */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-500" />
                Historical Temperature Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Mean, maximum, and minimum surface temperatures.
              </p>
            </div>
            {/* Annual vs Monthly Toggle (Section 6) */}
            <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 flex items-center">
              <button
                onClick={() => setTempTrendMode('annual')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  tempTrendMode === 'annual'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                Annual
              </button>
              <button
                onClick={() => setTempTrendMode('monthly')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  tempTrendMode === 'monthly'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="h-60 flex items-end gap-1 sm:gap-2 px-1 pt-6">
            {(tempTrendMode === 'annual'
              ? analysisData.temperatureTrendAnnual
              : analysisData.temperatureTrendMonthly
            ).map((t, idx) => {
              // Scale temperature between 0°C and 50°C
              const maxScale = 48;
              const avgHeight = Math.min(100, (t.avgTemp / maxScale) * 100);
              const maxHeight = Math.min(100, (t.maxTemp / maxScale) * 100);
              const minHeight = Math.min(100, (t.minTemp / maxScale) * 100);

              return (
                <div
                  key={idx}
                  className="flex-1 h-full flex flex-col justify-end items-center relative group cursor-pointer"
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-950 text-white text-[11px] p-2 rounded-xl border border-slate-700 shadow-2xl z-30 pointer-events-none whitespace-nowrap min-w-28">
                    <div className="font-bold text-rose-400">{t.label}</div>
                    <div className="text-slate-300">Avg: <strong className="text-white">{t.avgTemp}°C</strong></div>
                    <div className="text-rose-400">Max: {t.maxTemp}°C</div>
                    <div className="text-cyan-400">Min: {t.minTemp}°C</div>
                  </div>

                  {/* Range Bar */}
                  <div
                    style={{ height: `${maxHeight}%` }}
                    className="w-full bg-rose-500/20 dark:bg-rose-950/40 rounded-t-sm relative flex flex-col justify-end items-center"
                  >
                    {/* Max dot */}
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-0" />
                    {/* Avg line bar */}
                    <div
                      style={{ height: `${avgHeight}%` }}
                      className="w-full bg-rose-600/70 dark:bg-rose-500/70"
                    />
                    {/* Min dot */}
                    <div
                      style={{ bottom: `${minHeight}%` }}
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-2 truncate">
                    {t.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800 pt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Max Temp
              <span className="w-2 h-2 rounded-full bg-rose-700 ml-2"></span> Avg Temp
              <span className="w-2 h-2 rounded-full bg-cyan-400 ml-2"></span> Min Temp
            </span>
            <span>Units: °C</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          GRAPH 4: CURRENT WEATHER VS HISTORICAL BASELINE (Section 7)
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Current Weather vs Historical Baseline
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Multi-decadal baseline comparison for {analysisData.city.name}.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800 text-xs font-mono text-cyan-800 dark:text-cyan-300">
            Deviation: <strong>{analysisData.baselineComparison.percentDifference >= 0 ? `+${analysisData.baselineComparison.percentDifference}%` : `${analysisData.baselineComparison.percentDifference}%`}</strong>
          </div>
        </div>

        {/* Visual Comparison Horizontal Bars */}
        <div className="space-y-4 pt-2">
          {/* Row 1: Historical Average */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Historical Average</span>
              <span className="font-mono">{analysisData.baselineComparison.baselineAverage} mm</span>
            </div>
            <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex">
              <div
                style={{
                  width: `${(analysisData.baselineComparison.baselineAverage / analysisData.baselineComparison.historicalMax) * 100}%`
                }}
                className="bg-slate-500 h-full rounded-lg transition-all duration-500"
              />
            </div>
          </div>

          {/* Row 2: Current Rainfall */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-cyan-700 dark:text-cyan-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <strong>Current Season Rainfall</strong>
              </span>
              <span className="font-mono font-bold">{analysisData.baselineComparison.currentRainfall} mm</span>
            </div>
            <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex">
              <div
                style={{
                  width: `${(analysisData.baselineComparison.currentRainfall / analysisData.baselineComparison.historicalMax) * 100}%`
                }}
                className="bg-cyan-500 h-full rounded-lg transition-all duration-500 shadow-md shadow-cyan-500/20"
              />
            </div>
          </div>

          {/* Row 3: Historical Maximum */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Historical Maximum Recorded</span>
              <span className="font-mono">{analysisData.baselineComparison.historicalMax} mm</span>
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex">
              <div style={{ width: '100%' }} className="bg-rose-500/70 h-full rounded-lg" />
            </div>
          </div>

          {/* Row 4: Historical Minimum */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Historical Minimum Recorded</span>
              <span className="font-mono">{analysisData.baselineComparison.historicalMin} mm</span>
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex">
              <div
                style={{
                  width: `${(analysisData.baselineComparison.historicalMin / analysisData.baselineComparison.historicalMax) * 100}%`
                }}
                className="bg-amber-500/60 h-full rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Statistical Insight */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          Current rainfall is{' '}
          <strong className="text-cyan-600 dark:text-cyan-400">
            {Math.abs(analysisData.baselineComparison.percentDifference)}%{' '}
            {analysisData.baselineComparison.percentDifference >= 0 ? 'above' : 'below'}
          </strong>{' '}
          the historical average ({Math.abs(analysisData.baselineComparison.differenceMm)} mm difference).
        </div>

        {/* MANDATORY TRUST & SAFETY DISCLAIMER (Requirement 7 & 23) */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">
            <strong>MausamSetu Verification Notice:</strong> {analysisData.baselineComparison.trustDisclaimer}
          </span>
        </div>
      </div>

      {/* ========================================================
          GRAPH 5 & 6: HAZARD FREQUENCY & EXTREME EVENTS BY YEAR
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRAPH 5: HISTORICAL HAZARD FREQUENCY */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Historical Hazard Frequency
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Number of documented hazardous events ({analysisData.timeRange.periodLabel}).
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {analysisData.hazardFrequency.reduce((a, b) => a + b.count, 0)} Total
            </span>
          </div>

          {/* Bar Chart of Hazards */}
          <div className="space-y-3 pt-2">
            {analysisData.hazardFrequency.map(h => {
              const maxHazard = Math.max(...analysisData.hazardFrequency.map(x => x.count), 1);
              const widthPct = Math.min(100, (h.count / maxHazard) * 100);

              return (
                <div key={h.hazard} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      {h.hazard === 'Heavy Rainfall' && <Droplets className="w-3.5 h-3.5 text-blue-500" />}
                      {h.hazard === 'Flood' && <Waves className="w-3.5 h-3.5 text-cyan-500" />}
                      {h.hazard === 'Heatwave' && <Flame className="w-3.5 h-3.5 text-rose-500" />}
                      {h.hazard === 'Lightning' && <CloudLightning className="w-3.5 h-3.5 text-amber-400" />}
                      {h.hazard === 'Cyclone' && <Wind className="w-3.5 h-3.5 text-teal-400" />}
                      {h.hazard === 'Landslide' && <Layers className="w-3.5 h-3.5 text-orange-500" />}
                      {h.hazard === 'Strong Wind' && <Wind className="w-3.5 h-3.5 text-indigo-400" />}
                      {h.hazard === 'Drought' && <Sun className="w-3.5 h-3.5 text-yellow-500" />}
                      <span>{h.hazard}</span>
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      <strong>{h.count}</strong> events
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className={`h-full rounded-full ${
                        h.severityGrade === 'Severe'
                          ? 'bg-rose-600'
                          : h.severityGrade === 'High'
                          ? 'bg-amber-500'
                          : 'bg-cyan-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800 pt-2">
            <span>Filter: {analysisData.timeRange.periodLabel}</span>
            <span>Source: State Disaster Management Authorities & NDMA</span>
          </div>
        </div>

        {/* GRAPH 6: EXTREME WEATHER EVENTS BY YEAR */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Extreme Events by Year
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Annual frequency of declared extreme meteorological events.
              </p>
            </div>
            {/* Category Filter */}
            <select
              value={hazardFilter}
              onChange={e => setHazardFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1"
            >
              <option value="All hazards">All hazards</option>
              <option value="Heavy Rainfall">Heavy Rainfall</option>
              <option value="Flood">Flood</option>
              <option value="Heatwave">Heatwave</option>
              <option value="Lightning">Lightning</option>
              <option value="Cyclone">Cyclone</option>
              <option value="Landslide">Landslide</option>
              <option value="Strong Wind">Strong Wind</option>
              <option value="Drought">Drought</option>
            </select>
          </div>

          {/* Bar Chart by Year */}
          <div className="h-60 flex items-end gap-1.5 sm:gap-2 px-1 pt-6">
            {filteredExtremeEvents.map(item => {
              const heightPct = Math.min(100, (item.count / maxExtremeEventCount) * 100);

              return (
                <div
                  key={item.year}
                  className="flex-1 h-full flex flex-col justify-end items-center relative group cursor-pointer"
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-950 text-white text-[11px] p-2 rounded-xl border border-slate-700 shadow-2xl z-30 pointer-events-none whitespace-nowrap min-w-24">
                    <div className="font-bold text-orange-400">{item.year}</div>
                    <div className="text-slate-200">{item.count} {hazardFilter} events</div>
                  </div>

                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-orange-500/80 hover:bg-orange-400 rounded-t-sm transition-all duration-150"
                  />
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-2 truncate">
                    {item.year}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800 pt-2">
            <span>Filtered: {hazardFilter}</span>
            <span>Recorded threshold: &gt;95th percentile</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          GRAPH 7 & 8: SEASONAL ANALYSIS & HISTORICAL ANOMALIES
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRAPH 7: SEASONAL WEATHER PATTERN */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-500" />
              Seasonal Weather Pattern
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Four seasonal quadrants of the Indian meteorological cycle.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {analysisData.seasonalAnalysis.map(season => (
              <div
                key={season.season}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {season.season}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{season.months}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Rainfall:</span>
                    <strong className="text-cyan-600 dark:text-cyan-400 font-mono">
                      {season.avgRainfallMm} mm
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Avg Temp:</span>
                    <strong className="text-rose-600 dark:text-rose-400 font-mono">
                      {season.avgTempC}°C
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Extreme Events:</span>
                    <strong className="text-amber-600 dark:text-amber-400 font-mono">
                      {season.extremeEventsCount}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800 pt-2">
            Seasonal averages computed across {analysisData.timeRange.periodLabel}.
          </div>
        </div>

        {/* GRAPH 8: HISTORICAL WEATHER ANOMALIES */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-500" />
                Historical Weather Anomalies
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Precipitation departure percentage from the climatological baseline.
              </p>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              0% = Normal Baseline
            </div>
          </div>

          {/* Diverging Bar / Line Chart (+40% to -40%) */}
          <div className="h-60 flex items-center gap-1.5 sm:gap-2 px-1 relative">
            {/* Center Zero Line */}
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-slate-400 dark:bg-slate-600 z-10" />

            {analysisData.anomaliesTrend.map(item => {
              const maxAnomalyRange = 50; // -50% to +50%
              const absVal = Math.min(maxAnomalyRange, Math.abs(item.rainfallAnomalyPercent));
              const heightPct = (absVal / maxAnomalyRange) * 50; // half height
              const isPositive = item.rainfallAnomalyPercent >= 0;

              return (
                <div
                  key={item.year}
                  className="flex-1 h-full flex flex-col justify-center items-center relative group cursor-pointer"
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-950 text-white text-[11px] p-2.5 rounded-xl border border-slate-700 shadow-2xl z-30 pointer-events-none whitespace-nowrap min-w-28">
                    <div className="font-bold text-cyan-400">{item.year}</div>
                    <div className="text-slate-300">
                      Rainfall Anomaly:{' '}
                      <strong className={isPositive ? 'text-emerald-400' : 'text-amber-400'}>
                        {isPositive ? `+${item.rainfallAnomalyPercent}%` : `${item.rainfallAnomalyPercent}%`}
                      </strong>
                    </div>
                    <div className="text-slate-400">
                      Thermal Departure: +{item.tempDepartureCelsius}°C
                    </div>
                  </div>

                  {/* Positive Bar (upper half) */}
                  <div className="h-1/2 w-full flex flex-col justify-end items-center">
                    {isPositive && (
                      <div
                        style={{ height: `${heightPct * 2}%` }}
                        className="w-full bg-emerald-500 rounded-t-sm hover:bg-emerald-400 transition-all"
                      />
                    )}
                  </div>

                  {/* Negative Bar (lower half) */}
                  <div className="h-1/2 w-full flex flex-col justify-start items-center">
                    {!isPositive && (
                      <div
                        style={{ height: `${heightPct * 2}%` }}
                        className="w-full bg-amber-500 rounded-b-sm hover:bg-amber-400 transition-all"
                      />
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 absolute bottom-0 truncate">
                    {item.year}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800 pt-2">
            <span className="text-emerald-600 dark:text-emerald-400">Positive = Above Normal</span>
            <span className="text-amber-600 dark:text-amber-400">Negative = Deficit / Below Normal</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          GRAPH 9: YEAR-TO-YEAR COMPARISON (Section 12)
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Year-to-Year Comparative Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Direct telemetry comparison between two historical years in {analysisData.city.name}.
            </p>
          </div>

          {/* Select Two Years */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500 dark:text-slate-400">Year A:</span>
              <select
                value={compareYear1}
                onChange={e => setCompareYear1(parseInt(e.target.value, 10))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 font-bold"
              >
                {Array.from({ length: 15 }, (_, i) => 2011 + i).map(yr => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-slate-400 font-bold">vs</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500 dark:text-slate-400">Year B:</span>
              <select
                value={compareYear2}
                onChange={e => setCompareYear2(parseInt(e.target.value, 10))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 font-bold"
              >
                {Array.from({ length: 15 }, (_, i) => 2011 + i).map(yr => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grouped Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Metric 1: Rainfall */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Rainfall Comparison
            </span>
            <div className="space-y-2 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{compareYear1}:</span>
                <span className="text-slate-900 dark:text-white font-bold">{yearComparison.rainfallYear1} mm</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-600 dark:text-amber-400 font-bold">{compareYear2}:</span>
                <span className="text-slate-900 dark:text-white font-bold">{yearComparison.rainfallYear2} mm</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] flex justify-between text-slate-500">
                <span>Variance:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {yearComparison.rainfallYear2 - yearComparison.rainfallYear1 > 0 ? '+' : ''}
                  {yearComparison.rainfallYear2 - yearComparison.rainfallYear1} mm
                </span>
              </div>
            </div>
          </div>

          {/* Metric 2: Mean Temp */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Mean Temperature
            </span>
            <div className="space-y-2 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{compareYear1}:</span>
                <span className="text-slate-900 dark:text-white font-bold">{yearComparison.avgTempYear1}°C</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-600 dark:text-amber-400 font-bold">{compareYear2}:</span>
                <span className="text-slate-900 dark:text-white font-bold">{yearComparison.avgTempYear2}°C</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] flex justify-between text-slate-500">
                <span>Thermal Drift:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {(yearComparison.avgTempYear2 - yearComparison.avgTempYear1).toFixed(1)}°C
                </span>
              </div>
            </div>
          </div>

          {/* Metric 3: Extreme Events */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Extreme Events Logged
            </span>
            <div className="space-y-2 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{compareYear1}:</span>
                <span className="text-slate-900 dark:text-white font-bold">{yearComparison.extremeEventsYear1} events</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-600 dark:text-amber-400 font-bold">{compareYear2}:</span>
                <span className="text-slate-900 dark:text-white font-bold">{yearComparison.extremeEventsYear2} events</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] flex justify-between text-slate-500">
                <span>Frequency Delta:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {yearComparison.extremeEventsYear2 - yearComparison.extremeEventsYear1 > 0 ? '+' : ''}
                  {yearComparison.extremeEventsYear2 - yearComparison.extremeEventsYear1}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          SECTION 13: COMPARE CITIES (Up to 5 Indian Cities)
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-500" />
              Compare Indian Cities
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cross-examine climatological norms across up to 5 Indian cities.
            </p>
          </div>

          {/* Metric Selector (Section 13) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {(
              [
                { id: 'rainfall', label: 'Annual Rainfall' },
                { id: 'temperature', label: 'Avg Temp' },
                { id: 'rainEvents', label: 'Extreme Rain' },
                { id: 'heatwave', label: 'Heatwaves' },
                { id: 'flood', label: 'Flood Events' }
              ] as const
            ).map(m => (
              <button
                key={m.id}
                onClick={() => setComparisonMetric(m.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  comparisonMetric === m.id
                    ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Cities Selector Pills */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Selected Cities (Choose up to 5):
          </span>
          <div className="flex flex-wrap gap-2">
            {ALL_INDIA_CITIES.slice(0, 14).map(c => {
              const isSelected = comparisonCityIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => handleToggleCompareCity(c.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-400 text-cyan-800 dark:text-cyan-300 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{c.name}</span>
                  {isSelected && <span className="text-[10px] text-cyan-500">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* City Comparison Bar Chart */}
        <div className="space-y-3 pt-2">
          {multiCityComparison.map(city => {
            let val = 0;
            let unit = '';
            let maxVal = 1;

            if (comparisonMetric === 'rainfall') {
              val = city.annualRainfall;
              unit = 'mm / yr';
              maxVal = Math.max(...multiCityComparison.map(c => c.annualRainfall), 100);
            } else if (comparisonMetric === 'temperature') {
              val = city.avgTemperature;
              unit = '°C';
              maxVal = 35;
            } else if (comparisonMetric === 'rainEvents') {
              val = city.extremeRainEvents;
              unit = 'events';
              maxVal = Math.max(...multiCityComparison.map(c => c.extremeRainEvents), 5);
            } else if (comparisonMetric === 'heatwave') {
              val = city.heatwaveEvents;
              unit = 'events';
              maxVal = Math.max(...multiCityComparison.map(c => c.heatwaveEvents), 5);
            } else {
              val = city.floodEvents;
              unit = 'events';
              maxVal = Math.max(...multiCityComparison.map(c => c.floodEvents), 5);
            }

            const widthPct = Math.min(100, (val / maxVal) * 100);

            return (
              <div key={city.cityId} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <strong className="text-slate-900 dark:text-white">{city.cityName}</strong>
                    <span className="text-slate-400 font-normal">({city.state})</span>
                  </span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {val} {unit}
                  </span>
                </div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex">
                  <div
                    style={{ width: `${widthPct}%` }}
                    className="bg-cyan-500 h-full rounded-lg transition-all duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          SECTION 22: VERIFICATION CONNECTION (Anti-Misinformation)
          ======================================================== */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg sm:text-xl font-black text-white">
              Use Historical Data While Verifying Weather Information
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Have you received a viral WhatsApp forward or social media panic post claiming imminent cloudbursts or record-shattering heat? Cross-examine claims against real-time ground telemetry and historical baselines before trusting or sharing.
          </p>
          <div className="text-[11px] text-cyan-300/80 font-mono">
            MausamSetu Rule: Historical context supports evaluation — it does not independently verify forward claims.
          </div>
        </div>

        <button
          onClick={handleTriggerVerificationForCity}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Verify a Weather Message for {analysisData.city.name}</span>
        </button>
      </div>

      {/* ========================================================
          DATA PROVENANCE & AUTHORITATIVE METEOROLOGICAL SOURCES
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Authoritative Data Provenance & Methodological Standards
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold">
            Audited Standards
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">IMD Pune / New Delhi</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              30-year climatological normal tables (1991–2020) & regional automatic surface weather networks (AWS).
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">NDMA SACHET Grid</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              National Disaster Management Authority CAP alerts, heatwave declarations, and hazard registry.
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">CWC Basin Inflow</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              Central Water Commission hydrological monitoring stations and reservoir danger mark calibrations.
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">MOSDAC / ISRO</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              INSAT-3D/3DR geostationary quantitative precipitation estimates (QPE) and atmospheric sounders.
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <span>Station Elevation: {analysisData.city.elevationMeters}m MSL • Grid Cell: {analysisData.city.latitude.toFixed(2)}°N, {analysisData.city.longitude.toFixed(2)}°E</span>
          <span>MausamSetu Climatology Engine v2.4 (IST Synchronized)</span>
        </div>
      </div>
    </div>
  );
};
