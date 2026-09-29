export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Severe';

export type HazardType = 
  | 'Heavy Rain'
  | 'Thunderstorm'
  | 'Strong Wind'
  | 'Heat Risk'
  | 'High UV'
  | 'Poor Air Quality'
  | 'Flood Risk'
  | 'Dense Fog'
  | 'Coastal Surge';

export type AlertStatus = 'Active' | 'Resolved' | 'Expired';

export type VerificationStatus = 
  | 'SUPPORTED'
  | 'PARTIALLY SUPPORTED'
  | 'NOT VERIFIED'
  | 'OUTDATED'
  | 'UNABLE TO CONFIRM';

export interface Area {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  floodVulnerability: 'Low' | 'Moderate' | 'High';
  heatVulnerability: 'Low' | 'Moderate' | 'High';
}

export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  climateZone: string;
  areas: Area[];
}

export interface WeatherData {
  cityId: string;
  cityName: string;
  areaId: string;
  areaName: string;
  state: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionCode: string;
  humidity: number;
  rainfall: number; // mm in last 24h
  rainProbability: number; // %
  windSpeed: number; // km/h
  windDirection: string;
  uvIndex: number;
  visibility: number; // km
  aqi: number;
  aqiCategory: 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  barometer: number; // hPa
  dewPoint: number;
  lastUpdated: string;
  observationTimestamp: string; // e.g. "28 Sep 2026 • 10:32 AM IST"
  syncTimestamp: string; // e.g. "10:34 AM IST"
  source: string;
  stationName: string;
  stationDistance: string;
  floodGeoRisk: SeverityLevel;
  floodGeoRiskReason: string;
  rainfallThreshold: number;
  isDemoData: boolean;
}

export interface LocationAlert {
  alertId: string;
  city: string;
  cityId: string;
  area: string;
  areaId: string;
  state: string;
  hazardType: HazardType;
  severity: SeverityLevel;
  title: string;
  description: string;
  weatherParameter: string;
  value: number | string;
  threshold: number | string;
  source: string;
  timestamp: string;
  validUntil: string;
  status: AlertStatus;
  recommendation: string;
}

export interface HourlyForecast {
  time: string;
  hour: number;
  temperature: number;
  condition: string;
  rainProbability: number;
  rainfall: number;
  windSpeed: number;
  humidity: number;
  forecastTimestamp?: string;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  rainProbability: number;
  rainfall: number;
  windSpeed: number;
  humidity: number;
  uvIndex: number;
  summary: string;
}

export interface ForecastData {
  cityId: string;
  areaId: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  generatedAt: string;
}

export interface RiskFactor {
  hazard: HazardType;
  level: SeverityLevel;
  score: number; // 0-100
  metricValue: string;
  threshold: string;
  trend: 'Increasing' | 'Stable' | 'Decreasing';
  explanation: string;
  mitigation: string;
}

export interface RiskAnalysis {
  cityId: string;
  areaId: string;
  overallScore: number; // 0-100
  overallLevel: SeverityLevel;
  primaryHazard: HazardType;
  factors: RiskFactor[];
  lastCalculated: string;
}

export interface HistoricalYearData {
  year: number;
  annualRainfall: number; // mm
  averageTemp: number; // °C
  extremeEventsCount: number;
  heatwaveDays: number;
  monsoonTotal: number;
}

export interface MonthlyHistory {
  month: string;
  fullMonthName: string;
  monthNumber: number;
  isMonsoon: boolean;
  actualRainfall: number;
  historicalBaseline: number;
  difference: number;
  deviationPercent: number;
  // Legacy aliases for backward compatibility
  avgRainfall: number;
  currentYearRainfall: number;
  avgTemp: number;
  maxRecordedTemp: number;
}

export interface HistoricalBenchmarkEvent {
  eventName: string;
  dateRecorded: string;
  rawYear: number;
  classification: string;
  measurement: string;
  unit: string;
  severityContext: string;
  source: string;
  // legacy aliases
  date?: string;
  event?: string;
  value?: string;
  historicalRank?: string;
}

export interface CityHistoricalData {
  cityId: string;
  cityName: string;
  baselinePeriod: string;
  selectedPeriod: '1y' | '5y' | '10y' | '20y';
  periodLabel: string;
  dataUpdated: string;
  stationName: string;
  source: string;
  dataResolution: string;
  annualData: HistoricalYearData[];
  monthlyData: MonthlyHistory[];
  rainfallAnomalyPercent: number;
  tempAnomalyCelsius: number;
  extremeEventsCount: number;
  topExtremeEvents: HistoricalBenchmarkEvent[];
}

export interface SourceComparisonItem {
  id: string;
  sourceName: string;
  sourceType: 'Official Meteorological Agency' | 'Global Model / Platform' | 'News Wire' | 'Social Intelligence' | 'Hyperlocal Sensor';
  temperature: string;
  rainfall: string;
  wind: string;
  hazardClaim: string;
  timestamp: string;
  status: VerificationStatus;
  confidenceScore: number;
  notes: string;
}

export interface VerificationRecord {
  id: string;
  userId?: string;
  timestamp: string;
  inputType: 'text' | 'image';
  originalInput: string;
  imageUrl?: string;
  extractedLocation: {
    city: string;
    area?: string;
  };
  extractedClaim: {
    hazard: string;
    metricClaimed?: string;
    timeframeClaimed?: string;
  };
  officialComparison: {
    officialValue: string;
    variance: string;
  };
  resultStatus: VerificationStatus;
  explanation: string;
  actionAdvice: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  cityId: string;
  cityName: string;
  areaId: string;
  areaName: string;
  state: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface AlertPreferences {
  emailAlertsEnabled: boolean;
  inAppAlertsEnabled: boolean;
  subscribedHazards: HazardType[];
  minimumSeverity: SeverityLevel;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export type SocialPlatform = 'X / Twitter' | 'Facebook' | 'Instagram' | 'YouTube';

export type SocialSourceType = 'OFFICIAL' | 'NEWS' | 'SOCIAL' | 'USER_REPORT';

export interface SocialReport {
  id: string;
  cityId: string;
  cityName: string;
  areaId?: string;
  areaName?: string;
  // Legacy / snake_case aliases
  city_id: string;
  area_id?: string;
  platform: SocialPlatform | string;
  post_id?: string;
  account_name: string;
  account_handle: string;
  account_type?: 'verified_official' | 'news_agency' | 'citizen_observer' | 'user_submission';
  content: string;
  url?: string;
  media_url?: string;
  thumbnail_url?: string;
  detected_location: {
    city: string;
    area?: string;
    confidence: number;
  };
  hazardType?: string;
  hazard_type: string;
  severity: SeverityLevel;
  weatherClaim: {
    parameter: string;
    value?: string;
    timeframe?: string;
  };
  timestamp: string;
  retrieved_at?: string;
  verificationStatus?: VerificationStatus;
  verification_status: VerificationStatus;
  verification_reason: string;
  evidence?: string;
  source_type: SocialSourceType;
  isSimulated?: boolean;
  engagement?: {
    likes: number;
    shares: number;
    views?: number;
    comments?: number;
  };
  sourceScoring: {
    sourceType: string;
    timestamp: string;
    locationMatch: 'Matched' | 'Unclear' | 'Not Matched';
    evidenceAvailable: 'Yes' | 'Limited' | 'No';
    crossSourceAgreement: 'High' | 'Mixed' | 'Low';
  };
}

export interface SocialWeatherSummary {
  totalReports: number;
  byPlatform: {
    xTwitter: number;
    facebook: number;
    instagram: number;
    youtube: number;
  };
  byStatus: {
    supported: number;
    partiallySupported: number;
    notVerified: number;
    outdated: number;
    unableToConfirm: number;
  };
  recentTimeline: Array<{
    id: string;
    time: string;
    platform: SocialPlatform;
    city: string;
    area: string;
    hazard: string;
    status: VerificationStatus;
  }>;
}
