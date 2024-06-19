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

const ProfileInventory: React.FC<ProfileInventoryProps> = ({
  filteredItems,
}) => {
  const handleDragStart = (e: any, item: any) => {
    console.log("Dragging item:", item);
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Allow drop
    console.log("Drag over profileInventory");
  };
  const handleDragEnd = () => {
    console.log("Drag end");
  };
  return (
    <div onDragOver={handleDragOver}>
      {filteredItems.length > 0 && (
        <Label className="p-2" htmlFor="profile">
          ...the rest of your gear
        </Label>
      )}
      <div className="border rounded-xl flex flex-grid flex-wrap items-center justify-center gap-1 p-2">
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
