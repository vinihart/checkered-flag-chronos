
import React from "react";
import { Track } from "@/types/racing";
import { Clock, Flag, Users, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface RacingHeaderProps {
  activeTrack: Track | null;
  setActiveTrack: (track: Track | null) => void;
  tracks: Track[];
  onShowSubmitForm: () => void;
  onShowAdminPanel: () => void;
  className?: string;
}

const RacingHeader: React.FC<RacingHeaderProps> = ({
  activeTrack,
  setActiveTrack,
  tracks,
  onShowSubmitForm,
  onShowAdminPanel,
  className,
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="bg-racing-red p-2 flex items-center justify-between">
        <div className="text-white font-formula font-bold text-xl md:text-2xl tracking-wider">
          RANKING ACC BRASIL
        </div>
        <div className="text-white flex items-center gap-3">
          <button
            onClick={onShowSubmitForm}
            className="bg-racing-darkgrey hover:bg-racing-black transition-colors py-1 px-3 rounded flex items-center gap-1"
          >
            <Clock size={16} />
            <span className="hidden md:inline">Submit Time</span>
          </button>
          <button
            onClick={onShowAdminPanel}
            className="bg-racing-darkgrey hover:bg-racing-black transition-colors py-1 px-3 rounded flex items-center gap-1"
          >
            <Users size={16} />
            <span className="hidden md:inline">Admin</span>
          </button>
        </div>
      </div>
      
      <div className="bg-racing-black p-3 border-b border-racing-grey text-white">
        <div className="flex items-center justify-between">
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
        </div>
      </div>
    </div>
  );
};

export default RacingHeader;
