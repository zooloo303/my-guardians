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
          <Image src={src} alt={alt} width={40} height={40} />
        </ToggleGroupItem>
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-bold">{value}</div>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <ToggleGroup type="multiple">
        {/* Class Type Filters */}
        {renderToggleGroupItem("Warlock", "/class-warlock.svg", "class-warlock" )}
        {renderToggleGroupItem("Hunter", "/class-hunter.svg", "class-hunter")}
        {renderToggleGroupItem("Titan", "/class-titan.svg", "class-titan")}

        {/* Item Category Filters */}
        {renderToggleGroupItem("Helmet", "/helmet.svg", "helmet")}
        {renderToggleGroupItem("Gauntlets", "/arms.svg", "arms")}
        {renderToggleGroupItem("Chest Armor", "/chest.svg", "chest")}
        {renderToggleGroupItem("Leg Armor", "/legs.svg", "legs")}
        {renderToggleGroupItem("Class Item", "/class.svg", "class")}
      </ToggleGroup>
    </TooltipProvider>
  );
};

export default ArmorFilters;
