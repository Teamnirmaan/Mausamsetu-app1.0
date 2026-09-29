import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Layers,
  Search,
  Maximize2,
  Minimize2,
  Compass,
  RotateCcw,
  AlertTriangle,
  CloudRain,
  Wind,
  Flame,
  Activity,
  Zap,
  Waves,
  CheckCircle2,
  Clock,
  Info,
  X,
  ChevronRight,
  ChevronLeft,
  Calendar,
  ShieldCheck,
  Eye,
  BarChart3
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { LocationAlert, SeverityLevel, Area } from '../../types';
import { evaluateAreaHazards, getAreaOverallRisk, EvaluatedHazard, getWeatherData } from '../../services/weatherEngine';

interface HazardMapViewProps {
  onOpenEmailModalForAlert?: (alert: LocationAlert) => void;
  onNavigateToHistorical?: (cityId?: string) => void;
}

export const HazardMapView: React.FC<HazardMapViewProps> = ({
  onOpenEmailModalForAlert,
  onNavigateToHistorical
}) => {
  const {
    cities,
    selectedCity,
    selectedArea,
    setCity,
    setArea,
    weather,
    activeAlerts,
    riskAnalysis,
    lastCheckedTime,
    systemTime
  } = useLocation();

  // Map DOM container ref & Leaflet map instance ref
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Map View States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [basemapTheme, setBasemapTheme] = useState<'dark' | 'standard'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeStep, setTimeStep] = useState<'NOW' | '-1h' | '-3h' | '-6h' | '-12h' | '-24h'>('NOW');
  const [activeWeatherOverlay, setActiveWeatherOverlay] = useState<'radar' | 'none'>('radar');

  // Selected Area & Explained Hazard Dialog state (Requirement 8)
  const [inspectedArea, setInspectedArea] = useState<Area | null>(null);
  const [inspectedHazards, setInspectedHazards] = useState<EvaluatedHazard[]>([]);
  const [selectedHazardToExplain, setSelectedHazardToExplain] = useState<EvaluatedHazard | null>(null);

  // Filtered areas for map search
  const searchedAreas = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: Array<{ cityId: string; cityName: string; area: Area }> = [];
    cities.forEach(c => {
      c.areas.forEach(a => {
        if (a.name.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)) {
          results.push({ cityId: c.id, cityName: c.name, area: a });
        }
      });
    });
    return results.slice(0, 6);
  }, [cities, searchQuery]);

  // Color helper for 4-tier risk levels (Requirement 7)
  const getRiskColor = (level: SeverityLevel) => {
    switch (level) {
      case 'Severe':
        return '#881337'; // Maroon
      case 'High':
        return '#dc2626'; // Red
      case 'Moderate':
        return '#d97706'; // Orange
      case 'Low':
      default:
        return '#16a34a'; // Green
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedArea.latitude, selectedArea.longitude],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      const tileUrl = (import.meta as any).env?.VITE_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abc',
        className: 'dark-weather-basemap',
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      const group = L.layerGroup().addTo(map);
      layerGroupRef.current = group;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, []);

  // Sync Basemap Theme (Dark Ops vs Standard Street)
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const container = tileLayerRef.current.getContainer();
    if (container) {
      if (basemapTheme === 'dark') {
        container.classList.add('dark-weather-basemap');
      } else {
        container.classList.remove('dark-weather-basemap');
      }
    }
  }, [basemapTheme]);

  // Pan to selected area when area or city changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedArea.latitude, selectedArea.longitude], 12.5, {
        duration: 0.8
      });
    }
  }, [selectedCity.id, selectedArea.id]);

  // Requirements 6, 7 & 8: Automatic Hazard Detection & Automatic 4-tier Risk Markers
  useEffect(() => {
    const group = layerGroupRef.current;
    if (!group) return;

    group.clearLayers();

    // 1. Optional Doppler Radar Echo Circle around selected area
    if (activeWeatherOverlay === 'radar') {
      const radarColor = weather.rainfall >= 60 ? '#881337' : weather.rainfall >= 40 ? '#dc2626' : weather.rainfall >= 20 ? '#d97706' : '#16a34a';
      const radarZone = L.circle([selectedArea.latitude, selectedArea.longitude], {
        radius: 3500,
        color: radarColor,
        weight: 1.5,
        fillColor: radarColor,
        fillOpacity: 0.22
      });
      radarZone.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px;">
          <strong style="color: #fff;">Doppler Radar Core (${selectedArea.name})</strong><br/>
          <span>24h Rainfall: ${weather.rainfall} mm (Threshold: 50 mm)</span>
        </div>`,
        { className: 'leaflet-dark-tooltip' }
      );
      group.addLayer(radarZone);
    }

    // 2. Automatically evaluate hazards for EVERY area in the selected city (Requirement 6 & 7)
    selectedCity.areas.forEach(a => {
      const isSelected = a.id === selectedArea.id;
      // Get area-specific weather & evaluate hazards
      const areaWeather = a.id === selectedArea.id ? weather : getWeatherData(selectedCity, a);
      const hazards = evaluateAreaHazards(selectedCity, a, areaWeather);
      const risk = getAreaOverallRisk(selectedCity, a, areaWeather);
      const markerColor = risk.color;

      // Draw hazard buffer circle if Moderate, High, or Severe
      if (risk.level !== 'Low') {
        const hazardCircle = L.circle([a.latitude, a.longitude], {
          radius: risk.level === 'Severe' ? 2400 : risk.level === 'High' ? 1800 : 1200,
          color: markerColor,
          weight: 1.5,
          fillColor: markerColor,
          fillOpacity: 0.2
        });

        hazardCircle.on('click', () => {
          setArea(a.id);
          setInspectedArea(a);
          setInspectedHazards(hazards);
          setSelectedHazardToExplain(hazards[0]);
        });

        group.addLayer(hazardCircle);
      }

      // Circular Map Marker with the calculated 4-tier risk colour (Requirement 7)
      // LOW = Green (#16a34a), MODERATE = Orange (#d97706), HIGH = Red (#dc2626), SEVERE = Maroon (#881337)
      const markerSize = isSelected ? 34 : 26;
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${markerSize}px;
            height: ${markerSize}px;
            border-radius: 9999px;
            background: ${markerColor};
            border: 2px solid ${isSelected ? '#ffffff' : '#ffffffcc'};
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6);
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            ${isSelected ? '<div style="position: absolute; inset: -4px; border-radius: 9999px; border: 2px solid #ffffff; opacity: 0.8; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : ''}
            <span>${risk.level === 'Severe' ? '!' : risk.level === 'High' ? '!' : risk.level === 'Moderate' ? '▲' : '✓'}</span>
          </div>
        `,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize / 2]
      });

      const marker = L.marker([a.latitude, a.longitude], { icon: customIcon });

      // Click on marker opens explainable risk panel (Requirement 8)
      marker.on('click', () => {
        setArea(a.id);
        setInspectedArea(a);
        setInspectedHazards(hazards);
        // Find highest hazard to explain
        const highest = hazards.find(h => h.level === risk.level) || hazards[0];
        setSelectedHazardToExplain(highest);
      });

      // Hover Tooltip
      marker.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px; line-height: 1.35; padding: 2px 4px;">
          <strong style="color: #ffffff; display: block; font-size: 12px;">${a.name}</strong>
          <span style="color: #cbd5e1;">${selectedCity.name} • Elevation: ${a.elevationMeters}m</span>
          <div style="display: flex; align-items: center; gap: 4px; margin-top: 4px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background: ${markerColor};"></span>
            <strong style="color: ${markerColor}; text-transform: uppercase;">${risk.level} Risk</strong>
            <span style="color: #94a3b8;">(${risk.primaryHazard})</span>
          </div>
          <span style="color: #94a3b8; font-size: 10px; display: block; margin-top: 2px;">Click to inspect explainable risk data</span>
        </div>`,
        { direction: 'top', offset: [0, -14], className: 'leaflet-custom-tooltip' }
      );

      group.addLayer(marker);
    });
  }, [
    selectedCity,
    selectedArea,
    weather,
    activeWeatherOverlay,
    basemapTheme
  ]);

  // Center / Reset View Handler
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedArea.latitude, selectedArea.longitude], 12.5);
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleLocateMe = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          mapInstanceRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 13);
        },
        () => {
          handleResetView();
        }
      );
    } else {
      handleResetView();
    }
  };

  // Evaluate current area hazards for side panel
  const currentAreaHazards = useMemo(() => {
    return evaluateAreaHazards(selectedCity, selectedArea, weather);
  }, [selectedCity, selectedArea, weather]);

  return (
    <div className={`space-y-4 animate-in fade-in duration-200 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 flex flex-col' : ''}`}>
      {/* 1. MAP HEADER (Requirements 1, 2, 6, 7) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800/60">
              AUTOMATIC HAZARD DETECTION ENGINE
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">{selectedCity.name}</strong>
              <span className="text-slate-400">→</span>
              <strong className="text-cyan-600 dark:text-cyan-300">{selectedArea.name}</strong>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              IMD & NDMA Calibrated Grid
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>
              Coordinates: <strong className="text-slate-700 dark:text-slate-200">{selectedArea.latitude.toFixed(4)}° N, {selectedArea.longitude.toFixed(4)}° E</strong>
            </span>
            <span>•</span>
            <span>
              Risk Level: <strong className="uppercase" style={{ color: getRiskColor(riskAnalysis.overallLevel) }}>{riskAnalysis.overallLevel} ({riskAnalysis.overallScore}/100)</strong>
            </span>
            <span>•</span>
            <span>
              Active Alerts: <strong className={activeAlerts.length > 0 ? 'text-red-500 dark:text-rose-400' : 'text-emerald-500 dark:text-emerald-400'}>{activeAlerts.length}</strong>
            </span>
            <span>•</span>
            <span>Observed: {weather.observationTimestamp}</span>
          </div>
        </div>

        {/* Map Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search locality (e.g. Hinjewadi, Andheri)..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
          />

          {searchedAreas.length > 0 && (
            <div className="absolute right-0 top-full mt-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-1 z-50">
              {searchedAreas.map(({ cityId, cityName, area }) => (
                <button
                  key={`${cityId}-${area.id}`}
                  onClick={() => {
                    setCity(cityId);
                    setArea(area.id);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between"
                >
                  <span className="font-semibold text-cyan-600 dark:text-cyan-300">{area.name}</span>
                  <span className="text-[10px] text-slate-400">{cityName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN MAP CONTAINER */}
      <div className={`relative rounded-2xl bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col ${isFullscreen ? 'flex-1' : 'min-h-[580px] h-[640px]'}`}>
        {/* Leaflet Map Target Element */}
        <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-slate-950" />

        {/* Floating Top Left: Map Controls */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          <div className="p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl flex flex-col gap-1 text-slate-300">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center font-bold text-base hover:text-white"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center font-bold text-base hover:text-white"
              title="Zoom Out"
            >
              −
            </button>
            <div className="h-px bg-slate-800 my-0.5" />
            <button
              onClick={handleLocateMe}
              className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center hover:text-cyan-400"
              title="Locate Me"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center hover:text-cyan-400"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center hover:text-cyan-400"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Floating Top Right: Map Display Modes & Basemap Toggle */}
        <div className="absolute top-4 right-4 z-10 flex items-start gap-2">
          <div className="p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveWeatherOverlay(activeWeatherOverlay === 'radar' ? 'none' : 'radar')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeWeatherOverlay === 'radar'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Doppler Radar</span>
            </button>

            <button
              onClick={() => setBasemapTheme(basemapTheme === 'dark' ? 'standard' : 'dark')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                basemapTheme === 'dark'
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                  : 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              }`}
              title="Toggle Dark Weather Basemap / Standard Street Map"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{basemapTheme === 'dark' ? 'Dark Ops' : 'Street Map'}</span>
            </button>
          </div>

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl text-slate-300 hover:text-white"
            title="Toggle Hazard Breakdown Panel"
          >
            {isSidePanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Floating Bottom Left: Clear 4-tier Hazard Risk Colour Legend (Requirement 7) */}
        <div className="absolute bottom-16 left-4 z-10 p-3 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl text-xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="font-bold uppercase tracking-wider text-slate-300 text-[10px]">
              Risk Level Legend
            </span>
            <span className="text-[9px] font-mono text-cyan-400">Automatic</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#16a34a] border border-white/20 shrink-0"></span>
              <span className="text-emerald-300 font-bold">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#d97706] border border-white/20 shrink-0"></span>
              <span className="text-amber-300 font-bold">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#dc2626] border border-white/20 shrink-0"></span>
              <span className="text-red-400 font-bold">High</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#881337] border border-white/20 shrink-0"></span>
              <span className="text-[#fda4af] font-bold">Severe</span>
            </div>
          </div>
        </div>

        {/* Floating Right: Automatic Evaluated Hazard Panel for Selected Area (Requirement 6 & 8) */}
        {isSidePanelOpen && (
          <div className="absolute top-16 right-4 z-10 w-80 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl text-xs space-y-3 animate-in fade-in slide-in-from-right-3 max-h-[520px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  AUTOMATIC HAZARD EVALUATION
                </span>
                <h4 className="text-sm font-black text-white">{selectedArea.name}</h4>
                <p className="text-[10px] text-cyan-400">{selectedCity.name} ({selectedArea.elevationMeters}m elevation)</p>
              </div>
              <button
                onClick={() => setIsSidePanelOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Overall Area Status */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Composite Risk:</span>
              <span
                className="px-2 py-0.5 rounded font-extrabold uppercase text-[10px] font-mono border"
                style={{
                  backgroundColor: `${getRiskColor(riskAnalysis.overallLevel)}33`,
                  borderColor: getRiskColor(riskAnalysis.overallLevel),
                  color: riskAnalysis.overallLevel === 'Severe' ? '#fda4af' : getRiskColor(riskAnalysis.overallLevel)
                }}
              >
                {riskAnalysis.overallLevel} Risk
              </span>
            </div>

            {/* List of Automatically Evaluated Hazards with Click-to-Explain (Requirement 8) */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Detected Hazard Factors
              </span>

              {currentAreaHazards.map((h, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedHazardToExplain(h)}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[11px] group-hover:text-cyan-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: h.color }}></span>
                      {h.hazard}
                    </span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase"
                      style={{
                        backgroundColor: `${h.color}33`,
                        color: h.level === 'Severe' ? '#fda4af' : h.color
                      }}
                    >
                      {h.level}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{h.metricLabel}: <strong className="text-white">{h.metricValue}</strong></span>
                    <span>Threshold: {h.threshold}</span>
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-1 group-hover:text-slate-200">
                    {h.explanation}
                  </p>
                </div>
              ))}
            </div>

            {onNavigateToHistorical && (
              <button
                onClick={() => onNavigateToHistorical(selectedCity.id)}
                className="w-full py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>View Historical Analysis for {selectedCity.name}</span>
              </button>
            )}

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>Source: IMD AWS Network</span>
              <span className="text-cyan-400">Click card to explain</span>
            </div>
          </div>
        )}

        {/* Floating Bottom Center: Timeline Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 p-1.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl flex items-center gap-1 text-[11px] font-mono">
          <span className="px-2 text-slate-400 font-sans font-bold text-[10px] uppercase">Timeline:</span>
          {(['NOW', '-1h', '-3h', '-6h', '-12h', '-24h'] as const).map(step => (
            <button
              key={step}
              onClick={() => setTimeStep(step)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                timeStep === step
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {step}
            </button>
          ))}
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 ml-1">
            {timeStep === 'NOW' ? 'LIVE RADAR' : 'OBSERVED'}
          </span>
        </div>
      </div>

      {/* 3. EXPLAINABLE HAZARD MODAL / DIALOG (Requirement 8) */}
      {selectedHazardToExplain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <button
              onClick={() => setSelectedHazardToExplain(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Risk Level Badge */}
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-extrabold uppercase border"
                style={{
                  backgroundColor: `${selectedHazardToExplain.color}33`,
                  borderColor: selectedHazardToExplain.color,
                  color: selectedHazardToExplain.level === 'Severe' ? '#fda4af' : selectedHazardToExplain.color
                }}
              >
                {selectedHazardToExplain.hazard.toUpperCase()} — {selectedHazardToExplain.level.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400 font-mono">Calibrated Hazard Trigger</span>
            </div>

            <h3 className="text-lg font-black text-white">
              {selectedHazardToExplain.hazard} Assessment for {inspectedArea ? inspectedArea.name : selectedArea.name}
            </h3>

            {/* Exact Values & Data Transparency (Requirement 8 example) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{selectedHazardToExplain.metricLabel}:</span>
                <strong className="text-white text-sm">{selectedHazardToExplain.metricValue}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Threshold:</span>
                <strong className="text-amber-400">{selectedHazardToExplain.threshold}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Susceptibility:</span>
                <strong className="text-cyan-300">{selectedHazardToExplain.susceptibility}</strong>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                <span className="text-slate-400">Observed:</span>
                <span className="text-slate-200">{selectedHazardToExplain.observedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Source:</span>
                <span className="text-slate-300">{selectedHazardToExplain.source}</span>
              </div>
            </div>

            {/* Plain explanation */}
            <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed font-sans">
              <p>{selectedHazardToExplain.explanation}</p>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-[11px] mt-2">
                <strong className="text-amber-300">Action Advisory: </strong>
                {selectedHazardToExplain.mitigation}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedHazardToExplain(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold transition-colors"
              >
                Close Explanation
              </button>
              {onNavigateToHistorical && (
                <button
                  onClick={() => {
                    const cityToLoad = selectedCity.id;
                    setSelectedHazardToExplain(null);
                    onNavigateToHistorical(cityToLoad);
                  }}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs text-slate-950 font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>View Historical Analysis for {selectedCity.name}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. MAP DATA STATUS BAR & ATTRIBUTION */}
      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Ground AWS Telemetry: Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Automatic Risk Classifier: Calibrated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            <span>Last Synced: {lastCheckedTime}</span>
          </div>
        </div>

        <div>
          <span>Map Provider: OpenStreetMap Standard Tiles • WGS84 Geographic</span>
        </div>
      </div>
    </div>
  );
};
