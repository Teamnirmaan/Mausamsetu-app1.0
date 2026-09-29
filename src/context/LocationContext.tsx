import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import {
  City,
  Area,
  WeatherData,
  LocationAlert,
  ForecastData,
  RiskAnalysis,
  CityHistoricalData,
  SourceComparisonItem
} from '../types';
import { INDIAN_CITIES, getCityById, getAreaById } from '../data/citiesData';
import {
  getWeatherData,
  getActiveAlerts,
  getForecastData,
  getRiskAnalysis,
  getCityHistoricalData,
  getSourceComparisons
} from '../services/weatherEngine';

export type HistoricalPeriod = '1y' | '5y' | '10y' | '20y';

interface LocationContextType {
  cities: City[];
  selectedCity: City;
  selectedArea: Area;
  weather: WeatherData;
  activeAlerts: LocationAlert[];
  forecast: ForecastData;
  riskAnalysis: RiskAnalysis;
  historicalData: CityHistoricalData;
  historicalPeriod: HistoricalPeriod;
  setHistoricalPeriod: (period: HistoricalPeriod) => void;
  sourceComparisons: SourceComparisonItem[];
  setCity: (cityId: string) => void;
  setArea: (areaId: string) => void;
  setCityAndArea: (cityId: string, areaId: string) => void;
  isRefreshing: boolean;
  refreshLocationData: () => void;
  lastCheckedTime: string;
  systemTime: string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const LOCAL_STORAGE_CITY_KEY = 'mausamsetu_selected_city_id';
const LOCAL_STORAGE_AREA_KEY = 'mausamsetu_selected_area_id';
const LOCAL_STORAGE_PERIOD_KEY = 'mausamsetu_historical_period';

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_CITY_KEY) || 'pune';
  });

  const [selectedAreaId, setSelectedAreaId] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_AREA_KEY) || 'hinjewadi';
  });

  const [historicalPeriod, setHistoricalPeriodState] = useState<HistoricalPeriod>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PERIOD_KEY) as HistoricalPeriod;
    if (saved === '1y' || saved === '5y' || saved === '10y' || saved === '20y') {
      return saved;
    }
    return '5y';
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [lastCheckedTime, setLastCheckedTime] = useState('10:34 AM IST');

  // Live ticking system clock in IST
  const [systemTime, setSystemTime] = useState<string>(() => {
    return '28 Sep 2026, 10:34 AM IST';
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Formatted as "28 Sep 2026, 10:34 AM IST"
      const datePart = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSystemTime(`${datePart}, ${timePart} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Resolved City object
  const selectedCity = useMemo(() => {
    return getCityById(selectedCityId);
  }, [selectedCityId]);

  // Resolved Area object (ensuring it always belongs to selectedCity)
  const selectedArea = useMemo(() => {
    return getAreaById(selectedCity, selectedAreaId);
  }, [selectedCity, selectedAreaId]);

  // When city changes, ensure area is in that city
  const setCity = useCallback((cityId: string) => {
    const targetCity = getCityById(cityId);
    setSelectedCityId(targetCity.id);
    const defaultArea = targetCity.areas[0];
    setSelectedAreaId(defaultArea.id);
    localStorage.setItem(LOCAL_STORAGE_CITY_KEY, targetCity.id);
    localStorage.setItem(LOCAL_STORAGE_AREA_KEY, defaultArea.id);
  }, []);

  const setArea = useCallback((areaId: string) => {
    setSelectedAreaId(areaId);
    localStorage.setItem(LOCAL_STORAGE_AREA_KEY, areaId);
  }, []);

  const setCityAndArea = useCallback((cityId: string, areaId: string) => {
    const targetCity = getCityById(cityId);
    const targetArea = getAreaById(targetCity, areaId);
    setSelectedCityId(targetCity.id);
    setSelectedAreaId(targetArea.id);
    localStorage.setItem(LOCAL_STORAGE_CITY_KEY, targetCity.id);
    localStorage.setItem(LOCAL_STORAGE_AREA_KEY, targetArea.id);
  }, []);

  const setHistoricalPeriod = useCallback((period: HistoricalPeriod) => {
    setHistoricalPeriodState(period);
    localStorage.setItem(LOCAL_STORAGE_PERIOD_KEY, period);
  }, []);

  const refreshLocationData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST';
      setLastCheckedTime(timeStr);
      setRefreshTick(prev => prev + 1);
      setIsRefreshing(false);
    }, 400);
  }, []);

  // Compute live weather for the exact selected city and area
  const weather = useMemo(() => {
    void refreshTick;
    return getWeatherData(selectedCity, selectedArea);
  }, [selectedCity, selectedArea, refreshTick]);

  // Compute active location-specific alerts
  const activeAlerts = useMemo(() => {
    return getActiveAlerts(selectedCity, selectedArea, weather);
  }, [selectedCity, selectedArea, weather]);

  // Compute forecast
  const forecast = useMemo(() => {
    return getForecastData(selectedCity, selectedArea, weather);
  }, [selectedCity, selectedArea, weather]);

  // Compute risk analysis
  const riskAnalysis = useMemo(() => {
    return getRiskAnalysis(selectedCity, selectedArea, weather);
  }, [selectedCity, selectedArea, weather]);

  // Historical data dynamically recalculated according to city & selected period
  const historicalData = useMemo(() => {
    return getCityHistoricalData(selectedCity, historicalPeriod);
  }, [selectedCity, historicalPeriod]);

  // Source comparison
  const sourceComparisons = useMemo(() => {
    return getSourceComparisons(selectedCity, selectedArea, weather);
  }, [selectedCity, selectedArea, weather]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CITY_KEY, selectedCity.id);
    localStorage.setItem(LOCAL_STORAGE_AREA_KEY, selectedArea.id);
  }, [selectedCity.id, selectedArea.id]);

  return (
    <LocationContext.Provider
      value={{
        cities: INDIAN_CITIES,
        selectedCity,
        selectedArea,
        weather,
        activeAlerts,
        forecast,
        riskAnalysis,
        historicalData,
        historicalPeriod,
        setHistoricalPeriod,
        sourceComparisons,
        setCity,
        setArea,
        setCityAndArea,
        isRefreshing,
        refreshLocationData,
        lastCheckedTime,
        systemTime
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
