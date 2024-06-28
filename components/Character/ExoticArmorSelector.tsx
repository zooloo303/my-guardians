// components/Character/CharacterExoticArmor.tsx

import React, { useMemo } from "react";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useManifestData } from "@/app/hooks/useManifest";
import { useAuthContext } from "@/components/Auth/AuthContext";
import Item from "@/components/Item/item";
import { InventoryItem } from "@/lib/interfaces";
import { Card, CardContent, CardHeader } from "../ui/card";

interface CharacterExoticArmorProps {
  characterId: string;
}

const armorOrder = [
  "Helmet",
  "Gauntlets",
  "Chest Armor",
  "Leg Armor",
  "Class Item",
];

const CharacterExoticArmor: React.FC<CharacterExoticArmorProps> = ({
  characterId,
}) => {
  const { membershipId } = useAuthContext();
  const { data: profileData } = useProfileData(membershipId);
  const { data: manifestData } = useManifestData();

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
    <Card className="max-w-lg mx-auto">
      <CardHeader>Choose an Exotic Armor Item</CardHeader>
      {armorOrder.map((armorType) => (
        <CardContent key={armorType}>
          <h3>{armorType}</h3>
          <div className="flex flex-wrap gap-2">
            {exoticArmorItems
              .filter(
                (item) =>
                  manifestData?.DestinyInventoryItemDefinition[item.itemHash]
                    .itemTypeDisplayName === armorType
              )
              .map((item) => (
                <Item
                  key={item.itemInstanceId}
                  itemHash={item.itemHash}
                  itemInstanceId={item.itemInstanceId}
                />
              ))}
          </div>
        </CardContent>
      ))}
    </Card>
  );
};

export default CharacterExoticArmor;
