
import React, { useState, useEffect } from "react";
import { LapTime } from "@/types/racing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Users, Upload, BadgeCheck, Trophy, MessageSquare } from "lucide-react";
import TeamAnnouncements from "@/components/TeamAnnouncements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamAreaProps {
  lapTimes: LapTime[];
}

type TeamMember = {
  name: string;
  role: "admin" | "assistant" | "member";
};

type Team = {
  id: string;
  name: string;
  logo?: string;
  members: TeamMember[];
  announcements: TeamAnnouncement[];
};

type TeamAnnouncement = {
  id: string;
  title: string;
  content: string;
  date: string;
  authorName: string;
};

const TeamArea: React.FC<TeamAreaProps> = ({ lapTimes }) => {
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState("info");
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
      setTeamMembers([{
        name: pilotInfo.pilot,
        role: "admin"
      }]);
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
      members: teamMembers,
      announcements: userTeam?.announcements || []
    };

    setUserTeam(newTeam);
    
    toast({
      title: "Team Updated",
      description: "Your team information has been saved.",
    });
  };

  // Check if current user is an admin or assistant
  const isTeamManager = () => {
    if (!userTeam) return false;
    
    const pilotInfo = JSON.parse(localStorage.getItem("pilotRegistration") || "{}");
    const currentMember = userTeam.members.find(m => m.name === pilotInfo.pilot);
    return currentMember?.role === "admin" || currentMember?.role === "assistant";
  };

  // Get lap times for team members
  const getTeamLapTimes = () => {
    if (!userTeam) return [];
    const memberNames = userTeam.members.map(m => m.name);
    return lapTimes.filter(lap => memberNames.includes(lap.driverName));
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

  // Add team announcement
  const handleAddAnnouncement = (announcement: TeamAnnouncement) => {
    if (!userTeam) return;
    
    const updatedTeam = {
      ...userTeam,
      announcements: [...userTeam.announcements, announcement]
    };
    
    setUserTeam(updatedTeam);
    
    toast({
      title: "Announcement Posted",
      description: "Your team announcement has been published.",
    });
  };

  const teamLapTimes = getTeamLapTimes();
  const bestLapsByTrack = getBestLapsByTrack();
  const canManageTeam = isTeamManager();

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
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-racing-darkgrey">
              <TabsTrigger 
                value="info" 
                className="flex-1 data-[state=active]:bg-racing-red data-[state=active]:text-white text-racing-silver"
              >
                Team Info
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="flex-1 data-[state=active]:bg-racing-red data-[state=active]:text-white text-racing-silver"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger 
                value="announcements" 
                className="flex-1 data-[state=active]:bg-racing-red data-[state=active]:text-white text-racing-silver"
              >
                Announcements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <ul className="space-y-1">
                      {userTeam.members.map((member, index) => (
                        <li key={index} className="flex justify-between items-center text-sm">
                          <span className="text-racing-silver">{member.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            member.role === "admin" 
                              ? "bg-racing-red text-white" 
                              : member.role === "assistant"
                              ? "bg-racing-darkgrey text-racing-silver border border-racing-silver" 
                              : "text-racing-silver"
                          }`}>
                            {member.role === "admin" ? "Admin" : member.role === "assistant" ? "Assistant" : "Member"}
                          </span>
                        </li>
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
                      className="w-full border-racing-grey bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Edit Team
                    </Button>
                  </div>
                </div>
                
                <div className="bg-racing-darkgrey p-4 rounded">
                  <h4 className="font-formula mb-4 flex items-center gap-1">
                    <MessageSquare size={16} className="text-racing-red" /> 
                    Team Management
                  </h4>
                  
                  <p className="text-sm text-racing-silver mb-4">
                    Each team can have one administrator and up to 5 assistants. Administrators and assistants can post team announcements and manage team information.
                  </p>
                  
                  {canManageTeam ? (
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-racing-silver mb-2">Team Members</h5>
                        <p className="text-xs text-racing-silver mb-2">
                          Admins can assign assistant roles to help manage the team. You currently have {userTeam.members.filter(m => m.role === "assistant").length} of 5 assistants assigned.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-racing-silver py-4">
                      Only team administrators and assistants can manage the team.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-4 p-4">
              {teamLapTimes.length === 0 ? (
                <div className="text-racing-silver text-center py-8 bg-racing-darkgrey p-4 rounded">
                  No lap times recorded for team members yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-racing-darkgrey p-4 rounded">
                    <h4 className="font-formula mb-2 flex items-center gap-2">
                      <Trophy size={18} className="text-racing-red" /> 
                      Best Lap Times by Track
                    </h4>
                    <div className="border border-racing-grey rounded overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-racing-black border-b border-racing-grey">
                            <th className="py-2 px-3 text-left text-xs font-formula tracking-wider">TRACK</th>
                            <th className="py-2 px-3 text-center text-xs font-formula tracking-wider">DRIVER</th>
                            <th className="py-2 px-3 text-center text-xs font-formula tracking-wider">LAP TIME</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bestLapsByTrack.map((lap, index) => (
                            <tr key={lap.id} className={`border-b border-racing-grey ${index % 2 === 0 ? "bg-racing-black" : "bg-racing-darkgrey/30"}`}>
                              <td className="py-1.5 px-3 text-left">{lap.trackId}</td>
                              <td className="py-1.5 px-3 text-center">{lap.driverName}</td>
                              <td className="py-1.5 px-3 text-center font-formula font-bold">{lap.lapTime}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="bg-racing-darkgrey p-4 rounded">
                    <h4 className="font-formula mb-2 flex items-center gap-2">
                      <MessageSquare size={18} className="text-racing-red" /> 
                      Recent Team Activity
                    </h4>
                    <div className="border border-racing-grey rounded overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-racing-black border-b border-racing-grey">
                            <th className="py-2 px-3 text-left text-xs font-formula tracking-wider">DRIVER</th>
                            <th className="py-2 px-3 text-left text-xs font-formula tracking-wider">TRACK</th>
                            <th className="py-2 px-3 text-center text-xs font-formula tracking-wider">LAP TIME</th>
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
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="announcements" className="mt-4">
              <TeamAnnouncements 
                team={userTeam} 
                canManage={canManageTeam} 
                onAddAnnouncement={handleAddAnnouncement}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default TeamArea;
