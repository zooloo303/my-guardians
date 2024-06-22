"use client";
import React from "react";
import { toast } from "sonner";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useItemOperations } from "@/app/hooks/useItemOperations";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { bucketHash } from "@/lib/destinyEnums";
import {
  ProfileInventoryProps,
  InventoryItem
} from "@/lib/interfaces";

type DraggableItem = InventoryItem & { SOURCE: string };

const ProfileInventory: React.FC<ProfileInventoryProps> = ({
  filteredItems,
}) => {
  const SOURCE = "ProfileInventory";
  const { membershipId } = useAuthContext();
  const { data: manifestData } = useManifestData();
  const { data: profileData } = useProfileData(membershipId);
  const { transfer } = useItemOperations();

  const getBucketName = (hash: number): string => {
    return bucketHash[hash] || "Unknown Bucket";
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: InventoryItem) => {
    const draggableItem: DraggableItem = { ...item, SOURCE };
    e.dataTransfer.setData("application/json", JSON.stringify(draggableItem));
    e.dataTransfer.effectAllowed = "move";

    if (manifestData && manifestData.DestinyInventoryItemDefinition) {
      let itemDefinition = manifestData.DestinyInventoryItemDefinition[item.itemHash];
      if (itemDefinition) {
        console.log(`Dragging item: ${itemDefinition.displayProperties.name} ${getBucketName(item.bucketHash)} from Vault`);
      } else {
        console.log(`Dragging Unknown item from Vault`);
      }
    } else {
      console.log(`Dragging Unknown item from Vault`);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    const item: DraggableItem = JSON.parse(data);
    const membershipType = profileData?.Response.profile.data.userInfo.membershipType;

    if (!manifestData || !membershipId || !membershipType) return;

    if (item.SOURCE === "CharacterInventory") {
      try {
        await transfer(item, true, item.characterId, membershipType);
        if (manifestData && manifestData.DestinyInventoryItemDefinition) {
          let itemDefinition = manifestData.DestinyInventoryItemDefinition[item.itemHash];
          if (itemDefinition) {
            toast(`Transferred ${itemDefinition.displayProperties.name} to the vault`);
          }
        }
      } catch (error) {
        console.error("Transfer to vault failed:", error);
        toast("Transfer to vault failed", { style: { backgroundColor: 'red', color: 'white' } });
      }
    }
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver}>
      {filteredItems.length > 0 && (
        <Label className="p-2" htmlFor="profile">
          ...the rest of your gear
        </Label>
      )}
      <div className="border rounded-xl flex flex-wrap items-center justify-center gap-1 p-2">
        {filteredItems.map((item) => (
          <div
            key={item.itemInstanceId}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="item cursor-grab active:cursor-grabbing"
          >
            <Item
              itemHash={item.itemHash}
              itemInstanceId={item.itemInstanceId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInventory;