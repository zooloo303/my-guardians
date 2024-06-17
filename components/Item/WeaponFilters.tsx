import Image from "next/image";
import React, { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WeaponFiltersProps {
  onFilterChange: (filters: string[]) => void;
}

const WeaponFilters: React.FC<WeaponFiltersProps> = ({ onFilterChange }) => {
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
      <ToggleGroup type="single">
        {/* Damage Type Filters */}
        {renderToggleGroupItem("Kinetic", "/kinetic-damage.png", "kinetic-damage" )}
        {renderToggleGroupItem("Stasis", "/stasis-damage.png", "stasis-damage")}
        {renderToggleGroupItem("Strand", "/strand-damage.png", "strand-damage")}
        {renderToggleGroupItem("Solar", "/solar-damage.png", "solar-damage")}
        {renderToggleGroupItem("Arc", "/arc-damage.png", "arc-damage")}
        {renderToggleGroupItem("Void", "/void-damage.png", "void-damage")}
        </ToggleGroup>
        <ToggleGroup className=" flex flex-wrap" type="multiple">
        {/* Item Category Filters */}
        {renderToggleGroupItem("Auto Rifle", "/auto-rifle.svg", "auto-rifle")}
        {renderToggleGroupItem(
          "Trace Rifle",
          "/beam-weapon.svg",
          "trace-rifle"
        )}
        {renderToggleGroupItem("Combat Bow", "/bow.svg", "bow")}
        {renderToggleGroupItem(
          "Fusion Rifle",
          "/fusion-rifle.svg",
          "fusion-rifle"
        )}
        {renderToggleGroupItem("Glaive", "/glaive.svg", "glaive")}
        {renderToggleGroupItem(
          "Grenade Launcher",
          "/grenade-launcher-ff.svg",
          "grenade-launcher-ff"
        )}
        {renderToggleGroupItem(
          "Hand Cannon",
          "/hand-cannon.svg",
          "hand-cannon"
        )}
        {renderToggleGroupItem("Machine Gun", "/machinegun.svg", "machinegun")}
        {renderToggleGroupItem(
          "Pulse Rifle",
          "/pulse-rifle.svg",
          "pulse-rifle"
        )}
        {renderToggleGroupItem(
          "Rocket Launcher",
          "/rocket-launcher.svg",
          "rocket-launcher"
        )}
        {renderToggleGroupItem(
          "Scout Rifle",
          "/scout-rifle.svg",
          "scout-rifle"
        )}
        {renderToggleGroupItem("Shotgun", "/shotgun.svg", "shotgun")}
        {renderToggleGroupItem("Sidearm", "/sidearm.svg", "sidearm")}
        {renderToggleGroupItem("Submachine Gun", "/smg.svg", "smg")}
        {renderToggleGroupItem("Sniper Rifle", "/sniper.svg", "sniper")}
        {renderToggleGroupItem("Sword", "/sword-heavy.svg", "sword")}
      </ToggleGroup>
    </TooltipProvider>
  );
};

export default WeaponFilters;
