import Image from "next/image";
import React, { useState } from "react";
import { ArmorFiltersProps } from "@/lib/interfaces";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ArmorFilters: React.FC<ArmorFiltersProps> = ({ onFilterChange }) => {
  const [selectedClassType, setSelectedClassType] = useState<string | null>(null);
  const [selectedArmorType, setSelectedArmorType] = useState<string | null>(null);

  const handleClassFilterChange = (value: string) => {
    const newValue = value === selectedClassType ? null : value;
    setSelectedClassType(newValue);
    onFilterChange(newValue, selectedArmorType);
  };

  const handleArmorTypeFilterChange = (value: string) => {
    const newValue = value === selectedArmorType ? null : value;
    setSelectedArmorType(newValue);
    onFilterChange(selectedClassType, newValue);
  };

  const renderToggleGroupItem = (value: string, src: string, alt: string, isSelected: boolean) => (
    <Tooltip key={value}>
      <TooltipTrigger asChild>
        <ToggleGroupItem 
          value={value} 
          aria-label={`Toggle ${value}`}
          className={isSelected ? "bg-slate-700" : ""}
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
        <ToggleGroup 
          type="single"
          value={selectedClassType || ""}
          onValueChange={handleClassFilterChange}
          className="grid flex-wrap grid-cols-3"
        >
          {renderToggleGroupItem("Warlock", "/class-warlock.svg", "class-warlock", selectedClassType === "Warlock")}
          {renderToggleGroupItem("Hunter", "/class-hunter.svg", "class-hunter", selectedClassType === "Hunter")}
          {renderToggleGroupItem("Titan", "/class-titan.svg", "class-titan", selectedClassType === "Titan")}
        </ToggleGroup>
        <ToggleGroup 
          type="single"
          value={selectedArmorType || ""}
          onValueChange={handleArmorTypeFilterChange}
          className="grid flex-wrap grid-cols-5"
        >
          {renderToggleGroupItem("Helmet", "/helmet.svg", "helmet", selectedArmorType === "Helmet")}
          {renderToggleGroupItem("Gauntlets", "/arms.svg", "arms", selectedArmorType === "Gauntlets")}
          {renderToggleGroupItem("Chest Armor", "/chest.svg", "chest", selectedArmorType === "Chest Armor")}
          {renderToggleGroupItem("Leg Armor", "/legs.svg", "legs", selectedArmorType === "Leg Armor")}
          {renderToggleGroupItem("Class Item", "/class.svg", "class", selectedArmorType === "Class Item")}
        </ToggleGroup>
      </div>
    </TooltipProvider>
  );
};

export default ArmorFilters;