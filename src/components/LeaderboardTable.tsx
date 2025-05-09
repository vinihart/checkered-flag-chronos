
import React from "react";
import { LapTime, Car, Team, Track, MOCK_CARS, MOCK_TEAMS, MOCK_TRACKS } from "@/types/racing";
import { AlertTriangle, ArrowDown, ArrowUp, Calendar, Flag, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeaderboardTableProps {
  lapTimes: LapTime[];
  onEditLapTime?: (lapTime: LapTime) => void;
  onReportLapTime?: (lapTime: LapTime) => void;
  showOnlyMyTimes?: boolean;
  activeTrack?: Track | null;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  lapTimes,
  onEditLapTime,
  onReportLapTime,
  showOnlyMyTimes = false,
  activeTrack = null,
}) => {
  // Helper function to get team by ID
  const getTeam = (teamId: string | undefined): Team | undefined => {
    if (!teamId) return undefined;
    return MOCK_TEAMS.find((team) => team.id === teamId);
  };

  // Helper function to get car by ID
  const getCar = (carId: string): Car | undefined => {
    return MOCK_CARS.find((car) => car.id === carId);
  };

  // Helper function to get track by ID
  const getTrack = (trackId: string): Track | undefined => {
    return MOCK_TRACKS.find((track) => track.id === trackId);
  };

  // Helper function to determine the color based on status
  const getStatusColor = (status: string | undefined): string => {
    switch (status) {
      case "improved":
        return "text-status-improved";
      case "slower":
        return "text-status-slower";
      case "best":
        return "text-status-best";
      default:
        return "text-status-neutral";
    }
  };

  // Helper function to render position change indicator
  const renderPositionChange = (change: number | undefined) => {
    if (!change || change === 0) {
      return <Minus size={14} className="text-status-neutral" />;
    }
    
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-status-improved">
          <ArrowUp size={14} />
          <span>{change}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1 text-status-slower">
        <ArrowDown size={14} />
        <span>{Math.abs(change)}</span>
      </div>
    );
  };

  // Format date display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter to show only current user's times if needed
  const filteredTimes = showOnlyMyTimes ? lapTimes.filter(lapTime => {
    const pilotInfo = JSON.parse(localStorage.getItem("pilotRegistration") || "{}");
    return pilotInfo.pilot === lapTime.driverName;
  }) : lapTimes;

  return (
    <div className="bg-racing-black text-white w-full overflow-hidden rounded-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-racing-darkgrey border-b border-racing-grey">
            <th className="py-2 px-3 text-left text-xs font-formula tracking-wider w-10">POS</th>
            <th className="py-2 px-3 text-left text-xs font-formula tracking-wider">DRIVER</th>
            <th className="py-2 px-3 text-center text-xs font-formula tracking-wider w-12">CAR</th>
            <th className="py-2 px-3 text-left text-xs font-formula tracking-wider w-24 hidden sm:table-cell">TEAM</th>
            <th className="py-2 px-3 text-center text-xs font-formula tracking-wider w-24">LAP TIME</th>
            {!activeTrack && (
              <th className="py-2 px-3 text-center text-xs font-formula tracking-wider w-20 hidden sm:table-cell">TRACK</th>
            )}
            <th className="py-2 px-3 text-center text-xs font-formula tracking-wider w-12">DIFF</th>
            <th className="py-2 px-3 text-center text-xs font-formula tracking-wider w-12">+/-</th>
            <th className="py-2 px-3 text-center text-xs font-formula tracking-wider w-16 hidden md:table-cell">DATE</th>
            <th className="py-2 px-3 text-center text-xs font-formula tracking-wider w-12">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {filteredTimes.length === 0 ? (
            <tr>
              <td colSpan={activeTrack ? 9 : 10} className="py-4 text-center text-racing-silver">
                No lap times recorded yet. Be the first to submit your time!
              </td>
            </tr>
          ) : (
            filteredTimes.map((lapTime, index) => {
              const team = getTeam(lapTime.teamId);
              const car = getCar(lapTime.carId);
              const track = getTrack(lapTime.trackId);
              
              // Calculate gap to leader
              const leaderTime = filteredTimes[0].lapTimeMs;
              const timeDiff = lapTime.lapTimeMs - leaderTime;
              const formattedDiff = index === 0 
                ? "-" 
                : `+${(timeDiff / 1000).toFixed(3)}`;
              
              return (
                <tr 
                  key={lapTime.id}
                  className={`border-b border-racing-grey hover:bg-racing-darkgrey cursor-pointer transition-colors ${index % 2 === 0 ? "bg-racing-black" : "bg-[#1A1A1A]"}`}
                  onClick={() => onEditLapTime && onEditLapTime(lapTime)}
                >
                  <td className="py-1.5 px-3 text-left font-formula font-bold">
                    {index + 1}
                  </td>
                  <td className="py-1.5 px-3 text-left font-formula">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">{lapTime.driverTag || lapTime.driverName.substring(0, 3).toUpperCase()}</span>
                      <span className="hidden sm:inline text-racing-silver text-sm">{lapTime.driverName}</span>
                      
                      {/* Under review indicator */}
                      {lapTime.underReview && (
                        <span className="h-3 w-3 bg-yellow-500 rounded-full inline-block ml-1" title="Under review"></span>
                      )}
                      
                      {/* Anomaly detection flag */}
                      {lapTime.isFlagged && (
                        <AlertTriangle size={14} className="text-yellow-500 ml-1" aria-label="Flagged as anomaly" />
                      )}
                    </div>
                  </td>
                  <td 
                    className="py-1.5 px-3 text-center text-sm font-bold" 
                    style={{ backgroundColor: team?.color || "transparent" }}
                  >
                    {car?.icon}
                  </td>
                  <td className="py-1.5 px-3 text-left hidden sm:table-cell">
                    <span className="text-racing-silver text-sm">{team?.name || "-"}</span>
                  </td>
                  <td className={`py-1.5 px-3 text-center font-formula font-bold ${getStatusColor(lapTime.status)}`}>
                    {lapTime.lapTime}
                  </td>
                  {!activeTrack && (
                    <td className="py-1.5 px-3 text-center text-racing-silver text-sm hidden sm:table-cell">
                      {track?.name || "-"}
                    </td>
                  )}
                  <td className="py-1.5 px-3 text-center font-formula text-sm">
                    {formattedDiff}
                  </td>
                  <td className="py-1.5 px-3 text-center">
                    {renderPositionChange(lapTime.positionChange)}
                  </td>
                  <td className="py-1.5 px-3 text-center hidden md:table-cell text-xs text-racing-silver">
                    {lapTime.date ? (
                      <span className="whitespace-nowrap">
                        {formatDate(lapTime.date)}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="py-1.5 px-3 text-center">
                    {/* Report button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild onClick={(e) => {
                          e.stopPropagation();
                          onReportLapTime && onReportLapTime(lapTime);
                        }}>
                          <button 
                            className="p-1 hover:bg-racing-red/20 rounded text-racing-silver hover:text-racing-red transition-colors"
                            disabled={lapTime.underReview}
                          >
                            <Flag size={16} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{lapTime.underReview ? "This lap time is under review" : "Report this lap time"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
