
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LapTime, Track, MOCK_LAP_TIMES, MOCK_TRACKS, detectAnomalies, reportLapTime, clearReviewFlag } from "@/types/racing";
import RacingHeader from "@/components/RacingHeader";
import LeaderboardTable from "@/components/LeaderboardTable";
import LapTimeForm from "@/components/LapTimeForm";
import AdminPanel from "@/components/AdminPanel";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  // State for lap times
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  
  // Track selection
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  
  // Modals
  const [submitFormOpen, setSubmitFormOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [editingLapTime, setEditingLapTime] = useState<LapTime | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);
  
  // Load initial data
  useEffect(() => {
    // In a real app, we would fetch lap times from a database
    // For this demo, we'll use the MOCK_LAP_TIMES which is now empty as requested
    setLapTimes(MOCK_LAP_TIMES);
    
    // Load stored lap times from localStorage if available
    const storedLapTimes = localStorage.getItem("lapTimes");
    if (storedLapTimes) {
      setLapTimes(JSON.parse(storedLapTimes));
    }
  }, []);
  
  // Save lap times to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lapTimes", JSON.stringify(lapTimes));
  }, [lapTimes]);
  
  // Filter lap times based on selected track
  const filteredLapTimes = lapTimes.filter(lap => {
    // Track filter
    if (activeTrack && lap.trackId !== activeTrack.id) {
      return false;
    }
    
    return true;
  }).sort((a, b) => a.lapTimeMs - b.lapTimeMs);
  
  // Add or update lap time
  const handleSubmitLapTime = (newLapTime: LapTime) => {
    // If editing, update existing lap time
    if (editingLapTime) {
      setLapTimes(prev => 
        prev.map(lap => lap.id === newLapTime.id ? newLapTime : lap)
      );
      setEditingLapTime(null);
      
      toast({
        title: "Lap Time Updated",
        description: "Your lap time has been successfully updated.",
      });
    } else {
      // Add new lap time
      setLapTimes(prev => [...prev, newLapTime]);
      
      toast({
        title: "Lap Time Submitted",
        description: "Your lap time has been successfully recorded.",
      });
    }
  };
  
  // Delete lap time
  const handleDeleteLapTime = (id: string) => {
    // Delete all lap times
    if (id === "delete-all") {
      setLapTimes([]);
      toast({
        title: "All Lap Times Deleted",
        description: "The leaderboard has been cleared.",
      });
    } else {
      // Delete specific lap time
      setLapTimes(prev => prev.filter(lap => lap.id !== id));
      toast({
        title: "Lap Time Deleted",
        description: "The lap time has been removed from the leaderboard.",
      });
    }
  };
  
  // Open edit form
  const handleEditLapTime = (lapTime: LapTime) => {
    // Get pilot info
    const storedPilotInfo = localStorage.getItem("pilotRegistration");
    if (storedPilotInfo) {
      const pilotInfo = JSON.parse(storedPilotInfo);
      
      // Only allow editing own lap times
      if (pilotInfo.pilot === lapTime.driverName) {
        setEditingLapTime(lapTime);
        setSubmitFormOpen(true);
      } else {
        toast({
          variant: "destructive",
          title: "Cannot Edit",
          description: "You can only edit your own lap times.",
        });
      }
    }
  };
  
  // Handle reporting a lap time
  const handleReportLapTime = (lapTime: LapTime) => {
    if (lapTime.underReview) {
      toast({
        title: "Already Under Review",
        description: "This lap time is already being reviewed.",
      });
      return;
    }
    
    setLapTimes(reportLapTime(lapTimes, lapTime.id));
    
    toast({
      title: "Lap Time Reported",
      description: "The lap time has been flagged for review.",
    });
  };
  
  // Run anomaly detection
  const handleRunAnomalyDetection = () => {
    const flaggedLaps = detectAnomalies(lapTimes);
    setLapTimes(flaggedLaps);
    
    toast({
      title: "Anomaly Detection Complete",
      description: "Suspicious lap times have been flagged for review.",
    });
  };
  
  // Clear review flag
  const handleClearReviewFlag = (lapTimeId: string) => {
    setLapTimes(clearReviewFlag(lapTimes, lapTimeId));
    
    toast({
      title: "Review Complete",
      description: "The lap time has been approved.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-racing-black font-racing">
      {/* Racing Header with Track Selection */}
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
      
      {/* Main content */}
      <div className="flex-1 p-4 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <div className="bg-racing-red p-2 flex justify-between items-center mb-1">
            <h2 className="text-white font-formula text-lg tracking-wider">LEADERBOARD</h2>
            <div className="text-white text-sm">
              {filteredLapTimes.length} {filteredLapTimes.length === 1 ? "Entry" : "Entries"}
            </div>
          </div>
          
          {/* Track Information */}
          {activeTrack && (
            <div className="bg-racing-darkgrey p-2 mb-1 flex items-center justify-between">
              <span className="text-white font-formula">
                <span className="text-racing-silver mr-2">TRACK:</span> 
                {activeTrack.icon} {activeTrack.name}, {activeTrack.country}
              </span>
              
              {activeTrack.recordTime && (
                <span className="text-white font-formula text-sm">
                  <span className="text-racing-silver">GT3 Record:</span> {activeTrack.recordTime}
                </span>
              )}
            </div>
          )}
          
          {/* Leaderboard Table */}
          <LeaderboardTable 
            lapTimes={filteredLapTimes} 
            onEditLapTime={handleEditLapTime} 
            onReportLapTime={handleReportLapTime}
          />
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
      
      {/* Admin Panel - enhanced with review functionality */}
      <AdminPanel
        open={adminPanelOpen}
        onOpenChange={setAdminPanelOpen}
        lapTimes={lapTimes}
        onEditLapTime={handleEditLapTime}
        onDeleteLapTime={handleDeleteLapTime}
        onRunAnomalyDetection={handleRunAnomalyDetection}
        onClearReviewFlag={handleClearReviewFlag}
      />
    </div>
  );
};

export default Index;
