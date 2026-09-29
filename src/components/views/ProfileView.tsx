import React, { useState } from 'react';
import {
  User,
  Mail,
  MapPin,
  ShieldCheck,
  Save,
  CheckCircle2,
  BellRing,
  Send,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { INDIAN_CITIES, getCityById } from '../../data/citiesData';

interface ProfileViewProps {
  onOpenEmailModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenEmailModal }) => {
  const { user, updateProfileLocation, openSignupModal, openLoginModal } = useAuth();
  const { setCityAndArea, selectedCity, selectedArea } = useLocation();

  const [editCityId, setEditCityId] = useState(user?.cityId || selectedCity.id);
  const [editAreaId, setEditAreaId] = useState(user?.areaId || selectedArea.id);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 max-w-lg mx-auto space-y-4">
        <User className="w-12 h-12 text-cyan-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Create or Login to Your Account</h2>
        <p className="text-xs text-slate-400">
          Sign up to personalize your city, neighborhood, and receive automated risk warning emails.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={openLoginModal}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
          >
            LOGIN
          </button>
          <button
            onClick={openSignupModal}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950"
          >
            SIGN UP
          </button>
        </div>
      </div>
    );
  }

  const currentCityObj = getCityById(editCityId);

  const handleCityChange = (newCityId: string) => {
    setEditCityId(newCityId);
    const targetCity = getCityById(newCityId);
    if (targetCity.areas.length > 0) {
      setEditAreaId(targetCity.areas[0].id);
    }
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileLocation(editCityId, editAreaId);
    setCityAndArea(editCityId, editAreaId);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
              Verified Citizen Profile
            </span>
            <span className="text-xs text-slate-400">Account ID: {user.id}</span>
          </div>
          <h1 className="text-2xl font-black text-white">USER PROFILE & ALERT SETTINGS</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Your home location dictates personalized early warnings and automated weather hazard emails.
          </p>
        </div>

        <button
          onClick={onOpenEmailModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20"
        >
          <Mail className="w-4 h-4" />
          <span>TEST EMAIL ALERT</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Primary location updated! All personalized dashboard modules and alerts have synchronized.</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black mx-auto md:mx-0 shadow-lg shadow-cyan-500/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
          </div>
          <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Status:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Citizen
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Email Alerts:</span>
              <span className="text-cyan-400 font-semibold font-mono">ENABLED</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Member Since:</span>
              <span className="text-slate-300 font-mono">Sept 2026</span>
            </div>
          </div>
        </div>

        {/* Change City & Locality Form (Requirement 17: Allow users to change City, Area, Alert Preferences) */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Configure Primary Home City & Locality
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your permanent residential or workspace area to receive tailored hazard notifications.
            </p>
          </div>

          <form onSubmit={handleSaveLocation} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select City</label>
                <select
                  value={editCityId}
                  onChange={e => handleCityChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                >
                  {INDIAN_CITIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Locality / Area</label>
                <select
                  value={editAreaId}
                  onChange={e => setEditAreaId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                >
                  {currentCityObj.areas.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} (Elev. {a.elevationMeters}m)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>State / Administration Territory:</span>
              <strong className="text-slate-200">{currentCityObj.state}</strong>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>SAVE LOCATION & SYNC DASHBOARD</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
