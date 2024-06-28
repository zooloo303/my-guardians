import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Subclass,
  SubclassSelectorProps,
  InventoryItem,
  ItemDefinition,
} from "@/lib/interfaces";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SUBCLASS_BUCKET_HASH = 3284755031;

const SubclassSelector: React.FC<SubclassSelectorProps> = ({ characterId }) => {
  const { membershipId } = useAuthContext();
  const { data: profileData } = useProfileData(membershipId);
  const { data: manifestData } = useManifestData();
  const [selectedSubclass, setSelectedSubclass] = useState<number | null>(null);

  const subclasses = useMemo(() => {
    if (!profileData || !manifestData) return [];

    const characterEquipment =
      profileData.Response.characterEquipment.data[characterId]?.items || [];
    const characterInventory =
      profileData.Response.characterInventories.data[characterId]?.items || [];
    const allItems = [...characterEquipment, ...characterInventory];

    return allItems
      .filter(
        (item: Partial<InventoryItem>) =>
          item.bucketHash === SUBCLASS_BUCKET_HASH
      )
      .map((item: Partial<InventoryItem>) => {
        const itemDef = manifestData.DestinyInventoryItemDefinition[
          item.itemHash as number
        ] as ItemDefinition;
        return {
          itemHash: item.itemHash as number,
          name: itemDef.displayProperties.name,
          icon: itemDef.displayProperties.icon,
        };
      });
  }, [profileData, manifestData, characterId]);

  useEffect(() => {
    // Set initially equipped subclass
    const equippedSubclass = profileData?.Response.characterEquipment.data[
      characterId
    ]?.items.find(
      (item: Partial<InventoryItem>) => item.bucketHash === SUBCLASS_BUCKET_HASH
    );
    if (equippedSubclass) {
      setSelectedSubclass(equippedSubclass.itemHash as number);
    }
  }, [profileData, characterId]);

  const handleSubclassChange = (value: string) => {
    setSelectedSubclass(Number(value));
  };

  return (
    <TooltipProvider>
      <ToggleGroup
        type="single"
        value={selectedSubclass?.toString() || ""}
        onValueChange={handleSubclassChange}
        className="flex flex-col justify-center space-y-4"
      >
        {subclasses.map((subclass: Subclass) => (
          <Tooltip key={subclass.itemHash}>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value={subclass.itemHash.toString()}
                aria-label={`Select ${subclass.name}`}
                className={`p-2 ${
                  selectedSubclass === subclass.itemHash ? "bg-slate-700" : ""
                }`}
              >
                <Image
                  src={`https://www.bungie.net${subclass.icon}`}
                  alt={subclass.name}
                  width={50}
                  height={50}
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
