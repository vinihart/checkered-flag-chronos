// Types for our racing leaderboard application

export interface LapTime {
  id: string;
  driverName: string;
  driverTag?: string; // Optional short tag/nickname
  trackId: string;
  carId: string;
  teamId?: string; // Optional team name (now manually entered)
  lapTime: string; // Format: "1:23.456"
  lapTimeMs: number; // For sorting and calculations
  date: string;
  status?: "improved" | "slower" | "best" | "neutral";
  positionChange?: number; // Positive for positions gained, negative for positions lost
  isFlagged?: boolean; // For anomaly detection
}

export interface Track {
  id: string;
  name: string;
  country: string;
  icon?: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  icon?: string;
}

export interface Team {
  id: string;
  name: string;
  icon?: string;
  color: string;
}

// Updated tracks list from Assetto Corsa Competizione
export const MOCK_TRACKS: Track[] = [
  { id: "monza", name: "Monza", country: "Italy", icon: "🇮🇹" },
  { id: "zolder", name: "Zolder", country: "Belgium", icon: "🇧🇪" },
  { id: "brands_hatch", name: "Brands Hatch", country: "United Kingdom", icon: "🇬🇧" },
  { id: "silverstone", name: "Silverstone", country: "United Kingdom", icon: "🇬🇧" },
  { id: "paul_ricard", name: "Paul Ricard", country: "France", icon: "🇫🇷" },
  { id: "misano", name: "Misano", country: "Italy", icon: "🇮🇹" },
  { id: "spa", name: "Spa-Francorchamps", country: "Belgium", icon: "🇧🇪" },
  { id: "nurburgring", name: "Nürburgring", country: "Germany", icon: "🇩🇪" },
  { id: "barcelona", name: "Barcelona", country: "Spain", icon: "🇪🇸" },
  { id: "hungaroring", name: "Hungaroring", country: "Hungary", icon: "🇭🇺" },
  { id: "zandvoort", name: "Zandvoort", country: "Netherlands", icon: "🇳🇱" },
  { id: "imola", name: "Imola", country: "Italy", icon: "🇮🇹" },
  { id: "suzuka", name: "Suzuka", country: "Japan", icon: "🇯🇵" },
  { id: "kyalami", name: "Kyalami", country: "South Africa", icon: "🇿🇦" },
  { id: "mount_panorama", name: "Mount Panorama", country: "Australia", icon: "🇦🇺" },
  { id: "laguna_seca", name: "Laguna Seca", country: "United States", icon: "🇺🇸" },
  { id: "oulton_park", name: "Oulton Park", country: "United Kingdom", icon: "🇬🇧" },
  { id: "donington", name: "Donington", country: "United Kingdom", icon: "🇬🇧" },
  { id: "snetterton", name: "Snetterton", country: "United Kingdom", icon: "🇬🇧" },
  { id: "cota", name: "Circuit of the Americas", country: "United States", icon: "🇺🇸" },
  { id: "indianapolis", name: "Indianapolis", country: "United States", icon: "🇺🇸" },
  { id: "watkins_glen", name: "Watkins Glen", country: "United States", icon: "🇺🇸" },
];

// Updated cars list from Assetto Corsa Competizione
export const MOCK_CARS: Car[] = [
  { id: "amr_v12_vantage_gt3", make: "Aston Martin", model: "V12 Vantage GT3", icon: "A" },
  { id: "amr_v8_vantage_gt3", make: "Aston Martin", model: "V8 Vantage GT3", icon: "A" },
  { id: "audi_r8_lms", make: "Audi", model: "R8 LMS", icon: "A" },
  { id: "audi_r8_lms_evo", make: "Audi", model: "R8 LMS Evo", icon: "A" },
  { id: "audi_r8_lms_evo_ii", make: "Audi", model: "R8 LMS Evo II", icon: "A" },
  { id: "bentley_continental_gt3_2016", make: "Bentley", model: "Continental GT3 2016", icon: "B" },
  { id: "bentley_continental_gt3_2018", make: "Bentley", model: "Continental GT3 2018", icon: "B" },
  { id: "bmw_m4_gt3", make: "BMW", model: "M4 GT3", icon: "B" },
  { id: "bmw_m6_gt3", make: "BMW", model: "M6 GT3", icon: "B" },
  { id: "ferrari_488_gt3", make: "Ferrari", model: "488 GT3", icon: "F" },
  { id: "ferrari_488_gt3_evo", make: "Ferrari", model: "488 GT3 Evo", icon: "F" },
  { id: "ferrari_296_gt3", make: "Ferrari", model: "296 GT3", icon: "F" },
  { id: "honda_nsx_gt3", make: "Honda", model: "NSX GT3", icon: "H" },
  { id: "honda_nsx_gt3_evo", make: "Honda", model: "NSX GT3 Evo", icon: "H" },
  { id: "lamborghini_huracan_gt3", make: "Lamborghini", model: "Huracán GT3", icon: "L" },
  { id: "lamborghini_huracan_gt3_evo", make: "Lamborghini", model: "Huracán GT3 Evo", icon: "L" },
  { id: "lamborghini_huracan_gt3_evo2", make: "Lamborghini", model: "Huracán GT3 Evo2", icon: "L" },
  { id: "lexus_rc_f_gt3", make: "Lexus", model: "RC F GT3", icon: "L" },
  { id: "mclaren_650s_gt3", make: "McLaren", model: "650S GT3", icon: "M" },
  { id: "mclaren_720s_gt3", make: "McLaren", model: "720S GT3", icon: "M" },
  { id: "mclaren_720s_gt3_evo", make: "McLaren", model: "720S GT3 Evo", icon: "M" },
  { id: "mercedes_amg_gt3", make: "Mercedes-AMG", model: "GT3 2015", icon: "M" },
  { id: "mercedes_amg_gt3_evo", make: "Mercedes-AMG", model: "GT3 2020", icon: "M" },
  { id: "nissan_gt_r_nismo_gt3_2017", make: "Nissan", model: "GT-R Nismo GT3 2017", icon: "N" },
  { id: "nissan_gt_r_nismo_gt3_2018", make: "Nissan", model: "GT-R Nismo GT3 2018", icon: "N" },
  { id: "porsche_991_gt3_r", make: "Porsche", model: "991 GT3 R", icon: "P" },
  { id: "porsche_991ii_gt3_r", make: "Porsche", model: "991 II GT3 R", icon: "P" },
  { id: "porsche_992_gt3_r", make: "Porsche", model: "992 GT3 R", icon: "P" },
];

// Now teams are user-entered, but keeping MOCK_TEAMS for backward compatibility
export const MOCK_TEAMS: Team[] = [
  { id: "amg", name: "AMG Team", icon: "M", color: "#00A15F" },
  { id: "audi_sport", name: "Audi Sport", icon: "A", color: "#E10600" },
  { id: "bmw_motorsport", name: "BMW Motorsport", icon: "B", color: "#0600EF" },
  { id: "ferrari_racing", name: "Ferrari Racing", icon: "F", color: "#DC0000" },
  { id: "lamborghini_squad", name: "Lamborghini Squad", icon: "L", color: "#FFFF00" },
  { id: "porsche_racing", name: "Porsche Racing", icon: "P", color: "#FFFFFF" },
];

// Mock data for the app
export const MOCK_LAP_TIMES: LapTime[] = [
  {
    id: "1",
    driverName: "Lewis Hamilton",
    driverTag: "HAM",
    trackId: "silverstone",
    carId: "mercedes",
    teamId: "amg",
    lapTime: "1:52.118",
    lapTimeMs: 112118,
    date: "2023-05-15",
    status: "best",
    positionChange: 0,
  },
  {
    id: "2",
    driverName: "Max Verstappen",
    driverTag: "VER",
    trackId: "silverstone",
    carId: "audi",
    teamId: "audi_sport",
    lapTime: "1:52.455",
    lapTimeMs: 112455,
    date: "2023-05-15",
    status: "improved",
    positionChange: 2,
  },
  {
    id: "3",
    driverName: "Charles Leclerc",
    driverTag: "LEC",
    trackId: "silverstone",
    carId: "ferrari",
    teamId: "ferrari_racing",
    lapTime: "1:52.678",
    lapTimeMs: 112678,
    date: "2023-05-15",
    status: "slower",
    positionChange: -1,
  },
  {
    id: "4",
    driverName: "Daniel Ricciardo",
    driverTag: "RIC",
    trackId: "silverstone",
    carId: "porsche",
    teamId: "porsche_racing",
    lapTime: "1:53.001",
    lapTimeMs: 113001,
    date: "2023-05-15",
    status: "neutral",
    positionChange: 0,
  },
  {
    id: "5",
    driverName: "Fernando Alonso",
    driverTag: "ALO",
    trackId: "silverstone",
    carId: "audi",
    teamId: "audi_sport",
    lapTime: "1:53.210",
    lapTimeMs: 113210,
    date: "2023-05-15",
    status: "improved",
    positionChange: 3,
  },
  {
    id: "6",
    driverName: "Lando Norris",
    driverTag: "NOR",
    trackId: "silverstone",
    carId: "bmw",
    teamId: "bmw_motorsport",
    lapTime: "1:53.399",
    lapTimeMs: 113399,
    date: "2023-05-15",
    status: "neutral",
    positionChange: 0,
  },
  {
    id: "7",
    driverName: "Carlos Sainz",
    driverTag: "SAI",
    trackId: "silverstone",
    carId: "ferrari",
    teamId: "ferrari_racing",
    lapTime: "1:53.542",
    lapTimeMs: 113542,
    date: "2023-05-15",
    status: "slower",
    positionChange: -2,
  },
  {
    id: "8",
    driverName: "Sergio Perez",
    driverTag: "PER",
    trackId: "silverstone",
    carId: "audi",
    teamId: "audi_sport",
    lapTime: "1:53.788",
    lapTimeMs: 113788,
    date: "2023-05-15",
    status: "neutral",
    positionChange: 0,
  },
  {
    id: "9",
    driverName: "Sebastian Vettel",
    driverTag: "VET",
    trackId: "silverstone",
    carId: "porsche",
    teamId: "porsche_racing",
    lapTime: "1:53.901",
    lapTimeMs: 113901,
    date: "2023-05-15",
    status: "improved",
    positionChange: 1,
  },
  {
    id: "10",
    driverName: "Pierre Gasly",
    driverTag: "GAS",
    trackId: "silverstone",
    carId: "lamborghini",
    teamId: "lamborghini_squad",
    lapTime: "1:54.200",
    lapTimeMs: 114200,
    date: "2023-05-15",
    status: "neutral",
    positionChange: 0,
    isFlagged: true, // Anomaly detected
  },
  {
    id: "11",
    driverName: "Yuki Tsunoda",
    driverTag: "TSU",
    trackId: "silverstone",
    carId: "lamborghini",
    teamId: "lamborghini_squad",
    lapTime: "1:54.344",
    lapTimeMs: 114344,
    date: "2023-05-15",
    status: "slower",
    positionChange: -1,
  },
  {
    id: "12",
    driverName: "George Russell",
    driverTag: "RUS",
    trackId: "silverstone",
    carId: "mercedes",
    teamId: "amg",
    lapTime: "1:54.550",
    lapTimeMs: 114550,
    date: "2023-05-15",
    status: "neutral",
    positionChange: 0,
  },
  {
    id: "13",
    driverName: "Esteban Ocon",
    driverTag: "OCO",
    trackId: "silverstone",
    carId: "bmw",
    teamId: "bmw_motorsport",
    lapTime: "1:54.988",
    lapTimeMs: 114988,
    date: "2023-05-15",
    status: "improved",
    positionChange: 2,
  },
  {
    id: "14",
    driverName: "Lance Stroll",
    driverTag: "STR",
    trackId: "silverstone",
    carId: "porsche",
    teamId: "porsche_racing",
    lapTime: "1:55.100",
    lapTimeMs: 115100,
    date: "2023-05-15",
    status: "slower",
    positionChange: -2,
  },
  {
    id: "15",
    driverName: "Valtteri Bottas",
    driverTag: "BOT",
    trackId: "silverstone",
    carId: "audi",
    teamId: "audi_sport",
    lapTime: "1:55.276",
    lapTimeMs: 115276,
    date: "2023-05-15",
    status: "neutral",
    positionChange: 0,
  },
];

// Utility function to format lap time from milliseconds to MM:SS.mmm
export const formatLapTime = (timeMs: number): string => {
  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);
  const milliseconds = timeMs % 1000;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

// Utility function to convert lap time string (MM:SS.mmm) to milliseconds
export const lapTimeToMs = (lapTime: string): number => {
  const [minutesPart, secondsPart] = lapTime.split(':');
  const [seconds, milliseconds] = secondsPart.split('.');
  
  const minutes = parseInt(minutesPart, 10);
  const secs = parseInt(seconds, 10);
  const ms = parseInt(milliseconds, 10);
  
  return (minutes * 60 * 1000) + (secs * 1000) + ms;
};

// Simple anomaly detection - flags lap times that are significantly faster than the average
export const detectAnomalies = (lapTimes: LapTime[], threshold = 0.1): LapTime[] => {
  // Only consider lap times for the same track
  const trackGroups = lapTimes.reduce((groups, lap) => {
    if (!groups[lap.trackId]) {
      groups[lap.trackId] = [];
    }
    groups[lap.trackId].push(lap);
    return groups;
  }, {} as Record<string, LapTime[]>);
  
  const flaggedLapTimes = [...lapTimes];
  
  // Check each track group
  Object.keys(trackGroups).forEach(trackId => {
    const laps = trackGroups[trackId];
    
    // Calculate average lap time for this track
    const totalMs = laps.reduce((sum, lap) => sum + lap.lapTimeMs, 0);
    const avgLapTimeMs = totalMs / laps.length;
    
    // Flag lap times that are significantly faster than average
    laps.forEach(lap => {
      const percentFaster = (avgLapTimeMs - lap.lapTimeMs) / avgLapTimeMs;
      if (percentFaster > threshold) {
        const index = flaggedLapTimes.findIndex(l => l.id === lap.id);
        if (index !== -1) {
          flaggedLapTimes[index] = { ...flaggedLapTimes[index], isFlagged: true };
        }
      }
    });
  });
  
  return flaggedLapTimes;
};
