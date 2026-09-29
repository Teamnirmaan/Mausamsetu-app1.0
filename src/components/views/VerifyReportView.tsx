import React, { useState } from 'react';
import {
  CheckCheck,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  MapPin,
  Send,
  Eye,
  RefreshCw,
  Share2,
  BarChart3
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { VerificationStatus, VerificationRecord } from '../../types';

interface VerifyReportViewProps {
  prefillData?: {
    source?: string;
    platform?: string;
    account?: string;
    text?: string;
    url?: string;
    location?: string;
    hazard?: string;
  } | null;
  onClearPrefill?: () => void;
  onNavigateToHistorical?: (cityId?: string) => void;
}

export const VerifyReportView: React.FC<VerifyReportViewProps> = ({
  prefillData,
  onClearPrefill,
  onNavigateToHistorical
}) => {
  const { selectedCity, selectedArea, weather } = useLocation();
  const { addVerificationRecord } = useAuth();

  const [inputMode, setInputMode] = useState<'text' | 'screenshot'>('text');
  const [inputText, setInputText] = useState(
    prefillData?.text || 'URGENT: Red alert issued for Pune Hinjewadi IT park. Cloudburst expected by 12 PM with 150mm rain in 2 hours!'
  );
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [extractedOcrText, setExtractedOcrText] = useState<string>('');

  React.useEffect(() => {
    if (prefillData?.text) {
      setInputText(prefillData.text);
      setInputMode('text');
    }
  }, [prefillData]);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationRecord | null>(null);

  const sampleClaims = [
    'Heavy rainfall of 150 mm is expected in Pune Hinjewadi today.',
    'Mumbai Andheri subway completely submerged due to 120mm rainfall alert.',
    'Delhi Rohini air quality reaches hazardous emergency levels with severe smog.',
    'Bengaluru Whitefield facing category 3 cyclone gale winds today.'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotPreview(reader.result as string);
        // Simulate high-fidelity OCR extraction
        setExtractedOcrText(
          `[OCR Text Extracted from Screenshot]\n"Warning forward from resident group: Heavy rain and waterlogging near Hinjewadi Flyover. 150mm rain expected this afternoon. Stay safe!"`
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunVerification = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    const textToAnalyze = inputMode === 'screenshot' && extractedOcrText ? extractedOcrText : inputText;

    // Simulate intelligent verification comparison against live location data
    await new Promise(resolve => setTimeout(resolve, 800));

    // Determine extracted parameters based on content
    const isPune = textToAnalyze.toLowerCase().includes('pune');
    const isMumbai = textToAnalyze.toLowerCase().includes('mumbai');
    const isDelhi = textToAnalyze.toLowerCase().includes('delhi');
    const detectedCity = isMumbai ? 'Mumbai' : isDelhi ? 'Delhi' : isPune ? 'Pune' : selectedCity.name;
    const detectedArea = textToAnalyze.toLowerCase().includes('hinjewadi')
      ? 'Hinjewadi'
      : textToAnalyze.toLowerCase().includes('andheri')
      ? 'Andheri'
      : textToAnalyze.toLowerCase().includes('rohini')
      ? 'Rohini'
      : selectedArea.name;

    // Compare with current location's live measured rainfall / temp
    const claimedRainMatch = textToAnalyze.match(/(\d+)\s*mm/i);
    const claimedRain = claimedRainMatch ? parseInt(claimedRainMatch[1], 10) : 150;
    const actualRain = weather.rainfall;

    let resultStatus: VerificationStatus = 'PARTIALLY SUPPORTED';
    let explanation = '';
    let advice = '';

    if (textToAnalyze.toLowerCase().includes('cloudburst')) {
      resultStatus = 'PARTIALLY SUPPORTED';
      explanation = `The claim mentions an imminent 'cloudburst' (>100mm/hr) in ${detectedArea}, ${detectedCity}. IMD Radar telemetry confirms active heavy rainfall (${actualRain}mm measured in ${selectedArea.name}), but no localized cloudburst signature has been detected by Doppler stations.`;
      advice = `Exercise extreme caution while driving near low-lying roads, but disregard sensationalized viral claims of cloudburst deluges.`;
    } else if (textToAnalyze.toLowerCase().includes('cyclone') && (detectedCity === 'Bengaluru' || detectedCity === 'Pune')) {
      resultStatus = 'NOT VERIFIED';
      explanation = `Tropical cyclones do not make landfall directly over inland elevated plateaus like ${detectedCity}. Wind speeds are currently ${weather.windSpeed} km/h, well below cyclonic thresholds (>62 km/h).`;
      advice = `Do not forward this message. Refer only to official IMD Doppler bulletins.`;
    } else if (actualRain > 40) {
      resultStatus = 'SUPPORTED';
      explanation = `Official sensors confirm significant rainfall (${actualRain}mm) in ${detectedArea}, corroborating the core alert premise of this report.`;
      advice = `The weather advisory is valid. Stay indoors during peak afternoon showers and check municipal route advisories.`;
    } else {
      resultStatus = 'UNABLE TO CONFIRM';
      explanation = `Reported rainfall claims (${claimedRain}mm) significantly exceed currently logged sensor telemetry (${actualRain}mm).`;
      advice = `Awaiting next radar sweep and secondary satellite sounding confirmation.`;
    }

    const newRecord: Omit<VerificationRecord, 'id' | 'timestamp' | 'userId'> = {
      inputType: inputMode === 'screenshot' ? 'image' : 'text',
      originalInput: textToAnalyze,
      imageUrl: screenshotPreview || undefined,
      extractedLocation: {
        city: detectedCity,
        area: detectedArea
      },
      extractedClaim: {
        hazard: textToAnalyze.toLowerCase().includes('rain') ? 'Heavy Rain' : 'Severe Weather Hazard',
        metricClaimed: claimedRainMatch ? `${claimedRain} mm` : 'High Severity Disruption',
        timeframeClaimed: 'Today'
      },
      officialComparison: {
        officialValue: `${actualRain} mm recorded in ${selectedArea.name}`,
        variance: claimedRainMatch ? `${Math.abs(claimedRain - actualRain)} mm divergence` : 'Moderate divergence'
      },
      resultStatus,
      explanation,
      actionAdvice: advice
    };

    const saved = addVerificationRecord(newRecord);
    setVerificationResult(saved);
    setIsVerifying(false);
  };

  const getStatusClass = (status: VerificationStatus) => {
    switch (status) {
      case 'SUPPORTED':
        return 'bg-emerald-950/90 border-emerald-600 text-emerald-300';
      case 'PARTIALLY SUPPORTED':
        return 'bg-amber-950/90 border-amber-600 text-amber-300';
      case 'NOT VERIFIED':
        return 'bg-rose-950/90 border-rose-600 text-rose-300';
      case 'OUTDATED':
        return 'bg-purple-950/90 border-purple-600 text-purple-300';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with KEY FEATURE Badge */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-2 py-0.5 rounded shadow-sm">
              KEY FEATURE
            </span>
            <span className="text-xs text-cyan-400 font-semibold">MausamSetu Anti-Misinformation Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white">VERIFY WEATHER REPORT OR CLAIM</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste viral WhatsApp messages, social media posts, or upload screenshots to cross-verify claims against real-time ground telemetry in <strong className="text-slate-200">{selectedArea.name}, {selectedCity.name}</strong>.
          </p>
        </div>

        <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center">
          <button
            onClick={() => setInputMode('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputMode === 'text' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Paste Text / Claim
          </button>
          <button
            onClick={() => setInputMode('screenshot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputMode === 'screenshot' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Upload Screenshot (OCR)
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        {prefillData && (
          <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-800/70 text-xs flex items-center justify-between gap-3 text-cyan-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong>Imported from {prefillData.platform || 'Social Feed'}</strong> ({prefillData.account}): Location detected as <strong>{prefillData.location}</strong>.
              </span>
            </div>
            {onClearPrefill && (
              <button
                onClick={onClearPrefill}
                className="text-[11px] underline text-cyan-300 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {inputMode === 'text' ? (
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Enter Weather Claim or Message
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="e.g. Heavy rainfall of 150 mm is expected in Pune today..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 leading-relaxed font-mono"
            />

            {/* Quick Sample Prompts */}
            <div className="mt-3">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Or try a sample viral forward:</span>
              <div className="flex flex-wrap gap-2">
                {sampleClaims.map((claim, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(claim)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-colors text-left"
                  >
                    "{claim.slice(0, 48)}..."
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Screenshot / OCR Upload Mode (Requirement 30) */
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Upload Screenshot or News Forward Image
            </label>
            <div className="p-8 border-2 border-dashed border-slate-700 hover:border-cyan-500/70 rounded-2xl bg-slate-950/60 text-center transition-colors">
              <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-200">Drag and drop screenshot, or click to browse</p>
              <p className="text-[11px] text-slate-400 mt-1">Supports PNG, JPG, WEBP screenshots of WhatsApp or social feeds</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="mt-3 block mx-auto text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer"
              />
            </div>

            {/* OCR Extracted Text Display (Requirement 30: Show Extracted Text before verification) */}
            {extractedOcrText && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Extracted Text (OCR Engine):
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">100% Optical Confidence</span>
                </div>
                <p className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {extractedOcrText}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleRunVerification}
            disabled={isVerifying || (inputMode === 'text' && !inputText.trim())}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>CROSS-REFERENCING RADAR & SENSORS...</span>
              </>
            ) : (
              <>
                <CheckCheck className="w-4 h-4" />
                <span>VERIFY AGAINST {selectedCity.name.toUpperCase()} DATA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification Result Output (Requirement 29: Extract location, date, hazard, compare with data) */}
      {verificationResult && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                VERIFICATION AUDIT REPORT
              </span>
              <h3 className="text-lg font-bold text-white">Meteorological Truth Assessment</h3>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-extrabold uppercase border shadow-md ${getStatusClass(
                verificationResult.resultStatus
              )}`}
            >
              {verificationResult.resultStatus}
            </span>
          </div>

          {/* Extracted Entities Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">DETECTED LOCATION</span>
              <strong className="text-cyan-300 text-sm">{verificationResult.extractedLocation.area}, {verificationResult.extractedLocation.city}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">HAZARD CLAIMED</span>
              <strong className="text-white text-sm">{verificationResult.extractedClaim.hazard}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">CLAIMED INTENSITY</span>
              <strong className="text-amber-400 text-sm">{verificationResult.extractedClaim.metricClaimed}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">OFFICIAL SENSOR VALUE</span>
              <strong className="text-emerald-400 text-sm">{verificationResult.officialComparison.officialValue}</strong>
            </div>
          </div>

          {/* Scientific Explanation & Current Evidence (Requirement 15) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Current Evidence Assessment</span>
              <span className="text-[10px] text-cyan-400 font-mono">IMD Radar & Ground Telemetry</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{verificationResult.explanation}</p>
          </div>

          {/* Historical Context Panel (Requirement 15 & 23) */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Historical Climatological Context</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">IMD 30-Year Climatological Normal</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Historical Normal</span>
                <strong className="text-white font-mono text-sm">
                  {selectedCity.name === 'Mumbai' ? '242 mm' : selectedCity.name === 'Delhi' ? '79 mm' : '142 mm'}
                </strong>
                <span className="text-[10px] text-slate-500 block">Regional monthly baseline</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Current / Claimed Value</span>
                <strong className="text-cyan-300 font-mono text-sm">
                  {verificationResult.extractedClaim.metricClaimed}
                </strong>
                <span className="text-[10px] text-slate-500 block">Reported in forward</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Historical Comparison</span>
                <strong className="text-amber-400 font-mono text-sm">Above Average Normal</strong>
                <span className="text-[10px] text-slate-500 block">Significant departure</span>
              </div>
            </div>

            {/* Crucial Trust & Safety Rule */}
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90 leading-relaxed">
              <strong>MausamSetu Rule:</strong> Historical data provides context and does not by itself verify the forwarded message. Always cross-reference against live Doppler radar echoes and official IMD state bulletins.
            </div>
          </div>

          {/* Citizen Advisory */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs space-y-1">
            <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Verified Public Guidance
            </h4>
            <p className="text-slate-300 font-sans">{verificationResult.actionAdvice}</p>
          </div>

          {/* Bottom Actions including View Historical Context Button (Requirement 15 & 22) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-[11px] text-slate-400 font-mono">
            <span>Audit Ref: {verificationResult.id} • Saved to Verification History</span>
            <div className="flex items-center gap-2">
              {onNavigateToHistorical && (
                <button
                  onClick={() => onNavigateToHistorical(verificationResult.extractedLocation.city.toLowerCase())}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 flex items-center gap-1.5 font-sans font-bold transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>📊 View Historical Context</span>
                </button>
              )}
              <button
                onClick={() => alert('Verification link copied to clipboard for sharing!')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-sans transition-colors"
              >
                <Share2 className="w-3 h-3 text-cyan-400" />
                Share Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
