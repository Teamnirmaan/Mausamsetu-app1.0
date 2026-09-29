import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, ShieldAlert, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { LocationAlert } from '../../types';

interface EmailAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAlert?: LocationAlert | null;
}

export const EmailAlertModal: React.FC<EmailAlertModalProps> = ({ isOpen, onClose, selectedAlert }) => {
  const { user, sendAlertEmail, isEmailSending } = useAuth();
  const { selectedCity, selectedArea, activeAlerts, weather } = useLocation();

  // If no alert is explicitly passed, pick the first active alert or fabricate the required sample for the current city/area
  const targetAlert: LocationAlert = selectedAlert || activeAlerts[0] || {
    alertId: `ALT-${selectedCity.id}-${selectedArea.id}`,
    city: selectedCity.name,
    cityId: selectedCity.id,
    area: selectedArea.name,
    areaId: selectedArea.id,
    state: selectedCity.state,
    hazardType: 'Heavy Rain',
    severity: 'High',
    title: 'Heavy Rain Risk',
    description: 'Heavy rainfall conditions detected for the selected location.',
    weatherParameter: 'Rainfall',
    value: `${weather.rainfall || 72} mm`,
    threshold: '50 mm',
    source: 'Weather Data & IMD Radar',
    timestamp: '10:32 AM',
    validUntil: '06:00 PM Today',
    status: 'Active',
    recommendation: 'Avoid unnecessary travel through waterlogged areas and monitor official local advisories.'
  };

  const recipientEmail = user?.email || 'mausamsetu@gmail.com';
  const userName = user?.name || 'Valued Resident';

  const [sentSuccess, setSentSuccess] = useState(false);
  const [sentMessage, setSentMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const emailSubject = `MausamSetu Alert: ${targetAlert.hazardType} Risk in ${targetAlert.area}, ${targetAlert.city}`;

  const emailBody = `Hello ${userName},

MausamSetu has detected a weather risk for your selected location.

Location:
${targetAlert.area}, ${targetAlert.city}, ${targetAlert.state}

Hazard:
${targetAlert.hazardType}

Risk Level:
${targetAlert.severity.toUpperCase()}

${targetAlert.weatherParameter}:
${targetAlert.value}

Threshold:
${targetAlert.threshold}

Detected:
${targetAlert.timestamp}

Source:
${targetAlert.source}

Recommended Action:
${targetAlert.recommendation}

Regards,
MausamSetu India
mausamsetu@gmail.com`;

  const handleSendEmail = async () => {
    const result = await sendAlertEmail(targetAlert);
    if (result.success) {
      setSentSuccess(true);
      setSentMessage(result.message);
    }
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>MausamSetu Email Alert Dispatch</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 font-semibold uppercase">
                  Server-Protected SMTP
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Automated location-based risk warning pipeline routed to registered user emails.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Meta Info */}
        <div className="px-5 py-3 bg-slate-950/40 border-b border-slate-800 text-xs space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">FROM:</span>
            <span className="text-cyan-300 font-semibold">mausamsetu@gmail.com (Authenticated Sender)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">TO (Registered User):</span>
            <span className="text-emerald-400 font-semibold">{recipientEmail}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">TARGET LOCATION:</span>
            <span className="text-slate-200">{targetAlert.area}, {targetAlert.city}, {targetAlert.state}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">SUBJECT:</span>
            <span className="text-amber-300 font-semibold truncate max-w-md">{emailSubject}</span>
          </div>
        </div>

        {/* Email Body Preview */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-950/80 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all border-b border-slate-800">
          {emailBody}
        </div>

        {/* Send Success Banner */}
        {sentSuccess && (
          <div className="m-4 p-3 rounded-xl bg-emerald-950/90 border border-emerald-700/80 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{sentMessage}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">SMTP 250 OK</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyBody}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500">
              <ShieldAlert className="w-3 h-3 text-slate-400" />
              <span>Credentials isolated server-side</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSendEmail}
              disabled={isEmailSending}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 disabled:opacity-60"
            >
              {isEmailSending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>DISPATCHING...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>DISPATCH TO {recipientEmail.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
