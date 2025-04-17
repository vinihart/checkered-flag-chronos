
import React, { useState, useEffect } from "react";
import { LapTime, Track, MOCK_LAP_TIMES, MOCK_TRACKS, detectAnomalies } from "@/types/racing";
import RacingHeader from "@/components/RacingHeader";
import LeaderboardTable from "@/components/LeaderboardTable";
import LeaderboardFilters from "@/components/LeaderboardFilters";
import LapTimeForm from "@/components/LapTimeForm";
import AdminPanel from "@/components/AdminPanel";

const Index = () => {
  // State for lap times
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  
  // Filters
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [selectedCarFilter, setSelectedCarFilter] = useState("all_cars");
  const [selectedTeamFilter, setSelectedTeamFilter] = useState("");
  
  // Modals
  const [submitFormOpen, setSubmitFormOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [editingLapTime, setEditingLapTime] = useState<LapTime | null>(null);
  
  // Load initial data
  useEffect(() => {
    setLapTimes(MOCK_LAP_TIMES);
  }, []);
  
  // Filter lap times based on selected filters
  const filteredLapTimes = lapTimes.filter(lap => {
    // Track filter
    if (activeTrack && lap.trackId !== activeTrack.id) {
      return false;
    }
    
    // Car filter
    if (selectedCarFilter !== "all_cars" && lap.carId !== selectedCarFilter) {
      return false;
    }
    
    // Team filter - now using string match for manually entered team names
    if (selectedTeamFilter && lap.teamId) {
      return lap.teamId.toLowerCase().includes(selectedTeamFilter.toLowerCase());
    }
    
    return true;
  }).sort((a, b) => a.lapTimeMs - b.lapTimeMs);
  
  // Reset all filters
  const resetFilters = () => {
    setActiveTrack(null);
    setSelectedCarFilter("all_cars");
    setSelectedTeamFilter("");
  };
  
  // Add or update lap time
  const handleSubmitLapTime = (newLapTime: LapTime) => {
    // If editing, update existing lap time
    if (editingLapTime) {
      setLapTimes(prev => 
        prev.map(lap => lap.id === newLapTime.id ? newLapTime : lap)
      );
      setEditingLapTime(null);
    } else {
      // Add new lap time
      setLapTimes(prev => [...prev, newLapTime]);
    }
  };
  
  // Delete lap time
  const handleDeleteLapTime = (id: string) => {
    // Delete all lap times
    if (id === "delete-all") {
      setLapTimes([]);
    } else {
      // Delete specific lap time
      setLapTimes(prev => prev.filter(lap => lap.id !== id));
    }
  };
  
  // Open edit form
  const handleEditLapTime = (lapTime: LapTime) => {
    setEditingLapTime(lapTime);
    setSubmitFormOpen(true);
  };
  
  // Run anomaly detection
  const handleRunAnomalyDetection = () => {
    const flaggedLaps = detectAnomalies(lapTimes);
    setLapTimes(flaggedLaps);
  };

  return (
    <div className="min-h-screen flex flex-col bg-racing-black font-racing">
      {/* Racing Header */}
      <RacingHeader
        activeTrack={activeTrack}
        setActiveTrack={setActiveTrack}
        tracks={MOCK_TRACKS}
        onShowSubmitForm={() => {
          setEditingLapTime(null);
          setSubmitFormOpen(true);
        }}
        onShowAdminPanel={() => setAdminPanelOpen(true)}
      />
      
      {/* Filters */}
      <LeaderboardFilters
        selectedCarFilter={selectedCarFilter}
        setSelectedCarFilter={setSelectedCarFilter}
        selectedTeamFilter={selectedTeamFilter}
        setSelectedTeamFilter={setSelectedTeamFilter}
        resetFilters={resetFilters}
      />
      
      {/* Main content */}
      <div className="flex-1 p-4 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <div className="bg-racing-red p-2 flex justify-between items-center mb-1">
            <h2 className="text-white font-formula text-lg tracking-wider">LEADERBOARD</h2>
            <div className="text-white text-sm">
              {filteredLapTimes.length} {filteredLapTimes.length === 1 ? "Entry" : "Entries"}
            </div>
          </div>
          
          {/* Leaderboard Table */}
          {filteredLapTimes.length > 0 ? (
            <LeaderboardTable lapTimes={filteredLapTimes} />
          ) : (
            <div className="bg-racing-darkgrey p-6 text-center text-racing-silver">
              No lap times found. Adjust filters or submit a new lap time.
            </div>
          )}
        </div>
      </div>
      
      {/* Submit Lap Time Form */}
      <LapTimeForm
        open={submitFormOpen}
        onOpenChange={setSubmitFormOpen}
        onSubmit={handleSubmitLapTime}
        editingLapTime={editingLapTime}
        isAdmin={true} // For simplicity, everyone is admin in this demo
      />
      
      {/* Admin Panel */}
      <AdminPanel
        open={adminPanelOpen}
        onOpenChange={setAdminPanelOpen}
        lapTimes={lapTimes}
        onEditLapTime={handleEditLapTime}
        onDeleteLapTime={handleDeleteLapTime}
        onRunAnomalyDetection={handleRunAnomalyDetection}
      />
    </div>
  );
};

export default Index;
