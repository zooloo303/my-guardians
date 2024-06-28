// useDragContext.tsx
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { useItemOperations } from "@/app/hooks/useItemOperations";
import { createContext, useState, useContext } from 'react'
import { DraggableItem, DragContextType, DragProviderProps } from '@/lib/interfaces';

const DragContext = createContext<DragContextType | undefined>(undefined);

export const useDragContext = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDragContext must be used within a DragProvider');
  }
  return context;
};

export const DragProvider: React.FC<DragProviderProps> = ({ children }) => {
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null);
  const queryClient = useQueryClient();
  const { membershipId } = useAuthContext();
  const { data: manifestData } = useManifestData();
  const { data: profileData } = useProfileData(membershipId);
  const { transfer, equip, getRandomItem } = useItemOperations();

  const handleDrop = async (targetCharacterId: string, targetSource: string) => {
    if (!draggedItem) return;
  
    const sourceCharacterId = draggedItem.characterId;
    const membershipType = profileData?.Response.profile.data.userInfo.membershipType;
  
    if (!manifestData || !membershipId || !membershipType) return;
  
    try {
      // Same character, same source (inventory to inventory or equipment to equipment)
      if (sourceCharacterId === targetCharacterId && draggedItem.SOURCE === targetSource) {
        console.log("Item dropped in the same location, no action needed");
        return;
      }
      // Same character, inventory to equipment
      if (sourceCharacterId === targetCharacterId && draggedItem.SOURCE === "CharacterInventory" && targetSource === "CharacterEquipment") {
        await equip(draggedItem, targetCharacterId, membershipType);
      }
      // Same character, equipment to inventory
      else if (sourceCharacterId === targetCharacterId && draggedItem.SOURCE === "CharacterEquipment" && targetSource === "CharacterInventory") {
        const randomItem = getRandomItem(sourceCharacterId, draggedItem.bucketHash);
        if (randomItem) {
          await equip(randomItem, sourceCharacterId, membershipType);
        } else {
          console.log("No suitable replacement found");
          return;
        }
      }
      // Different character
      else if (sourceCharacterId !== targetCharacterId) {
        if (draggedItem.SOURCE === "CharacterEquipment") {
          const randomItem = getRandomItem(sourceCharacterId, draggedItem.bucketHash);
          if (randomItem) {
            await equip(randomItem, sourceCharacterId, membershipType);
          } else {
            console.log("No suitable replacement found");
            return;
          }
        }
        await transfer(draggedItem, true, sourceCharacterId, membershipType);
        await transfer(draggedItem, false, targetCharacterId, membershipType);
        if (targetSource === "CharacterEquipment") {
          await equip(draggedItem, targetCharacterId, membershipType);
        }
      }
      // From vault to character
      else if (draggedItem.SOURCE === "ProfileInventory") {
        await transfer(draggedItem, false, targetCharacterId, membershipType);
        if (targetSource === "CharacterEquipment") {
          await equip(draggedItem, targetCharacterId, membershipType);
        }
      }
      // From character inventory to vault
      else if (draggedItem.SOURCE === "CharacterInventory" && targetSource === "ProfileInventory") {
        await transfer(draggedItem, true, sourceCharacterId, membershipType);
      }

      await queryClient.invalidateQueries({ queryKey: ["profileData", membershipId] });
      await queryClient.refetchQueries({ queryKey: ["profileData", membershipId] });
      toast.success("Item moved successfully");
    } catch (error) {
      console.error("Transfer or equip operation failed:", error);
      toast.error("Failed to move item", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  };

  return (
    <DragContext.Provider value={{ draggedItem, setDraggedItem, handleDrop }}>
      {children}
    </DragContext.Provider>
  );
};