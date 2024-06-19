"use client";
import { motion } from "framer-motion";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";

interface InventoryItem {
  bucketHash: number;
  itemHash: number;
  itemInstanceId: string;
}

interface ProfileInventoryProps {
  filteredItems: InventoryItem[];
}

const ProfileInventory: React.FC<ProfileInventoryProps> = ({ filteredItems }) => {
  const handleDragStart = (e: any, item: any) => {
    console.log('Dragging item:', item);
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    console.log("Drag end");
  };

  return (
    <div className="pl-2 pr-2">
      {filteredItems.length > 0 && (
        <Label className="p-2" htmlFor="profile">
          ...the rest of your gear
        </Label>
      )}
      <div className="border rounded-xl grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-16 3xl:grid-cols-18 4xl:grid-cols-20 gap-1 p-2">
        {filteredItems.map((item) => (
          <motion.div
            key={item.itemInstanceId}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            className="item cursor-grab active:cursor-grabbing"
          >
            <Item
              itemHash={item.itemHash}
              itemInstanceId={item.itemInstanceId}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInventory;
