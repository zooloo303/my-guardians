"use client";
import { motion } from "framer-motion";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";
import { ProfileData } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { EquipData, TransferData } from "@/lib/interfaces";
import { useProfileData } from "@/app/hooks/useProfileData";
import { equipItem, transferItem } from "@/lib/transferUtils";
import { useAuthContext } from "@/components/Auth/AuthContext";
import CharacterSubclass from "../Character/characterSubclass";
import { armorBucketHash, weaponBucketHash } from "@/lib/destinyEnums";
import { useToast } from "@/app/hooks/use-toast"; // Import the useToast hook

interface CharacterEquipmentProps {
  showSubclass: boolean;
}

const CharacterEquipment: React.FC<CharacterEquipmentProps> = ({
  showSubclass,
}) => {
  const queryClient = useQueryClient();
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);
  const { toast } = useToast(); // Get the toast function from useToast

  if (isLoading) {
    return <SkeletonGuy />;
  }

  const data = profileData as unknown as ProfileData | null;
  const equipmentData = data?.Response.characterEquipment.data;

  if (!equipmentData || !membershipId) {
    return <div className="hidden">No profile data found</div>; // Subtle empty state
  }

  const handleDragStart = (e: any, item: any) => {
    console.log("Dragging item:", item);
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Allow drop
    console.log("Drag over characterEquipment");
  };

  const handleDrop = async (characterId: string, event: React.DragEvent) => {
    event.preventDefault();
    const itemData = event.dataTransfer.getData("application/json");
    if (itemData) {
      const item = JSON.parse(itemData);
      const itemName = item.itemName; // Assuming item has a name property
      const characterClassRace = `${characterId}`; // Adjust this based on your data structure
      console.log(
        `Equipping item ${item.itemInstanceId} to character ${characterId}`
      );
      const membershipType: number =
        profileData?.Response.profile.data.userInfo.membershipType;

      // Show toast message when action starts
      toast({
        title: "Transfer started ",
        description: "uh-huh, transferring items...",
      });

      try {
        // Step 1: Transfer to vault if the item is not already in the vault
        if (item.characterId && item.characterId !== characterId) {
          const transferToVault: TransferData = {
            username: membershipId,
            itemReferenceHash: item.itemHash,
            stackSize: 1,
            transferToVault: true,
            itemId: item.itemInstanceId,
            characterId: item.characterId,
            membershipType: membershipType,
          };
          await transferItem(transferToVault);
          console.log(`Item ${item.itemInstanceId} transferred to vault`);
        }

        // Step 2: Transfer to target character
        const transferToCharacter: TransferData = {
          username: membershipId,
          itemReferenceHash: item.itemHash,
          stackSize: 1,
          transferToVault: false,
          itemId: item.itemInstanceId,
          characterId: characterId,
          membershipType: membershipType,
        };
        await transferItem(transferToCharacter);
        console.log(
          `Item ${item.itemInstanceId} transferred to character ${characterId}`
        );

        // Step 3: Equip the item
        const equipData: EquipData = {
          username: membershipId,
          itemId: item.itemInstanceId,
          characterId,
          membershipType: membershipType,
        };
        console.log("Equip data:", equipData);
        await equipItem(equipData);
        console.log(`Item ${item.itemInstanceId} equipped`);

        // Update toast message when action completes

        // Invalidate and refetch the query to update the UI
        await queryClient.invalidateQueries({
          queryKey: ["profileData", membershipId],
        });
      } catch (error) {
        console.error("Equip on Character failed:", error);
        // Update toast message if action fails
      }
    }
  };

  return (
    <>
      <Label className="pl-2" htmlFor="equipped">
        Equipped Items
      </Label>
      <div
        onDragOver={handleDragOver}
        className="flex flex-row justify-between items-center gap-2"
      >
        {Object.entries(equipmentData).map(
          ([characterId, characterEquipment]) => (
            <div
              key={characterId}
              className="w-1/3 border p-2 rounded-md"
              onDrop={(e) => handleDrop(characterId, e)}
            >
              {showSubclass && <CharacterSubclass characterId={characterId} />}
              <div className="pt-2 gap-1 flex flex-grid flex-wrap justify-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {characterEquipment.items
                  .filter((item) => weaponBucketHash.includes(item.bucketHash))
                  .map((item) => (
                    <motion.div
                      key={`${characterId}-${item.itemInstanceId}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="item cursor-grab active:cursor-grabbing"
                    >
                      <Item
                        key={item.itemInstanceId}
                        itemHash={item.itemHash}
                        itemInstanceId={item.itemInstanceId}
                      />
                    </motion.div>
                  ))}
              </div>
              <div className="pt-2 gap-1 flex flex-grid flex-wrap justify-center grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {characterEquipment.items
                  .filter((item) => armorBucketHash.includes(item.bucketHash))
                  .map((item) => (
                    <motion.div
                      key={`${characterId}-${item.itemInstanceId}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="item cursor-grab active:cursor-grabbing"
                    >
                      <Item
                        key={item.itemInstanceId}
                        itemHash={item.itemHash}
                        itemInstanceId={item.itemInstanceId}
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

export default CharacterEquipment;
