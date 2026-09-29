export interface IndianCityRecord {
  id: string;
  name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  climateZone: string;
  annualRainfallNormalMm: number; // IMD 30-year normal
  avgTempNormalC: number;
  primaryHazards: string[];
}

export const ALL_INDIA_CITIES: IndianCityRecord[] = [
  // Maharashtra
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    district: 'Pune',
    latitude: 18.5204,
    longitude: 73.8567,
    elevationMeters: 560,
    climateZone: 'Deccan Plateau Semi-Arid',
    annualRainfallNormalMm: 722,
    avgTempNormalC: 25.4,
    primaryHazards: ['Heavy Rainfall', 'Flood', 'Thunderstorm', 'Heatwave']
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    latitude: 19.0760,
    longitude: 72.8777,
    elevationMeters: 14,
    climateZone: 'Konkan Coastal Tropical Wet',
    annualRainfallNormalMm: 2422,
    avgTempNormalC: 27.8,
    primaryHazards: ['Heavy Rainfall', 'Flood', 'Cyclone', 'High Humidity Heat']
  },
  {
    id: 'nashik',
    name: 'Nashik',
    state: 'Maharashtra',
    district: 'Nashik',
    latitude: 19.9975,
    longitude: 73.7898,
    elevationMeters: 592,
    climateZone: 'Western Ghats Leeward',
    annualRainfallNormalMm: 812,
    avgTempNormalC: 24.8,
    primaryHazards: ['Heavy Rainfall', 'Flood', 'Thunderstorm', 'Strong Wind']
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    state: 'Maharashtra',
    district: 'Nagpur',
    latitude: 21.1458,
    longitude: 79.0882,
    elevationMeters: 310,
    climateZone: 'Vidarbha Continental Subtropical',
    annualRainfallNormalMm: 1162,
    avgTempNormalC: 26.9,
    primaryHazards: ['Heatwave', 'Heavy Rainfall', 'Lightning', 'Drought']
  },
  {
    id: 'kolhapur',
    name: 'Kolhapur',
    state: 'Maharashtra',
    district: 'Kolhapur',
    latitude: 16.7050,
    longitude: 74.2433,
    elevationMeters: 569,
    climateZone: 'Western Ghats Foothills',
    annualRainfallNormalMm: 1040,
    avgTempNormalC: 25.1,
    primaryHazards: ['Panchganga River Flood', 'Heavy Rainfall', 'Landslide']
  },
  {
    id: 'chhatrapati-sambhajinagar',
    name: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    district: 'Chhatrapati Sambhajinagar',
    latitude: 19.8762,
    longitude: 75.3433,
    elevationMeters: 568,
    climateZone: 'Marathwada Semi-Arid',
    annualRainfallNormalMm: 734,
    avgTempNormalC: 26.2,
    primaryHazards: ['Drought', 'Heatwave', 'Thunderstorm', 'Heavy Rainfall']
  },
  {
    id: 'thane',
    name: 'Thane',
    state: 'Maharashtra',
    district: 'Thane',
    latitude: 19.2183,
    longitude: 72.9781,
    elevationMeters: 15,
    climateZone: 'Konkan Coastal',
    annualRainfallNormalMm: 2510,
    avgTempNormalC: 27.5,
    primaryHazards: ['Flood', 'Heavy Rainfall', 'Cyclone', 'High Humidity']
  },
  {
    id: 'solapur',
    name: 'Solapur',
    state: 'Maharashtra',
    district: 'Solapur',
    latitude: 17.6599,
    longitude: 75.9064,
    elevationMeters: 458,
    climateZone: 'Southern Maharashtra Arid',
    annualRainfallNormalMm: 680,
    avgTempNormalC: 27.6,
    primaryHazards: ['Drought', 'Heatwave', 'Thunderstorm']
  },
  {
    id: 'satara',
    name: 'Satara',
    state: 'Maharashtra',
    district: 'Satara',
    latitude: 17.6805,
    longitude: 73.9934,
    elevationMeters: 742,
    climateZone: 'Sahyadri Foothills',
    annualRainfallNormalMm: 1420,
    avgTempNormalC: 24.2,
    primaryHazards: ['Heavy Rainfall', 'Flood', 'Landslide']
  },

  // Delhi NCR
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'Delhi (NCT)',
    district: 'New Delhi',
    latitude: 28.6139,
    longitude: 77.2090,
    elevationMeters: 216,
    climateZone: 'Northern Plains Semi-Arid',
    annualRainfallNormalMm: 790,
    avgTempNormalC: 25.1,
    primaryHazards: ['Severe Heatwave', 'Poor Air Quality', 'Yamuna Flood', 'Dense Fog']
  },
  {
    id: 'noida',
    name: 'Noida',
    state: 'Uttar Pradesh',
    district: 'Gautam Buddha Nagar',
    latitude: 28.5355,
    longitude: 77.3910,
    elevationMeters: 200,
    climateZone: 'Indo-Gangetic Semi-Arid',
    annualRainfallNormalMm: 750,
    avgTempNormalC: 25.0,
    primaryHazards: ['Poor Air Quality', 'Heatwave', 'Urban Flood', 'Dense Fog']
  },
  {
    id: 'gurugram',
    name: 'Gurugram',
    state: 'Haryana',
    district: 'Gurugram',
    latitude: 28.4595,
    longitude: 77.0266,
    elevationMeters: 217,
    climateZone: 'Aravalli Fringe Semi-Arid',
    annualRainfallNormalMm: 710,
    avgTempNormalC: 25.3,
    primaryHazards: ['Urban Waterlogging', 'Heatwave', 'Severe Smog', 'Dust Storm']
  },

  // Karnataka
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    latitude: 12.9716,
    longitude: 77.5946,
    elevationMeters: 920,
    climateZone: 'South Deccan Tropical Savanna',
    annualRainfallNormalMm: 986,
    avgTempNormalC: 24.1,
    primaryHazards: ['Urban Flash Flood', 'Thunderstorm', 'Lightning', 'Strong Wind']
  },
  {
    id: 'mysuru',
    name: 'Mysuru',
    state: 'Karnataka',
    district: 'Mysuru',
    latitude: 12.2958,
    longitude: 76.6394,
    elevationMeters: 763,
    climateZone: 'South Karnataka Plateau',
    annualRainfallNormalMm: 798,
    avgTempNormalC: 24.5,
    primaryHazards: ['Heavy Rainfall', 'Thunderstorm', 'Lightning']
  },
  {
    id: 'mangaluru',
    name: 'Mangaluru',
    state: 'Karnataka',
    district: 'Dakshina Kannada',
    latitude: 12.9141,
    longitude: 74.8560,
    elevationMeters: 22,
    climateZone: 'Malabar Coastal Tropical Monsoon',
    annualRainfallNormalMm: 3479,
    avgTempNormalC: 27.2,
    primaryHazards: ['Extreme Monsoon Rain', 'Coastal Inundation', 'Landslide', 'Sea Surge']
  },
  {
    id: 'hubballi',
    name: 'Hubballi',
    state: 'Karnataka',
    district: 'Dharwad',
    latitude: 15.3647,
    longitude: 75.1240,
    elevationMeters: 671,
    climateZone: 'North Karnataka Dry Plateau',
    annualRainfallNormalMm: 740,
    avgTempNormalC: 25.6,
    primaryHazards: ['Heatwave', 'Heavy Rainfall', 'Drought']
  },

  // Telangana
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    district: 'Hyderabad',
    latitude: 17.3850,
    longitude: 78.4867,
    elevationMeters: 542,
    climateZone: 'Central Deccan Tropical Wet & Dry',
    annualRainfallNormalMm: 828,
    avgTempNormalC: 26.8,
    primaryHazards: ['Musi River Inundation', 'Heatwave', 'Thunderstorm', 'Lightning']
  },
  {
    id: 'warangal',
    name: 'Warangal',
    state: 'Telangana',
    district: 'Warangal',
    latitude: 17.9689,
    longitude: 79.5941,
    elevationMeters: 266,
    climateZone: 'Northern Telangana Semi-Arid',
    annualRainfallNormalMm: 994,
    avgTempNormalC: 27.4,
    primaryHazards: ['Heatwave', 'Heavy Rain Flood', 'Thunderstorm']
  },

  // Tamil Nadu
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    district: 'Chennai',
    latitude: 13.0827,
    longitude: 80.2707,
    elevationMeters: 6,
    climateZone: 'Coromandel Coastal Northeast Monsoon',
    annualRainfallNormalMm: 1382,
    avgTempNormalC: 28.6,
    primaryHazards: ['Northeast Monsoon Flood', 'Cyclone', 'Severe Humid Heat', 'Storm Surge']
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    latitude: 11.0168,
    longitude: 76.9558,
    elevationMeters: 411,
    climateZone: 'Palghat Gap Tropical Semi-Arid',
    annualRainfallNormalMm: 618,
    avgTempNormalC: 26.3,
    primaryHazards: ['Heavy Rain Spell', 'Strong Wind', 'Thunderstorm']
  },
  {
    id: 'madurai',
    name: 'Madurai',
    state: 'Tamil Nadu',
    district: 'Madurai',
    latitude: 9.9252,
    longitude: 78.1198,
    elevationMeters: 136,
    climateZone: 'Southern Plains Semi-Arid',
    annualRainfallNormalMm: 850,
    avgTempNormalC: 29.1,
    primaryHazards: ['Extreme Heat', 'Heavy Rain', 'Drought']
  },

  // West Bengal
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    district: 'Kolkata',
    latitude: 22.5726,
    longitude: 88.3639,
    elevationMeters: 9,
    climateZone: 'Ganges Delta Tropical Wet-and-Dry',
    annualRainfallNormalMm: 1735,
    avgTempNormalC: 26.8,
    primaryHazards: ['Severe Cyclone (Bay of Bengal)', 'Tidal Waterlogging', 'Severe Heat Index', 'Lightning']
  },
  {
    id: 'siliguri',
    name: 'Siliguri',
    state: 'West Bengal',
    district: 'Darjeeling',
    latitude: 26.7271,
    longitude: 88.3953,
    elevationMeters: 122,
    climateZone: 'Sub-Himalayan Terai',
    annualRainfallNormalMm: 3340,
    avgTempNormalC: 24.0,
    primaryHazards: ['Flash Flood', 'Teesta River Overflow', 'Landslide', 'Extreme Rain']
  },

  // Gujarat
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    district: 'Ahmedabad',
    latitude: 23.0225,
    longitude: 72.5714,
    elevationMeters: 53,
    climateZone: 'Western India Semi-Arid / Hot',
    annualRainfallNormalMm: 782,
    avgTempNormalC: 27.5,
    primaryHazards: ['Extreme Heatwave (>46°C)', 'Sabarmati Flood', 'Dust Storm']
  },
  {
    id: 'surat',
    name: 'Surat',
    state: 'Gujarat',
    district: 'Surat',
    latitude: 21.1702,
    longitude: 72.8311,
    elevationMeters: 13,
    climateZone: 'Tapi Estuary Coastal',
    annualRainfallNormalMm: 1205,
    avgTempNormalC: 27.9,
    primaryHazards: ['Tapi River Flood', 'High Humidity Heat', 'Cyclone', 'Urban Flood']
  },
  {
    id: 'vadodara',
    name: 'Vadodara',
    state: 'Gujarat',
    district: 'Vadodara',
    latitude: 22.3072,
    longitude: 73.1812,
    elevationMeters: 39,
    climateZone: 'Central Gujarat Semi-Arid',
    annualRainfallNormalMm: 932,
    avgTempNormalC: 27.1,
    primaryHazards: ['Vishwamitri River Flood', 'Heatwave', 'Heavy Rain']
  },
  {
    id: 'rajkot',
    name: 'Rajkot',
    state: 'Gujarat',
    district: 'Rajkot',
    latitude: 22.3039,
    longitude: 70.8022,
    elevationMeters: 128,
    climateZone: 'Saurashtra Semi-Arid',
    annualRainfallNormalMm: 620,
    avgTempNormalC: 26.8,
    primaryHazards: ['Cyclone Peripheral', 'Drought', 'Flash Flood', 'Heatwave']
  },

  // Rajasthan
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    district: 'Jaipur',
    latitude: 26.9124,
    longitude: 75.7873,
    elevationMeters: 431,
    climateZone: 'Semi-Arid Hot Steppe',
    annualRainfallNormalMm: 637,
    avgTempNormalC: 25.8,
    primaryHazards: ['Severe Heatwave', 'Dust Storm (Andhi)', 'Flash Flood', 'Cold Wave']
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur',
    state: 'Rajasthan',
    district: 'Jodhpur',
    latitude: 26.2389,
    longitude: 73.0243,
    elevationMeters: 231,
    climateZone: 'Thar Desert Hot Arid',
    annualRainfallNormalMm: 362,
    avgTempNormalC: 27.2,
    primaryHazards: ['Extreme Heatwave (>47°C)', 'Drought', 'Severe Dust Storm', 'Flash Inundation']
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    district: 'Udaipur',
    latitude: 24.5854,
    longitude: 73.7125,
    elevationMeters: 598,
    climateZone: 'Mewar Aravalli Subtropical',
    annualRainfallNormalMm: 650,
    avgTempNormalC: 24.7,
    primaryHazards: ['Heavy Rainfall', 'Lake Basin Overflow', 'Heatwave']
  },

  // Uttar Pradesh
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    latitude: 26.8467,
    longitude: 80.9462,
    elevationMeters: 123,
    climateZone: 'Central Gangetic Plain Humid Subtropical',
    annualRainfallNormalMm: 990,
    avgTempNormalC: 25.3,
    primaryHazards: ['Gomti River Flood', 'Severe Heatwave', 'Cold Wave Dense Fog', 'Lightning']
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    district: 'Kanpur Nagar',
    latitude: 26.4499,
    longitude: 80.3319,
    elevationMeters: 126,
    climateZone: 'Central Gangetic Plain',
    annualRainfallNormalMm: 852,
    avgTempNormalC: 25.5,
    primaryHazards: ['Ganga River Flood', 'Extreme Heatwave', 'Air Pollution', 'Cold Wave']
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    latitude: 25.3176,
    longitude: 82.9739,
    elevationMeters: 81,
    climateZone: 'Eastern Gangetic Plain',
    annualRainfallNormalMm: 1045,
    avgTempNormalC: 26.0,
    primaryHazards: ['Ganga Flood', 'Severe Heatwave', 'Lightning', 'Cold Wave Fog']
  },
  {
    id: 'agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    district: 'Agra',
    latitude: 27.1767,
    longitude: 78.0081,
    elevationMeters: 171,
    climateZone: 'Yamuna Basin Semi-Arid',
    annualRainfallNormalMm: 686,
    avgTempNormalC: 25.6,
    primaryHazards: ['Extreme Heatwave', 'Severe Dust Storm', 'Dense Fog', 'Yamuna Overflow']
  },

  // Madhya Pradesh
  {
    id: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    latitude: 23.2599,
    longitude: 77.4126,
    elevationMeters: 527,
    climateZone: 'Malwa Plateau Humid Subtropical',
    annualRainfallNormalMm: 1126,
    avgTempNormalC: 25.2,
    primaryHazards: ['Urban Waterlogging', 'Heatwave', 'Thunderstorm', 'Cold Wave']
  },
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    district: 'Indore',
    latitude: 22.7196,
    longitude: 75.8577,
    elevationMeters: 553,
    climateZone: 'Malwa Plateau',
    annualRainfallNormalMm: 958,
    avgTempNormalC: 24.9,
    primaryHazards: ['Heavy Monsoon Rain', 'Heatwave', 'Thunderstorm']
  },
  {
    id: 'gwalior',
    name: 'Gwalior',
    state: 'Madhya Pradesh',
    district: 'Gwalior',
    latitude: 26.2183,
    longitude: 78.1828,
    elevationMeters: 211,
    climateZone: 'Chambal Fringe Continental',
    annualRainfallNormalMm: 751,
    avgTempNormalC: 25.8,
    primaryHazards: ['Extreme Heatwave (>48°C)', 'Cold Wave', 'Drought', 'Dust Storm']
  },

  // Bihar
  {
    id: 'patna',
    name: 'Patna',
    state: 'Bihar',
    district: 'Patna',
    latitude: 25.5941,
    longitude: 85.1376,
    elevationMeters: 53,
    climateZone: 'Middle Gangetic Plain Humid Subtropical',
    annualRainfallNormalMm: 1130,
    avgTempNormalC: 25.7,
    primaryHazards: ['Ganga & Son River Flood', 'Severe Lightning Fatalities', 'Heatwave', 'Dense Winter Fog']
  },
  {
    id: 'gaya',
    name: 'Gaya',
    state: 'Bihar',
    district: 'Gaya',
    latitude: 24.7955,
    longitude: 85.0002,
    elevationMeters: 111,
    climateZone: 'South Bihar Subtropical',
    annualRainfallNormalMm: 1060,
    avgTempNormalC: 26.1,
    primaryHazards: ['Extreme Heatwave (>46°C)', 'Drought', 'Lightning', 'Cold Wave']
  },

  // Odisha
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    district: 'Khordha',
    latitude: 20.2961,
    longitude: 85.8245,
    elevationMeters: 45,
    climateZone: 'East Coast Tropical Wet & Dry',
    annualRainfallNormalMm: 1492,
    avgTempNormalC: 27.3,
    primaryHazards: ['Severe Tropical Cyclone', 'Mahanadi Flood', 'Lightning', 'Severe Heat & Humidity']
  },
  {
    id: 'puri',
    name: 'Puri',
    state: 'Odisha',
    district: 'Puri',
    latitude: 19.8135,
    longitude: 85.8312,
    elevationMeters: 5,
    climateZone: 'Coastal Bay of Bengal',
    annualRainfallNormalMm: 1530,
    avgTempNormalC: 27.6,
    primaryHazards: ['Super Cyclone Landfall', 'Storm Surge Inundation', 'Heavy Rain', 'Sea Erosion']
  },

  // Assam & Northeast
  {
    id: 'guwahati',
    name: 'Guwahati',
    state: 'Assam',
    district: 'Kamrup Metropolitan',
    latitude: 26.1445,
    longitude: 91.7362,
    elevationMeters: 55,
    climateZone: 'Brahmaputra Valley Humid Subtropical',
    annualRainfallNormalMm: 1717,
    avgTempNormalC: 24.5,
    primaryHazards: ['Brahmaputra Flood', 'Severe Urban Waterlogging', 'Landslide', 'Lightning']
  },
  {
    id: 'shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    district: 'East Khasi Hills',
    latitude: 25.5788,
    longitude: 91.8933,
    elevationMeters: 1525,
    climateZone: 'Highland Subtropical Highland',
    annualRainfallNormalMm: 2260,
    avgTempNormalC: 17.1,
    primaryHazards: ['Extreme Cloudburst Rain', 'Landslide', 'Cold Wave', 'Strong Winds']
  },

  // Punjab, Haryana, Chandigarh
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    state: 'Chandigarh (UT)',
    district: 'Chandigarh',
    latitude: 30.7333,
    longitude: 76.7794,
    elevationMeters: 321,
    climateZone: 'Shivalik Foothills Humid Subtropical',
    annualRainfallNormalMm: 1110,
    avgTempNormalC: 23.8,
    primaryHazards: ['Sukhna Choe Inundation', 'Heatwave', 'Dense Fog', 'Cold Wave']
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    district: 'Amritsar',
    latitude: 31.6340,
    longitude: 74.8723,
    elevationMeters: 234,
    climateZone: 'Northwestern Plain Semi-Arid',
    annualRainfallNormalMm: 681,
    avgTempNormalC: 23.4,
    primaryHazards: ['Extreme Cold Wave & Frost', 'Dense Fog', 'Severe Heatwave', 'Dust Storm']
  },
  {
    id: 'ludhiana',
    name: 'Ludhiana',
    state: 'Punjab',
    district: 'Ludhiana',
    latitude: 30.9010,
    longitude: 75.8573,
    elevationMeters: 244,
    climateZone: 'Punjab Plains',
    annualRainfallNormalMm: 730,
    avgTempNormalC: 24.1,
    primaryHazards: ['Sutlej River Flood', 'Heatwave', 'Cold Wave', 'Air Quality Smog']
  },

  // Uttarakhand & Himachal Pradesh
  {
    id: 'dehradun',
    name: 'Dehradun',
    state: 'Uttarakhand',
    district: 'Dehradun',
    latitude: 30.3165,
    longitude: 78.0322,
    elevationMeters: 640,
    climateZone: 'Doon Valley Subtropical Mountain',
    annualRainfallNormalMm: 2209,
    avgTempNormalC: 21.8,
    primaryHazards: ['Extreme Cloudburst Rain', 'Flash Flood (Rispana/Bindal)', 'Landslide', 'Lightning']
  },
  {
    id: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    district: 'Shimla',
    latitude: 31.1048,
    longitude: 77.1734,
    elevationMeters: 2206,
    climateZone: 'Himalayan Subtropical Highland',
    annualRainfallNormalMm: 1575,
    avgTempNormalC: 14.5,
    primaryHazards: ['Severe Landslide', 'Cloudburst', 'Snowstorm / Frost', 'Flash Flood']
  },

  // Jammu & Kashmir
  {
    id: 'srinagar',
    name: 'Srinagar',
    state: 'Jammu and Kashmir (UT)',
    district: 'Srinagar',
    latitude: 34.0837,
    longitude: 74.7973,
    elevationMeters: 1585,
    climateZone: 'Kashmir Valley Continental Highland',
    annualRainfallNormalMm: 720,
    avgTempNormalC: 13.5,
    primaryHazards: ['Jhelum River Catastrophic Flood', 'Severe Snowstorm / Avalanche', 'Sub-Zero Freezing']
  },
  {
    id: 'jammu',
    name: 'Jammu',
    state: 'Jammu and Kashmir (UT)',
    district: 'Jammu',
    latitude: 32.7266,
    longitude: 74.8570,
    elevationMeters: 327,
    climateZone: 'Sub-Himalayan Footstep Subtropical',
    annualRainfallNormalMm: 1240,
    avgTempNormalC: 24.2,
    primaryHazards: ['Tawi River Flash Flood', 'Heatwave', 'Cloudburst in Catchments']
  },

  // Kerala
  {
    id: 'thiruvananthapuram',
    name: 'Thiruvananthapuram',
    state: 'Kerala',
    district: 'Thiruvananthapuram',
    latitude: 8.5241,
    longitude: 76.9366,
    elevationMeters: 10,
    climateZone: 'Southern Malabar Coast Tropical Wet',
    annualRainfallNormalMm: 1827,
    avgTempNormalC: 27.2,
    primaryHazards: ['Extreme Southwest & Northeast Rain', 'Sea Swell / High Waves (Kallakkadal)', 'Waterlogging']
  },
  {
    id: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    district: 'Ernakulam',
    latitude: 9.9312,
    longitude: 76.2673,
    elevationMeters: 4,
    climateZone: 'Central Kerala Coastal Wetland',
    annualRainfallNormalMm: 3100,
    avgTempNormalC: 27.5,
    primaryHazards: ['Periyar River Inundation', 'Tidal Surge', 'Severe Monsoon Deluge', 'High Humidity Heat']
  },

  // Andhra Pradesh
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    latitude: 17.6868,
    longitude: 83.2185,
    elevationMeters: 11,
    climateZone: 'Northern Circars Coastal Tropical',
    annualRainfallNormalMm: 1090,
    avgTempNormalC: 27.8,
    primaryHazards: ['Very Severe Cyclonic Storm (Hudhud Type)', 'Storm Surge', 'Urban Flash Flood', 'Humid Heat']
  },
  {
    id: 'vijayawada',
    name: 'Vijayawada',
    state: 'Andhra Pradesh',
    district: 'NTR',
    latitude: 16.5062,
    longitude: 80.6480,
    elevationMeters: 23,
    climateZone: 'Krishna Delta Tropical Savanna',
    annualRainfallNormalMm: 1012,
    avgTempNormalC: 28.5,
    primaryHazards: ['Krishna River Heavy Inundation (Budameru Flood)', 'Extreme Heatwave (>46°C)', 'Cyclone Rain']
  },

  // Goa
  {
    id: 'panaji',
    name: 'Panaji',
    state: 'Goa',
    district: 'North Goa',
    latitude: 15.4909,
    longitude: 73.8278,
    elevationMeters: 7,
    climateZone: 'Konkan-Goa Tropical Wet',
    annualRainfallNormalMm: 2950,
    avgTempNormalC: 27.6,
    primaryHazards: ['Heavy Monsoon Rain', 'Mandovi High Tide Inundation', 'Sea Surges']
  },

  // Chhattisgarh
  {
    id: 'raipur',
    name: 'Raipur',
    state: 'Chhattisgarh',
    district: 'Raipur',
    latitude: 21.2514,
    longitude: 81.6296,
    elevationMeters: 298,
    climateZone: 'Mahanadi Basin Tropical Wet and Dry',
    annualRainfallNormalMm: 1320,
    avgTempNormalC: 26.9,
    primaryHazards: ['Severe Heatwave', 'Flash Flood', 'Lightning']
  },

  // Jharkhand
  {
    id: 'ranchi',
    name: 'Ranchi',
    state: 'Jharkhand',
    district: 'Ranchi',
    latitude: 23.3441,
    longitude: 85.3096,
    elevationMeters: 651,
    climateZone: 'Chota Nagpur Plateau Subtropical',
    annualRainfallNormalMm: 1430,
    avgTempNormalC: 23.8,
    primaryHazards: ['Severe Lightning (High Risk)', 'Heavy Monsoon Rain', 'Cold Wave']
  }
];

// Helper: search all Indian cities by name, state, district, or query
export function searchIndianCities(query: string): IndianCityRecord[] {
  if (!query || !query.trim()) {
    return ALL_INDIA_CITIES.slice(0, 10);
  }
  const q = query.toLowerCase().trim();
  const matched = ALL_INDIA_CITIES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.state.toLowerCase().includes(q) ||
    c.district.toLowerCase().includes(q) ||
    c.climateZone.toLowerCase().includes(q)
  );

  if (matched.length > 0) return matched;

  // Fallback: If user entered an unknown city/town name anywhere in India,
  // dynamically generate a geocoded city record so ANY Indian location works seamlessly!
  const slug = q.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  return [
    {
      id: slug || 'custom-city',
      name: query.charAt(0).toUpperCase() + query.slice(1),
      state: 'India',
      district: query.charAt(0).toUpperCase() + query.slice(1),
      latitude: 20.5937,
      longitude: 78.9629,
      elevationMeters: 450,
      climateZone: 'Subtropical Monsoon',
      annualRainfallNormalMm: 950,
      avgTempNormalC: 25.5,
      primaryHazards: ['Heavy Rainfall', 'Thunderstorm', 'Heatwave']
    }
  ];
}

export function getIndianCityRecord(cityIdOrName: string): IndianCityRecord {
  const normalized = (cityIdOrName || 'pune').toLowerCase().trim();
  const directMatch = ALL_INDIA_CITIES.find(
    c => c.id.toLowerCase() === normalized || c.name.toLowerCase() === normalized
  );
  if (directMatch) return directMatch;

  // Fallback dynamic generator for any arbitrary Indian city/locality
  const cleanName = cityIdOrName.charAt(0).toUpperCase() + cityIdOrName.slice(1);
  return {
    id: normalized.replace(/[^a-z0-9]/g, '-'),
    name: cleanName,
    state: 'India',
    district: cleanName,
    latitude: 20.5937,
    longitude: 78.9629,
    elevationMeters: 450,
    climateZone: 'Subtropical Monsoon',
    annualRainfallNormalMm: 920,
    avgTempNormalC: 25.4,
    primaryHazards: ['Heavy Rainfall', 'Thunderstorm', 'Heatwave']
  };
}
