
import React, { useState, useEffect } from "react";
import { LapTime } from "@/types/racing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, Upload, BadgeCheck, Trophy, MessageSquare, Clock } from "lucide-react";
import TeamAnnouncements from "@/components/TeamAnnouncements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamAreaProps {
  lapTimes: LapTime[];
}

type TeamMember = {
  name: string;
  role: "admin" | "assistant" | "member";
};

type TeamAnnouncement = {
  id: string;
  title: string;
  content: string;
  date: string;
  authorName: string;
};

type TeamEvent = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isArchived: boolean;
};

type TeamChat = {
  id: string;
  messages: TeamChatMessage[];
};

type TeamChatMessage = {
  id: string;
  senderName: string;
  content: string;
  timestamp: string;
};

type Team = {
  id: string;
  name: string;
  logo?: string;
  members: TeamMember[];
  announcements: TeamAnnouncement[];
  events: TeamEvent[];
  chat: TeamChat;
  archivedEvents: TeamEvent[];
};

const TeamArea: React.FC<TeamAreaProps> = ({ lapTimes }) => {
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState("info");
  const [chatMessage, setChatMessage] = useState("");
  const { toast } = useToast();

  // Load team data on component mount
  useEffect(() => {
    const savedTeam = localStorage.getItem("userTeam");
    if (savedTeam) {
      const team = JSON.parse(savedTeam);
      // Initialize events array if it doesn't exist
      if (!team.events) team.events = [];
      // Initialize chat if it doesn't exist
      if (!team.chat) team.chat = { id: Date.now().toString(), messages: [] };
      // Initialize archivedEvents array if it doesn't exist
      if (!team.archivedEvents) team.archivedEvents = [];
      
      setUserTeam(team);
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
  
  // Effect for checking event end dates and archiving expired events
  useEffect(() => {
    if (!userTeam || !userTeam.events) return;
    
    const now = new Date();
    const currentEvents = [...userTeam.events];
    const expiredEvents: TeamEvent[] = [];
    
    // Find events that have passed their end date
    const activeEvents = currentEvents.filter(event => {
      const endDate = new Date(event.endDate);
      const hasExpired = endDate < now;
      if (hasExpired) {
        expiredEvents.push({...event, isArchived: true});
      }
      return !hasExpired;
    });
    
    // If we have expired events, update the team data
    if (expiredEvents.length > 0) {
      const updatedTeam = {
        ...userTeam,
        events: activeEvents,
        archivedEvents: [...(userTeam.archivedEvents || []), ...expiredEvents]
      };
      setUserTeam(updatedTeam);
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
      announcements: userTeam?.announcements || [],
      events: userTeam?.events || [],
      archivedEvents: userTeam?.archivedEvents || [],
      chat: userTeam?.chat || { id: Date.now().toString(), messages: [] }
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
  
  // Add team event
  const handleAddEvent = (event: TeamEvent) => {
    if (!userTeam) return;
    
    const updatedTeam = {
      ...userTeam,
      events: [...userTeam.events, event]
    };
    
    setUserTeam(updatedTeam);
    
    toast({
      title: "Event Added",
      description: "Your team event has been created.",
    });
  };
  
  // Send chat message
  const handleSendMessage = () => {
    if (!userTeam || !chatMessage.trim()) return;
    
    const pilotInfo = JSON.parse(localStorage.getItem("pilotRegistration") || "{}");
    const newMessage: TeamChatMessage = {
      id: Date.now().toString(),
      senderName: pilotInfo.pilot || "Unknown",
      content: chatMessage,
      timestamp: new Date().toISOString()
    };
    
    const updatedChat = {
      ...userTeam.chat,
      messages: [...userTeam.chat.messages, newMessage]
    };
    
    setUserTeam({
      ...userTeam,
      chat: updatedChat
    });
    
    setChatMessage("");
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format timestamp for chat messages
  const formatTimestamp = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const teamLapTimes = getTeamLapTimes();
  const bestLapsByTrack = getBestLapsByTrack();
  const canManageTeam = isTeamManager();
  
  // Get current username
  const getCurrentUsername = () => {
    const pilotInfo = JSON.parse(localStorage.getItem("pilotRegistration") || "{}");
    return pilotInfo.pilot || "Unknown";
  };

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
              <TabsTrigger 
                value="events" 
                className="flex-1 data-[state=active]:bg-racing-red data-[state=active]:text-white text-racing-silver"
              >
                Events
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="flex-1 data-[state=active]:bg-racing-red data-[state=active]:text-white text-racing-silver"
              >
                Team Chat
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
                                <td className="py-1.5 px-3 text-center text-xs text-racing-silver">
                                  {lap.date ? formatDate(lap.date) : '-'}
                                </td>
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
            
            <TabsContent value="events" className="mt-4 p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-1 lg:col-span-2">
                  <div className="bg-racing-red p-2 flex justify-between items-center mb-1">
                    <h3 className="text-white font-formula text-lg tracking-wider">TEAM EVENTS</h3>
                    {canManageTeam && (
                      <Button 
                        size="sm"
                        variant="outline"
                        className="bg-transparent border-white/30 hover:bg-white/20 text-white text-xs"
                        onClick={() => {
                          // Open event creation modal or switch to relevant UI
                          toast({
                            title: "Create Event",
                            description: "Event creation form would appear here."
                          });
                        }}
                      >
                        + New Event
                      </Button>
                    )}
                  </div>
                  
                  {/* Team Events List */}
                  {(userTeam.events && userTeam.events.length > 0) ? (
                    <div className="space-y-2">
                      {userTeam.events.map(event => {
                        // Calculate days remaining until event expires
                        const endDate = new Date(event.endDate);
                        const today = new Date();
                        const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <div 
                            key={event.id} 
                            className="bg-racing-darkgrey p-4 rounded border border-racing-grey"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-formula text-racing-red">{event.title}</h4>
                                <p className="text-sm text-white mt-1">{event.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-racing-silver text-xs">
                                  <Calendar size={14} />
                                  <span>Visible for {daysRemaining} more day{daysRemaining !== 1 ? 's' : ''}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
                              <div className="flex items-center gap-1 text-racing-silver">
                                <Calendar size={14} className="text-racing-red" />
                                <span>Start: {formatDate(event.startDate)}</span>
                                {event.startTime && (
                                  <span className="ml-1">at {event.startTime}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-racing-silver">
                                <Calendar size={14} className="text-racing-red" />
                                <span>End: {formatDate(event.endDate)}</span>
                                {event.endTime && (
                                  <span className="ml-1">at {event.endTime}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-racing-darkgrey">
                      <p className="text-racing-silver">No active events found.</p>
                      {canManageTeam && (
                        <Button 
                          size="sm"
                          variant="outline"
                          className="mt-2 border-racing-red bg-transparent hover:bg-racing-red/20 text-racing-red"
                        >
                          Create First Event
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="col-span-1">
                  <div className="bg-racing-red p-2 flex justify-between items-center mb-1">
                    <h3 className="text-white font-formula text-lg tracking-wider">ARCHIVED EVENTS</h3>
                  </div>
                  
                  {/* Archived Events */}
                  <div className="bg-racing-darkgrey max-h-96 overflow-y-auto p-1">
                    {userTeam.archivedEvents && userTeam.archivedEvents.length > 0 ? (
                      <div className="space-y-1 p-1">
                        {userTeam.archivedEvents.map(event => (
                          <div 
                            key={event.id}
                            className="p-2 border border-racing-grey/30 rounded bg-racing-black hover:bg-racing-darkgrey/50 cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <h5 className="text-sm font-formula text-white">{event.title}</h5>
                              <span className="text-xs text-racing-silver">{formatDate(event.endDate)}</span>
                            </div>
                            <p className="text-xs text-racing-silver mt-1 line-clamp-2">{event.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-racing-silver text-sm">No archived events.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="chat" className="mt-4 p-4">
              <div className="bg-racing-darkgrey rounded-sm border border-racing-grey">
                <div className="bg-racing-red p-2 flex items-center gap-2">
                  <MessageSquare size={16} className="text-white" />
                  <h3 className="font-formula text-white text-lg">TEAM CHAT</h3>
                </div>
                
                <div className="h-80 overflow-y-auto p-3 flex flex-col space-y-2">
                  {userTeam.chat && userTeam.chat.messages && userTeam.chat.messages.length > 0 ? (
                    userTeam.chat.messages.map((msg) => {
                      const isCurrentUser = msg.senderName === getCurrentUsername();
                      
                      return (
                        <div 
                          key={msg.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-2 rounded-md ${
                            isCurrentUser 
                              ? 'bg-racing-red text-white rounded-br-none' 
                              : 'bg-racing-grey/20 text-white rounded-bl-none'
                          }`}>
                            {!isCurrentUser && (
                              <p className="text-xs font-bold text-racing-red mb-1">{msg.senderName}</p>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs ${isCurrentUser ? 'text-white/70' : 'text-racing-silver'} text-right mt-1`}>
                              {formatTimestamp(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-racing-silver">
                      <MessageSquare size={24} className="mb-2" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </div>
                
                <div className="p-2 border-t border-racing-grey">
                  <div className="flex items-center gap-2">
                    <Input 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="bg-racing-black border-racing-grey text-white"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim()}
                      className="bg-racing-red hover:bg-racing-red/80"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default TeamArea;
