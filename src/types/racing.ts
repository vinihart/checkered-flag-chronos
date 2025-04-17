
// Types for our racing leaderboard application

export interface LapTime {
  id: string;
  driverName: string;
  driverTag?: string; // Optional short tag/nickname
  trackId: string;
  carId: string;
  teamId?: string; // Optional team
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

// Mock data for the app
export const MOCK_TRACKS: Track[] = [
  { id: "silverstone", name: "Silverstone", country: "Great Britain", icon: "🇬🇧" },
  { id: "spa", name: "Spa-Francorchamps", country: "Belgium", icon: "🇧🇪" },
  { id: "monza", name: "Monza", country: "Italy", icon: "🇮🇹" },
  { id: "nurburgring", name: "Nürburgring", country: "Germany", icon: "🇩🇪" },
  { id: "suzuka", name: "Suzuka", country: "Japan", icon: "🇯🇵" },
];

export const MOCK_CARS: Car[] = [
  { id: "mercedes", make: "Mercedes", model: "AMG GT3", icon: "M" },
  { id: "audi", make: "Audi", model: "R8 LMS GT3", icon: "A" },
  { id: "bmw", make: "BMW", model: "M4 GT3", icon: "B" },
  { id: "ferrari", make: "Ferrari", model: "488 GT3", icon: "F" },
  { id: "lamborghini", make: "Lamborghini", model: "Huracan GT3", icon: "L" },
  { id: "porsche", make: "Porsche", model: "911 GT3 R", icon: "P" },
];

export const MOCK_TEAMS: Team[] = [
  { id: "amg", name: "AMG Team", icon: "M", color: "#00A15F" },
  { id: "audi_sport", name: "Audi Sport", icon: "A", color: "#E10600" },
  { id: "bmw_motorsport", name: "BMW Motorsport", icon: "B", color: "#0600EF" },
  { id: "ferrari_racing", name: "Ferrari Racing", icon: "F", color: "#DC0000" },
  { id: "lamborghini_squad", name: "Lamborghini Squad", icon: "L", color: "#FFFF00" },
  { id: "porsche_racing", name: "Porsche Racing", icon: "P", color: "#FFFFFF" },
];

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
