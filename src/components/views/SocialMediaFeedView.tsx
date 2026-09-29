import React, { useState, useMemo, useEffect } from 'react';
import {
  Share2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  MapPin,
  Search,
  Filter,
  Eye,
  CheckCheck,
  Radio,
  Layers,
  Sparkles,
  Info,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  TrendingUp,
  MessageSquare,
  X,
  Compass,
  Activity,
  ChevronDown,
  ArrowRight,
  Database,
  SlidersHorizontal,
  Flame,
  CloudRain,
  Wind,
  Zap,
  Gauge
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { SocialPlatform, SocialSourceType, VerificationStatus, HazardType, SocialReport, City, Area } from '../../types';
import { getSocialReports, getSocialWeatherSummary } from '../../data/socialReportsData';
import { INDIAN_CITIES, getCityById, getAreaById } from '../../data/citiesData';

interface SocialMediaFeedViewProps {
  onVerifyClaim: (claim: {
    source: string;
    platform: string;
    account: string;
    text: string;
    url: string;
    location: string;
    hazard: string;
  }) => void;
}

export const SocialMediaFeedView: React.FC<SocialMediaFeedViewProps> = ({ onVerifyClaim }) => {
  const { selectedCity: globalCity, selectedArea: globalArea, setCity, setArea, weather } = useLocation();

  // Local city selection - initialized from global context, but can be switched directly here
  const [filterCityId, setFilterCityId] = useState<string>(globalCity.id);
  const [filterAreaId, setFilterAreaId] = useState<string>(globalArea.id);

  // Platform & Hazard & Status & Time dropdown filters
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [hazardFilter, setHazardFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<string>('Latest');

  // Source Type Filter (OFFICIAL, NEWS, SOCIAL, USER_REPORT)
  const [sourceTypeFilter, setSourceTypeFilter] = useState<'All' | SocialSourceType>('All');

  // Text search query
  const [searchQuery, setSearchQuery] = useState('');

  // Selected report for the detailed In-Page Verification Inspection Modal
  const [inspectingReport, setInspectingReport] = useState<SocialReport | null>(null);

  // Sync with global location changes if they happen from the Header
  useEffect(() => {
    setFilterCityId(globalCity.id);
    setFilterAreaId(globalArea.id);
  }, [globalCity.id, globalArea.id]);

  // Current active city object
  const activeCity: City = useMemo(() => {
    return getCityById(filterCityId);
  }, [filterCityId]);

  // Dynamic area list for the currently selected city (strictly populated per city)
  const availableAreas: Area[] = useMemo(() => {
    return activeCity.areas || [];
  }, [activeCity]);

  // Handle City Change: Automatically switches city and resets area to "all"
  const handleCityChange = (newCityId: string) => {
    setFilterCityId(newCityId);
    setFilterAreaId('all');
    // Also sync globally so the entire MausamSetu intelligence engine stays cohesive
    setCity(newCityId);
  };

  // Handle Area Change
  const handleAreaChange = (newAreaId: string) => {
    setFilterAreaId(newAreaId);
    if (newAreaId !== 'all') {
      setArea(newAreaId);
    }
  };

  // Retrieve reports strictly filtered by city, area, platform, hazard, status, and time
  const reports = useMemo(() => {
    return getSocialReports({
      cityId: filterCityId,
      areaId: filterAreaId,
      platform: platformFilter !== 'All' ? platformFilter : undefined,
      sourceType: sourceTypeFilter !== 'All' ? sourceTypeFilter : undefined,
      hazard: hazardFilter !== 'All' ? hazardFilter : undefined,
      verificationStatus: statusFilter !== 'All' ? statusFilter : undefined,
      timeFilter: timeFilter,
      search: searchQuery
    });
  }, [filterCityId, filterAreaId, platformFilter, sourceTypeFilter, hazardFilter, statusFilter, timeFilter, searchQuery]);

  // City-specific summary
  const summary = useMemo(() => {
    return getSocialWeatherSummary(filterCityId);
  }, [filterCityId]);

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('twitter') || p === 'x') {
      return <Twitter className="w-4 h-4 text-sky-400" />;
    }
    if (p.includes('facebook')) {
      return <Facebook className="w-4 h-4 text-blue-500" />;
    }
    if (p.includes('instagram')) {
      return <Instagram className="w-4 h-4 text-pink-400" />;
    }
    if (p.includes('youtube')) {
      return <Youtube className="w-4 h-4 text-red-500" />;
    }
    return <MessageSquare className="w-4 h-4 text-slate-400" />;
  };

  const getStatusBadge = (status: VerificationStatus | string) => {
    const s = (status || '').toUpperCase().replace(/\s+/g, '_');
    switch (s) {
      case 'SUPPORTED':
        return 'bg-emerald-950/80 border-emerald-600 text-emerald-300';
      case 'PARTIALLY_SUPPORTED':
      case 'PARTIALLY SUPPORTED':
        return 'bg-amber-950/80 border-amber-600 text-amber-300';
      case 'NOT_VERIFIED':
      case 'NOT VERIFIED':
        return 'bg-slate-800 border-slate-600 text-slate-300';
      case 'OUTDATED':
        return 'bg-purple-950/80 border-purple-600 text-purple-300';
      case 'UNABLE_TO_CONFIRM':
      case 'UNABLE TO CONFIRM':
        return 'bg-rose-950/80 border-rose-600 text-rose-300';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  const getHazardIcon = (hazard: string) => {
    const h = (hazard || '').toLowerCase();
    if (h.includes('rain')) return <CloudRain className="w-3.5 h-3.5 text-blue-400" />;
    if (h.includes('flood')) return <Compass className="w-3.5 h-3.5 text-cyan-400" />;
    if (h.includes('wind')) return <Wind className="w-3.5 h-3.5 text-teal-400" />;
    if (h.includes('thunder') || h.includes('lightning')) return <Zap className="w-3.5 h-3.5 text-amber-400" />;
    if (h.includes('heat')) return <Flame className="w-3.5 h-3.5 text-orange-400" />;
    return <AlertCircle className="w-3.5 h-3.5 text-indigo-400" />;
  };

  const handleOpenVerifyModal = (report: SocialReport) => {
    setInspectingReport(report);
  };

  const handleProceedToVerifyLab = (report: SocialReport) => {
    setInspectingReport(null);
    onVerifyClaim({
      source: `${report.platform} (${report.account_name})`,
      platform: typeof report.platform === 'string' ? report.platform : 'Social Media',
      account: report.account_handle,
      text: report.content,
      url: report.url || '',
      location: `${report.areaName || report.detected_location.area ? `${report.areaName || report.detected_location.area}, ` : ''}${report.cityName || report.detected_location.city}`,
      hazard: report.hazardType || report.hazard_type
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-800/80">
              SOCIAL MEDIA WEATHER MONITOR
            </span>
            <span className="text-xs text-slate-400">
              Active City: <strong className="text-white">{activeCity.name}</strong> ({activeCity.state})
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-950/70 border border-amber-700/80 text-amber-300 flex items-center gap-1 font-bold">
              <span>●</span> SIMULATED MONITORING FEED
            </span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">SOCIAL & MEDIA INTELLIGENCE FEED</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            MausamSetu monitors weather claims across <strong>X / Twitter</strong>, <strong>Facebook</strong>, <strong>Instagram</strong>, and <strong>YouTube</strong>.
            Claims are collected, identified, compared against radar telemetry, and verified objectively without biased labeling.
          </p>
        </div>

        {/* Anti-Misinformation Guard Status */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-right shrink-0">
          <div className="flex items-center justify-end gap-1.5 text-xs text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Misinformation Protocol</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Neutral Classification: Supported • Partially Supported • Not Verified
          </p>
          <div className="mt-1 text-[10px] text-cyan-400 font-semibold">
            {reports.length} Reports Loaded for {activeCity.name}
          </div>
        </div>
      </div>

      {/* ========================================================
          3 & 4. TOP CITY, AREA, PLATFORM, HAZARD, STATUS & TIME FILTERS
          ======================================================== */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Feed Controls & Location Filters</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Showing claims for: <span className="text-cyan-300 font-semibold">{filterAreaId === 'all' ? 'All Areas' : activeCity.areas.find(a => a.id === filterAreaId)?.name || filterAreaId}</span>, {activeCity.name}
          </span>
        </div>

        {/* 6 Required Filters in a Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. CITY FILTER */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              City
            </label>
            <div className="relative">
              <select
                value={filterCityId}
                onChange={e => handleCityChange(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-800/60 hover:border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
              >
                {INDIAN_CITIES.map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. AREA FILTER (Dynamically populated strictly for the selected city) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Area / Locality
            </label>
            <div className="relative">
              <select
                value={filterAreaId}
                onChange={e => handleAreaChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 hover:border-slate-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
              >
                <option value="all" className="bg-slate-900 text-white font-semibold">
                  All Areas ({availableAreas.length})
                </option>
                {availableAreas.map(a => (
                  <option key={a.id} value={a.id} className="bg-slate-900 text-white">
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. PLATFORM FILTER */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Platform
            </label>
            <select
              value={platformFilter}
              onChange={e => setPlatformFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 hover:border-slate-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="All">All Platforms</option>
              <option value="X / Twitter">X / Twitter</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>

          {/* 4. HAZARD FILTER */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Hazard
            </label>
            <select
              value={hazardFilter}
              onChange={e => setHazardFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 hover:border-slate-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="All">All Hazards</option>
              <option value="Heavy Rain">Heavy Rain</option>
              <option value="Flood">Flood Risk</option>
              <option value="Thunderstorm">Thunderstorm</option>
              <option value="Strong Wind">Strong Wind</option>
              <option value="Heat">Heat Risk</option>
              <option value="Poor Air Quality">AQI / Smog</option>
              <option value="Lightning">Lightning</option>
              <option value="Cyclone">Cyclone</option>
              <option value="Other Weather Reports">Other Reports</option>
            </select>
          </div>

          {/* 5. VERIFICATION STATUS FILTER */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Verification Status
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 hover:border-slate-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="SUPPORTED">Supported</option>
              <option value="PARTIALLY SUPPORTED">Partially Supported</option>
              <option value="NOT VERIFIED">Not Verified</option>
              <option value="OUTDATED">Outdated</option>
              <option value="UNABLE TO CONFIRM">Unable to Confirm</option>
            </select>
          </div>

          {/* 6. TIME FILTER */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Time
            </label>
            <select
              value={timeFilter}
              onChange={e => setTimeFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 hover:border-slate-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="Latest">Latest</option>
              <option value="Oldest">Oldest</option>
              <option value="Most Engaged">Most Engaged</option>
            </select>
          </div>
        </div>

        {/* Quick Platform Tabs & Source Category Filter Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Quick Platform Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(['All', 'X / Twitter', 'Facebook', 'Instagram', 'YouTube'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setPlatformFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  platformFilter === tab
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
                }`}
              >
                {tab !== 'All' && getPlatformIcon(tab)}
                <span>{tab === 'All' ? 'ALL' : tab === 'X / Twitter' ? 'X / TWITTER' : tab.toUpperCase()}</span>
                {tab !== 'All' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${platformFilter === tab ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {tab === 'X / Twitter' ? summary.byPlatform.xTwitter : tab === 'Facebook' ? summary.byPlatform.facebook : tab === 'Instagram' ? summary.byPlatform.instagram : summary.byPlatform.youtube}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Quick Source Type Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['All', 'OFFICIAL', 'NEWS', 'SOCIAL', 'USER_REPORT'] as const).map(st => (
              <button
                key={st}
                onClick={() => setSourceTypeFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                  sourceTypeFilter === st
                    ? 'bg-cyan-950 border border-cyan-500/80 text-cyan-300 font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'All' ? 'All Sources' : st === 'OFFICIAL' ? 'Official Sources' : st === 'NEWS' ? 'News Sources' : st === 'SOCIAL' ? 'Social Reports' : 'User Reports'}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-56 shrink-0">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search reports or claims..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          5. SOCIAL REPORT CARDS GRID
          ======================================================== */}
      {reports.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3 shadow-xl">
          <Radio className="w-10 h-10 text-slate-500 mx-auto animate-pulse" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Social Reports Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No active social media weather reports match the current filters for <strong>{filterAreaId === 'all' ? 'All Areas' : filterAreaId}</strong> in <strong>{activeCity.name}</strong>.
          </p>
          <button
            onClick={() => {
              setFilterAreaId('all');
              setPlatformFilter('All');
              setHazardFilter('All');
              setStatusFilter('All');
              setSourceTypeFilter('All');
              setSearchQuery('');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 text-xs font-bold hover:bg-cyan-500/30 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map(report => (
            <div
              key={report.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden group"
            >
              {/* Demo Badge Watermark */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-950/60 border border-amber-700/60 text-amber-300 font-bold tracking-tight">
                    DEMO SOCIAL REPORT
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID: {report.id}
                  </span>
                </div>

                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase border ${getStatusBadge(report.verificationStatus || report.verification_status)}`}>
                  {report.verificationStatus || report.verification_status}
                </span>
              </div>

              <div>
                {/* Platform, Account Name & Source Type */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                      {getPlatformIcon(report.platform)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white leading-tight">{report.account_name}</span>
                        {report.source_type === 'OFFICIAL' && (
                          <span title="Verified Official Entity">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="text-slate-300 font-mono">{report.account_handle}</span>
                        <span>•</span>
                        <span>{report.platform}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono uppercase">
                    {report.source_type}
                  </span>
                </div>

                {/* Location indicator (City → Area) */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    📍 <strong className="text-white">{report.cityName || report.detected_location.city}</strong> → <span className="text-cyan-300 font-semibold">{report.areaName || report.detected_location.area || report.cityName}</span>
                  </span>
                </div>

                {/* Post Content */}
                <p className="text-xs text-slate-200 leading-relaxed font-sans mb-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 italic">
                  "{report.content}"
                </p>

                {/* Extracted Claim Box */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono space-y-1.5 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      {getHazardIcon(report.hazardType || report.hazard_type)}
                      HAZARD:
                    </span>
                    <strong className="text-amber-300 font-bold">
                      {report.hazardType || report.hazard_type} ({report.severity})
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] uppercase">Weather Claim:</span>
                    <strong className="text-white text-right">
                      {report.weatherClaim.parameter}: {report.weatherClaim.value || 'Reported'}
                    </strong>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                    <span>Posted: {report.timestamp}</span>
                    <span>Timeframe: {report.weatherClaim.timeframe || 'Immediate'}</span>
                  </div>
                </div>

                {/* Objective Source Scoring Attributes & Evidence availability */}
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[10px] font-mono grid grid-cols-2 gap-2 text-slate-400 mb-3">
                  <div>
                    <span>Source Type: </span>
                    <strong className="text-slate-300">{report.sourceScoring?.sourceType || report.source_type}</strong>
                  </div>
                  <div>
                    <span>Evidence Found: </span>
                    <strong className={report.sourceScoring?.evidenceAvailable === 'Yes' ? 'text-cyan-400' : 'text-amber-400'}>
                      {report.sourceScoring?.evidenceAvailable || (report.evidence ? 'Yes' : 'Limited')}
                    </strong>
                  </div>
                  <div className="col-span-2 text-slate-300 truncate">
                    <span className="text-slate-500">Evidence Citation: </span>
                    <span className="text-cyan-300 font-semibold">{report.evidence || 'Doppler Radar soundings & AWS Telemetry'}</span>
                  </div>
                </div>

                {/* Verification Reason */}
                <div className="text-[11px] text-slate-400 italic bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/40">
                  <strong className="text-slate-300 font-sans not-italic">Verification Analysis: </strong>
                  {report.verification_reason}
                </div>
              </div>

              {/* Action Buttons: View Original & Verify Claim */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  {report.engagement && (
                    <span>❤ {report.engagement.likes} | 🔁 {report.engagement.shares}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>VIEW SOURCE</span>
                  </a>

                  <button
                    onClick={() => handleOpenVerifyModal(report)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>VERIFY</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          56. IN-PAGE SOCIAL MEDIA VERIFICATION PIPELINE MODAL
          SOCIAL MEDIA POST → CLAIM EXTRACTION → LOCATION IDENTIFICATION
          → CURRENT WEATHER CHECK → OFFICIAL SOURCE CHECK → FORECAST CHECK
          → HISTORICAL CONTEXT → VERIFICATION RESULT
          ======================================================== */}
      {inspectingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
                  <CheckCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Social Media Claim Verification Pipeline
                  </h3>
                  <p className="text-xs text-slate-400">
                    Multilateral scientific verification against official radar, AWS sensors & synoptic models
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pipeline Steps Flow */}
            <div className="space-y-4">
              {/* Step 1: SOCIAL MEDIA POST */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-[10px]">1</span>
                    ORIGINAL SOCIAL MEDIA POST
                  </span>
                  <span>{inspectingReport.platform} • {inspectingReport.timestamp}</span>
                </div>
                <p className="text-xs text-slate-200 italic font-sans pl-5">
                  "{inspectingReport.content}"
                </p>
                <div className="pl-5 text-[11px] text-slate-400">
                  Source: <strong className="text-white">{inspectingReport.account_name}</strong> ({inspectingReport.account_handle})
                </div>
              </div>

              {/* Step 2: CLAIM EXTRACTION */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 uppercase">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-[10px]">2</span>
                  EXTRACTED CLAIM PARAMETERS
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-5 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Hazard</div>
                    <div className="text-amber-300 font-bold">{inspectingReport.hazardType || inspectingReport.hazard_type}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Parameter</div>
                    <div className="text-white font-bold">{inspectingReport.weatherClaim.parameter}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Claimed Value</div>
                    <div className="text-white font-bold">{inspectingReport.weatherClaim.value || 'N/A'}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Severity</div>
                    <div className="text-cyan-300 font-bold">{inspectingReport.severity}</div>
                  </div>
                </div>
              </div>

              {/* Step 3: LOCATION IDENTIFICATION */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 uppercase">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-[10px]">3</span>
                  LOCATION GEOLOCATION IDENTIFICATION
                </span>
                <div className="pl-5 text-xs text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>
                    Detected: <strong className="text-white">{inspectingReport.cityName || inspectingReport.detected_location.city}</strong> → <span className="text-cyan-300 font-semibold">{inspectingReport.areaName || inspectingReport.detected_location.area || inspectingReport.cityName}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-950 border border-emerald-800 text-emerald-300">
                    Confidence: {Math.round((inspectingReport.detected_location?.confidence || 0.95) * 100)}%
                  </span>
                </div>
              </div>

              {/* Step 4 & 5: CURRENT WEATHER & OFFICIAL SOURCE CHECK */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 uppercase">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-[10px]">4 & 5</span>
                  CURRENT WEATHER & OFFICIAL SOURCE CHECK
                </span>
                <div className="pl-5 space-y-1.5 text-xs">
                  <div className="text-slate-300">
                    <strong className="text-white">Evidence Citation:</strong> {inspectingReport.evidence || 'Ground AWS station telemetry'}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Cross-referenced against IMD regional Doppler radar, State Disaster Management telemetry, and municipal automated rain gauges.
                  </div>
                </div>
              </div>

              {/* Step 6 & 7: FORECAST & HISTORICAL CONTEXT */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 uppercase">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-[10px]">6 & 7</span>
                  FORECAST CHECK & HISTORICAL CONTEXT
                </span>
                <div className="pl-5 text-xs text-slate-300 leading-relaxed">
                  Synoptic numerical model (ECMWF & GFS ensemble) aligned with current season baseline. No anomalous deviation contradicting radar.
                </div>
              </div>

              {/* Step 8: FINAL VERIFICATION RESULT */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-[10px] font-black">8</span>
                    FINAL VERIFICATION RESULT
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-black uppercase border ${getStatusBadge(inspectingReport.verificationStatus || inspectingReport.verification_status)}`}>
                    {inspectingReport.verificationStatus || inspectingReport.verification_status}
                  </span>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono">
                  {inspectingReport.verification_reason}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setInspectingReport(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Close
              </button>

              <button
                onClick={() => handleProceedToVerifyLab(inspectingReport)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
              >
                <span>OPEN IN VERIFICATION LAB</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Architecture Scalability Note */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Scalable Multi-City Architecture: </strong>
          Social Reports now natively support all 14 major Indian cities and their distinct localities (e.g. Pune, Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad, Jaipur, Lucknow, Nagpur, Nashik, Bhopal, Chandigarh). When the city filter changes, only reports for that city are loaded, and the Area dropdown immediately updates to that city's localities.
        </div>
      </div>
    </div>
  );
};
