import React, { useState } from 'react';
import {
  LayoutDashboard,
  CheckCheck,
  AlertTriangle,
  User,
  MoreHorizontal,
  CloudRain,
  CalendarDays,
  MapPin,
  Activity,
  History,
  Sliders,
  X
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

interface MobileNavProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate }) => {
  const { activeAlerts } = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'verify-report', label: 'Verify', icon: CheckCheck, isKey: true },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: activeAlerts.length > 0 ? activeAlerts.length : undefined },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const moreItems = [
    { id: 'live-weather', label: 'Weather', icon: CloudRain },
    { id: 'forecast', label: 'Forecast', icon: CalendarDays },
    { id: 'hazard-map', label: 'Map', icon: MapPin },
    { id: 'risk-analysis', label: 'Risk', icon: Activity },
    { id: 'historical-analysis', label: 'Historical', icon: History },
    { id: 'development-team', label: 'Team', icon: Sliders },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <>
      {/* "More" Sheet Overlay */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex flex-col justify-end p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3 shadow-2xl animate-in fade-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">More Modules</span>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMoreOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isActive
                        ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1.5 text-cyan-400" />
                    <span className="text-[11px] font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 lg:hidden flex items-center justify-around shadow-2xl">
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`relative flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2.5 flex h-3.5 min-w-3.5 px-1 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white">
                    {tab.badge}
                  </span>
                )}
                {tab.isKey && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
            moreItems.some(i => i.id === currentView) ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
};
