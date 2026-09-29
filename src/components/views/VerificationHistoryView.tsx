import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Eye,
  X,
  FileText,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { VerificationRecord, VerificationStatus } from '../../types';

export const VerificationHistoryView: React.FC = () => {
  const { verificationHistory } = useAuth();
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'SUPPORTED':
        return 'bg-emerald-950/80 border-emerald-700 text-emerald-300';
      case 'PARTIALLY SUPPORTED':
        return 'bg-amber-950/80 border-amber-700 text-amber-300';
      case 'NOT VERIFIED':
        return 'bg-rose-950/80 border-rose-700 text-rose-300';
      case 'OUTDATED':
        return 'bg-purple-950/80 border-purple-700 text-purple-300';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
              Audit Trail Archive
            </span>
            <span className="text-xs text-slate-400">Authenticated Citizen Log</span>
          </div>
          <h1 className="text-2xl font-black text-white">VERIFICATION HISTORY</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Previous claims, forwarded messages, and OCR screenshots cross-examined against MausamSetu telemetry.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400">
          Total Audited: {verificationHistory.length}
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/90 text-slate-400 font-mono">
              <th className="p-4 font-semibold uppercase text-[11px]">Date & Time</th>
              <th className="p-4 font-semibold uppercase text-[11px]">Original Claim / Message</th>
              <th className="p-4 font-semibold uppercase text-[11px]">Location</th>
              <th className="p-4 font-semibold uppercase text-[11px]">Status Result</th>
              <th className="p-4 font-semibold uppercase text-[11px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {verificationHistory.map(record => (
              <tr key={record.id} className="hover:bg-slate-950/40 transition-colors">
                <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                  {record.timestamp}
                </td>

                <td className="p-4 max-w-md">
                  <p className="text-slate-200 line-clamp-2 font-medium">"{record.originalInput}"</p>
                  <span className="text-[10px] text-cyan-400 block mt-0.5">
                    Hazard: {record.extractedClaim.hazard}
                  </span>
                </td>

                <td className="p-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{record.extractedLocation.area ? `${record.extractedLocation.area}, ` : ''}{record.extractedLocation.city}</span>
                  </div>
                </td>

                <td className="p-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(record.resultStatus)}`}>
                    {record.resultStatus}
                  </span>
                </td>

                <td className="p-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => alert(`Verification certificate for "${record.id}" copied to clipboard.`)}
                      className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="Share report"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs px-2 py-0.5 rounded font-bold uppercase bg-slate-950 border border-slate-800 text-cyan-400">
              Audit Ref: {selectedRecord.id}
            </span>

            <h3 className="text-lg font-bold text-white mt-2 mb-1">Verification Details</h3>
            <p className="text-xs text-slate-400 mb-4">{selectedRecord.timestamp}</p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 mb-4">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Original Analyzed Input</span>
              <p className="text-slate-200 font-mono italic">"{selectedRecord.originalInput}"</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 mb-4 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-white font-bold">{selectedRecord.extractedLocation.area}, {selectedRecord.extractedLocation.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Official Value:</span>
                <span className="text-emerald-400 font-bold">{selectedRecord.officialComparison.officialValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Result Verdict:</span>
                <span className="text-amber-400 font-bold">{selectedRecord.resultStatus}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs mb-4">
              <strong className="text-slate-300 block mb-1">Explanation:</strong>
              <p className="text-slate-300 leading-relaxed">{selectedRecord.explanation}</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
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
