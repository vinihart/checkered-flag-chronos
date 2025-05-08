
import React, { useEffect, useState } from "react";
import { Track } from "@/types/racing";
import { Clock, Flag, Trophy, User, LogOut } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface RacingHeaderProps {
  activeTrack: Track | null;
  setActiveTrack: (track: Track | null) => void;
  tracks: Track[];
  onShowSubmitForm: () => void;
  onShowAdminPanel: () => void;
  className?: string;
  isAdmin: boolean;
}

type PilotInfo = {
  pilot: string;
  pilotTag?: string;
  mainCar: string;
  platform: string;
  team?: string;
};

const RacingHeader: React.FC<RacingHeaderProps> = ({
  activeTrack,
  setActiveTrack,
  tracks,
  onShowSubmitForm,
  onShowAdminPanel,
  className,
  isAdmin
}) => {
  const [pilotInfo, setPilotInfo] = useState<PilotInfo | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    // Load pilot info from localStorage
    const storedPilotInfo = localStorage.getItem("pilotRegistration");
    if (storedPilotInfo) {
      setPilotInfo(JSON.parse(storedPilotInfo));
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    navigate("/login");
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-racing-red p-2 flex items-center justify-between">
        <div className="text-white font-formula font-bold text-xl md:text-2xl tracking-wider">
          RANKING ACC BRASIL
        </div>
        <div className="text-white flex items-center gap-3">
          {pilotInfo && (
            <div className="hidden md:flex items-center gap-2 bg-racing-darkgrey/80 py-1 px-3 rounded">
              <User size={16} />
              <span>
                {pilotInfo.pilot}
                {pilotInfo.pilotTag && ` (${pilotInfo.pilotTag})`}
              </span>
            </div>
          )}
          <button
            onClick={onShowSubmitForm}
            className="bg-racing-darkgrey hover:bg-racing-black transition-colors py-1 px-3 rounded flex items-center gap-1"
          >
            <Clock size={16} />
            <span className="hidden md:inline">Submit Time</span>
          </button>
          
          {isAdmin && (
            <button
              onClick={onShowAdminPanel}
              className="bg-racing-darkgrey hover:bg-racing-black transition-colors py-1 px-3 rounded flex items-center gap-1"
            >
              <Flag size={16} />
              <span className="hidden md:inline">Admin</span>
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="bg-racing-darkgrey hover:bg-racing-black transition-colors py-1 px-3 rounded flex items-center gap-1"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
      
      <div className="bg-racing-black p-3 border-b border-racing-grey text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flag size={18} className="text-racing-red" />
            <span className="font-formula text-lg mr-3">Track Selection:</span>
            
            <Select 
              value={activeTrack ? activeTrack.id : "all"} 
              onValueChange={(value) => {
                if (value === "all") {
                  setActiveTrack(null);
                } else {
                  const track = tracks.find(t => t.id === value);
                  if (track) setActiveTrack(track);
                }
              }}
            >
              <SelectTrigger className="bg-racing-darkgrey border-racing-grey text-white w-64">
                <SelectValue placeholder="Select a track" />
              </SelectTrigger>
              <SelectContent className="bg-racing-black border-racing-grey text-white">
                <SelectItem value="all">All Tracks</SelectItem>
                {tracks.map((track) => (
                  <SelectItem key={track.id} value={track.id}>
                    {track.icon} {track.name} - {track.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {activeTrack && activeTrack.recordTime && (
            <div className="flex items-center gap-2 bg-racing-darkgrey/30 py-1.5 px-3 rounded">
              <Trophy size={16} className="text-racing-red" />
              <span className="text-sm">
                <span className="font-formula">GT3 RECORD:</span>{" "}
                <span className="text-racing-silver">{activeTrack.recordTime}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RacingHeader;
