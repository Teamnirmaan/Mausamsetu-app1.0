import React, { useState } from 'react';
import {
  Radio,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Mail,
  CheckCheck,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { getSocialWeatherSummary, getSocialReports } from '../../data/socialReportsData';
import { VerificationStatus, SocialReport } from '../../types';

interface SocialWeatherSignalsViewProps {
  onNavigate: (viewId: string) => void;
  onVerifyClaim: (claim: any) => void;
}

export const SocialWeatherSignalsView: React.FC<SocialWeatherSignalsViewProps> = ({
  onNavigate,
  onVerifyClaim
}) => {
  const { selectedCity, selectedArea, weather } = useLocation();
  const { user } = useAuth();

  const [socialEmailSent, setSocialEmailSent] = useState(false);

  const summary = getSocialWeatherSummary(selectedCity.id);
  const cityReports = getSocialReports({ cityId: selectedCity.id, areaId: selectedArea.id });

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'SUPPORTED':
        return 'bg-emerald-950/80 border-emerald-700 text-emerald-300';
      case 'PARTIALLY SUPPORTED':
        return 'bg-amber-950/80 border-amber-700 text-amber-300';
      case 'NOT VERIFIED':
        return 'bg-slate-800 border-slate-700 text-slate-300';
      case 'OUTDATED':
        return 'bg-purple-950/80 border-purple-700 text-purple-300';
      default:
        return 'bg-rose-950/80 border-rose-700 text-rose-300';
    }
  };

  const handleSendUnverifiedSocialEmail = () => {
    setSocialEmailSent(true);
    setTimeout(() => setSocialEmailSent(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
              COMMUNITY RADAR SIGNALS
            </span>
            <span className="text-xs text-slate-400">
              Location: <strong className="text-white">{selectedArea.name}</strong>, {selectedCity.name}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">SOCIAL WEATHER SIGNALS & ACTIVITY</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Aggregated intelligence stream detecting emerging weather claims across public social platforms.
          </p>
        </div>

        <button
          onClick={() => onNavigate('social-feed')}
          className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
        >
          <span>VIEW FULL SOCIAL FEED</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Activity Counters Card (Requirement 68) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              SOCIAL WEATHER ACTIVITY TODAY
            </h3>
            <p className="text-xs text-slate-400">
              Volume and status distribution of detected weather reports for {selectedCity.name}
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-950 text-cyan-300 border border-slate-800 font-bold">
            Total: {summary.totalReports} Reports
          </span>
        </div>

        {/* Platform Breakdown Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">X / TWITTER</span>
            <strong className="text-xl text-white font-bold">{summary.byPlatform.xTwitter} reports</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">FACEBOOK</span>
            <strong className="text-xl text-white font-bold">{summary.byPlatform.facebook} reports</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">INSTAGRAM</span>
            <strong className="text-xl text-white font-bold">{summary.byPlatform.instagram} reports</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">YOUTUBE</span>
            <strong className="text-xl text-white font-bold">{summary.byPlatform.youtube} reports</strong>
          </div>
        </div>

        {/* Verification Status Distribution Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-[11px] font-mono pt-2">
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300">
            <span className="block text-[10px] text-slate-400">SUPPORTED</span>
            <strong className="text-base font-bold">{summary.byStatus.supported}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-300">
            <span className="block text-[10px] text-slate-400">PARTIALLY SUPPORTED</span>
            <strong className="text-base font-bold">{summary.byStatus.partiallySupported}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300">
            <span className="block text-[10px] text-slate-400">NOT VERIFIED</span>
            <strong className="text-base font-bold">{summary.byStatus.notVerified}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-800/50 text-purple-300">
            <span className="block text-[10px] text-slate-400">OUTDATED</span>
            <strong className="text-base font-bold">{summary.byStatus.outdated}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300">
            <span className="block text-[10px] text-slate-400">UNABLE TO CONFIRM</span>
            <strong className="text-base font-bold">{summary.byStatus.unableToConfirm}</strong>
          </div>
        </div>
      </div>

      {/* Social Media Timeline (Requirement 69) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              SOCIAL MEDIA WEATHER TIMELINE
            </h3>
            <p className="text-xs text-slate-400">Chronological stream of incoming reports for {selectedCity.name}</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Live Ingestion</span>
        </div>

        <div className="space-y-3">
          {summary.recentTimeline.map(item => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-cyan-400 font-bold text-[11px] min-w-[70px]">{item.time}</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                  {item.platform}
                </span>
                <div>
                  <span className="font-bold text-white">{item.area}, {item.city}</span>
                  <span className="text-slate-400 ml-2">Hazard: {item.hazard}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
                <button
                  onClick={() => onNavigate('social-feed')}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-cyan-300 font-semibold"
                >
                  Inspect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unverified Social Weather Email Alert Section (Requirement 67) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Citizen Alert: Unverified Social Weather Dispatch
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-mono font-bold">
            UNVERIFIED SOCIAL REPORT
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          When unconfirmed reports of sudden localized deluge or cloudbursts circulate online for <strong className="text-cyan-300">{selectedArea.name}, {selectedCity.name}</strong>, MausamSetu can notify subscribed residents with strict unverified labeling so citizens do not panic.
        </p>

        {socialEmailSent && (
          <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sample unverified social report notification dispatched to {user?.email || 'mausamsetu@gmail.com'}.</span>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            onClick={handleSendUnverifiedSocialEmail}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>Trigger Test Unverified Social Report Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};
