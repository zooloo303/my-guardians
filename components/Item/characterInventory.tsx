"use client";
import Item from "@/components/Item/item";
import { armorBucketHash, weaponBucketHash } from "@/lib/destinyEnums";
import { Label } from "@/components/ui/label";

interface InventoryItem {
  bucketHash: number;
  itemHash: number;
  itemInstanceId: string;
}

interface CharacterInventoryProps {
  filteredItems: { [characterId: string]: { items: InventoryItem[] } };
  
}

const CharacterInventory: React.FC<CharacterInventoryProps> = ({ filteredItems }) => {
  const isWeaponOrArmor = (bucketHash: number) => {
    return weaponBucketHash.includes(bucketHash) || armorBucketHash.includes(bucketHash);
  };

  const hasItems = Object.values(filteredItems).some(characterInventory =>
    characterInventory.items.some(item => isWeaponOrArmor(item.bucketHash))
  );

  return (
    <>
      {hasItems && <Label className="pl-2 pb-1" htmlFor="character">Character Inventory</Label>}
      <div className="flex flex-row justify-between pr-2 pl-2 gap-1">
        {Object.entries(filteredItems).map(([characterId, characterInventory]) => (
          <div key={characterId} className="w-1/3 p-2 border rounded-xl">
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5">
              {characterInventory.items
                .filter(item => isWeaponOrArmor(item.bucketHash))
                .map((item) => (
                  <Item
                    key={`${characterId}-${item.itemInstanceId}`} // Ensuring unique key
                    itemHash={item.itemHash}
                    itemInstanceId={item.itemInstanceId}
                    characterId={characterId} // Used for moving items between characters
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CharacterInventory;
