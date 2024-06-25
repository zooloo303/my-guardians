import Image from "next/image";
import React, { useState } from "react";
import { WeaponFiltersProps } from "@/lib/interfaces";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExtendedWeaponFiltersProps extends WeaponFiltersProps {
  damageOnly?: boolean;
  weaponOnly?: boolean;
}

const WeaponFilters: React.FC<ExtendedWeaponFiltersProps> = ({ onFilterChange, damageOnly, weaponOnly }) => {
  const [selectedDamageType, setSelectedDamageType] = useState<string | null>(null);
  const [selectedWeaponType, setSelectedWeaponType] = useState<string | null>(null);

  const handleDamageFilterChange = (value: string) => {
    const newValue = value === selectedDamageType ? null : value;
    setSelectedDamageType(newValue);
    onFilterChange(newValue, null);
  };

  const handleWeaponTypeFilterChange = (value: string) => {
    const newValue = value === selectedWeaponType ? null : value;
    setSelectedWeaponType(newValue);
    onFilterChange(null, newValue);
  };

  const renderToggleGroupItem = (value: string, src: string, alt: string, isSelected: boolean) => (
    <Tooltip key={value}>
      <TooltipTrigger asChild>
        <ToggleGroupItem 
          value={value} 
          aria-label={`Toggle ${value}`}
          className={isSelected ? "bg-slate-700" : ""}
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
      {damageOnly && (
        <ToggleGroup 
          type="single"
          value={selectedDamageType || ""}
          onValueChange={handleDamageFilterChange}
          className="grid grid-cols-3 gap-1"
        >
          {renderToggleGroupItem("Kinetic", "/kinetic-damage.png", "kinetic-damage", selectedDamageType === "Kinetic")}
          {renderToggleGroupItem("Stasis", "/stasis-damage.png", "stasis-damage", selectedDamageType === "Stasis")}
          {renderToggleGroupItem("Strand", "/strand-damage.png", "strand-damage", selectedDamageType === "Strand")}
          {renderToggleGroupItem("Solar", "/solar-damage.png", "solar-damage", selectedDamageType === "Solar")}
          {renderToggleGroupItem("Arc", "/arc-damage.png", "arc-damage", selectedDamageType === "Arc")}
          {renderToggleGroupItem("Void", "/void-damage.png", "void-damage", selectedDamageType === "Void")}
        </ToggleGroup>
      )}
      {weaponOnly && (
        <ToggleGroup 
          type="single"
          value={selectedWeaponType || ""}
          onValueChange={handleWeaponTypeFilterChange}
          className="grid grid-cols-5 gap-1"
        >
          {renderToggleGroupItem("Auto Rifle", "/auto-rifle.svg", "auto-rifle", selectedWeaponType === "Auto Rifle")}
          {renderToggleGroupItem("Trace Rifle","/beam-weapon.svg", "trace-rifle", selectedWeaponType === "Trace Rifle")}
          {renderToggleGroupItem("Combat Bow", "/bow.svg", "bow", selectedWeaponType === "Combat Bow")}
          {renderToggleGroupItem("Fusion Rifle", "/fusion-rifle.svg", "fusion-rifle", selectedWeaponType === "Fusion Rifle")}
          {renderToggleGroupItem("Glaive", "/glaive.svg", "glaive", selectedWeaponType === "Glaive")}
          {renderToggleGroupItem("Grenade Launcher", "/grenade-launcher-ff.svg", "grenade-launcher-ff", selectedWeaponType === "Grenade Launcher")}
          {renderToggleGroupItem("Hand Cannon", "/hand-cannon.svg", "hand-cannon", selectedWeaponType === "Hand Cannon")}
          {renderToggleGroupItem("Machine Gun", "/machinegun.svg", "machinegun", selectedWeaponType === "Machine Gun")}
          {renderToggleGroupItem("Pulse Rifle", "/pulse-rifle.svg", "pulse-rifle", selectedWeaponType === "Pulse Rifle")}
          {renderToggleGroupItem("Rocket Launcher", "/rocket-launcher.svg", "rocket-launcher", selectedWeaponType === "Rocket Launcher")}
          {renderToggleGroupItem("Scout Rifle", "/scout-rifle.svg", "scout-rifle", selectedWeaponType === "Scout Rifle")}
          {renderToggleGroupItem("Shotgun", "/shotgun.svg", "shotgun", selectedWeaponType === "Shotgun")}
          {renderToggleGroupItem("Sidearm", "/sidearm.svg", "sidearm", selectedWeaponType === "Sidearm")}
          {renderToggleGroupItem("Submachine Gun", "/smg.svg", "smg", selectedWeaponType === "Submachine Gun")}
          {renderToggleGroupItem("Sniper Rifle", "/sniper.svg", "sniper", selectedWeaponType === "Sniper Rifle")}
          {renderToggleGroupItem("Sword", "/sword-heavy.svg", "sword", selectedWeaponType === "Sword")}
        </ToggleGroup>
      )}
    </TooltipProvider>
  );
};

export default WeaponFilters;