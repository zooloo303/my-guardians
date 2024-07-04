import React, { useState, useMemo } from "react";
import Item from "@/components/Item/item";
import { useManifestData } from "@/app/hooks/useManifest";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { CharacterExoticArmorProps, InventoryItem } from "@/lib/interfaces";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const armorOrder = [
  "Helmet",
  "Gauntlets",
  "Chest Armor",
  "Leg Armor",
  "Class Item",
];

const CharacterExoticArmor: React.FC<CharacterExoticArmorProps> = ({
  characterId,
  onSelect,
}) => {
  const { membershipId } = useAuthContext();
  const { data: profileData } = useProfileData(membershipId);
  const { data: manifestData } = useManifestData();
  const [selectedExotic, setSelectedExotic] = useState<string | null>(null);

  const handleExoticSelect = (itemHash: number, itemInstanceId: string) => {
    setSelectedExotic(itemInstanceId);
    onSelect && onSelect(itemInstanceId, itemHash.toString());
  };

  const exoticArmorItems = useMemo(() => {
    if (!profileData || !manifestData) return [];

    const character = profileData.Response.characters.data[characterId];
    if (!character) return [];

    const characterClassType = character.classType;

    const allItems: InventoryItem[] = [
      ...profileData.Response.characterInventories.data[characterId].items,
      ...profileData.Response.characterEquipment.data[characterId].items,
      ...profileData.Response.profileInventory.data.items,
    ];

    return allItems
      .filter((item) => {
        const itemDef =
          manifestData.DestinyInventoryItemDefinition[item.itemHash];
        return (
          itemDef.inventory.tierType === 6 && // Exotic rarity
          itemDef.itemType === 2 && // Armor
          (itemDef.classType === characterClassType || itemDef.classType === 3)
        ); // 3 is for items usable by all classes
      })
      .sort((a, b) => {
        const aType =
          manifestData.DestinyInventoryItemDefinition[a.itemHash]
            .itemTypeDisplayName;
        const bType =
          manifestData.DestinyInventoryItemDefinition[b.itemHash]
            .itemTypeDisplayName;
        return armorOrder.indexOf(aType) - armorOrder.indexOf(bType);
      });
  }, [profileData, manifestData, characterId]);

  if (!exoticArmorItems.length)
    return <div>No exotic armor found for this character.</div>;

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>Choose an Exotic Armor Item</CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {armorOrder.map((armorType) => (
            <AccordionItem value={armorType} key={armorType}>
              <AccordionTrigger>{armorType}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-8 gap-4 cursor-pointer">
                  {exoticArmorItems
                    .filter(
                      (item) =>
                        manifestData?.DestinyInventoryItemDefinition[
                          item.itemHash
                        ].itemTypeDisplayName === armorType
                    )
                    .map((item) => (
                      <Item
                        key={item.itemInstanceId}
                        itemHash={item.itemHash}
                        itemInstanceId={item.itemInstanceId}
                        isSelected={selectedExotic === item.itemInstanceId}
                        onClick={handleExoticSelect}
                      />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default CharacterExoticArmor;