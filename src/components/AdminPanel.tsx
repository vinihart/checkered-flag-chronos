
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LapTime } from "@/types/racing";
import { PlusCircle, Trash2, AlertTriangle, Clock, CheckCircle, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lapTimes: LapTime[];
  onEditLapTime: (lapTime: LapTime) => void;
  onDeleteLapTime: (id: string) => void;
  onRunAnomalyDetection: () => void;
  onClearReviewFlag?: (lapTimeId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  open,
  onOpenChange,
  lapTimes,
  onEditLapTime,
  onDeleteLapTime,
  onRunAnomalyDetection,
  onClearReviewFlag,
}) => {
  // Filter lap times that are under review or flagged
  const flaggedLapTimes = lapTimes.filter(lap => lap.underReview || lap.isFlagged);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-racing-darkgrey text-white border-racing-grey max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-formula text-xl flex items-center gap-2">
            <Users size={18} />
            Admin Panel
          </DialogTitle>
          <DialogDescription className="text-racing-silver">
            Manage lap times and perform administrative tasks
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-formula text-lg mb-2 flex items-center gap-2">
              <AlertTriangle size={16} className="text-yellow-500" />
              Lap Times Under Review
            </h3>
            
            {flaggedLapTimes.length === 0 ? (
              <p className="text-racing-silver italic">No lap times currently under review or flagged.</p>
            ) : (
              <div className="border border-racing-grey rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-racing-black">
                    <TableRow>
                      <TableHead className="text-white">Driver</TableHead>
                      <TableHead className="text-white">Track</TableHead>
                      <TableHead className="text-white">Time</TableHead>
                      <TableHead className="text-white">Date</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-racing-black">
                    {flaggedLapTimes.map((lapTime) => (
                      <TableRow key={lapTime.id} className="hover:bg-racing-darkgrey/50">
                        <TableCell className="font-medium text-white">
                          {lapTime.driverName}
                          {lapTime.underReview && 
                            <span className="ml-2 h-2 w-2 bg-yellow-500 rounded-full inline-block"></span>
                          }
                          {lapTime.isFlagged && 
                            <AlertTriangle size={14} className="text-yellow-500 ml-1 inline" />
                          }
                        </TableCell>
                        <TableCell className="text-racing-silver">{
                          lapTimes.find(t => t.trackId === lapTime.trackId)?.trackId || lapTime.trackId
                        }</TableCell>
                        <TableCell className="text-racing-silver font-mono">{lapTime.lapTime}</TableCell>
                        <TableCell className="text-racing-silver">{lapTime.date}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-transparent text-white border-racing-grey hover:bg-racing-grey hover:text-white"
                            onClick={() => onEditLapTime(lapTime)}
                          >
                            <Clock size={14} className="mr-1" />
                            Edit
                          </Button>
                          {lapTime.underReview && onClearReviewFlag && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-transparent text-green-500 border-green-800 hover:bg-green-900 hover:text-green-400"
                              onClick={() => onClearReviewFlag(lapTime.id)}
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Approve
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-transparent text-racing-red border-racing-red/30 hover:bg-racing-red/20 hover:text-red-400"
                            onClick={() => onDeleteLapTime(lapTime.id)}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 justify-between">
            <div className="flex gap-2">
              <Button 
                onClick={onRunAnomalyDetection} 
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <AlertTriangle size={16} className="mr-1" />
                Run Anomaly Detection
              </Button>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={() => onDeleteLapTime("delete-all")} 
              className="bg-racing-red hover:bg-red-900"
            >
              <Trash2 size={16} className="mr-1" />
              Clear All Lap Times
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
