
import React, { useState, useEffect } from "react";
import { LapTime } from "@/types/racing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Users, Upload, BadgeCheck, Trophy } from "lucide-react";

interface TeamAreaProps {
  lapTimes: LapTime[];
}

type Team = {
  id: string;
  name: string;
  logo?: string;
  members: string[];
};

const TeamArea: React.FC<TeamAreaProps> = ({ lapTimes }) => {
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const { toast } = useToast();

  // Load team data on component mount
  useEffect(() => {
    const savedTeam = localStorage.getItem("userTeam");
    if (savedTeam) {
      setUserTeam(JSON.parse(savedTeam));
    }
    
    // Get the current user's pilot name
    const pilotInfo = JSON.parse(localStorage.getItem("pilotRegistration") || "{}");
    if (pilotInfo.pilot) {
      setTeamMembers([pilotInfo.pilot]);
    }
  }, []);

  // Save team data when it changes
  useEffect(() => {
    if (userTeam) {
      localStorage.setItem("userTeam", JSON.stringify(userTeam));
    }
  }, [userTeam]);

  // Handle file upload for team logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTeamLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create or update team
  const handleTeamSave = () => {
    if (!teamName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a team name.",
      });
      return;
    }

    const newTeam: Team = {
      id: userTeam?.id || Date.now().toString(),
      name: teamName,
      logo: teamLogo || undefined,
      members: teamMembers
    };

    setUserTeam(newTeam);
    
    toast({
      title: "Team Updated",
      description: "Your team information has been saved.",
    });
  };

  // Get lap times for team members
  const getTeamLapTimes = () => {
    if (!userTeam) return [];
    return lapTimes.filter(lap => userTeam.members.includes(lap.driverName));
  };
  
  // Best lap times by track for team
  const getBestLapsByTrack = () => {
    const teamLapTimes = getTeamLapTimes();
    const trackGroups: Record<string, LapTime[]> = {};
    
    // Group by track
    teamLapTimes.forEach(lap => {
      if (!trackGroups[lap.trackId]) {
        trackGroups[lap.trackId] = [];
      }
      trackGroups[lap.trackId].push(lap);
    });
    
    // Get best lap per track
    return Object.entries(trackGroups).map(([trackId, laps]) => {
      return laps.reduce((best, current) => 
        current.lapTimeMs < best.lapTimeMs ? current : best
      );
    }).sort((a, b) => a.lapTimeMs - b.lapTimeMs);
  };

  const teamLapTimes = getTeamLapTimes();
  const bestLapsByTrack = getBestLapsByTrack();

  return (
    <div className="bg-racing-black text-white">
      <div className="bg-racing-red p-2 flex items-center gap-2">
        <Users size={18} />
        <h2 className="font-formula text-lg tracking-wider">TEAM AREA</h2>
      </div>
      
      {!userTeam ? (
        <div className="p-4 bg-racing-darkgrey">
          <h3 className="font-formula text-xl mb-4 text-center">Create Your Team</h3>
          <div className="space-y-4 max-w-lg mx-auto">
            <div>
              <label className="block text-sm font-medium text-racing-silver mb-1">Team Name*</label>
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="bg-racing-black border-racing-grey text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-racing-silver mb-1">Team Logo</label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="bg-racing-black border-racing-grey text-white"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="border-racing-grey"
                >
                  <Upload size={16} />
                </Button>
              </div>
              {teamLogo && (
                <div className="mt-2">
                  <img src={teamLogo} alt="Team logo" className="h-16 object-contain" />
                </div>
              )}
            </div>
            
            <div className="pt-4">
              <Button
                onClick={handleTeamSave}
                className="w-full bg-racing-red hover:bg-red-700 text-white"
              >
                Create Team
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {/* Team Info */}
          <div className="bg-racing-darkgrey p-4 rounded">
            <div className="flex flex-col items-center mb-4">
              {userTeam.logo ? (
                <img src={userTeam.logo} alt={userTeam.name} className="h-24 mb-2 object-contain" />
              ) : (
                <div className="h-24 w-24 bg-racing-grey/20 flex items-center justify-center mb-2">
                  <Users size={32} className="text-racing-silver" />
                </div>
              )}
              <h3 className="font-formula text-xl text-center">{userTeam.name}</h3>
              <div className="text-sm text-racing-silver mt-1">
                {userTeam.members.length} member{userTeam.members.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <Separator className="my-4 bg-racing-grey/30" />
            
            <div>
              <h4 className="font-formula mb-2 flex items-center gap-1">
                <BadgeCheck size={16} className="text-racing-red" /> 
                Team Members
              </h4>
              <ul className="space-y-1 text-racing-silver">
                {userTeam.members.map((member, index) => (
                  <li key={index} className="text-sm">{member}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 space-y-2">
              <Button
                onClick={() => {
                  setTeamName(userTeam.name);
                  setTeamLogo(userTeam.logo || null);
                  setTeamMembers(userTeam.members);
                  setUserTeam(null);
                }}
                variant="outline"
                className="w-full border-racing-grey text-racing-silver hover:text-white"
              >
                Edit Team
              </Button>
            </div>
          </div>
          
          {/* Team Statistics */}
          <div className="bg-racing-darkgrey p-4 rounded md:col-span-2">
            <h3 className="font-formula text-xl mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-racing-red" /> 
              Team Performance
            </h3>
            
            {teamLapTimes.length === 0 ? (
              <div className="text-racing-silver text-center py-8">
                No lap times recorded for team members yet.
              </div>
            ) : (
              <>
                <h4 className="font-formula mb-2 text-sm text-racing-silver">Best Lap Times by Track</h4>
                <div className="border border-racing-grey rounded overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-racing-black border-b border-racing-grey">
                        <th className="py-2 px-3 text-left text-xs font-formula tracking-wider">TRACK</th>
                        <th className="py-2 px-3 text-center text-xs font-formula tracking-wider">DRIVER</th>
                        <th className="py-2 px-3 text-center text-xs font-formula tracking-wider">LAP TIME</th>
                        <th className="py-2 px-3 text-center text-xs font-formula tracking-wider">DATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bestLapsByTrack.map((lap, index) => (
                        <tr key={lap.id} className={`border-b border-racing-grey ${index % 2 === 0 ? "bg-racing-black" : "bg-racing-darkgrey/30"}`}>
                          <td className="py-1.5 px-3 text-left">{lap.trackId}</td>
                          <td className="py-1.5 px-3 text-center">{lap.driverName}</td>
                          <td className="py-1.5 px-3 text-center font-formula font-bold">{lap.lapTime}</td>
                          <td className="py-1.5 px-3 text-center text-sm">{lap.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-formula mb-2 text-sm text-racing-silver">Recent Team Activity</h4>
                  <div className="border border-racing-grey rounded overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-racing-black border-b border-racing-grey">
                          <th className="py-2 px-3 text-left text-xs font-formula tracking-wider">DRIVER</th>
                          <th className="py-2 px-3 text-left text-xs font-formula tracking-wider">TRACK</th>
                          <th className="py-2 px-3 text-center text-xs font-formula tracking-wider">LAP TIME</th>
                          <th className="py-2 px-3 text-center text-xs font-formula tracking-wider">DATE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamLapTimes
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .slice(0, 5)
                          .map((lap, index) => (
                            <tr key={lap.id} className={`border-b border-racing-grey ${index % 2 === 0 ? "bg-racing-black" : "bg-racing-darkgrey/30"}`}>
                              <td className="py-1.5 px-3 text-left">{lap.driverName}</td>
                              <td className="py-1.5 px-3 text-left">{lap.trackId}</td>
                              <td className="py-1.5 px-3 text-center font-formula font-bold">{lap.lapTime}</td>
                              <td className="py-1.5 px-3 text-center text-sm">{lap.date}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamArea;
