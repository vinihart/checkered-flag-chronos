
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  CalendarDays, 
  Clock, 
  Flag, 
  Plus, 
  Trophy,
  X,
  Edit2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { RacingEvent, MOCK_TRACKS } from "@/types/racing";
import { Textarea } from "@/components/ui/textarea";

interface EventsPanelProps {
  events: RacingEvent[];
  isAdmin: boolean;
  onEventUpdated: (events: RacingEvent[]) => void;
  title?: string; // Add the title prop as optional
}

const EventsPanel: React.FC<EventsPanelProps> = ({ events: initialEvents, isAdmin, onEventUpdated, title = "UPCOMING EVENTS" }) => {
  const [events, setEvents] = useState<RacingEvent[]>(initialEvents);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventFormData, setEventFormData] = useState<Partial<RacingEvent>>({
    title: "",
    description: "",
    trackId: "",
    startDate: "",
    endDate: "",
    isPublic: true
  });
  const [editingEvent, setEditingEvent] = useState<RacingEvent | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load events from localStorage
    const savedEvents = localStorage.getItem("racingEvents");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else if (initialEvents.length > 0) {
      setEvents(initialEvents);
    }
  }, [initialEvents]);
  
  useEffect(() => {
    // Save events to localStorage when they change
    localStorage.setItem("racingEvents", JSON.stringify(events));
    onEventUpdated(events);
  }, [events, onEventUpdated]);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventFormData.title || !eventFormData.trackId || !eventFormData.startDate || !eventFormData.endDate) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill out all required fields."
      });
      return;
    }
    
    // Get current user info
    const pilotInfo = JSON.parse(localStorage.getItem("pilotRegistration") || "{}");
    const userTeam = JSON.parse(localStorage.getItem("userTeam") || "null");
    
    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === editingEvent.id 
          ? { 
              ...event, 
              ...eventFormData as RacingEvent
            }
          : event
      );
      
      setEvents(updatedEvents);
      
      toast({
        title: "Event Updated",
        description: "The racing event has been updated."
      });
    } else {
      // Create new event
      const newEvent: RacingEvent = {
        id: uuidv4(),
        title: eventFormData.title || "",
        description: eventFormData.description || "",
        trackId: eventFormData.trackId || "",
        startDate: eventFormData.startDate || new Date().toISOString().split('T')[0],
        endDate: eventFormData.endDate || new Date().toISOString().split('T')[0],
        createdBy: pilotInfo.pilot || "Unknown",
        teamId: userTeam?.id,
        isPublic: eventFormData.isPublic !== false,
        isArchived: false
      };
      
      setEvents([...events, newEvent]);
      
      toast({
        title: "Event Created",
        description: "The new racing event has been created."
      });
    }
    
    // Reset form and close dialog
    setEventFormData({
      title: "",
      description: "",
      trackId: "",
      startDate: "",
      endDate: "",
      isPublic: true
    });
    setEditingEvent(null);
    setShowEventForm(false);
  };
  
  const handleEditEvent = (event: RacingEvent) => {
    setEditingEvent(event);
    setEventFormData({
      title: event.title,
      description: event.description,
      trackId: event.trackId,
      startDate: event.startDate,
      endDate: event.endDate,
      isPublic: event.isPublic
    });
    setShowEventForm(true);
  };
  
  const handleArchiveEvent = (eventId: string) => {
    // Archive event
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, isArchived: true } : event
    );
    
    setEvents(updatedEvents);
    
    toast({
      title: "Event Archived",
      description: "The event has been archived."
    });
  };
  
  // Filter for active (not archived) and upcoming events
  const activeEvents = events
    .filter(event => !event.isArchived)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  // Check if event has ended and is within 5 days for showing results
  const isShowingResults = (event: RacingEvent) => {
    const endDate = new Date(event.endDate);
    const today = new Date();
    const daysSinceEnd = Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
    return endDate < today && daysSinceEnd <= 5;
  };
  
  // Check if event is in the future
  const isUpcoming = (event: RacingEvent) => {
    return new Date(event.startDate) > new Date();
  };
  
  // Check if event is happening now
  const isOngoing = (event: RacingEvent) => {
    const today = new Date();
    return new Date(event.startDate) <= today && new Date(event.endDate) >= today;
  };
  
  const getTrackName = (trackId: string) => {
    const track = MOCK_TRACKS.find(t => t.id === trackId);
    return track ? `${track.icon} ${track.name}` : trackId;
  };
  
  return (
    <div className="bg-racing-darkgrey rounded overflow-hidden">
      <div className="bg-racing-red p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-white" />
          <h3 className="font-formula text-white text-lg">{title}</h3>
        </div>
        
        {isAdmin && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowEventForm(true)}
            className="text-white hover:bg-racing-black/30 p-1 h-auto"
          >
            <Plus size={16} />
          </Button>
        )}
      </div>
      
      <div className="p-3">
        {activeEvents.length === 0 ? (
          <div className="text-racing-silver text-center py-6">
            <CalendarDays size={32} className="mx-auto mb-2 opacity-50" />
            <p>No upcoming events scheduled.</p>
            {isAdmin && (
              <Button 
                onClick={() => setShowEventForm(true)}
                variant="outline" 
                className="mt-4 border-racing-grey text-white hover:bg-racing-black"
              >
                <Plus size={16} className="mr-1" />
                Create Event
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {activeEvents.map(event => (
              <div 
                key={event.id} 
                className={`border border-racing-grey rounded overflow-hidden ${
                  isOngoing(event) 
                    ? "bg-racing-red/10 border-racing-red/30" 
                    : isShowingResults(event)
                    ? "bg-racing-black/30 border-racing-grey/50"
                    : "bg-racing-black/20"
                }`}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-formula text-white text-base">{event.title}</h4>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                          className="h-6 w-6 p-0 text-racing-silver hover:text-white"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArchiveEvent(event.id)}
                          className="h-6 w-6 p-0 text-racing-silver hover:text-white"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-racing-silver text-sm mt-1">
                    {getTrackName(event.trackId)}
                  </div>
                  
                  <div className="text-xs text-racing-silver mt-2 flex items-center">
                    <Clock size={12} className="mr-1" />
                    <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
                  </div>
                  
                  {event.description && (
                    <p className="text-sm mt-2 text-white/80">{event.description}</p>
                  )}
                  
                  {/* Event status indicator */}
                  <div className="mt-2">
                    {isOngoing(event) && (
                      <div className="inline-block bg-racing-red text-white text-xs py-0.5 px-2 rounded">
                        <Flag size={12} className="inline mr-1" />
                        Happening now
                      </div>
                    )}
                    
                    {isUpcoming(event) && (
                      <div className="inline-block bg-racing-darkgrey/60 text-white text-xs py-0.5 px-2 rounded">
                        <Calendar size={12} className="inline mr-1" />
                        Upcoming
                      </div>
                    )}
                    
                    {isShowingResults(event) && (
                      <div className="mt-3">
                        <div className="text-xs font-bold text-racing-silver mb-1 flex items-center">
                          <Trophy size={12} className="mr-1 text-racing-red" />
                          RESULTS
                        </div>
                        
                        {event.winners && event.winners.length > 0 ? (
                          <div className="space-y-1">
                            {event.winners.map((winner, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-formula mr-1">{idx + 1}.</span>
                                  {winner.driverName}
                                </div>
                                <div className="font-formula">{winner.lapTime}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-racing-silver">No results posted yet.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Event Form Dialog */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="bg-racing-darkgrey text-white border-racing-grey">
          <DialogHeader>
            <DialogTitle className="font-formula text-xl flex items-center gap-2">
              <Calendar size={18} />
              {editingEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
            <DialogDescription className="text-racing-silver">
              {editingEvent ? "Update the event details below." : "Fill in the details to create a new racing event."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-racing-silver">Event Title*</label>
              <Input
                value={eventFormData.title}
                onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
                className="bg-racing-black border-racing-grey text-white"
                placeholder="e.g., Weekly Time Attack Challenge"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-racing-silver">Track*</label>
              <Select
                value={eventFormData.trackId}
                onValueChange={(value) => setEventFormData({...eventFormData, trackId: value})}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-racing-silver">Start Date*</label>
                <Input
                  type="date"
                  value={eventFormData.startDate}
                  onChange={(e) => setEventFormData({...eventFormData, startDate: e.target.value})}
                  className="bg-racing-black border-racing-grey text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-racing-silver">End Date*</label>
                <Input
                  type="date"
                  value={eventFormData.endDate}
                  onChange={(e) => setEventFormData({...eventFormData, endDate: e.target.value})}
                  className="bg-racing-black border-racing-grey text-white"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-racing-silver">Description</label>
              <Textarea
                value={eventFormData.description}
                onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                className="bg-racing-black border-racing-grey text-white min-h-[80px]"
                placeholder="Provide details about the event..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={eventFormData.isPublic !== false}
                onChange={(e) => setEventFormData({...eventFormData, isPublic: e.target.checked})}
                className="rounded border-racing-grey bg-racing-black"
              />
              <label htmlFor="isPublic" className="text-sm text-racing-silver">
                Make this event visible to all users
              </label>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                  setEventFormData({
                    title: "",
                    description: "",
                    trackId: "",
                    startDate: "",
                    endDate: "",
                    isPublic: true
                  });
                }}
                className="text-racing-silver hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-racing-red hover:bg-red-700 text-white"
              >
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsPanel;
