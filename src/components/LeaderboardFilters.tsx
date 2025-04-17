
import React from "react";
import { Car, Team, MOCK_CARS, MOCK_TEAMS } from "@/types/racing";
import { Filter, Car as CarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface LeaderboardFiltersProps {
  selectedCarFilter: string;
  setSelectedCarFilter: (car: string) => void;
  selectedTeamFilter: string;
  setSelectedTeamFilter: (team: string) => void;
  resetFilters: () => void;
}

const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = ({
  selectedCarFilter,
  setSelectedCarFilter,
  selectedTeamFilter,
  setSelectedTeamFilter,
  resetFilters,
}) => {
  return (
    <div className="bg-racing-darkgrey p-2 flex flex-col md:flex-row gap-2 items-center justify-between text-white border-b border-racing-grey">
      <div className="flex items-center gap-2">
        <Filter size={16} />
        <span className="font-formula text-sm">FILTERS</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 items-center w-full md:w-auto">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CarIcon size={16} className="text-racing-silver" />
          <Select value={selectedCarFilter} onValueChange={setSelectedCarFilter}>
            <SelectTrigger className="bg-racing-black border-racing-grey text-white h-8 w-full sm:w-40">
              <SelectValue placeholder="All Cars" />
            </SelectTrigger>
            <SelectContent className="bg-racing-black border-racing-grey text-white">
              <SelectItem value="all_cars">All Cars</SelectItem>
              {MOCK_CARS.map((car: Car) => (
                <SelectItem key={car.id} value={car.id}>
                  {car.make} {car.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-racing-silver">Team</span>
          <Select value={selectedTeamFilter} onValueChange={setSelectedTeamFilter}>
            <SelectTrigger className="bg-racing-black border-racing-grey text-white h-8 w-full sm:w-40">
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>
            <SelectContent className="bg-racing-black border-racing-grey text-white">
              <SelectItem value="all_teams">All Teams</SelectItem>
              {MOCK_TEAMS.map((team: Team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="border-racing-grey text-racing-silver hover:text-white hover:bg-racing-black h-8"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default LeaderboardFilters;
