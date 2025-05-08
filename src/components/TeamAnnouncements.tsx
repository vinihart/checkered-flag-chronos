
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare, Pin } from 'lucide-react';
import { v4 as uuidv4 } from "uuid";

type TeamAnnouncement = {
  id: string;
  title: string;
  content: string;
  date: string;
  authorName: string;
};

type Team = {
  id: string;
  name: string;
  logo?: string;
  members: {
    name: string;
    role: "admin" | "assistant" | "member";
  }[];
  announcements: TeamAnnouncement[];
};

interface TeamAnnouncementsProps {
  team: Team;
  canManage: boolean;
  onAddAnnouncement: (announcement: TeamAnnouncement) => void;
}

const TeamAnnouncements: React.FC<TeamAnnouncementsProps> = ({ team, canManage, onAddAnnouncement }) => {
  const [newAnnouncementOpen, setNewAnnouncementOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;
    
    const pilotInfo = JSON.parse(localStorage.getItem("pilotRegistration") || "{}");
    
    const newAnnouncement: TeamAnnouncement = {
      id: uuidv4(),
      title,
      content,
      date: new Date().toISOString(),
      authorName: pilotInfo.pilot || 'Unknown',
    };
    
    onAddAnnouncement(newAnnouncement);
    setNewAnnouncementOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="bg-racing-darkgrey p-4 rounded">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-formula text-lg flex items-center gap-2">
          <MessageSquare size={18} className="text-racing-red" />
          Team Announcements
        </h3>
        
        {canManage && (
          <Button 
            onClick={() => setNewAnnouncementOpen(true)}
            className="bg-racing-red hover:bg-red-700 text-white"
          >
            New Announcement
          </Button>
        )}
      </div>
      
      {team.announcements.length === 0 ? (
        <div className="text-center text-racing-silver py-8">
          No announcements posted yet.
          {canManage && (
            <p className="mt-2 text-sm">
              Click the "New Announcement" button to post your first team announcement.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {team.announcements
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(announcement => (
              <div key={announcement.id} className="border border-racing-grey p-3 rounded">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-formula text-base flex items-center gap-1">
                    {announcement.title}
                  </h4>
                  <span className="text-xs text-racing-silver">
                    {new Date(announcement.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm mb-2 whitespace-pre-wrap">{announcement.content}</p>
                <div className="flex justify-between items-center text-xs text-racing-silver">
                  <span>Posted by: {announcement.authorName}</span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* New announcement dialog */}
      <Dialog open={newAnnouncementOpen} onOpenChange={setNewAnnouncementOpen}>
        <DialogContent className="bg-racing-darkgrey text-white border-racing-grey">
          <DialogHeader>
            <DialogTitle className="font-formula">New Team Announcement</DialogTitle>
            <DialogDescription className="text-racing-silver">
              Post an announcement for your team members to see.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-racing-silver">Title*</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement Title"
                required
                className="bg-racing-black border-racing-grey text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-racing-silver">Content*</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Announcement details..."
                required
                className="bg-racing-black border-racing-grey text-white min-h-[100px]"
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewAnnouncementOpen(false)}
                className="border-racing-grey text-racing-silver hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-racing-red hover:bg-red-700 text-white"
              >
                Post Announcement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamAnnouncements;
