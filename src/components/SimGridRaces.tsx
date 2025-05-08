
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Race {
  id: string;
  title: string;
  championship?: string;
  date: string;
  track: string;
  series: string;
  url: string;
  type: 'quick' | 'halfHour' | 'mini';
}

const SimGridRaces = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  // For demo purposes, populate with mock data representing the different series
  useEffect(() => {
    // In a real application, this would fetch data from The SimGrid API
    const currentDate = new Date();
    
    // Quick Race (updates every 5 minutes)
    const quickRaceDate = new Date(currentDate);
    quickRaceDate.setMinutes(quickRaceDate.getMinutes() + (5 - (quickRaceDate.getMinutes() % 5)));
    
    // Half Hour Dash (updates every 20 minutes)
    const halfHourDate = new Date(currentDate);
    halfHourDate.setMinutes(halfHourDate.getMinutes() + (20 - (halfHourDate.getMinutes() % 20)));
    
    // Mini Enduro (updates every 30 minutes)
    const miniEnduroDate = new Date(currentDate);
    miniEnduroDate.setMinutes(miniEnduroDate.getMinutes() + (30 - (miniEnduroDate.getMinutes() % 30)));
    
    const mockRaces: Race[] = [
      {
        id: "1",
        title: "Quick Race",
        championship: "Quick Race Series",
        date: quickRaceDate.toISOString(),
        track: "Red Bull Ring",
        series: "GT3",
        url: "https://www.thesimgrid.com/championships/14395",
        type: "quick"
      },
      {
        id: "2",
        title: "Half Hour Dash",
        championship: "Half Hour Dash",
        date: halfHourDate.toISOString(),
        track: "Mount Panorama",
        series: "GT3/GT4",
        url: "https://www.thesimgrid.com/championships/14396",
        type: "halfHour"
      },
      {
        id: "3",
        title: "Mini Enduro",
        championship: "Mini Enduro Series",
        date: miniEnduroDate.toISOString(),
        track: "Circuit de Barcelona-Catalunya",
        series: "GT3/GT4",
        url: "https://www.thesimgrid.com/championships/14397",
        type: "mini"
      },
    ];

    setRaces(mockRaces);
    setLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRefreshInterval = (type: 'quick' | 'halfHour' | 'mini') => {
    switch (type) {
      case 'quick': return '5 minutes';
      case 'halfHour': return '20 minutes';
      case 'mini': return '30 minutes';
      default: return 'regularly';
    }
  };

  return (
    <div className="bg-racing-black text-white rounded-sm overflow-hidden mb-4 border border-racing-grey">
      <div className="bg-racing-darkgrey p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-racing-red" />
          <h2 className="font-formula text-base">NEXT TEAM'S EVENTS</h2>
        </div>
        <a 
          href="https://www.thesimgrid.com/seasons" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs text-racing-silver hover:text-white transition-colors"
        >
          View All
        </a>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-racing-silver">
            Loading races...
          </div>
        ) : races.length > 0 ? (
          <div className="space-y-2 p-2">
            {races.map((race) => (
              <div 
                key={race.id} 
                className="bg-racing-darkgrey hover:bg-racing-grey p-3 rounded border border-racing-grey cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-formula text-racing-red text-sm mb-1">{race.title}</div>
                    <div className="text-sm font-medium">{race.track}</div>
                    <div className="text-xs text-racing-silver">{race.series}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatDate(race.date)}</div>
                    <div className="text-xs text-racing-silver">Updates every {getRefreshInterval(race.type)}</div>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button 
                    onClick={() => window.open(race.url, '_blank')} 
                    size="sm" 
                    variant="outline" 
                    className="bg-racing-red hover:bg-racing-red/80 text-white border-0"
                  >
                    Join Race
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-racing-silver">
            No upcoming races found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SimGridRaces;
