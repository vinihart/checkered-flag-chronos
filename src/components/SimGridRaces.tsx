
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

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

interface RaceResult {
  id: string;
  position: number;
  driverName: string;
  teamName?: string;
  lapTime: string;
  raceType: 'quick' | 'halfHour' | 'mini';
  track: string;
}

const SimGridRaces = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [results, setResults] = useState<RaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("races");

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
        track: "Silverstone",
        series: "GT3",
        url: "https://www.thesimgrid.com/championships/14395",
        type: "quick"
      },
      {
        id: "2",
        title: "Half Hour Dash",
        championship: "Half Hour Dash",
        date: halfHourDate.toISOString(),
        track: "Spa-Francorchamps",
        series: "GT3/GT4",
        url: "https://www.thesimgrid.com/championships/14396",
        type: "halfHour"
      },
      {
        id: "3",
        title: "Mini Enduro",
        championship: "Mini Enduro Series",
        date: miniEnduroDate.toISOString(),
        track: "Monza",
        series: "GT3/GT4",
        url: "https://www.thesimgrid.com/championships/14397",
        type: "mini"
      },
    ];

    // Mock results data
    const mockResults: RaceResult[] = [
      { id: "r1", position: 1, driverName: "Max Speed", teamName: "Racing Bulls", lapTime: "1:48.234", raceType: "quick", track: "Silverstone" },
      { id: "r2", position: 2, driverName: "Lewis Power", teamName: "Silver Arrows", lapTime: "1:48.567", raceType: "quick", track: "Silverstone" },
      { id: "r3", position: 3, driverName: "Charles Leader", teamName: "Prancing Horse", lapTime: "1:48.901", raceType: "quick", track: "Silverstone" },
      { id: "r4", position: 1, driverName: "Lando Quick", teamName: "Orange Team", lapTime: "2:15.112", raceType: "halfHour", track: "Spa-Francorchamps" },
      { id: "r5", position: 2, driverName: "Carlos Speed", teamName: "Prancing Horse", lapTime: "2:15.345", raceType: "halfHour", track: "Spa-Francorchamps" },
      { id: "r6", position: 1, driverName: "George Fast", teamName: "Silver Arrows", lapTime: "1:21.789", raceType: "mini", track: "Monza" }
    ];
    
    setRaces(mockRaces);
    setResults(mockResults);
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

  const getResultsUrl = (type: 'quick' | 'halfHour' | 'mini') => {
    switch (type) {
      case 'quick': return 'https://www.thesimgrid.com/championships/14395/results';
      case 'halfHour': return 'https://www.thesimgrid.com/championships/14396/results';
      case 'mini': return 'https://www.thesimgrid.com/championships/14397/results';
      default: return '';
    }
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
        <TabsList className="w-full bg-racing-black border-b border-racing-grey">
          <TabsTrigger 
            value="races" 
            className="flex-1 data-[state=active]:bg-racing-red data-[state=active]:text-white text-racing-silver"
          >
            Races
          </TabsTrigger>
          <TabsTrigger 
            value="results" 
            className="flex-1 data-[state=active]:bg-racing-red data-[state=active]:text-white text-racing-silver"
          >
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="races" className="max-h-80 overflow-y-auto">
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
        </TabsContent>

        <TabsContent value="results" className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-racing-silver">
              Loading results...
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              <Table className="border-collapse w-full">
                <TableHeader>
                  <TableRow className="bg-racing-darkgrey border-b border-racing-grey">
                    <TableHead className="text-xs font-formula text-white py-2 px-3 text-center">POS</TableHead>
                    <TableHead className="text-xs font-formula text-white py-2 px-3 text-left">DRIVER</TableHead>
                    <TableHead className="text-xs font-formula text-white py-2 px-3 text-left hidden sm:table-cell">TEAM</TableHead>
                    <TableHead className="text-xs font-formula text-white py-2 px-3 text-center">LAP TIME</TableHead>
                    <TableHead className="text-xs font-formula text-white py-2 px-3 text-center hidden sm:table-cell">TRACK</TableHead>
                    <TableHead className="text-xs font-formula text-white py-2 px-3 text-center">VIEW</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id} className="border-b border-racing-grey hover:bg-racing-darkgrey">
                      <TableCell className="py-1.5 px-3 text-center font-formula font-bold">{result.position}</TableCell>
                      <TableCell className="py-1.5 px-3 text-left">{result.driverName}</TableCell>
                      <TableCell className="py-1.5 px-3 text-left hidden sm:table-cell text-racing-silver">{result.teamName || "-"}</TableCell>
                      <TableCell className="py-1.5 px-3 text-center font-formula font-bold">{result.lapTime}</TableCell>
                      <TableCell className="py-1.5 px-3 text-center text-racing-silver hidden sm:table-cell">{result.track}</TableCell>
                      <TableCell className="py-1.5 px-3 text-center">
                        <Button 
                          onClick={() => window.open(getResultsUrl(result.raceType), '_blank')} 
                          size="sm" 
                          variant="outline" 
                          className="bg-transparent hover:bg-racing-red/20 text-racing-silver hover:text-white text-xs border-racing-grey py-1 px-2"
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-4 text-center text-racing-silver">
              No results found.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimGridRaces;
