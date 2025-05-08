
// Types for our racing leaderboard application

export interface LapTime {
  id: string;
  driverName: string;
  driverTag?: string; // Optional short tag/nickname
  trackId: string;
  carId: string;
  teamId?: string; // Optional team name (now manually entered)
  lapTime: string; // Format: "1:23.456" now changed to "1:23:456"
  lapTimeMs: number; // For sorting and calculations
  date: string;
  status?: "improved" | "slower" | "best" | "neutral";
  positionChange?: number; // Positive for positions gained, negative for positions lost
  isFlagged?: boolean; // For anomaly detection
  underReview?: boolean; // New field to mark times under review after being reported
}

export interface Track {
  id: string;
  name: string;
  country: string;
  icon?: string;
  recordTime?: string; // New field for the record time
  recordTimeMs?: number; // Record time in milliseconds for calculations
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
  logo?: string; // URL to team logo
  members?: string[]; // Array of driver IDs
}

export interface RacingEvent {
  id: string;
  title: string;
  description: string;
  trackId: string;
  startDate: string;
  endDate: string;
  createdBy: string; // User ID of team leader who created the event
  teamId?: string; // Optional: if it's team-specific
  isPublic: boolean; // Whether this event is visible to all users
  winners?: {
    driverName: string;
    lapTime: string;
    position: number;
  }[];
  isArchived: boolean;
}

// Updated tracks list from Assetto Corsa Competizione with record times
export const MOCK_TRACKS: Track[] = [
  { id: "monza", name: "Monza", country: "Italy", icon: "🇮🇹", recordTime: "1:47:501", recordTimeMs: 107501 },
  { id: "zolder", name: "Zolder", country: "Belgium", icon: "🇧🇪", recordTime: "1:28:182", recordTimeMs: 88182 },
  { id: "brands_hatch", name: "Brands Hatch", country: "United Kingdom", icon: "🇬🇧", recordTime: "1:23:598", recordTimeMs: 83598 },
  { id: "silverstone", name: "Silverstone", country: "United Kingdom", icon: "🇬🇧", recordTime: "1:57:274", recordTimeMs: 117274 },
  { id: "paul_ricard", name: "Paul Ricard", country: "France", icon: "🇫🇷", recordTime: "1:53:028", recordTimeMs: 113028 },
  { id: "misano", name: "Misano", country: "Italy", icon: "🇮🇹", recordTime: "1:33:550", recordTimeMs: 93550 },
  { id: "spa", name: "Spa-Francorchamps", country: "Belgium", icon: "🇧🇪", recordTime: "2:17:470", recordTimeMs: 137470 },
  { id: "nurburgring", name: "Nürburgring", country: "Germany", icon: "🇩🇪", recordTime: "1:54:125", recordTimeMs: 114125 },
  { id: "barcelona", name: "Barcelona", country: "Spain", icon: "🇪🇸", recordTime: "1:43:202", recordTimeMs: 103202 },
  { id: "hungaroring", name: "Hungaroring", country: "Hungary", icon: "🇭🇺", recordTime: "1:43:389", recordTimeMs: 103389 },
  { id: "zandvoort", name: "Zandvoort", country: "Netherlands", icon: "🇳🇱", recordTime: "1:35:792", recordTimeMs: 95792 },
  { id: "imola", name: "Imola", country: "Italy", icon: "🇮🇹", recordTime: "1:41:756", recordTimeMs: 101756 },
  { id: "suzuka", name: "Suzuka", country: "Japan", icon: "🇯🇵", recordTime: "2:00:124", recordTimeMs: 120124 },
  { id: "kyalami", name: "Kyalami", country: "South Africa", icon: "🇿🇦", recordTime: "1:40:894", recordTimeMs: 100894 },
  { id: "mount_panorama", name: "Mount Panorama", country: "Australia", icon: "🇦🇺", recordTime: "2:01:286", recordTimeMs: 121286 },
  { id: "laguna_seca", name: "Laguna Seca", country: "United States", icon: "🇺🇸", recordTime: "1:22:701", recordTimeMs: 82701 },
  { id: "oulton_park", name: "Oulton Park", country: "United Kingdom", icon: "🇬🇧", recordTime: "1:32:579", recordTimeMs: 92579 },
  { id: "donington", name: "Donington", country: "United Kingdom", icon: "🇬🇧", recordTime: "1:26:731", recordTimeMs: 86731 },
  { id: "snetterton", name: "Snetterton", country: "United Kingdom", icon: "🇬🇧", recordTime: "1:46:118", recordTimeMs: 106118 },
  { id: "cota", name: "Circuit of the Americas", country: "United States", icon: "🇺🇸", recordTime: "2:04:893", recordTimeMs: 124893 },
  { id: "indianapolis", name: "Indianapolis", country: "United States", icon: "🇺🇸", recordTime: "1:33:027", recordTimeMs: 93027 },
  { id: "watkins_glen", name: "Watkins Glen", country: "United States", icon: "🇺🇸", recordTime: "1:44:352", recordTimeMs: 104352 },
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

// Emptying the mock data per user request
export const MOCK_LAP_TIMES: LapTime[] = [];

// Sample events
export const MOCK_EVENTS: RacingEvent[] = [];

// Utility function to format lap time from milliseconds to MM:SS:mmm
export const formatLapTime = (timeMs: number): string => {
  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);
  const milliseconds = timeMs % 1000;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
};

// Utility function to convert lap time string (MM:SS:mmm) to milliseconds
export const lapTimeToMs = (lapTime: string): number => {
  const [minutesPart, secondsPart, milliseconds] = lapTime.split(':');
  
  const minutes = parseInt(minutesPart, 10);
  const secs = parseInt(secondsPart, 10);
  const ms = parseInt(milliseconds, 10);
  
  return (minutes * 60 * 1000) + (secs * 1000) + ms;
};

// Simple anomaly detection - flags lap times that are significantly faster than the average
export const detectAnomalies = (lapTimes: LapTime[], threshold = 0.1): LapTime[] => {
  // Keep existing code for anomaly detection
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

// New function to report a lap time for review
export const reportLapTime = (lapTimes: LapTime[], lapTimeId: string): LapTime[] => {
  return lapTimes.map(lap => 
    lap.id === lapTimeId ? { ...lap, underReview: true } : lap
  );
};

// New function to clear a review flag
export const clearReviewFlag = (lapTimes: LapTime[], lapTimeId: string): LapTime[] => {
  return lapTimes.map(lap => 
    lap.id === lapTimeId ? { ...lap, underReview: false } : lap
  );
};
