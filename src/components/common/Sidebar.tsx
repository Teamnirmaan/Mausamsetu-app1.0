import React from 'react';
import {
  LayoutDashboard,
  CloudRain,
  MapPin,
  CalendarDays,
  CheckCheck,
  Activity,
  AlertTriangle,
  History,
  GitCompare,
  BarChart3,
  Share2,
  Clock,
  User,
  BellRing,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Compass,
  Radio,
  Users
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'key' | 'count' | 'info';
  category: 'core' | 'intelligence' | 'social' | 'alerts' | 'account' | 'information';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile,
  onCloseMobile
}) => {
  const { activeAlerts, selectedCity, selectedArea } = useLocation();
  const { user } = useAuth();

  const navItems: NavItem[] = [
    // CORE MODULES
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'core' },
    { id: 'live-weather', label: 'Live Weather', icon: CloudRain, category: 'core' },
    { id: 'hazard-map', label: 'Hazard Map', icon: MapPin, category: 'core' },
    { id: 'forecast', label: 'Forecast', icon: CalendarDays, category: 'core' },

    // INTELLIGENCE & VERIFICATION
    {
      id: 'verify-report',
      label: 'Verify Report',
      icon: CheckCheck,
      badge: 'KEY FEATURE',
      badgeType: 'key',
      category: 'intelligence'
    },
    { id: 'risk-analysis', label: 'Risk Analysis', icon: Activity, category: 'intelligence' },
    { id: 'source-comparison', label: 'Source Comparison', icon: GitCompare, category: 'intelligence' },
    { id: 'historical-analysis', label: 'Historical Analysis', icon: BarChart3, category: 'intelligence' },

    // SOCIAL INTELLIGENCE
    { id: 'social-feed', label: 'Social & Media Feed', icon: Share2, category: 'social' },
    { id: 'social-signals', label: 'Social Weather Signals', icon: Radio, category: 'social' },
    { id: 'verification-history', label: 'Verification History', icon: Clock, category: 'social' },

    // ALERTS
    {
      id: 'alerts',
      label: 'Alerts',
      icon: AlertTriangle,
      badge: activeAlerts.length > 0 ? String(activeAlerts.length) : undefined,
      badgeType: 'count',
      category: 'alerts'
    },

    // ACCOUNT
    { id: 'profile', label: 'Profile', icon: User, category: 'account' },
    { id: 'preferences', label: 'Alert Preferences', icon: BellRing, category: 'account' },
    { id: 'settings', label: 'Settings', icon: Sliders, category: 'account' },

    // INFORMATION
    { id: 'development-team', label: 'Development Team', icon: Users, category: 'information' }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  const renderSection = (category: NavItem['category'], title: string) => {
    const items = navItems.filter(i => i.category === category);
    return (
      <div className="pt-2">
        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {title}
        </div>
        <div className="space-y-0.5">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'historical-analysis' && currentView === 'historical-data');
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-slate-800 text-slate-100 border border-slate-700/90 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-1">
                  {item.badge && item.badgeType === 'key' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-black tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 uppercase shadow-sm">
                      {item.badge}
                    </span>
                  )}
                  {item.badge && item.badgeType === 'count' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-rose-600 text-white">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-950/95 border-r border-slate-200 dark:border-slate-800/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black text-xl tracking-tighter">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">MausamSetu</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-400">
                  INDIA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Weather & Verification Grid</p>
            </div>
          </div>

          {/* Current Focus Pill */}
          <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shrink-0"></span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{selectedCity.name} / {selectedArea.name}</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {renderSection('core', 'CORE MODULES')}
          {renderSection('intelligence', 'INTELLIGENCE & VERIFICATION')}
          {renderSection('social', 'SOCIAL INTELLIGENCE')}
          {renderSection('alerts', 'ALERTS')}
          {renderSection('account', 'ACCOUNT')}
          {renderSection('information', 'INFORMATION')}
        </div>

        {/* Footer profile snippet */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div className="text-[11px]">
                <p className="text-slate-700 dark:text-slate-300 font-semibold">{user ? user.name : 'Citizen Portal'}</p>
                <p className="text-slate-400 font-mono text-[10px]">IMD & NDMA Grid</p>
              </div>
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-3 rounded-sm bg-orange-500" title="India"></div>
              <div className="w-1.5 h-3 rounded-sm bg-slate-300 dark:bg-white" title="India"></div>
              <div className="w-1.5 h-3 rounded-sm bg-emerald-600" title="India"></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
