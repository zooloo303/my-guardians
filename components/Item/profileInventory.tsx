"use client";
import { motion } from "framer-motion";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";
import { transferItem } from "@/lib/transferUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { InventoryItem, TransferData } from "@/lib/interfaces";

interface ProfileInventoryProps {
  filteredItems: InventoryItem[];
}

const ProfileInventory: React.FC<ProfileInventoryProps> = ({
  filteredItems,
}) => {
  const queryClient = useQueryClient();
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);

  const handleDragStart = (e: any, item: any) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Allow drop
    console.log("Drag over profileInventory");
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const itemData = event.dataTransfer.getData("application/json");
    if (itemData && membershipId) {
      const item = JSON.parse(itemData);
      const membershipType: number =
        profileData?.Response.profile.data.userInfo.membershipType;
      const transferData: TransferData = {
        username: membershipId,
        itemReferenceHash: item.itemHash,
        stackSize: 1,
        transferToVault: true,
        itemId: item.itemInstanceId,
        characterId: item.characterId,
        membershipType: membershipType,
      };
      try {
        await transferItem(transferData);
        console.log(`Item ${item.itemInstanceId} transferred to the vault`);
        await queryClient.invalidateQueries({
          queryKey: ["profileData", membershipId],
        });
      } catch (error) {
        console.error("Transfer to vault failed:", error);
      }
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
