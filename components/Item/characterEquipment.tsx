"use client";
import Image from "next/image";
import { useState } from "react";
import { Shield } from "lucide-react";
import Item from "@/components/Item/item";
import { SkeletonGuy } from "@/components/skeleton";
import { useManifestData } from "@/app/hooks/useManifest";
import { useDragContext } from "@/app/hooks/useDragContext";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import CharacterSubclass from "../Character/characterSubclass";
import { armorBucketHash, weaponBucketHash, bucketIcons, bucketHashToType } from "@/lib/destinyEnums";
import {
  motion,
  useDragControls,
  AnimatePresence,
  PanInfo,
} from "framer-motion";
import {
  ProfileData,
  CharacterEquipmentProps,
  CharacterEquipmentItem,
  DraggableItem,
  DestinyInventoryBucketDefinition,
} from "@/lib/interfaces";

const CharacterEquipment: React.FC<CharacterEquipmentProps> = ({
  showSubclass,
}) => {
  const dragControls = useDragControls();
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);
  const { data: manifestData } = useManifestData();
  const { draggedItem, setDraggedItem, handleDrop } = useDragContext();
  const [processingItems, setProcessingItems] = useState<Set<string>>(
    new Set()
  );
  const [isUpdating, setIsUpdating] = useState(false);

  if (isLoading || !manifestData) {
    return <SkeletonGuy />;
  }

  const data = profileData as unknown as ProfileData | null;
  const equipmentData = data?.Response.characterEquipment.data;
  const bucketDefinitions = manifestData.DestinyInventoryBucketDefinition as {
    [key: number]: DestinyInventoryBucketDefinition;
  };
  if (!equipmentData || !membershipId) {
    return <div className="hidden">No profile data found</div>;
  }

  const handleDragStart = (
    item: CharacterEquipmentItem,
    characterId: string
  ) => {
    setDraggedItem({
      ...item,
      characterId,
      SOURCE: "CharacterEquipment",
    } as DraggableItem);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!draggedItem) return;

    const dropZones = document.querySelectorAll(
      "[data-character-id][data-inventory-type]"
    );
    const targetDropZone = Array.from(dropZones).find((zone) => {
      const rect = zone.getBoundingClientRect();
      return (
        info.point.x >= rect.left &&
        info.point.x <= rect.right &&
        info.point.y >= rect.top &&
        info.point.y <= rect.bottom
      );
    });

    if (targetDropZone) {
      const targetCharacterId =
        targetDropZone.getAttribute("data-character-id");
      const targetSource = targetDropZone.getAttribute("data-inventory-type");
      if (targetCharacterId && targetSource) {
        setProcessingItems((prev) =>
          new Set(prev).add(draggedItem.itemInstanceId)
        );
        setIsUpdating(true);
        handleDrop(targetCharacterId, targetSource).finally(() => {
          setProcessingItems((prev) => {
            const newSet = new Set(prev);
            newSet.delete(draggedItem.itemInstanceId);
            return newSet;
          });
          setIsUpdating(false);
        });
      }
    }
    setDraggedItem(null);
  };

  const getBucketIcon = (bucketHash: number): string => {
    const bucketType = bucketHashToType[bucketHash];
    return bucketIcons[bucketType] || 'default';
  };
  return (
    <>
      <Shield className="pl-2" />
      {isUpdating && <div>Updating inventory...</div>}
      <div className="flex flex-row justify-between items-center gap-2">
        {Object.entries(equipmentData).map(
          ([characterId, characterEquipment]) => (
            <motion.div
              key={characterId}
              className={`w-1/3 border p-2 rounded-xl`}
              data-character-id={characterId}
              data-inventory-type="CharacterEquipment"
            >
              {showSubclass && <CharacterSubclass characterId={characterId} />}
              <div className="pt-4 gap-1 flex flex-grid flex-wrap justify-between grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <AnimatePresence>
                  {characterEquipment.items
                    .filter((item) =>
                      weaponBucketHash.includes(item.bucketHash)
                    )
                    .map((item) => (
                      <div key={`${characterId}-${item.itemInstanceId}`} className="flex flex-col items-center">
                        <Image 
                          className="pb-1"
                          src={`/${getBucketIcon(item.bucketHash)}.svg`} 
                          alt={getBucketIcon(item.bucketHash)} 
                          width={20} 
                          height={20}
                        />
                        <motion.div
                          drag
                          dragControls={dragControls}
                          onDragStart={() => handleDragStart(item, characterId)}
                          onDragEnd={handleDragEnd}
                          whileDrag={{ scale: 1.1, zIndex: 1 }}
                          className="item cursor-grab active:cursor-grabbing"
                          initial={{ opacity: 1, scale: 1 }}
                          exit={{
                            opacity: 0,
                            scale: 0.5,
                            transition: { duration: 0.3 },
                          }}
                          animate={
                            processingItems.has(item.itemInstanceId)
                              ? { opacity: 0.5 }
                              : { opacity: 1 }
                          }
                        >
                          <Item
                            key={item.itemInstanceId}
                            itemHash={item.itemHash}
                            itemInstanceId={item.itemInstanceId}
                          />
                        </motion.div>
                      </div>
                    ))}
                </AnimatePresence>
              </div>
              <div className="pt-2 gap-1 flex flex-grid flex-wrap justify-between grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <AnimatePresence>
                  {characterEquipment.items
                    .filter((item) => armorBucketHash.includes(item.bucketHash))
                    .map((item) => (
                      <div key={`${characterId}-${item.itemInstanceId}`} className="flex flex-col items-center">
                        <Image 
                          className="pb-1"
                          src={`/${getBucketIcon(item.bucketHash)}.svg`} 
                          alt={getBucketIcon(item.bucketHash)} 
                          width={20} 
                          height={20}
                        />
                        <motion.div
                          drag
                          dragControls={dragControls}
                          onDragStart={() => handleDragStart(item, characterId)}
                          onDragEnd={handleDragEnd}
                          whileDrag={{ scale: 1.1, zIndex: 1 }}
                          className="item cursor-grab active:cursor-grabbing"
                        >
                          <Item
                            key={item.itemInstanceId}
                            itemHash={item.itemHash}
                            itemInstanceId={item.itemInstanceId}
                          />
                        </motion.div>
                      </div>
                    ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        )}
      </div>
    </>
  );
};

export default CharacterEquipment;