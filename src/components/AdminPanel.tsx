
import React, { useState } from "react";
import { LapTime, detectAnomalies } from "@/types/racing";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { X, AlertTriangle, Shield } from "lucide-react";
import LeaderboardTable from "./LeaderboardTable";

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lapTimes: LapTime[];
  onEditLapTime: (lapTime: LapTime) => void;
  onDeleteLapTime: (id: string) => void;
  onRunAnomalyDetection: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  open,
  onOpenChange,
  lapTimes,
  onEditLapTime,
  onDeleteLapTime,
  onRunAnomalyDetection,
}) => {
  const [showingId, setShowingId] = useState<string | null>(null);
  
  // Filter flagged lap times for anomaly section
  const flaggedLapTimes = lapTimes.filter(lap => lap.isFlagged);
  
  const handleConfirmDelete = () => {
    if (showingId) {
      onDeleteLapTime(showingId);
      setShowingId(null);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-racing-darkgrey text-white border-racing-grey max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-formula text-xl flex items-center gap-2">
              <Shield size={18} />
              Admin Panel
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
            Manage lap times and run anomaly detection
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-formula font-bold">All Lap Times</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRunAnomalyDetection}
                className="bg-racing-black border-racing-grey text-racing-silver hover:text-white flex items-center gap-1"
              >
                <AlertTriangle size={14} />
                Run Anomaly Detection
              </Button>
            </div>
            <LeaderboardTable 
              lapTimes={lapTimes} 
              onEditLapTime={onEditLapTime}
            />
          </div>
          
          {flaggedLapTimes.length > 0 && (
            <div>
              <h3 className="text-lg font-formula font-bold flex items-center gap-2 text-yellow-500 mb-2">
                <AlertTriangle size={18} />
                Flagged Lap Times
              </h3>
              <p className="text-sm text-racing-silver mb-2">
                The following lap times have been flagged as potential anomalies.
              </p>
              <LeaderboardTable 
                lapTimes={flaggedLapTimes} 
                onEditLapTime={onEditLapTime}
              />
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between gap-2 pt-4">
          <div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setShowingId("delete-all")}
              className="bg-racing-red hover:bg-red-700"
            >
              Delete All Lap Times
            </Button>
          </div>
          <Button 
            size="sm"
            onClick={() => onOpenChange(false)}
            className="bg-racing-darkgrey border-racing-grey text-white hover:bg-racing-black"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* Confirmation Dialog */}
      {showingId && (
        <Dialog open={!!showingId} onOpenChange={(open) => !open && setShowingId(null)}>
          <DialogContent className="bg-racing-darkgrey text-white border-racing-grey">
            <DialogHeader>
              <DialogTitle className="font-formula text-xl">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-racing-silver">
                {showingId === "delete-all" 
                  ? "Are you sure you want to delete all lap times? This action cannot be undone."
                  : "Are you sure you want to delete this lap time? This action cannot be undone."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowingId(null)}
                className="border-racing-grey text-racing-silver hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
                className="bg-racing-red hover:bg-red-700"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default AdminPanel;
