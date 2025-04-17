
import React from "react";
import { Track } from "@/types/racing";
import { Clock, Flag, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      
      <div className="bg-racing-black p-2 border-b border-racing-grey text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div className="flex items-center gap-2">
            <Flag size={18} className="text-racing-red" />
            <span className="font-formula text-lg">
              {activeTrack ? `${activeTrack.name} - ${activeTrack.country}` : "All Tracks"}
            </span>
          </div>
          
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="w-full md:w-auto bg-racing-darkgrey overflow-x-auto flex flex-nowrap">
              <TabsTrigger 
                value="all" 
                className="text-xs px-4 h-9 data-[state=active]:bg-racing-red whitespace-nowrap"
                onClick={() => setActiveTrack(null)}
              >
                All Tracks
              </TabsTrigger>
              {tracks.map((track) => (
                <TabsTrigger
                  key={track.id}
                  value={track.id}
                  className="text-xs px-4 h-9 data-[state=active]:bg-racing-red whitespace-nowrap"
                  onClick={() => setActiveTrack(track)}
                >
                  {track.icon} {track.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RacingHeader;
