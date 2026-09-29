import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  ChevronDown,
  Bell,
  RefreshCw,
  User,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Sparkles,
  LogOut,
  Mail,
  ChevronRight
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
  onOpenEmailModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView: _currentView, onNavigate, onOpenEmailModal }) => {
  const {
    cities,
    selectedCity,
    selectedArea,
    setCity,
    setArea,
    weather,
    activeAlerts,
    isRefreshing,
    refreshLocationData,
    lastCheckedTime,
    systemTime
  } = useLocation();

  const { user, openLoginModal, openSignupModal, logout } = useAuth();

  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const areaDropdownRef = useRef<HTMLDivElement>(null);
  const bellDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setIsCityOpen(false);
      }
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(e.target as Node)) {
        setIsAreaOpen(false);
      }
      if (bellDropdownRef.current && !bellDropdownRef.current.contains(e.target as Node)) {
        setIsBellOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 lg:px-6 py-3 transition-colors">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Top left: Location Selector (City + cascading Area) (Requirement 1) */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Location Pin & Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-950/50 border border-cyan-300 dark:border-cyan-800/50 text-cyan-700 dark:text-cyan-400 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">LOCATION:</span>
          </div>

          {/* First Dropdown: SELECT CITY */}
          <div className="relative" ref={cityDropdownRef}>
            <button
              onClick={() => {
                setIsCityOpen(!isCityOpen);
                setIsAreaOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 hover:border-cyan-500 text-slate-800 dark:text-slate-100 text-sm font-semibold transition-all shadow-sm focus:outline-none"
              aria-label="Select City"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">City:</span>
              <span className="text-slate-900 dark:text-slate-100">{selectedCity.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCityOpen && (
              <div className="absolute left-0 mt-1.5 w-64 max-h-80 overflow-y-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  14 Major Indian Meteorological Stations
                </div>
                {cities.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCity(c.id);
                      setIsCityOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                      c.id === selectedCity.id
                        ? 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 font-semibold border border-cyan-300 dark:border-cyan-800/60'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{c.state}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-slate-400 text-sm hidden sm:inline font-bold">→</span>

          {/* Second Dropdown: SELECT AREA (Cascades based on selected city) */}
          <div className="relative" ref={areaDropdownRef}>
            <button
              onClick={() => {
                setIsAreaOpen(!isAreaOpen);
                setIsCityOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 hover:border-cyan-500 text-slate-800 dark:text-slate-100 text-sm font-semibold transition-all shadow-sm focus:outline-none"
              aria-label="Select Area"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Area:</span>
              <span className="text-cyan-700 dark:text-cyan-300 font-bold">{selectedArea.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform ${isAreaOpen ? 'rotate-180' : ''}`} />
            </button>

            {isAreaOpen && (
              <div className="absolute left-0 mt-1.5 w-64 max-h-80 overflow-y-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  {selectedCity.name} Localities ({selectedCity.areas.length})
                </div>
                {selectedCity.areas.map(a => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setArea(a.id);
                      setIsAreaOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                      a.id === selectedArea.id
                        ? 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 font-semibold border border-cyan-300 dark:border-cyan-800/60'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <span>{a.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {a.floodVulnerability === 'High' ? 'Flood Risk' : `${a.elevationMeters}m`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Operational Verification Grid Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            IMD & NDMA VERIFIED GRID
          </div>
        </div>

        {/* Top Right: Status, Refresh, Notifications, Auth */}
        <div className="flex items-center justify-end gap-2.5 w-full md:w-auto">

          {/* Refresh & Last Checked */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={refreshLocationData}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors disabled:opacity-50 shadow-sm"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-500' : ''}`} />
            </button>
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{lastCheckedTime}</span>
            </div>
          </div>

          {/* Notification Center (Location-specific) */}
          <div className="relative" ref={bellDropdownRef}>
            <button
              onClick={() => setIsBellOpen(!isBellOpen)}
              className="relative p-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-lg animate-pulse">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {isBellOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Notifications for {selectedCity.name} / {selectedArea.name}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    {activeAlerts.length} Active
                  </span>
                </div>

                {activeAlerts.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">No active alerts for {selectedCity.name} / {selectedArea.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">Weather conditions within normal baseline thresholds.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {activeAlerts.map(alert => (
                      <div
                        key={alert.alertId}
                        onClick={() => {
                          setIsBellOpen(false);
                          onNavigate('alerts');
                        }}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                            {alert.hazardType}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 font-semibold uppercase">
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200 line-clamp-2">{alert.title}: {alert.value} (Limit {alert.threshold})</p>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                          <span>{alert.city} / {alert.area}</span>
                          <span className="text-cyan-600 dark:text-cyan-400 group-hover:underline flex items-center">
                            Details <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setIsBellOpen(false);
                      onNavigate('alerts');
                    }}
                    className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                  >
                    View All Active Alerts →
                  </button>
                  {onOpenEmailModal && (
                    <button
                      onClick={() => {
                        setIsBellOpen(false);
                        onOpenEmailModal();
                      }}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                      Email Dispatch
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Sign Up / Login / Profile */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 transition-colors shadow-sm"
                aria-label="User Menu"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[110px]">{user.name}</p>
                  <p className="text-[10px] text-cyan-600 dark:text-cyan-400 leading-none">{user.cityName}</p>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 mb-2 border border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-cyan-600 dark:text-cyan-400">
                      <MapPin className="w-3 h-3" />
                      <span>Registered: {user.cityName} / {user.areaName}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('profile');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    User Profile & Location
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('preferences');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Email Alert Preferences
                  </button>

                  <div className="my-1 border-t border-slate-200 dark:border-slate-800"></div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={openLoginModal}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-300 dark:hover:border-slate-800 transition-all"
              >
                LOGIN
              </button>
              <button
                onClick={openSignupModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-md shadow-cyan-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                SIGN UP
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
