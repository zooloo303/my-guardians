// components/Character/SubclassSelector.tsx

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useManifestData } from '@/app/hooks/useManifest';
import { useProfileData } from '@/app/hooks/useProfileData';
import { useAuthContext } from "@/components/Auth/AuthContext";

interface SubclassSelectorProps {
  characterId: string;
  onSubclassChange: (subclassHash: string | null) => void;
}

interface InventoryItem {
  itemHash: number;
  itemInstanceId: string;
  quantity: number;
  bindStatus: number;
  location: number;
  bucketHash: number;
  transferStatus: number;
  lockable: boolean;
  state: number;
}

interface Subclass {
  hash: string;
  icon: string;
  name: string;
}

const SubclassSelector: React.FC<SubclassSelectorProps> = ({ characterId, onSubclassChange }) => {
  const { membershipId } = useAuthContext();
  const { data: profileData } = useProfileData(membershipId);
  const { data: manifestData } = useManifestData();
  const [selectedSubclass, setSelectedSubclass] = useState<string | null>(null);

  const subclasses = useMemo(() => {
    if (!profileData || !manifestData) return [];

    const character = profileData.Response.characters.data[characterId];
    if (!character) return [];

    // Filter for subclass items
    return profileData.Response.characterInventories.data[characterId].items
      .filter((item: InventoryItem) => {
        const itemDef = manifestData.DestinyInventoryItemDefinition[item.itemHash];
        return itemDef.itemCategoryHashes.includes(3284755031); // Subclass category hash
      })
      .map((item: InventoryItem): Subclass => ({
        hash: item.itemHash.toString(),
        icon: manifestData.DestinyInventoryItemDefinition[item.itemHash].displayProperties.icon,
        name: manifestData.DestinyInventoryItemDefinition[item.itemHash].displayProperties.name,
      }));
  }, [profileData, manifestData, characterId]);

  useEffect(() => {
    // Set the initially equipped subclass
    const equippedSubclass = profileData?.Response.characterEquipment.data[characterId].items
      .find((item: InventoryItem) => 
        manifestData?.DestinyInventoryItemDefinition[item.itemHash].itemCategoryHashes.includes(3284755031)
      );
    if (equippedSubclass) {
      setSelectedSubclass(equippedSubclass.itemHash.toString());
      onSubclassChange(equippedSubclass.itemHash.toString());
    }
  }, [profileData, manifestData, characterId, onSubclassChange]);

  const handleSubclassChange = (value: string) => {
    setSelectedSubclass(value);
    onSubclassChange(value);
  };

  return (
    <TooltipProvider>
      <ToggleGroup 
        type="single"
        value={selectedSubclass || ""}
        onValueChange={handleSubclassChange}
        className="flex justify-center space-x-2"
      >
        {subclasses.map((subclass: Subclass) => (
          <Tooltip key={subclass.hash}>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value={subclass.hash}
                aria-label={`Select ${subclass.name}`}
                className={`p-2 ${selectedSubclass === subclass.hash ? 'bg-slate-700' : ''}`}
              >
                <Image 
                  src={`https://www.bungie.net${subclass.icon}`} 
                  alt={subclass.name}
                  width={40}
                  height={40}
                />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>{subclass.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </TooltipProvider>
  );
};

export default SubclassSelector;