"use client";
import { motion } from "framer-motion";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";
import { InventoryItem, TransferData } from "@/lib/interfaces";
import { useAuthContext } from "@/components/Auth/AuthContext";

interface ProfileInventoryProps {
  filteredItems: InventoryItem[];
}

const ProfileInventory: React.FC<ProfileInventoryProps> = ({
  filteredItems,
}) => {
  const { membershipId } = useAuthContext();

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

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const itemData = event.dataTransfer.getData("application/json");
    if (itemData && membershipId) {
      const item = JSON.parse(itemData) as InventoryItem;
      console.log(`Dropped item ${item.itemInstanceId} to the vault`);

      const transferData: TransferData = {
        username: membershipId,
        itemReferenceHash: item.itemHash,
        stackSize: 1,
        transferToVault: true,
        itemId: item.itemInstanceId,
        characterId: "", // Not needed for vault transfer
        membershipType: 1, // Replace with actual membershipType
      };

      // Call your transfer API with transferData
    }
  };

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop}>
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
