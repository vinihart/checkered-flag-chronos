
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Race {
  id: string;
  title: string;
  championship?: string;
  date: string;
  track: string;
  series: string;
  url: string;
}

const SimGridRaces = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  // For demo purposes, populate with mock data
  useEffect(() => {
    // In a real application, this would fetch data from The SimGrid API
    const mockRaces: Race[] = [
      {
        id: "1",
        title: "GT World Challenge Europe - Round 1",
        championship: "GT World Challenge",
        date: "2025-05-15",
        track: "Monza",
        series: "GT3",
        url: "https://www.thesimgrid.com/championships/gt-world-challenge-europe"
      },
      {
        id: "2",
        title: "Endurance Series - 6 Hours of Spa",
        championship: "Endurance Series",
        date: "2025-05-22",
        track: "Spa-Francorchamps",
        series: "GT3/GT4",
        url: "https://www.thesimgrid.com/championships/endurance-series"
      },
      {
        id: "3",
        title: "Sprint Cup - Brands Hatch",
        championship: "Sprint Cup",
        date: "2025-06-01",
        track: "Brands Hatch",
        series: "GT3",
        url: "https://www.thesimgrid.com/championships/sprint-cup"
      },
      {
        id: "4",
        title: "Special Event - 24h Nürburgring",
        championship: "Special Events",
        date: "2025-06-15",
        track: "Nürburgring",
        series: "GT3/GT4",
        url: "https://www.thesimgrid.com/special-events"
      },
    ];

    setRaces(mockRaces);
    setLoading(false);
  }, []);

  // Filter races based on the selected tab
  const filteredRaces = races.filter(race => {
    const eventDate = new Date(race.date);
    const today = new Date();
    
    if (activeTab === "upcoming") {
      return eventDate >= today;
    } else {
      return eventDate < today;
    }
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-racing-black text-white rounded-sm overflow-hidden mb-4 border border-racing-grey">
      <div className="bg-racing-darkgrey p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-racing-red" />
          <h2 className="font-formula text-base">SIMGRID RACES</h2>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-racing-black p-0">
          <TabsTrigger 
            value="upcoming" 
            className="flex-1 rounded-none data-[state=active]:bg-racing-red data-[state=active]:text-white text-racing-silver"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger 
            value="recent" 
            className="flex-1 rounded-none data-[state=active]:bg-racing-red data-[state=active]:text-white text-racing-silver"
          >
            Recent
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="m-0">
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-racing-silver">
                Loading races...
              </div>
            ) : filteredRaces.length > 0 ? (
              <table className="w-full border-collapse">
                <thead className="bg-racing-black sticky top-0">
                  <tr className="border-b border-racing-grey">
                    <th className="p-2 text-left text-xs font-formula tracking-wider">EVENT</th>
                    <th className="p-2 text-left text-xs font-formula tracking-wider">DATE</th>
                    <th className="p-2 text-left text-xs font-formula tracking-wider">SERIES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRaces.map((race, index) => (
                    <tr 
                      key={race.id} 
                      className={`border-b border-racing-grey hover:bg-racing-darkgrey cursor-pointer ${index % 2 === 0 ? "bg-racing-black" : "bg-[#1A1A1A]"}`}
                      onClick={() => window.open(race.url, '_blank')}
                    >
                      <td className="p-2 text-sm">
                        <div className="font-medium">{race.title}</div>
                        <div className="text-xs text-racing-silver">{race.track}</div>
                      </td>
                      <td className="p-2 text-sm">{formatDate(race.date)}</td>
                      <td className="p-2 text-sm">{race.series}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 text-center text-racing-silver">
                No upcoming races found.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="m-0">
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-racing-silver">
                Loading races...
              </div>
            ) : filteredRaces.length > 0 ? (
              <table className="w-full border-collapse">
                <thead className="bg-racing-black sticky top-0">
                  <tr className="border-b border-racing-grey">
                    <th className="p-2 text-left text-xs font-formula tracking-wider">EVENT</th>
                    <th className="p-2 text-left text-xs font-formula tracking-wider">DATE</th>
                    <th className="p-2 text-left text-xs font-formula tracking-wider">SERIES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRaces.map((race, index) => (
                    <tr 
                      key={race.id} 
                      className={`border-b border-racing-grey hover:bg-racing-darkgrey cursor-pointer ${index % 2 === 0 ? "bg-racing-black" : "bg-[#1A1A1A]"}`}
                      onClick={() => window.open(race.url, '_blank')}
                    >
                      <td className="p-2 text-sm">
                        <div className="font-medium">{race.title}</div>
                        <div className="text-xs text-racing-silver">{race.track}</div>
                      </td>
                      <td className="p-2 text-sm">{formatDate(race.date)}</td>
                      <td className="p-2 text-sm">{race.series}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 text-center text-racing-silver">
                No recent races found.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimGridRaces;
