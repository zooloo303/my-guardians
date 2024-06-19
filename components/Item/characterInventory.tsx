// CharacterInventory.tsx
import { motion } from "framer-motion";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";
import { CharacterInventoryProps } from "@/lib/interfaces";
import { armorBucketHash, weaponBucketHash } from "@/lib/destinyEnums";

const CharacterInventory: React.FC<CharacterInventoryProps> = ({
  filteredItems,
}) => {
  const isWeaponOrArmor = (bucketHash: number) => {
    return (
      weaponBucketHash.includes(bucketHash) ||
      armorBucketHash.includes(bucketHash)
    );
  };

  const hasItems = Object.values(filteredItems).some((characterInventory) =>
    characterInventory.items.some((item) => isWeaponOrArmor(item.bucketHash))
  );

  const handleDragStart = (e: any, item: any) => {
    console.log("Dragging item:", item);
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Allow drop
    console.log("Drag over characterInventory");
  };
  const handleDragEnd = () => {
    console.log("drag end");
  };

  return (
    <>
      {hasItems && (
        <Label className="pl-2 pb-1" htmlFor="character">
          Character Inventory
        </Label>
      )}
      <div onDragOver={handleDragOver} className="flex flex-row gap-1">
        {Object.entries(filteredItems).map(
          ([characterId, characterInventory]) => (
            <div key={characterId} className="w-1/3 p-2 border rounded-xl">
              <div className="flex flex-grid flex-wrap items-center justify-center grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                {characterInventory.items
                  .filter((item) => isWeaponOrArmor(item.bucketHash))
                  .map((item) => (
                    <motion.div
                      key={`${characterId}-${item.itemInstanceId}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                      className="item cursor-grab active:cursor-grabbing"
                    >
                      <Item
                        itemHash={item.itemHash}
                        itemInstanceId={item.itemInstanceId}
                        characterId={characterId}
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default CharacterInventory;
