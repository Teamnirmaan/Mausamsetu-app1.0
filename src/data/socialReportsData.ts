import { SocialReport, SocialWeatherSummary, VerificationStatus, HazardType, SocialPlatform, SocialSourceType } from '../types';
import { INDIAN_CITIES, getCityById, getAreaById } from './citiesData';

export const SOCIAL_REPORTS_DATABASE: SocialReport[] = [
  // ========================================================
  // 1. PUNE (Wakad, Hinjewadi, Kothrud, Baner, Shivajinagar, etc.)
  // ========================================================
  {
    id: 'SR-PUN-001',
    cityId: 'pune',
    cityName: 'Pune',
    areaId: 'wakad',
    areaName: 'Wakad',
    city_id: 'pune',
    area_id: 'wakad',
    platform: 'X / Twitter',
    post_id: 'x-pun-wakad-01',
    account_name: 'Wakad Residents Action Forum',
    account_handle: '@WakadResidents',
    account_type: 'citizen_observer',
    content: 'Intense rain bands passing over Wakad and Dutta Mandir road. Minor water stagnation on service lane towards highway. Drive carefully!',
    url: 'https://twitter.com/WakadResidents/status/183889102910',
    detected_location: { city: 'Pune', area: 'Wakad', confidence: 0.98 },
    hazardType: 'Heavy Rain',
    hazard_type: 'Heavy Rain',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Rainfall', value: '38 mm in 2 hours', timeframe: 'Morning' },
    timestamp: '10:05 AM IST',
    retrieved_at: '10:12 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Wakad AWS precipitation sensor recorded 36.4mm accumulation over past 120 minutes.',
    evidence: 'AWS Telemetry (36.4mm) + Traffic Police Update',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 245, shares: 64, comments: 18 },
    sourceScoring: {
      sourceType: 'Citizen Observer Community',
      timestamp: '10:05 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-PUN-002',
    cityId: 'pune',
    cityName: 'Pune',
    areaId: 'hinjewadi',
    areaName: 'Hinjewadi',
    city_id: 'pune',
    area_id: 'hinjewadi',
    platform: 'X / Twitter',
    post_id: 'x-pun-hinj-02',
    account_name: 'IMD Pune Sub-Division Nowcast',
    account_handle: '@imdpune_official',
    account_type: 'verified_official',
    content: 'NOWCAST WARNING: Isolated spells of heavy rainfall (50-75mm) with gusty winds (35-45 km/h) likely over Hinjewadi and Pimpri-Chinchwad corridors during next 3 hours.',
    url: 'https://twitter.com/imdpune_official/status/183889240192',
    detected_location: { city: 'Pune', area: 'Hinjewadi', confidence: 0.99 },
    hazardType: 'Heavy Rain',
    hazard_type: 'Heavy Rain',
    severity: 'High',
    weatherClaim: { parameter: 'Rainfall & Gusts', value: '72 mm measured (50-75 mm range)', timeframe: 'Next 3 hours' },
    timestamp: '09:55 AM IST',
    retrieved_at: '10:02 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Direct telemetry from Hinjewadi Phase 2 AWS station confirms 72mm accumulation crossing heavy rain threshold.',
    evidence: 'IMD Doppler Radar & Automated Weather Station (AWS)',
    source_type: 'OFFICIAL',
    isSimulated: true,
    engagement: { likes: 1380, shares: 512, comments: 72 },
    sourceScoring: {
      sourceType: 'Official Meteorological Agency',
      timestamp: '09:55 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-PUN-003',
    cityId: 'pune',
    cityName: 'Pune',
    areaId: 'kothrud',
    areaName: 'Kothrud',
    city_id: 'pune',
    area_id: 'kothrud',
    platform: 'Facebook',
    post_id: 'fb-pun-koth-03',
    account_name: 'Kothrud Citizens Forum',
    account_handle: '@KothrudResidentsGroup',
    account_type: 'user_submission',
    content: 'Cloudburst in Kothrud! More than 120 mm rain fell in 20 minutes! Basements along Paud Road will drown completely!',
    url: 'https://facebook.com/groups/kothrudforum/posts/9402841029',
    detected_location: { city: 'Pune', area: 'Kothrud', confidence: 0.91 },
    hazardType: 'Heavy Rain',
    hazard_type: 'Heavy Rain',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Cloudburst claim', value: '120 mm in 20 mins', timeframe: 'Current' },
    timestamp: '09:20 AM IST',
    retrieved_at: '09:30 AM IST',
    verificationStatus: 'NOT VERIFIED',
    verification_status: 'NOT VERIFIED',
    verification_reason: 'Kothrud rain gauge records 12mm steady showers. Claim drastically overstates actual measured precipitation by 10x.',
    evidence: 'Ground AWS sensor (12mm) refutes cloudburst',
    source_type: 'USER_REPORT',
    isSimulated: true,
    engagement: { likes: 92, shares: 48, comments: 26 },
    sourceScoring: {
      sourceType: 'User Report / Forward',
      timestamp: '09:20 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'No',
      crossSourceAgreement: 'Low'
    }
  },
  {
    id: 'SR-PUN-004',
    cityId: 'pune',
    cityName: 'Pune',
    areaId: 'baner',
    areaName: 'Baner',
    city_id: 'pune',
    area_id: 'baner',
    platform: 'Instagram',
    post_id: 'ig-pun-baner-04',
    account_name: 'Pune Weather Watcher',
    account_handle: '@WeatherSource',
    account_type: 'citizen_observer',
    content: 'Baner-Pashan link road experiencing heavy surface runoff and low visibility under thick convective squall.',
    url: 'https://instagram.com/p/punebaner44',
    detected_location: { city: 'Pune', area: 'Baner', confidence: 0.94 },
    hazardType: 'Heavy Rain',
    hazard_type: 'Heavy Rain',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Rainfall & Visibility', value: '32 mm / < 800m vis', timeframe: 'Morning' },
    timestamp: '10:15 AM IST',
    retrieved_at: '10:20 AM IST',
    verificationStatus: 'PARTIALLY SUPPORTED',
    verification_status: 'PARTIALLY SUPPORTED',
    verification_reason: 'Convective cloud radar shows localized heavy shower; moderate water runoff confirmed by traffic camera.',
    evidence: 'CCTV + Pashan AWS Rain Gauge',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 410, shares: 92, comments: 31 },
    sourceScoring: {
      sourceType: 'Social Media Observer',
      timestamp: '10:15 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-PUN-005',
    cityId: 'pune',
    cityName: 'Pune',
    areaId: 'shivajinagar',
    areaName: 'Shivajinagar',
    city_id: 'pune',
    area_id: 'shivajinagar',
    platform: 'YouTube',
    post_id: 'yt-pun-shiv-05',
    account_name: 'Maharashtra Weather Alert Desk',
    account_handle: '@MahaMausamLive',
    account_type: 'news_agency',
    content: 'LIVE Ground Report: Mutha River catchment water release impact near Shivajinagar bridge and Deccan Gymkhana.',
    url: 'https://youtube.com/watch?v=punerainlive',
    detected_location: { city: 'Pune', area: 'Shivajinagar', confidence: 0.96 },
    hazardType: 'Flood Risk',
    hazard_type: 'Flood Risk',
    severity: 'Moderate',
    weatherClaim: { parameter: 'River Level & Discharge', value: 'Khadakwasla release 14,000 cusecs', timeframe: 'Today' },
    timestamp: '08:45 AM IST',
    retrieved_at: '08:52 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Irrigation Department bulletin confirms 14,250 cusecs controlled discharge into Mutha River basin.',
    evidence: 'Irrigation Dept Official Bulletin',
    source_type: 'NEWS',
    isSimulated: true,
    engagement: { likes: 2150, shares: 430, views: 28000, comments: 145 },
    sourceScoring: {
      sourceType: 'News Broadcast',
      timestamp: '08:45 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },

  // ========================================================
  // 2. MUMBAI (Andheri, Bandra, Dadar, Kurla, Powai, etc.)
  // ========================================================
  {
    id: 'SR-MUM-001',
    cityId: 'mumbai',
    cityName: 'Mumbai',
    areaId: 'andheri',
    areaName: 'Andheri',
    city_id: 'mumbai',
    area_id: 'andheri',
    platform: 'X / Twitter',
    post_id: 'x-mum-andheri-01',
    account_name: 'Mumbai Rain Live',
    account_handle: '@mumbairains',
    account_type: 'citizen_observer',
    content: 'Waterlogging reported near Andheri subway following steady morning spell. Subway closed for vehicular traffic, vehicles diverted to SV Road.',
    url: 'https://twitter.com/mumbairains/status/19481102',
    detected_location: { city: 'Mumbai', area: 'Andheri', confidence: 0.97 },
    hazardType: 'Heavy Rain',
    hazard_type: 'Heavy Rain',
    severity: 'High',
    weatherClaim: { parameter: 'Inundation & Rain', value: '88 mm 24h accumulation', timeframe: 'Morning' },
    timestamp: '09:42 AM IST',
    retrieved_at: '09:48 AM IST',
    verificationStatus: 'PARTIALLY SUPPORTED',
    verification_status: 'PARTIALLY SUPPORTED',
    verification_reason: 'Santacruz radar recorded 84mm; BMC stormwater cell confirms Andheri subway water clearance pumps active.',
    evidence: 'CCTV + Radar + BMC Stormwater AWS',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 3410, shares: 980, comments: 190 },
    sourceScoring: {
      sourceType: 'Social Media Report',
      timestamp: '09:42 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-MUM-002',
    cityId: 'mumbai',
    cityName: 'Mumbai',
    areaId: 'dadar',
    areaName: 'Dadar',
    city_id: 'mumbai',
    area_id: 'dadar',
    platform: 'X / Twitter',
    post_id: 'x-mum-dadar-02',
    account_name: 'BMC Disaster Management',
    account_handle: '@DisasterMgmtBMC',
    account_type: 'verified_official',
    content: 'High Tide Warning: 4.28m High Tide predicted at 11:45 AM today. Citizens strictly advised against entering Dadar Chowpatty and Marine Drive promenades.',
    url: 'https://twitter.com/DisasterMgmtBMC/status/1948102941',
    detected_location: { city: 'Mumbai', area: 'Dadar', confidence: 0.99 },
    hazardType: 'Flood Risk',
    hazard_type: 'Flood Risk',
    severity: 'High',
    weatherClaim: { parameter: 'High Tide & Surge', value: '4.28 meters height', timeframe: '11:45 AM' },
    timestamp: '08:30 AM IST',
    retrieved_at: '08:35 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Hydrographic Office tide tables and Apollo Bunder coastal telemetry confirm 4.28m astronomical surge peak.',
    evidence: 'Naval Hydrographic Tide Gauge + Municipal Cell',
    source_type: 'OFFICIAL',
    isSimulated: true,
    engagement: { likes: 4520, shares: 1890, comments: 124 },
    sourceScoring: {
      sourceType: 'Official Disaster Cell',
      timestamp: '08:30 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-MUM-003',
    cityId: 'mumbai',
    cityName: 'Mumbai',
    areaId: 'kurla',
    areaName: 'Kurla',
    city_id: 'mumbai',
    area_id: 'kurla',
    platform: 'YouTube',
    post_id: 'yt-mum-kurla-03',
    account_name: 'Mumbai News 24/7',
    account_handle: '@MumbaiNewsLive',
    account_type: 'news_agency',
    content: 'Kurla Mithi River level touches 2.8m warning mark after overnight downpour. Slum rehabilitation areas on alert.',
    url: 'https://youtube.com/watch?v=mumKurlaLive',
    detected_location: { city: 'Mumbai', area: 'Kurla', confidence: 0.95 },
    hazardType: 'Flood Risk',
    hazard_type: 'Flood Risk',
    severity: 'High',
    weatherClaim: { parameter: 'River Catchment', value: 'Mithi river at 2.8m warning mark', timeframe: 'Current' },
    timestamp: '10:00 AM IST',
    retrieved_at: '10:05 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Kranti Nagar ultrasonic river level gauge reads 2.76m, matching the high alert threshold.',
    evidence: 'Ultrasonic River Sensor Telemetry',
    source_type: 'NEWS',
    isSimulated: true,
    engagement: { likes: 1620, shares: 420, views: 21000, comments: 110 },
    sourceScoring: {
      sourceType: 'Regional News Wire',
      timestamp: '10:00 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-MUM-004',
    cityId: 'mumbai',
    cityName: 'Mumbai',
    areaId: 'bandra',
    areaName: 'Bandra',
    city_id: 'mumbai',
    area_id: 'bandra',
    platform: 'Instagram',
    post_id: 'ig-mum-bandra-04',
    account_name: 'Bandra Coastal Watch',
    account_handle: '@bandra_coastal',
    account_type: 'citizen_observer',
    content: 'Strong gusty sea winds recorded at Bandra Carter Road. Sea spray splashing onto joggers track. Gale force winds!',
    url: 'https://instagram.com/p/bandrawind',
    detected_location: { city: 'Mumbai', area: 'Bandra', confidence: 0.94 },
    hazardType: 'Strong Wind',
    hazard_type: 'Strong Wind',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Wind Speed', value: 'Gale force (>65 km/h claimed)', timeframe: 'Morning' },
    timestamp: '10:10 AM IST',
    retrieved_at: '10:15 AM IST',
    verificationStatus: 'PARTIALLY SUPPORTED',
    verification_status: 'PARTIALLY SUPPORTED',
    verification_reason: 'Coastal anemometer records 44 km/h gusts (moderate squall). Claim of >65 km/h gale force is exaggerated.',
    evidence: 'Bandra Reclamation Anemometer (44 km/h)',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 620, shares: 140, comments: 45 },
    sourceScoring: {
      sourceType: 'Social Media Report',
      timestamp: '10:10 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'Mixed'
    }
  },

  // ========================================================
  // 3. DELHI (Rohini, Dwarka, Saket, Connaught Place, etc.)
  // ========================================================
  {
    id: 'SR-DEL-001',
    cityId: 'delhi',
    cityName: 'Delhi',
    areaId: 'rohini',
    areaName: 'Rohini',
    city_id: 'delhi',
    area_id: 'rohini',
    platform: 'X / Twitter',
    post_id: 'x-del-rohini-01',
    account_name: 'Delhi NCR Clean Air Watch',
    account_handle: '@DelhiAirTracker',
    account_type: 'citizen_observer',
    content: 'Severe air quality emergency across Rohini and Sector 16. CAAQMS sensor readings crossed 340 AQI. Stinging eyes and heavy haze throughout north Delhi.',
    url: 'https://twitter.com/DelhiAirTracker/status/193029104',
    detected_location: { city: 'Delhi', area: 'Rohini', confidence: 0.97 },
    hazardType: 'Poor Air Quality',
    hazard_type: 'Poor Air Quality',
    severity: 'Severe',
    weatherClaim: { parameter: 'Air Quality (AQI)', value: '342 AQI (PM2.5 spike)', timeframe: 'Morning' },
    timestamp: '09:10 AM IST',
    retrieved_at: '09:15 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Central Pollution Control Board (CPCB) continuous monitoring station in Rohini recorded 342 AQI at 09:00 AM.',
    evidence: 'CPCB CAAQMS Station Rohini Real-time Feed',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 980, shares: 440, comments: 85 },
    sourceScoring: {
      sourceType: 'Citizen Monitoring Network',
      timestamp: '09:10 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-DEL-002',
    cityId: 'delhi',
    cityName: 'Delhi',
    areaId: 'connaught-place',
    areaName: 'Connaught Place',
    city_id: 'delhi',
    area_id: 'connaught-place',
    platform: 'Facebook',
    post_id: 'fb-del-cp-02',
    account_name: 'Delhi Weather News Group',
    account_handle: '@DelhiWeatherUpdates',
    account_type: 'user_submission',
    content: 'Extreme heat warning forward: Mercury expected to cross 48°C in Connaught Place and central Delhi by 2 PM! Stay indoors!',
    url: 'https://facebook.com/delhiweather/posts/991204',
    detected_location: { city: 'Delhi', area: 'Connaught Place', confidence: 0.93 },
    hazardType: 'Heat Risk',
    hazard_type: 'Heat Risk',
    severity: 'High',
    weatherClaim: { parameter: 'Peak Temperature', value: '48°C claimed (IMD forecast 41.5°C)', timeframe: '2:00 PM' },
    timestamp: '08:45 AM IST',
    retrieved_at: '08:50 AM IST',
    verificationStatus: 'PARTIALLY SUPPORTED',
    verification_status: 'PARTIALLY SUPPORTED',
    verification_reason: 'High thermal stress confirmed (39.8°C at 9AM, peaking near 41.5°C), but 48°C extreme claim exceeds IMD numerical forecast by >6°C.',
    evidence: 'Safdarjung IMD Baseline Station (39.8°C)',
    source_type: 'USER_REPORT',
    isSimulated: true,
    engagement: { likes: 310, shares: 120, comments: 42 },
    sourceScoring: {
      sourceType: 'Social Media Group',
      timestamp: '08:45 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Limited',
      crossSourceAgreement: 'Mixed'
    }
  },
  {
    id: 'SR-DEL-003',
    cityId: 'delhi',
    cityName: 'Delhi',
    areaId: 'dwarka',
    areaName: 'Dwarka',
    city_id: 'delhi',
    area_id: 'dwarka',
    platform: 'YouTube',
    post_id: 'yt-del-dwarka-03',
    account_name: 'Capital Weather Radar Live',
    account_handle: '@DelhiWeather24',
    account_type: 'news_agency',
    content: 'Sudden Dust Storm approaching Dwarka & IGI Airport corridor from western Haryana. Visibility drops under 500m.',
    url: 'https://youtube.com/watch?v=delhiDustStorm',
    detected_location: { city: 'Delhi', area: 'Dwarka', confidence: 0.96 },
    hazardType: 'Strong Wind',
    hazard_type: 'Strong Wind',
    severity: 'High',
    weatherClaim: { parameter: 'Dust Squall & Winds', value: '52 km/h winds, <500m vis', timeframe: 'Next 1 hour' },
    timestamp: '10:20 AM IST',
    retrieved_at: '10:25 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Palam airport METAR radar records sudden squall front with 52 km/h gusts and horizontal visibility reduction.',
    evidence: 'Palam METAR Aviation Radar & Doppler Velocity',
    source_type: 'NEWS',
    isSimulated: true,
    engagement: { likes: 1890, shares: 520, views: 29000, comments: 160 },
    sourceScoring: {
      sourceType: 'Aviation & Meteorological News',
      timestamp: '10:20 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },

  // ========================================================
  // 4. BENGALURU (Whitefield, Koramangala, Indiranagar, etc.)
  // ========================================================
  {
    id: 'SR-BLR-001',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    areaId: 'whitefield',
    areaName: 'Whitefield',
    city_id: 'bengaluru',
    area_id: 'whitefield',
    platform: 'X / Twitter',
    post_id: 'x-blr-whitefield-01',
    account_name: 'Bengaluru Tech Corridor Alerts',
    account_handle: '@WhitefieldRising',
    account_type: 'citizen_observer',
    content: 'Strong sudden wind gusts (nearly 50 km/h) shaking trees and construction tin roofs on Whitefield ITPL main road. Two-wheeler riders take shelter!',
    url: 'https://twitter.com/WhitefieldRising/status/1948201',
    detected_location: { city: 'Bengaluru', area: 'Whitefield', confidence: 0.95 },
    hazardType: 'Strong Wind',
    hazard_type: 'Strong Wind',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Surface Wind Speed', value: '48 km/h recorded', timeframe: 'Current' },
    timestamp: '10:10 AM IST',
    retrieved_at: '10:14 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Karnataka State Natural Disaster Monitoring Centre (KSNDMC) sensor at ITPL logs 48 km/h peak surface gusts.',
    evidence: 'KSNDMC ITPL Telemetry Station',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 620, shares: 210, comments: 55 },
    sourceScoring: {
      sourceType: 'Neighborhood Citizen Group',
      timestamp: '10:10 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-BLR-002',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    areaId: 'koramangala',
    areaName: 'Koramangala',
    city_id: 'bengaluru',
    area_id: 'koramangala',
    platform: 'Facebook',
    post_id: 'fb-blr-kora-02',
    account_name: 'Koramangala Community Updates',
    account_handle: '@KoramangalaLive',
    account_type: 'citizen_observer',
    content: 'Rain accumulation starting on 80ft road near 4th Block. Stormwater drains flowing at 75% capacity.',
    url: 'https://facebook.com/koramangalaupdates/posts/882190',
    detected_location: { city: 'Bengaluru', area: 'Koramangala', confidence: 0.94 },
    hazardType: 'Heavy Rain',
    hazard_type: 'Heavy Rain',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Rainfall', value: '28 mm localized spell', timeframe: 'Past hour' },
    timestamp: '09:50 AM IST',
    retrieved_at: '09:55 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'BBMP automated rain gauge in Koramangala confirms 26.5mm in last 60 minutes.',
    evidence: 'BBMP Smart City Rain Gauge',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 380, shares: 85, comments: 29 },
    sourceScoring: {
      sourceType: 'Community Watch Group',
      timestamp: '09:50 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },

  // ========================================================
  // 5. HYDERABAD (Gachibowli, Banjara Hills, Hitech City, etc.)
  // ========================================================
  {
    id: 'SR-HYD-001',
    cityId: 'hyderabad',
    cityName: 'Hyderabad',
    areaId: 'hitec-city',
    areaName: 'HITEC City',
    city_id: 'hyderabad',
    area_id: 'hitec-city',
    platform: 'X / Twitter',
    post_id: 'x-hyd-hitec-01',
    account_name: 'Hyderabad Weather Tracker',
    account_handle: '@HydWeatherWatch',
    account_type: 'citizen_observer',
    content: 'Thunderstorm squall with intense lightning over HITEC City, Madhapur and Cyber Towers. Heavy showers starting.',
    url: 'https://twitter.com/HydWeatherWatch/status/1958203',
    detected_location: { city: 'Hyderabad', area: 'HITEC City', confidence: 0.97 },
    hazardType: 'Thunderstorm',
    hazard_type: 'Thunderstorm',
    severity: 'High',
    weatherClaim: { parameter: 'Thunderstorm & Lightning', value: 'Frequent cloud-to-ground strikes', timeframe: 'Current' },
    timestamp: '10:05 AM IST',
    retrieved_at: '10:10 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Telangana Planning Society (TSDPS) radar indicates severe convective cell with lightning flash rate >18 strikes/min.',
    evidence: 'TSDPS Doppler Radar & Lightning Sensor Network',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 780, shares: 290, comments: 64 },
    sourceScoring: {
      sourceType: 'Regional Weather Enthusiast',
      timestamp: '10:05 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-HYD-002',
    cityId: 'hyderabad',
    cityName: 'Hyderabad',
    areaId: 'kukatpally',
    areaName: 'Kukatpally',
    city_id: 'hyderabad',
    area_id: 'kukatpally',
    platform: 'YouTube',
    post_id: 'yt-hyd-kukat-02',
    account_name: 'Telangana News Media',
    account_handle: '@TelanganaNewsNow',
    account_type: 'news_agency',
    content: 'Kukatpally Y-Junction experiencing heavy water inundation after sudden cloudburst-like cloud system. GHMC DRF teams deployed.',
    url: 'https://youtube.com/watch?v=kukatpallyrain',
    detected_location: { city: 'Hyderabad', area: 'Kukatpally', confidence: 0.95 },
    hazardType: 'Flood Risk',
    hazard_type: 'Flood Risk',
    severity: 'High',
    weatherClaim: { parameter: 'Waterlogging & Inflow', value: '45 mm in 45 minutes', timeframe: 'Morning' },
    timestamp: '09:40 AM IST',
    retrieved_at: '09:46 AM IST',
    verificationStatus: 'PARTIALLY SUPPORTED',
    verification_status: 'PARTIALLY SUPPORTED',
    verification_reason: 'GHMC telemetry shows 38mm localized rain. DRF deployment confirmed for traffic clearance.',
    evidence: 'GHMC Telemetry + DRF Deployment Log',
    source_type: 'NEWS',
    isSimulated: true,
    engagement: { likes: 1450, shares: 380, views: 24000, comments: 92 },
    sourceScoring: {
      sourceType: 'Television News Desk',
      timestamp: '09:40 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },

  // ========================================================
  // 6. CHENNAI (Velachery, T Nagar, Anna Nagar, Adyar, etc.)
  // ========================================================
  {
    id: 'SR-CHN-001',
    cityId: 'chennai',
    cityName: 'Chennai',
    areaId: 'velachery',
    areaName: 'Velachery',
    city_id: 'chennai',
    area_id: 'velachery',
    platform: 'YouTube',
    post_id: 'yt-chn-velachery-01',
    account_name: 'Tamil Nadu Weatherman Updates',
    account_handle: '@TNWeathermanFanDesk',
    account_type: 'citizen_observer',
    content: 'Velachery & Tambaram Rain Bands: Cloudburst-like intensity over southern suburbs. Real-time radar analysis and ground reports.',
    url: 'https://youtube.com/watch?v=tnRainVelachery',
    detected_location: { city: 'Chennai', area: 'Velachery', confidence: 0.94 },
    hazardType: 'Heavy Rain',
    hazard_type: 'Heavy Rain',
    severity: 'High',
    weatherClaim: { parameter: 'Rainfall', value: '78 mm 24h accumulation', timeframe: 'Morning' },
    timestamp: '09:15 AM IST',
    retrieved_at: '09:20 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Meenambakkam IMD radar corroborates 78mm intense convective core over Velachery basin.',
    evidence: 'Meenambakkam IMD Radar Echo (52 dBZ)',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 3100, shares: 890, views: 33000, comments: 195 },
    sourceScoring: {
      sourceType: 'Meteorological Community Video',
      timestamp: '09:15 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-CHN-002',
    cityId: 'chennai',
    cityName: 'Chennai',
    areaId: 't-nagar',
    areaName: 'T Nagar',
    city_id: 'chennai',
    area_id: 't-nagar',
    platform: 'X / Twitter',
    post_id: 'x-chn-tnagar-02',
    account_name: 'Greater Chennai Corp Disaster Wing',
    account_handle: '@chennaicorp',
    account_type: 'verified_official',
    content: 'Advisory: Moderate spells in T Nagar shopping districts. Motor pumps deployed at Bazullah Road. Water draining swiftly.',
    url: 'https://twitter.com/chennaicorp/status/1968202',
    detected_location: { city: 'Chennai', area: 'T Nagar', confidence: 0.98 },
    hazardType: 'Heavy Rain',
    hazard_type: 'Heavy Rain',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Precipitation & Drainage', value: '25 mm spell', timeframe: 'Morning' },
    timestamp: '09:35 AM IST',
    retrieved_at: '09:40 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'GCC sensor at Panagal Park logged 24.8mm rain. Drainage pumps operational.',
    evidence: 'Municipal Telemetry Sensor',
    source_type: 'OFFICIAL',
    isSimulated: true,
    engagement: { likes: 1120, shares: 340, comments: 48 },
    sourceScoring: {
      sourceType: 'Municipal Corporation',
      timestamp: '09:35 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },

  // ========================================================
  // 7. KOLKATA (Howrah, Salt Lake, New Town, Ballygunge, etc.)
  // ========================================================
  {
    id: 'SR-KOL-001',
    cityId: 'kolkata',
    cityName: 'Kolkata',
    areaId: 'salt-lake',
    areaName: 'Salt Lake',
    city_id: 'kolkata',
    area_id: 'salt-lake',
    platform: 'X / Twitter',
    post_id: 'x-kol-saltlake-01',
    account_name: 'Kolkata Weather Beat',
    account_handle: '@CalcuttaWeather',
    account_type: 'citizen_observer',
    content: 'Thunderstorm with squall winds (45 km/h) sweeping across Salt Lake Sector V and New Town. Dark skies and sudden drop in temperature.',
    url: 'https://twitter.com/CalcuttaWeather/status/1978201',
    detected_location: { city: 'Kolkata', area: 'Salt Lake', confidence: 0.96 },
    hazardType: 'Thunderstorm',
    hazard_type: 'Thunderstorm',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Squall / Norwester', value: '45 km/h winds + 30mm rain', timeframe: 'Current' },
    timestamp: '10:12 AM IST',
    retrieved_at: '10:18 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Alipore IMD Doppler radar detects Kalbaishakhi (Norwester) line squall advancing southeast over Salt Lake.',
    evidence: 'Alipore Doppler Weather Radar (DWR Kolkata)',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 640, shares: 195, comments: 52 },
    sourceScoring: {
      sourceType: 'Weather Observer',
      timestamp: '10:12 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-KOL-002',
    cityId: 'kolkata',
    cityName: 'Kolkata',
    areaId: 'howrah',
    areaName: 'Howrah',
    city_id: 'kolkata',
    area_id: 'howrah',
    platform: 'Facebook',
    post_id: 'fb-kol-howrah-02',
    account_name: 'Howrah Traffic & Weather Alert',
    account_handle: '@HowrahAlertDesk',
    account_type: 'news_agency',
    content: 'High water levels in Hooghly River combined with tidal bore. Ferry services between Howrah and Bagbazar temporarily halted.',
    url: 'https://facebook.com/howrahalert/posts/99120',
    detected_location: { city: 'Kolkata', area: 'Howrah', confidence: 0.95 },
    hazardType: 'Flood Risk',
    hazard_type: 'Flood Risk',
    severity: 'High',
    weatherClaim: { parameter: 'River Level & Tide Bore', value: 'High tidal surge', timeframe: 'Morning' },
    timestamp: '09:25 AM IST',
    retrieved_at: '09:30 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Syama Prasad Mookerjee Port trust tide gauge recorded tidal surge surpassing the 5.1m safety mark.',
    evidence: 'Port Trust River Tide Gauge',
    source_type: 'NEWS',
    isSimulated: true,
    engagement: { likes: 1190, shares: 410, comments: 84 },
    sourceScoring: {
      sourceType: 'Local News Wire',
      timestamp: '09:25 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },

  // ========================================================
  // 8. AHMEDABAD (Satellite, Navrangpura, Bopal, Maninagar, etc.)
  // ========================================================
  {
    id: 'SR-AMD-001',
    cityId: 'ahmedabad',
    cityName: 'Ahmedabad',
    areaId: 'satellite',
    areaName: 'Satellite',
    city_id: 'ahmedabad',
    area_id: 'satellite',
    platform: 'X / Twitter',
    post_id: 'x-amd-satellite-01',
    account_name: 'Amdavad Weather Watch',
    account_handle: '@AmdavadWeather',
    account_type: 'citizen_observer',
    content: 'Extreme heat conditions in Satellite and SG Highway. Thermometer at office balcony reads 44.5°C in direct afternoon sun!',
    url: 'https://twitter.com/AmdavadWeather/status/1988201',
    detected_location: { city: 'Ahmedabad', area: 'Satellite', confidence: 0.95 },
    hazardType: 'Heat Risk',
    hazard_type: 'Heat Risk',
    severity: 'High',
    weatherClaim: { parameter: 'Heat Index & Temp', value: '44.5°C claimed (IMD AWS 42.1°C)', timeframe: 'Afternoon' },
    timestamp: '01:15 PM IST',
    retrieved_at: '01:22 PM IST',
    verificationStatus: 'PARTIALLY SUPPORTED',
    verification_status: 'PARTIALLY SUPPORTED',
    verification_reason: 'Severe thermal conditions verified; official shaded screen AWS recorded 42.1°C, while unshaded urban asphalt microclimate reached 44°C.',
    evidence: 'Ahmedabad IMD AWS (42.1°C) vs Citizen Sensor',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 490, shares: 130, comments: 38 },
    sourceScoring: {
      sourceType: 'Citizen Weather Observer',
      timestamp: '01:15 PM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-AMD-002',
    cityId: 'ahmedabad',
    cityName: 'Ahmedabad',
    areaId: 'navrangpura',
    areaName: 'Navrangpura',
    city_id: 'ahmedabad',
    area_id: 'navrangpura',
    platform: 'Instagram',
    post_id: 'ig-amd-nav-02',
    account_name: 'AMC Health Cell Advisory',
    account_handle: '@amc_health_gujarat',
    account_type: 'verified_official',
    content: 'ORANGE HEAT ALERT: Peak temperatures expected to remain 42-43°C across Ahmedabad. Drinking water kiosks operational near Navrangpura & Law Garden.',
    url: 'https://instagram.com/p/amcheatalert',
    detected_location: { city: 'Ahmedabad', area: 'Navrangpura', confidence: 0.98 },
    hazardType: 'Heat Risk',
    hazard_type: 'Heat Risk',
    severity: 'High',
    weatherClaim: { parameter: 'Heat Wave Threshold', value: 'Orange Alert (42-43°C)', timeframe: 'All Day' },
    timestamp: '09:00 AM IST',
    retrieved_at: '09:05 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Joint Heat Action Plan (HAP) trigger officially declared by IMD and AMC Health Dept.',
    evidence: 'Ahmedabad Municipal Corporation Official Action Plan',
    source_type: 'OFFICIAL',
    isSimulated: true,
    engagement: { likes: 2100, shares: 760, comments: 64 },
    sourceScoring: {
      sourceType: 'Municipal Health Authority',
      timestamp: '09:00 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },

  // ========================================================
  // 9. JAIPUR (Malviya Nagar, Vaishali Nagar, Mansarovar, C-Scheme, etc.)
  // ========================================================
  {
    id: 'SR-JAI-001',
    cityId: 'jaipur',
    cityName: 'Jaipur',
    areaId: 'malviya-nagar',
    areaName: 'Malviya Nagar',
    city_id: 'jaipur',
    area_id: 'malviya-nagar',
    platform: 'X / Twitter',
    post_id: 'x-jai-malviya-01',
    account_name: 'Pink City Weather Updates',
    account_handle: '@JaipurWeatherClub',
    account_type: 'citizen_observer',
    content: 'Dry, scorching loo winds gusting through Malviya Nagar and Jawahar Circle. Thermal gun reads 43°C on road surface.',
    url: 'https://twitter.com/JaipurWeatherClub/status/1998201',
    detected_location: { city: 'Jaipur', area: 'Malviya Nagar', confidence: 0.96 },
    hazardType: 'Heat Risk',
    hazard_type: 'Heat Risk',
    severity: 'High',
    weatherClaim: { parameter: 'Heat & Loo Winds', value: 'Hot dry loo winds (35 km/h)', timeframe: 'Midday' },
    timestamp: '11:30 AM IST',
    retrieved_at: '11:35 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Jaipur Sanganer AWS station confirms westerly dry continental winds at 34 km/h with relative humidity dropped to 18%.',
    evidence: 'Sanganer Airport IMD Telemetry',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 510, shares: 140, comments: 39 },
    sourceScoring: {
      sourceType: 'Social Media Observer',
      timestamp: '11:30 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-JAI-002',
    cityId: 'jaipur',
    cityName: 'Jaipur',
    areaId: 'c-scheme',
    areaName: 'C Scheme',
    city_id: 'jaipur',
    area_id: 'c-scheme',
    platform: 'YouTube',
    post_id: 'yt-jai-cscheme-02',
    account_name: 'Rajasthan News Express',
    account_handle: '@RajasthanNews24',
    account_type: 'news_agency',
    content: 'Pre-monsoon dust storm and thunderstorm alert for Jaipur district. Strong gusts expected by late afternoon in C-Scheme & Amer.',
    url: 'https://youtube.com/watch?v=jaipurStormAlert',
    detected_location: { city: 'Jaipur', area: 'C Scheme', confidence: 0.94 },
    hazardType: 'Strong Wind',
    hazard_type: 'Strong Wind',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Dust Storm Gusts', value: '45-55 km/h gusts', timeframe: 'Late afternoon' },
    timestamp: '10:45 AM IST',
    retrieved_at: '10:50 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Jaipur Meteorological Centre nowcast radar tracks convective dust storm cell moving from Ajmer direction.',
    evidence: 'IMD Jaipur Doppler Radar Nowcast',
    source_type: 'NEWS',
    isSimulated: true,
    engagement: { likes: 1340, shares: 410, views: 19800, comments: 88 },
    sourceScoring: {
      sourceType: 'Regional News Agency',
      timestamp: '10:45 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },

  // ========================================================
  // 10. LUCKNOW (Gomti Nagar, Hazratganj, Aliganj, Indira Nagar, etc.)
  // ========================================================
  {
    id: 'SR-LKO-001',
    cityId: 'lucknow',
    cityName: 'Lucknow',
    areaId: 'gomti-nagar',
    areaName: 'Gomti Nagar',
    city_id: 'lucknow',
    area_id: 'gomti-nagar',
    platform: 'X / Twitter',
    post_id: 'x-lko-gomti-01',
    account_name: 'Lucknow City Buzz',
    account_handle: '@LucknowWeatherReport',
    account_type: 'citizen_observer',
    content: 'Sudden intense thunder and lightning over Gomti Nagar extension and Shaheed Path. Heavy localized rain spell.',
    url: 'https://twitter.com/LucknowWeatherReport/status/2008201',
    detected_location: { city: 'Lucknow', area: 'Gomti Nagar', confidence: 0.97 },
    hazardType: 'Thunderstorm',
    hazard_type: 'Thunderstorm',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Thunderstorm & Rain', value: '35 mm rain + lightning', timeframe: 'Morning' },
    timestamp: '09:40 AM IST',
    retrieved_at: '09:45 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Amausi Airport IMD Doppler radar detects localized thunderstorm cell with cloud top height 11km.',
    evidence: 'Amausi Airport Doppler Radar & Lightning Network',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 430, shares: 125, comments: 34 },
    sourceScoring: {
      sourceType: 'Citizen Observer',
      timestamp: '09:40 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-LKO-002',
    cityId: 'lucknow',
    cityName: 'Lucknow',
    areaId: 'hazratganj',
    areaName: 'Hazratganj',
    city_id: 'lucknow',
    area_id: 'hazratganj',
    platform: 'Facebook',
    post_id: 'fb-lko-hazrat-02',
    account_name: 'UP Disaster Relief Community',
    account_handle: '@UPDisasterUpdates',
    account_type: 'news_agency',
    content: 'Lightning safety alert issued for Lucknow urban district. Multiple lightning strikes registered across central corridors.',
    url: 'https://facebook.com/updisaster/posts/112901',
    detected_location: { city: 'Lucknow', area: 'Hazratganj', confidence: 0.95 },
    hazardType: 'Lightning',
    hazard_type: 'Lightning',
    severity: 'High',
    weatherClaim: { parameter: 'Lightning Activity', value: 'High strike frequency', timeframe: 'Current' },
    timestamp: '09:55 AM IST',
    retrieved_at: '10:00 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Damini lightning app and IITM ground strike detection confirm 24 strikes within 15km radius of Hazratganj.',
    evidence: 'IITM Damini Lightning Detection Array',
    source_type: 'NEWS',
    isSimulated: true,
    engagement: { likes: 890, shares: 340, comments: 55 },
    sourceScoring: {
      sourceType: 'News Agency',
      timestamp: '09:55 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },

  // ========================================================
  // 11. NAGPUR (Dharampeth, Sadar, Manish Nagar, Wardha Road, etc.)
  // ========================================================
  {
    id: 'SR-NGP-001',
    cityId: 'nagpur',
    cityName: 'Nagpur',
    areaId: 'dharampeth',
    areaName: 'Dharampeth',
    city_id: 'nagpur',
    area_id: 'dharampeth',
    platform: 'X / Twitter',
    post_id: 'x-ngp-dharampeth-01',
    account_name: 'Vidarbha Weather Bulletin',
    account_handle: '@VidarbhaMausam',
    account_type: 'citizen_observer',
    content: 'Heatwave warning in Nagpur: Dharampeth street thermometer reads 43.8°C at 12:30 PM. Hot westerly gusts blowing.',
    url: 'https://twitter.com/VidarbhaMausam/status/2018201',
    detected_location: { city: 'Nagpur', area: 'Dharampeth', confidence: 0.96 },
    hazardType: 'Heat Risk',
    hazard_type: 'Heat Risk',
    severity: 'High',
    weatherClaim: { parameter: 'Peak Temperature', value: '43.8°C heatwave', timeframe: 'Midday' },
    timestamp: '12:35 PM IST',
    retrieved_at: '12:40 PM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Regional Meteorological Centre (RMC) Nagpur observatory logs 43.4°C maximum temperature, exceeding normal by 4.2°C.',
    evidence: 'RMC Nagpur Observatory Stevenson Screen AWS',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 580, shares: 160, comments: 46 },
    sourceScoring: {
      sourceType: 'Regional Observer',
      timestamp: '12:35 PM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-NGP-002',
    cityId: 'nagpur',
    cityName: 'Nagpur',
    areaId: 'wardha-road',
    areaName: 'Wardha Road',
    city_id: 'nagpur',
    area_id: 'wardha-road',
    platform: 'YouTube',
    post_id: 'yt-ngp-wardha-02',
    account_name: 'Nagpur News 360',
    account_handle: '@NagpurNews360',
    account_type: 'news_agency',
    content: 'Evening thundershowers bring relief to Wardha Road and MIHAN after scorching heatwave day. Hailstorm reported in isolated pockets.',
    url: 'https://youtube.com/watch?v=nagpurRainRelief',
    detected_location: { city: 'Nagpur', area: 'Wardha Road', confidence: 0.94 },
    hazardType: 'Thunderstorm',
    hazard_type: 'Thunderstorm',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Convective Rain & Hail', value: '25 mm rain + small hail', timeframe: 'Evening' },
    timestamp: '05:15 PM IST',
    retrieved_at: '05:22 PM IST',
    verificationStatus: 'PARTIALLY SUPPORTED',
    verification_status: 'PARTIALLY SUPPORTED',
    verification_reason: 'Radar shows moderate convective cell; rain accumulation of 18mm recorded, isolated hail not officially verified by weather post.',
    evidence: 'RMC Nagpur Doppler Radar (28 dBZ)',
    source_type: 'NEWS',
    isSimulated: true,
    engagement: { likes: 1220, shares: 310, views: 17400, comments: 72 },
    sourceScoring: {
      sourceType: 'Regional News Channel',
      timestamp: '05:15 PM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },

  // ========================================================
  // 12. NASHIK (Gangapur Road, College Road, Panchavati, Indira Nagar, etc.)
  // ========================================================
  {
    id: 'SR-NSK-001',
    cityId: 'nashik',
    cityName: 'Nashik',
    areaId: 'gangapur-road',
    areaName: 'Gangapur Road',
    city_id: 'nashik',
    area_id: 'gangapur-road',
    platform: 'X / Twitter',
    post_id: 'x-nsk-gangapur-01',
    account_name: 'Nashik Weather Alert',
    account_handle: '@NashikWeatherWatch',
    account_type: 'citizen_observer',
    content: 'Heavy rains in Gangapur catchment area. Gangapur Dam water storage reaching 82% capacity. Water discharge into Godavari likely by evening.',
    url: 'https://twitter.com/NashikWeatherWatch/status/2028201',
    detected_location: { city: 'Nashik', area: 'Gangapur Road', confidence: 0.97 },
    hazardType: 'Heavy Rain',
    hazard_type: 'Heavy Rain',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Catchment Rainfall', value: '55 mm 24h catchment rain', timeframe: 'Current' },
    timestamp: '09:20 AM IST',
    retrieved_at: '09:25 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Maharashtra Water Resources Department dam bulletin logs 54.2mm precipitation in Gangapur catchment.',
    evidence: 'Water Resources Dept Dam Telemetry',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 490, shares: 155, comments: 38 },
    sourceScoring: {
      sourceType: 'Citizen Observer',
      timestamp: '09:20 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-NSK-002',
    cityId: 'nashik',
    cityName: 'Nashik',
    areaId: 'panchavati',
    areaName: 'Panchavati',
    city_id: 'nashik',
    area_id: 'panchavati',
    platform: 'Instagram',
    post_id: 'ig-nsk-panch-02',
    account_name: 'Nashik Citizen Pulse',
    account_handle: '@nashikpulse',
    account_type: 'news_agency',
    content: 'Godavari river water level rises near Ramkund in Panchavati. Small temples partially submerged under river current.',
    url: 'https://instagram.com/p/nashikramkund',
    detected_location: { city: 'Nashik', area: 'Panchavati', confidence: 0.95 },
    hazardType: 'Flood Risk',
    hazard_type: 'Flood Risk',
    severity: 'High',
    weatherClaim: { parameter: 'River Inundation', value: 'Ramkund water level rise', timeframe: 'Morning' },
    timestamp: '10:05 AM IST',
    retrieved_at: '10:10 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Nashik Municipal Corporation disaster cell verifies water level touching initial warning mark on Godavari ghats.',
    evidence: 'NMC River Level Gauge & Visual Inspection',
    source_type: 'NEWS',
    isSimulated: true,
    engagement: { likes: 1680, shares: 480, comments: 94 },
    sourceScoring: {
      sourceType: 'Local News Wire',
      timestamp: '10:05 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },

  // ========================================================
  // 13. BHOPAL (MP Nagar, Kolar, Arera Colony, Shahpura, etc.)
  // ========================================================
  {
    id: 'SR-BHO-001',
    cityId: 'bhopal',
    cityName: 'Bhopal',
    areaId: 'mp-nagar',
    areaName: 'MP Nagar',
    city_id: 'bhopal',
    area_id: 'mp-nagar',
    platform: 'X / Twitter',
    post_id: 'x-bho-mpnagar-01',
    account_name: 'Bhopal Weather Eye',
    account_handle: '@BhopalMausam',
    account_type: 'citizen_observer',
    content: 'Thunderstorm squall with hail reported in MP Nagar Zone 1 and New Market. Wind gusts knocked down tree branches near board office square.',
    url: 'https://twitter.com/BhopalMausam/status/2038201',
    detected_location: { city: 'Bhopal', area: 'MP Nagar', confidence: 0.96 },
    hazardType: 'Thunderstorm',
    hazard_type: 'Thunderstorm',
    severity: 'High',
    weatherClaim: { parameter: 'Squall & Hail', value: '50 km/h wind gusts + hail', timeframe: 'Past 30 mins' },
    timestamp: '03:40 PM IST',
    retrieved_at: '03:46 PM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'IMD Bhopal Bairagarh radar records convective squall with 50 km/h wind peak and radar reflectivity 48 dBZ.',
    evidence: 'IMD Bhopal Doppler Weather Radar',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 530, shares: 170, comments: 41 },
    sourceScoring: {
      sourceType: 'Citizen Weather Observer',
      timestamp: '03:40 PM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-BHO-002',
    cityId: 'bhopal',
    cityName: 'Bhopal',
    areaId: 'kolar-road',
    areaName: 'Kolar Road',
    city_id: 'bhopal',
    area_id: 'kolar-road',
    platform: 'Facebook',
    post_id: 'fb-bho-kolar-02',
    account_name: 'Bhopal Disaster Management Group',
    account_handle: '@BhopalDisasterUpdates',
    account_type: 'verified_official',
    content: 'Advisory: Lower Lake and Kaliasot dam sluice gates being monitored. Water accumulation reported on low-lying stretches of Kolar road.',
    url: 'https://facebook.com/bhopaldisaster/posts/104910',
    detected_location: { city: 'Bhopal', area: 'Kolar Road', confidence: 0.97 },
    hazardType: 'Heavy Rain',
    hazard_type: 'Heavy Rain',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Dam Levels & Inundation', value: '40 mm rain in southern suburbs', timeframe: 'Morning' },
    timestamp: '10:30 AM IST',
    retrieved_at: '10:35 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Kaliasot dam automated level sensors indicate 88% full capacity; 41mm rain recorded at Kolar weather station.',
    evidence: 'Kaliasot Dam Telemetry Sensor',
    source_type: 'OFFICIAL',
    isSimulated: true,
    engagement: { likes: 980, shares: 320, comments: 50 },
    sourceScoring: {
      sourceType: 'Municipal Disaster Authority',
      timestamp: '10:30 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },

  // ========================================================
  // 14. CHANDIGARH (Sector 17, Sector 22, Sector 34, Manimajra, etc.)
  // ========================================================
  {
    id: 'SR-CHD-001',
    cityId: 'chandigarh',
    cityName: 'Chandigarh',
    areaId: 'sector-17',
    areaName: 'Sector 17',
    city_id: 'chandigarh',
    area_id: 'sector-17',
    platform: 'X / Twitter',
    post_id: 'x-chd-sec17-01',
    account_name: 'Chandigarh Weather Live',
    account_handle: '@CityBeautifulWeather',
    account_type: 'citizen_observer',
    content: 'Thunderstorm roll over Sector 17 Plaza and Sukhna Lake. Cool breeze blowing at 38 km/h following heavy pre-monsoon showers.',
    url: 'https://twitter.com/CityBeautifulWeather/status/2048201',
    detected_location: { city: 'Chandigarh', area: 'Sector 17', confidence: 0.97 },
    hazardType: 'Thunderstorm',
    hazard_type: 'Thunderstorm',
    severity: 'Moderate',
    weatherClaim: { parameter: 'Thunderstorm & Wind', value: '38 km/h wind gusts + 32 mm rain', timeframe: 'Current' },
    timestamp: '10:15 AM IST',
    retrieved_at: '10:20 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Chandigarh IMD Observatory Sector 39 reports 31.8mm rainfall accumulation with 40 km/h surface wind gusts.',
    evidence: 'IMD Chandigarh Observatory Sector 39 Telemetry',
    source_type: 'SOCIAL',
    isSimulated: true,
    engagement: { likes: 720, shares: 210, comments: 49 },
    sourceScoring: {
      sourceType: 'City Weather Observer',
      timestamp: '10:15 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  },
  {
    id: 'SR-CHD-002',
    cityId: 'chandigarh',
    cityName: 'Chandigarh',
    areaId: 'manimajra',
    areaName: 'Manimajra',
    city_id: 'chandigarh',
    area_id: 'manimajra',
    platform: 'YouTube',
    post_id: 'yt-chd-mani-02',
    account_name: 'Tricity News Network',
    account_handle: '@TricityNewsToday',
    account_type: 'news_agency',
    content: 'Sukhna Choe water level rises rapidly near Manimajra causeway. Traffic advised to use alternative railway underpass.',
    url: 'https://youtube.com/watch?v=sukhnaChoeOverflow',
    detected_location: { city: 'Chandigarh', area: 'Manimajra', confidence: 0.95 },
    hazardType: 'Flood Risk',
    hazard_type: 'Flood Risk',
    severity: 'High',
    weatherClaim: { parameter: 'Sukhna Choe Water Inundation', value: 'Choe overflowing causeway', timeframe: 'Morning' },
    timestamp: '09:50 AM IST',
    retrieved_at: '09:55 AM IST',
    verificationStatus: 'SUPPORTED',
    verification_status: 'SUPPORTED',
    verification_reason: 'Chandigarh traffic police dispatch and Sukhna water control room confirm floodgate opening.',
    evidence: 'Sukhna Regulator Telemetry + Traffic Police CCTV',
    source_type: 'NEWS',
    isSimulated: true,
    engagement: { likes: 1420, shares: 410, views: 22000, comments: 85 },
    sourceScoring: {
      sourceType: 'Regional News Agency',
      timestamp: '09:50 AM',
      locationMatch: 'Matched',
      evidenceAvailable: 'Yes',
      crossSourceAgreement: 'High'
    }
  }
];

/**
 * Generate simulated fallback reports for any newly registered city or locality
 * to guarantee that MausamSetu scales infinitely to any Indian city.
 */
function generateContextualReportsForCity(cityId: string, areaId?: string): SocialReport[] {
  const city = getCityById(cityId);
  const area = getAreaById(city, areaId);
  const platforms: SocialPlatform[] = ['X / Twitter', 'Instagram', 'Facebook', 'YouTube'];

  const templates = [
    {
      platform: 'X / Twitter',
      accountName: `${city.name} Weather Observer`,
      handle: `@${city.id}_weather_watch`,
      hazard: 'Heavy Rain',
      param: 'Rainfall',
      val: '35-45 mm',
      text: `Steady rain showers intensifying over ${area.name} and surrounding localities. Road traffic slow on arterial roads.`,
      status: 'SUPPORTED' as VerificationStatus,
      reason: `Automated weather station gauge in ${city.name} confirms steady precipitation accumulation.`,
      evidence: `AWS Gauge (${area.name}) + Radar Echo`,
      sourceType: 'SOCIAL' as SocialSourceType
    },
    {
      platform: 'Instagram',
      accountName: `${city.name} City Pulse`,
      handle: `@${city.id}pulse_official`,
      hazard: 'Thunderstorm',
      param: 'Wind & Thunder',
      val: '42 km/h gusts',
      text: `Sudden squall cloud line moving over ${area.name}. Loud thunder and gusty winds reported by local residents.`,
      status: 'PARTIALLY SUPPORTED' as VerificationStatus,
      reason: `Convective cloud formation detected on regional Doppler radar; wind gusts verified within moderate threshold.`,
      evidence: `Doppler Radar Composite + AWS Anemometer`,
      sourceType: 'NEWS' as SocialSourceType
    },
    {
      platform: 'X / Twitter',
      accountName: `${city.name} Municipal Disaster Cell`,
      handle: `@${city.id}_disaster_mgmt`,
      hazard: 'Flood Risk',
      param: 'Stormwater Flow',
      val: 'Localized water stagnation',
      text: `Municipal teams on standby in ${area.name} low-lying points. Stormwater drains cleared and active pumps deployed.`,
      status: 'SUPPORTED' as VerificationStatus,
      reason: `Municipal civic emergency bulletin and drainage sensor readings corroborate preventive response.`,
      evidence: `Municipal Telemetry & CCTV`,
      sourceType: 'OFFICIAL' as SocialSourceType
    },
    {
      platform: 'Facebook',
      accountName: `${area.name} Community Forum`,
      handle: `@${area.name.replace(/\s+/g, '')}Residents`,
      hazard: 'Strong Wind',
      param: 'Wind Speeds',
      val: 'Category 2 cyclone winds claimed',
      text: `Warning forward: Severe cyclone gale winds approaching ${area.name} within 1 hour! Extreme emergency alert!`,
      status: 'NOT VERIFIED' as VerificationStatus,
      reason: `No cyclone or severe storm warning issued by IMD for ${city.name}. Measured wind speed is light to moderate (18 km/h).`,
      evidence: `IMD Synoptic Charts refuting cyclone claim`,
      sourceType: 'USER_REPORT' as SocialSourceType
    }
  ];

  return templates.map((t, idx) => ({
    id: `SIM-${city.id}-${area.id}-${idx + 1}`,
    cityId: city.id,
    cityName: city.name,
    areaId: area.id,
    areaName: area.name,
    city_id: city.id,
    area_id: area.id,
    platform: t.platform,
    post_id: `sim-${city.id}-${idx + 1}`,
    account_name: t.accountName,
    account_handle: t.handle,
    account_type: t.sourceType === 'OFFICIAL' ? 'verified_official' : t.sourceType === 'NEWS' ? 'news_agency' : 'citizen_observer',
    content: t.text,
    url: `https://${t.platform.toLowerCase().replace(/[^a-z]/g, '')}.com/${t.handle.replace('@', '')}/status/100${idx}`,
    detected_location: {
      city: city.name,
      area: area.name,
      confidence: 0.95
    },
    hazardType: t.hazard,
    hazard_type: t.hazard,
    severity: t.status === 'SUPPORTED' ? 'Moderate' : 'High',
    weatherClaim: {
      parameter: t.param,
      value: t.val,
      timeframe: 'Current'
    },
    timestamp: `${10 - idx * 2}:15 AM IST`,
    retrieved_at: `${10 - idx * 2}:20 AM IST`,
    verificationStatus: t.status,
    verification_status: t.status,
    verification_reason: t.reason,
    evidence: t.evidence,
    source_type: t.sourceType,
    isSimulated: true,
    engagement: {
      likes: 120 + idx * 85,
      shares: 30 + idx * 22,
      comments: 10 + idx * 8
    },
    sourceScoring: {
      sourceType: t.sourceType === 'OFFICIAL' ? 'Official Agency' : t.sourceType === 'NEWS' ? 'News Media' : 'Social Observer',
      timestamp: `${10 - idx * 2}:15 AM`,
      locationMatch: 'Matched',
      evidenceAvailable: t.status === 'NOT VERIFIED' ? 'No' : 'Yes',
      crossSourceAgreement: t.status === 'SUPPORTED' ? 'High' : t.status === 'PARTIALLY SUPPORTED' ? 'Mixed' : 'Low'
    }
  }));
}

/**
 * Filter social reports strictly by cityId and areaId, platform, hazard, and verification status.
 * Architecture is 100% scalable: automatically serves all 14 Indian cities and any new cities.
 */
export function getSocialReports(options?: {
  cityId?: string;
  areaId?: string;
  platform?: string;
  sourceType?: string;
  hazard?: string;
  verificationStatus?: string;
  timeFilter?: string;
  search?: string;
}): SocialReport[] {
  const targetCityId = (options?.cityId || 'pune').toLowerCase();

  // Find reports explicitly authored for this city
  let cityReports = SOCIAL_REPORTS_DATABASE.filter(r => r.cityId.toLowerCase() === targetCityId || r.city_id?.toLowerCase() === targetCityId);

  // If fewer than 2 reports exist for this city, synthesize contextual calibrated reports
  if (cityReports.length < 3) {
    const fallbackReports = generateContextualReportsForCity(targetCityId, options?.areaId);
    cityReports = [...cityReports, ...fallbackReports];
  }

  let results = [...cityReports];

  // Area filter: strictly filter if specific area selected (and not 'all')
  if (options?.areaId && options.areaId !== 'all') {
    const targetAreaId = options.areaId.toLowerCase();
    const matchingAreaReports = results.filter(
      r => r.areaId?.toLowerCase() === targetAreaId || r.area_id?.toLowerCase() === targetAreaId
    );

    if (matchingAreaReports.length > 0) {
      // Prioritize area reports first, followed by city-wide reports
      const otherReports = results.filter(
        r => r.areaId?.toLowerCase() !== targetAreaId && r.area_id?.toLowerCase() !== targetAreaId
      );
      results = [...matchingAreaReports, ...otherReports];
    } else {
      // Generate calibrated reports specifically for this area
      const areaGenerated = generateContextualReportsForCity(targetCityId, targetAreaId);
      results = [...areaGenerated, ...results];
    }
  }

  // Platform filter
  if (options?.platform && options.platform !== 'All' && options.platform !== 'All Platforms') {
    const p = options.platform.toLowerCase();
    results = results.filter(r => r.platform.toLowerCase().includes(p) || (p.includes('twitter') && r.platform.toLowerCase().includes('twitter')));
  }

  // Source Type filter
  if (options?.sourceType && options.sourceType !== 'All' && options.sourceType !== 'All Sources') {
    results = results.filter(r => r.source_type.toLowerCase() === options.sourceType!.toLowerCase());
  }

  // Hazard filter
  if (options?.hazard && options.hazard !== 'All' && options.hazard !== 'All Hazards') {
    const h = options.hazard.toLowerCase();
    results = results.filter(r => {
      const reportHazard = (r.hazardType || r.hazard_type || '').toLowerCase();
      if (h === 'flood' || h === 'flood risk') return reportHazard.includes('flood');
      if (h === 'heat' || h === 'heat risk') return reportHazard.includes('heat');
      if (h === 'aqi' || h === 'poor air quality' || h === 'air quality') return reportHazard.includes('air') || reportHazard.includes('aqi') || reportHazard.includes('smog');
      return reportHazard.includes(h);
    });
  }

  // Verification status filter
  if (options?.verificationStatus && options.verificationStatus !== 'All' && options.verificationStatus !== 'All Statuses') {
    const s = options.verificationStatus.toUpperCase().replace(/\s+/g, '_');
    results = results.filter(r => {
      const reportStatus = (r.verificationStatus || r.verification_status || '').toUpperCase().replace(/\s+/g, '_');
      return reportStatus === s || r.verification_status === options.verificationStatus || r.verificationStatus === options.verificationStatus;
    });
  }

  // Text search
  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    results = results.filter(
      r =>
        r.content.toLowerCase().includes(q) ||
        r.account_name.toLowerCase().includes(q) ||
        r.account_handle.toLowerCase().includes(q) ||
        r.cityName.toLowerCase().includes(q) ||
        (r.areaName && r.areaName.toLowerCase().includes(q)) ||
        (r.hazardType && r.hazardType.toLowerCase().includes(q)) ||
        (r.evidence && r.evidence.toLowerCase().includes(q))
    );
  }

  // Time filter sort
  if (options?.timeFilter === 'Oldest') {
    results.reverse();
  } else if (options?.timeFilter === 'Most Engaged') {
    results.sort((a, b) => ((b.engagement?.likes || 0) + (b.engagement?.shares || 0)) - ((a.engagement?.likes || 0) + (a.engagement?.shares || 0)));
  }

  return results;
}

export function getSocialWeatherSummary(cityId?: string): SocialWeatherSummary {
  const targetCityId = (cityId || 'pune').toLowerCase();
  const filtered = getSocialReports({ cityId: targetCityId });

  const byPlatform = {
    xTwitter: filtered.filter(r => r.platform.includes('Twitter') || r.platform === 'X').length,
    facebook: filtered.filter(r => r.platform === 'Facebook').length,
    instagram: filtered.filter(r => r.platform === 'Instagram').length,
    youtube: filtered.filter(r => r.platform === 'YouTube').length
  };

  const byStatus = {
    supported: filtered.filter(r => r.verification_status === 'SUPPORTED' || r.verificationStatus === 'SUPPORTED').length,
    partiallySupported: filtered.filter(r => r.verification_status === 'PARTIALLY SUPPORTED' || r.verificationStatus === 'PARTIALLY SUPPORTED').length,
    notVerified: filtered.filter(r => r.verification_status === 'NOT VERIFIED' || r.verificationStatus === 'NOT VERIFIED').length,
    outdated: filtered.filter(r => r.verification_status === 'OUTDATED' || r.verificationStatus === 'OUTDATED').length,
    unableToConfirm: filtered.filter(r => r.verification_status === 'UNABLE TO CONFIRM' || r.verificationStatus === 'UNABLE TO CONFIRM').length
  };

  const recentTimeline = filtered.slice(0, 6).map(r => ({
    id: r.id,
    time: r.timestamp,
    platform: r.platform as SocialPlatform,
    city: r.cityName || r.detected_location.city,
    area: r.areaName || r.detected_location.area || r.cityName,
    hazard: r.hazardType || r.hazard_type,
    status: r.verificationStatus || r.verification_status
  }));

  return {
    totalReports: filtered.length,
    byPlatform,
    byStatus,
    recentTimeline
  };
}
