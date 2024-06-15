"use client";
import Item from "@/components/Item/item";
import {
  subclassBucketHash,
  armorBucketHash,
  weaponBucketHash,
  unwantedBucketHash,
  itemOrder,
} from "@/lib/destinyEnums";

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

  return (
    <div className="flex flex-row justify-between gap-1">
      {Object.entries(filteredItems).map(([characterId, characterInventory]) => (
        <div key={characterId} className="w-1/3 p-1 rounded-md">
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1">
            {characterInventory.items
              .filter(item => isWeaponOrArmor(item.bucketHash))
              .map((item) => (
                <Item
                  key={`${characterId}-${item.itemInstanceId}`} // Ensuring unique key
                  itemHash={item.itemHash}
                  itemInstanceId={item.itemInstanceId}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CharacterInventory;
