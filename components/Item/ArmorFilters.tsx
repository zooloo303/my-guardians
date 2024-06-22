import Image from "next/image";
import React, { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ArmorFiltersProps {
  onFilterChange: (filters: string[]) => void;
}

const ArmorFilters: React.FC<ArmorFiltersProps> = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterChange = (value: string) => {
    const newFilters = selectedFilters.includes(value)
      ? selectedFilters.filter((filter) => filter !== value)
      : [...selectedFilters, value];
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const renderToggleGroupItem = (value: string, src: string, alt: string) => (
    <Tooltip key={value}>
      <TooltipTrigger asChild>
        <ToggleGroupItem
          value={value}
          aria-label={`Toggle ${value}`}
          onClick={() => handleFilterChange(value)}
          className={selectedFilters.includes(value) ? "bg-slate-700" : ""}
        >
          <Image src={src} alt={alt} width={30} height={30} />
        </ToggleGroupItem>
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-bold">{value}</div>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className="flex flex-col">
      <ToggleGroup className="grid flex-wrap grid-cols-3" type="single">
        {/* Class Type Filters */}
        {renderToggleGroupItem("Warlock", "/class-warlock.svg", "class-warlock" )}
        {renderToggleGroupItem("Hunter", "/class-hunter.svg", "class-hunter")}
        {renderToggleGroupItem("Titan", "/class-titan.svg", "class-titan")}
      </ToggleGroup>
      <ToggleGroup className="grid flex-wrap grid-cols-5" type="single">
        {/* Item Category Filters */}
        {renderToggleGroupItem("Helmet", "/helmet.svg", "helmet")}
        {renderToggleGroupItem("Gauntlets", "/arms.svg", "arms")}
        {renderToggleGroupItem("Chest Armor", "/chest.svg", "chest")}
        {renderToggleGroupItem("Leg Armor", "/legs.svg", "legs")}
        {renderToggleGroupItem("Class Item", "/class.svg", "class")}
      </ToggleGroup>
      </div>
    </TooltipProvider>
  );
};

export default ArmorFilters;
