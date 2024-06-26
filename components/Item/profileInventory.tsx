"use client";
import { toast } from "sonner";
import { Vault } from "lucide-react";
import React, { useState } from "react";
import Item from "@/components/Item/item";
import { Badge } from "@/components/ui/badge";
import { bucketHash } from "@/lib/destinyEnums";
import { useQueryClient } from "@tanstack/react-query";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { useItemOperations } from "@/app/hooks/useItemOperations";
import { ProfileInventoryProps, InventoryItem } from "@/lib/interfaces";

type DraggableItem = InventoryItem & { SOURCE: string };

const ProfileInventory: React.FC<ProfileInventoryProps> = ({
  filteredItems,
}) => {
  const SOURCE = "ProfileInventory";
  const { membershipId } = useAuthContext();
  const { data: manifestData } = useManifestData();
  const { data: profileData } = useProfileData(membershipId);
  const [isDragOver, setIsDragOver] = useState(false);
  const { transfer } = useItemOperations();
  const queryClient = useQueryClient();
  const getBucketName = (hash: number): string => {
    return bucketHash[hash] || "Unknown Bucket";
  };

  // Function to count items recursively
  const countItems = (items: any[]): number => {
    return items.reduce((count, item) => {
      if (Array.isArray(item)) {
        return count + countItems(item);
      }
      return count + 1;
    }, 0);
  };

  const totalItems = countItems(filteredItems);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: InventoryItem
  ) => {
    e.stopPropagation();
    const draggableItem: DraggableItem = { ...item, SOURCE };
    e.dataTransfer.setData("application/json", JSON.stringify(draggableItem));
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add(
      "border",
      "border-dashed",
      "border-green-500"
    );

    if (manifestData && manifestData.DestinyInventoryItemDefinition) {
      let itemDefinition =
        manifestData.DestinyInventoryItemDefinition[item.itemHash];
      if (itemDefinition) {
        console.log(
          `Dragging item: ${
            itemDefinition.displayProperties.name
          } ${getBucketName(item.bucketHash)} from Vault`
        );
      } else {
        console.log(`Dragging Unknown item from Vault`);
      }
    } else {
      console.log(`Dragging Unknown item from Vault`);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove(
      "border",
      "border-dashed",
      "border-green-500"
    );
  };
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    const item: DraggableItem = JSON.parse(data);
    const membershipType =
      profileData?.Response.profile.data.userInfo.membershipType;

    if (!manifestData || !membershipId || !membershipType) return;

    if (item.SOURCE === "CharacterInventory") {
      try {
        await transfer(item, true, item.characterId, membershipType);
        if (manifestData && manifestData.DestinyInventoryItemDefinition) {
          let itemDefinition =
            manifestData.DestinyInventoryItemDefinition[item.itemHash];
          if (itemDefinition) {
            toast(
              `Transferred ${itemDefinition.displayProperties.name} to the vault`
            );
          }
        }
        queryClient.invalidateQueries({
          queryKey: ["profileData", membershipId],
        });
      } catch (error) {
        console.error("Transfer to vault failed:", error);
        toast("Transfer to vault failed", {
          style: { backgroundColor: "red", color: "white" },
        });
      }
    }
  };

  return (
    <>
      <div className="flex flex-row p-1">
        <Vault className="pl-2" />
        <Badge variant="outline" className="ml-2 text-xs">
          {totalItems}/700
        </Badge>
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border rounded-xl flex flex-wrap items-top justify-center gap-1 p-2 mb-2 transition-shadow duration-200 ${
          isDragOver ? "shadow-inner shadow-green-500/50" : ""
        }`}
      >
        {filteredItems.map((item) => (
          <div
            key={item.itemInstanceId}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            className="item cursor-grab active:cursor-grabbing transform translate-x-0 translate-y-0"
          >
            <Item
              itemHash={item.itemHash}
              itemInstanceId={item.itemInstanceId}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileInventory;
