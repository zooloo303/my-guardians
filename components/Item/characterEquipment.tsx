"use client";
import { motion } from "framer-motion";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";
import { ProfileData } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { armorBucketHash, weaponBucketHash } from "@/lib/destinyEnums";
import CharacterSubclass from "../Character/characterSubclass";
import { EquipData } from "@/lib/interfaces";

interface CharacterEquipmentProps {
  showSubclass: boolean;
}

const CharacterEquipment: React.FC<CharacterEquipmentProps> = ({
  showSubclass,
}) => {
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);

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

  const handleDragEnd = () => {
    console.log("Drag end");
  };

  const handleDrop = async (characterId: string, event: React.DragEvent) => {
    event.preventDefault();
    const itemData = event.dataTransfer.getData("application/json");
    if (itemData) {
      const item = JSON.parse(itemData);
      console.log(`Equipping item ${item.itemInstanceId} to character ${characterId}`);
      
      const equipData: EquipData = {
        username: membershipId,
        itemId: item.itemInstanceId,
        characterId,
        membershipType: data?.Response.profile.data.userInfo.membershipType || 0,
      };

      // Call your equip API with equipData
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
                      onDragEnd={handleDragEnd}
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
                      onDragEnd={handleDragEnd}
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
