"use client";
import { Shield } from "lucide-react";
import React, { useState } from "react";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";
import { SkeletonGuy } from "@/components/skeleton";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useItemOperations } from "@/app/hooks/useItemOperations";
import { useAuthContext } from "@/components/Auth/AuthContext";
import CharacterSubclass from "../Character/characterSubclass";
import {
  armorBucketHash,
  weaponBucketHash,
  classes,
  races,
} from "@/lib/destinyEnums";
import {
  ProfileData,
  InventoryItem,
  CharacterEquipmentProps,
  CharacterEquipmentItem,
} from "@/lib/interfaces";

type DraggableItem = InventoryItem & { SOURCE: string };

const CharacterEquipment: React.FC<CharacterEquipmentProps> = ({
  showSubclass,
}) => {
  const SOURCE = "CharacterEquipment";
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);
  const { data: manifestData } = useManifestData();
  const { transfer, equip, getRandomItem } = useItemOperations();
  const [dragOverCharacterId, setDragOverCharacterId] = useState<string | null>(
    null
  );

  if (isLoading) {
    return <SkeletonGuy />;
  }
  const data = profileData as unknown as ProfileData | null;
  const equipmentData = data?.Response.characterEquipment.data;

  if (!equipmentData || !membershipId) {
    return <div className="hidden">No profile data found</div>;
  }

  const getCharacterInfo = (characterId: string) => {
    const character = profileData?.Response.characters.data?.[characterId];
    if (character) {
      return `${classes[character.classType]}, ${races[character.raceType]}`;
    }
    return "the Vault";
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: CharacterEquipmentItem,
    characterId: string
  ) => {
    e.stopPropagation();
    const draggableItem: DraggableItem = { ...item, characterId, SOURCE };
    e.dataTransfer.setData("application/json", JSON.stringify(draggableItem));
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add(
      "border",
      "border-dashed",
      "border-green-500"
    );
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    characterId: string
  ) => {
    e.preventDefault();
    setDragOverCharacterId(characterId);
  };

  const handleDragLeave = () => {
    setDragOverCharacterId(null);
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Remove the Tailwind CSS classes when the drag ends
    e.currentTarget.classList.remove(
      "border",
      "border-dashed",
      "border-green-500"
    );
  };
  const handleDrop = async (
    characterId: string,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    const item: DraggableItem = JSON.parse(data);
    const membershipType =
      profileData?.Response.profile.data.userInfo.membershipType;

    if (!manifestData || !membershipId || !membershipType) return;

    try {
      if (
        item.SOURCE === "CharacterInventory" &&
        item.characterId === characterId
      ) {
        await equip(item, characterId, membershipType);
      } else if (
        item.SOURCE === "CharacterInventory" &&
        item.characterId !== characterId
      ) {
        await transfer(item, true, item.characterId, membershipType);
        await transfer(item, false, characterId, membershipType);
        await equip(item, characterId, membershipType);
      } else if (item.SOURCE === "ProfileInventory") {
        await transfer(item, false, characterId, membershipType);
        await equip(item, characterId, membershipType);
      }
    } catch (error) {
      console.error("Transfer or equip operation failed:", error);
    }
  };

  return (
    <>
      <Shield className="pl-2" />
      <div className="flex flex-row justify-between items-center gap-2">
        {Object.entries(equipmentData).map(
          ([characterId, characterEquipment]) => (
            <div
              key={characterId}
              className={`w-1/3 border p-2 rounded-xl transition-shadow duration-200 ${
                dragOverCharacterId === characterId
                  ? "shadow-inner shadow-green-500/50"
                  : ""
              }`}
              onDrop={(e) => handleDrop(characterId, e)}
              onDragOver={(e) => handleDragOver(e, characterId)}
              onDragLeave={handleDragLeave}
            >
              {showSubclass && <CharacterSubclass characterId={characterId} />}
              <div className="pt-2 gap-1 flex flex-grid flex-wrap justify-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {characterEquipment.items
                  .filter((item) => weaponBucketHash.includes(item.bucketHash))
                  .map((item) => (
                    <div
                      key={`${characterId}-${item.itemInstanceId}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, characterId)}
                      onDragEnd={handleDragEnd}
                      className="item cursor-grab active:cursor-grabbing transform translate-x-0 translate-y-0"
                    >
                      <Item
                        key={item.itemInstanceId}
                        itemHash={item.itemHash}
                        itemInstanceId={item.itemInstanceId}
                      />
                    </div>
                  ))}
              </div>
              <div className="pt-2 gap-1 flex flex-grid flex-wrap justify-center grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {characterEquipment.items
                  .filter((item) => armorBucketHash.includes(item.bucketHash))
                  .map((item) => (
                    <div
                      key={`${characterId}-${item.itemInstanceId}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, characterId)}
                      className="item cursor-grab active:cursor-grabbing transform translate-x-0 translate-y-0"
                    >
                      <Item
                        key={item.itemInstanceId}
                        itemHash={item.itemHash}
                        itemInstanceId={item.itemInstanceId}
                      />
                    </div>
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
