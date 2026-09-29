import React, { useState } from 'react';
import { LocationProvider, useLocation } from './context/LocationContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { AuthModal } from './components/common/AuthModal';
import { EmailAlertModal } from './components/common/EmailAlertModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { LiveWeatherView } from './components/views/LiveWeatherView';
import { HazardMapView } from './components/views/HazardMapView';
import { ForecastView } from './components/views/ForecastView';
import { VerifyReportView } from './components/views/VerifyReportView';
import { RiskAnalysisView } from './components/views/RiskAnalysisView';
import { ActiveAlertsView } from './components/views/ActiveAlertsView';
import { HistoricalDataView } from './components/views/HistoricalDataView';
import { HistoricalAnalysisView } from './components/views/HistoricalAnalysisView';
import { SourceComparisonView } from './components/views/SourceComparisonView';
import { SocialMediaFeedView } from './components/views/SocialMediaFeedView';
import { SocialWeatherSignalsView } from './components/views/SocialWeatherSignalsView';
import { VerificationHistoryView } from './components/views/VerificationHistoryView';
import { ProfileView } from './components/views/ProfileView';
import { AlertPreferencesView } from './components/views/AlertPreferencesView';
import { SettingsView } from './components/views/SettingsView';
import { CityComparisonView } from './components/views/CityComparisonView';
import { DevelopmentTeamView } from './components/views/DevelopmentTeamView';

import { LocationAlert } from './types';
import { Menu } from 'lucide-react';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTargetAlert, setEmailTargetAlert] = useState<LocationAlert | null>(null);

  // Social Claim verification transfer state
  const [prefillVerifyData, setPrefillVerifyData] = useState<{
    source?: string;
    platform?: string;
    account?: string;
    text?: string;
    url?: string;
    location?: string;
    hazard?: string;
  } | null>(null);

  // Historical Analysis target city state (Requirement 14 & 22)
  const [historicalTargetCity, setHistoricalTargetCity] = useState<string | undefined>(undefined);

  const handleOpenEmailModalForAlert = (alert: LocationAlert) => {
    setEmailTargetAlert(alert);
    setIsEmailModalOpen(true);
  };

  const handleOpenGeneralEmailModal = () => {
    setEmailTargetAlert(null);
    setIsEmailModalOpen(true);
  };

  const handleVerifyClaimFromSocial = (claimData: any) => {
    setPrefillVerifyData(claimData);
    setCurrentView('verify-report');
  };

  const handleNavigateToHistorical = (cityId?: string) => {
    if (cityId) {
      setHistoricalTargetCity(cityId);
    }
    setCurrentView('historical-analysis');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={setCurrentView}
            onOpenEmailModalForAlert={handleOpenEmailModalForAlert}
          />
        );
      case 'live-weather':
        return <LiveWeatherView />;
      case 'hazard-map':
        return (
          <HazardMapView
            onOpenEmailModalForAlert={handleOpenEmailModalForAlert}
            onNavigateToHistorical={handleNavigateToHistorical}
          />
        );
      case 'forecast':
        return <ForecastView />;
      case 'verify-report':
        return (
          <VerifyReportView
            prefillData={prefillVerifyData}
            onClearPrefill={() => setPrefillVerifyData(null)}
            onNavigateToHistorical={handleNavigateToHistorical}
          />
        );
      case 'risk-analysis':
        return <RiskAnalysisView />;
      case 'alerts':
        return <ActiveAlertsView onOpenEmailModalForAlert={handleOpenEmailModalForAlert} />;
      case 'historical-analysis':
      case 'historical-data':
        return (
          <HistoricalAnalysisView
            onNavigate={setCurrentView}
            onNavigateToVerify={prefill => {
              if (prefill) {
                setPrefillVerifyData(prefill);
              }
              setCurrentView('verify-report');
            }}
            initialCityId={historicalTargetCity}
          />
        );
      case 'source-comparison':
        return <SourceComparisonView />;
      case 'social-feed':
        return <SocialMediaFeedView onVerifyClaim={handleVerifyClaimFromSocial} />;
      case 'social-signals':
        return (
          <SocialWeatherSignalsView
            onNavigate={setCurrentView}
            onVerifyClaim={handleVerifyClaimFromSocial}
          />
        );
      case 'verification-history':
        return <VerificationHistoryView />;
      case 'profile':
        return <ProfileView onOpenEmailModal={handleOpenGeneralEmailModal} />;
      case 'preferences':
        return <AlertPreferencesView onOpenEmailModal={handleOpenGeneralEmailModal} />;
      case 'settings':
        return <SettingsView />;
      case 'development-team':
        return <DevelopmentTeamView />;
      case 'compare-cities':
        return <CityComparisonView />;
      default:
        return (
          <DashboardView
            onNavigate={setCurrentView}
            onOpenEmailModalForAlert={handleOpenEmailModalForAlert}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950 transition-colors">
      {/* Mobile top toggle bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
          MausamSetu India
        </span>
        <button
          onClick={() => setCurrentView('compare-cities')}
          className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        >
          Compare
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Drawer */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (offset by 64 = 256px on desktop) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0 pb-16 lg:pb-8">
        {/* Sticky Header with Location Selector */}
        <Header
          currentView={currentView}
          onNavigate={setCurrentView}
          onOpenEmailModal={handleOpenGeneralEmailModal}
        />

        {/* View Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentView={currentView} onNavigate={setCurrentView} />

      {/* Auth Modal (Sign Up & Login) */}
      <AuthModal />

      {/* Email Alert Preview & Dispatch Modal */}
      <EmailAlertModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        selectedAlert={emailTargetAlert}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <MainApp />
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
