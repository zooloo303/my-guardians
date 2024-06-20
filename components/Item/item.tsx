import Image from "next/image";
import { motion } from "framer-motion";
import Stats from "@/components/Item/stats";
import { SkeletonGuy } from "@/components/skeleton";
import { ItemProps, Socket } from "@/lib/interfaces";
import { defaultDamageType } from "@/lib/destinyEnums";
import { useManifestData } from "@/app/hooks/useManifest";
import React, { useState, useRef, useEffect } from "react";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ItemComponentProps extends ItemProps {
  alwaysExpanded?: boolean;
}

const Item: React.FC<ItemComponentProps> = ({
  itemHash,
  itemInstanceId,
  alwaysExpanded = false,
}) => {
  const { membershipId } = useAuthContext();
  const { data: manifestData } = useManifestData();
  const { data: profileData } = useProfileData(membershipId);
  const [isExpanded, setIsExpanded] = useState(alwaysExpanded);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    if (!alwaysExpanded) {
      setIsExpanded(!isExpanded);
    }
  };

  useEffect(() => {
    if (isExpanded && !alwaysExpanded) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isExpanded, alwaysExpanded]);

  if (!manifestData || !profileData) {
    return <SkeletonGuy />;
  }

  const itemData = manifestData.DestinyInventoryItemDefinition[itemHash];
  if (!itemData) {
    return <div>Item data not found</div>;
  }

  const instanceData =
    profileData.Response.itemComponents.instances.data[itemInstanceId];
  const primaryStatValue = instanceData?.primaryStat?.value;
  const damageType = instanceData?.damageType;
  const socketData =
    profileData.Response.itemComponents.sockets.data[itemInstanceId];
  const sockets: Socket[] = socketData?.sockets ?? {};
  const statData =
    profileData.Response.itemComponents.stats.data[itemInstanceId]?.stats ?? {};

  const damageTypeIcon = damageType ? defaultDamageType[damageType] : null;
  const shouldShowPrimaryStat =
    itemData.itemType === 2 || itemData.itemType === 3; // 2: Armor, 3: Weapon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div>
            <motion.div
              ref={itemRef}
              transition={{ layout: { duration: 0.5, type: "spring" } }}
              layout
              className={`p-2 rounded-md relative ${
                isExpanded ? "w-96 h-auto" : "w-16 h-16"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand();
              }}
              style={{
                zIndex: isExpanded ? 10 : "auto",
                backgroundImage: isExpanded
                  ? `url(http://www.bungie.net${itemData.screenshot})`
                  : `url(http://www.bungie.net${itemData.displayProperties.icon})`,
                backgroundSize: "cover",
                backgroundPosition: "top",
                position: "relative",
              }}
            >
              <motion.div
                layout="position"
                className="flex flex-row justify-between items-center"
              >
                {isExpanded && (
                  <div className="flex flex-row justify-between">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="flex flex-row"
                    >
                      {shouldShowPrimaryStat && primaryStatValue && (
                        <div className="flex items-center text-center text-base">
                          <Image
                            src="/power-lvl.svg"
                            alt="power level icon"
                            width={10}
                            height={10}
                          />
                          <span>{primaryStatValue}</span>
                          {damageTypeIcon && (
                            <Image
                              src={`/${damageTypeIcon}`}
                              alt="damage type icon"
                              width={15}
                              height={15}
                            />
                          )}
                        </div>
                      )}
                    </motion.div>
                    <div className="flex flex-col pt-2 p-2 ml-4 text-white">
                      <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="text-left text-base"
                      >
                        {itemData.displayProperties.name}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="text-left text-sm"
                      >
                        {itemData.itemTypeDisplayName}
                      </motion.p>
                    </div>
                  </div>
                )}
              </motion.div>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="text-left text-sm mt-2 text-white"
                >
                  <p>{itemData.flavorText}</p>
                  <div className="flex justify-center mt-2">
                    {sockets.map((socket: Socket, index: number) => {
                      const socketItem =
                        manifestData.DestinyInventoryItemDefinition[
                          socket.plugHash
                        ];
                      return socketItem?.displayProperties.icon ? (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <div className="mx-1">
                              <Image
                                className="rounded-md"
                                src={`http://www.bungie.net${socketItem.displayProperties.icon}`}
                                alt={socketItem.displayProperties.name}
                                width={32}
                                height={32}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              {socketItem.displayProperties.name}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : null;
                    })}
                  </div>
                  <Stats stats={statData} manifestData={manifestData} />
                </motion.div>
              )}
            </motion.div>
            {!isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="flex flex-row"
              >
                {shouldShowPrimaryStat && primaryStatValue && (
                  <div className="flex items-center text-center text-xs">
                    <Image
                      src="/power-lvl.svg"
                      alt="power level icon"
                      width={10}
                      height={10}
                    />
                    <span>{primaryStatValue}</span>
                    {damageTypeIcon && (
                      <Image
                        src={`/${damageTypeIcon}`}
                        alt="damage type icon"
                        width={12}
                        height={12}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col font-xs">
            {itemData.displayProperties.name} - {itemData.itemTypeDisplayName}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Item;
