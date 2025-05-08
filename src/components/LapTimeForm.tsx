
import React, { useState, useEffect } from "react";
import { Car, LapTime, Track, MOCK_CARS, MOCK_TRACKS, lapTimeToMs } from "@/types/racing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { X, Clock } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface LapTimeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (lapTime: LapTime) => void;
  editingLapTime?: LapTime | null;
  isAdmin?: boolean;
}

const LapTimeForm: React.FC<LapTimeFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editingLapTime = null,
  isAdmin = false,
}) => {
  const [driverName, setDriverName] = useState("");
  const [driverTag, setDriverTag] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [teamName, setTeamName] = useState("");
  const [lapTime, setLapTime] = useState("");
  const [lapTimeError, setLapTimeError] = useState("");

  useEffect(() => {
    if (editingLapTime) {
      setDriverName(editingLapTime.driverName);
      setDriverTag(editingLapTime.driverTag || "");
      setSelectedTrack(editingLapTime.trackId);
      setSelectedCar(editingLapTime.carId);
      setTeamName(editingLapTime.teamId || "");
      setLapTime(editingLapTime.lapTime);
    } else {
      resetForm();
    }
  }, [editingLapTime, open]);

  const resetForm = () => {
    setDriverName("");
    setDriverTag("");
    setSelectedTrack("");
    setSelectedCar("");
    setTeamName("");
    setLapTime("");
    setLapTimeError("");
  };

  const validateLapTime = (time: string): boolean => {
    // Validate format (M:SS:mmm or MM:SS:mmm)
    const regex = /^([0-9]{1,2}):([0-5][0-9]):([0-9]{1,3})$/;
    if (!regex.test(time)) {
      setLapTimeError("Invalid format. Use M:SS:mmm");
      return false;
    }
    
    setLapTimeError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLapTime(lapTime)) {
      return;
    }
    
    if (!driverName || !selectedTrack || !selectedCar) {
      return;
    }
    
    const lapTimeData: LapTime = {
      id: editingLapTime ? editingLapTime.id : uuidv4(),
      driverName,
      driverTag: driverTag || undefined,
      trackId: selectedTrack,
      carId: selectedCar,
      teamId: teamName || undefined,
      lapTime,
      lapTimeMs: lapTimeToMs(lapTime),
      date: new Date().toISOString().split('T')[0],
      status: "neutral",
      positionChange: 0,
    };
    
    onSubmit(lapTimeData);
    onOpenChange(false);
    if (!editingLapTime) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-racing-darkgrey text-white border-racing-grey">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-formula text-xl flex items-center gap-2">
              <Clock size={18} />
              {editingLapTime ? (isAdmin ? "Edit Lap Time" : "Lap Time Details") : "Submit Lap Time"}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="text-racing-silver hover:text-white"
            >
              <X size={18} />
            </Button>
          </div>
          <DialogDescription className="text-racing-silver">
            {editingLapTime 
              ? (isAdmin 
                ? "Edit the lap time details below" 
                : "View the lap time details below")
              : "Enter your lap time details below"
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-racing-silver">Driver Name*</label>
              <Input 
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Full Name"
                required
                className="bg-racing-black border-racing-grey text-white"
                readOnly={!isAdmin && !!editingLapTime}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-racing-silver">Driver Tag</label>
              <Input 
                value={driverTag}
                onChange={(e) => setDriverTag(e.target.value.toUpperCase())}
                placeholder="3-letter code (e.g., HAM)"
                maxLength={3}
                className="bg-racing-black border-racing-grey text-white uppercase"
                readOnly={!isAdmin && !!editingLapTime}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-racing-silver">Track*</label>
              <Select
                value={selectedTrack}
                onValueChange={setSelectedTrack}
                disabled={!isAdmin && !!editingLapTime}
                required
              >
                <SelectTrigger className="bg-racing-black border-racing-grey text-white">
                  <SelectValue placeholder="Select a track" />
                </SelectTrigger>
                <SelectContent className="bg-racing-black border-racing-grey text-white">
                  {MOCK_TRACKS.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      <div className="flex items-center gap-2">
                        <span>{track.icon}</span>
                        <span>{track.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-racing-silver">Car*</label>
              <Select
                value={selectedCar}
                onValueChange={setSelectedCar}
                disabled={!isAdmin && !!editingLapTime}
                required
              >
                <SelectTrigger className="bg-racing-black border-racing-grey text-white">
                  <SelectValue placeholder="Select a car" />
                </SelectTrigger>
                <SelectContent className="bg-racing-black border-racing-grey text-white">
                  {MOCK_CARS.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.make} {car.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-racing-silver">Team Name (Optional)</label>
              <Input 
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                className="bg-racing-black border-racing-grey text-white"
                readOnly={!isAdmin && !!editingLapTime}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-racing-silver">Lap Time* (Format: M:SS:mmm)</label>
              <Input 
                value={lapTime}
                onChange={(e) => setLapTime(e.target.value)}
                placeholder="1:23:456"
                required
                className={`bg-racing-black border-racing-grey text-white ${lapTimeError ? "border-status-slower" : ""}`}
                readOnly={!isAdmin && !!editingLapTime}
              />
              {lapTimeError && <p className="text-status-slower text-xs">{lapTimeError}</p>}
            </div>
          </div>
          
          <DialogFooter>
            {(!editingLapTime || isAdmin) && (
              <Button 
                type="submit" 
                className="bg-racing-red hover:bg-red-700 text-white"
              >
                {editingLapTime ? "Update Lap Time" : "Submit Lap Time"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LapTimeForm;
