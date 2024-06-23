import Image from "next/image";
import { motion } from "framer-motion";
import Fave from "@/components/Item/Fave";
import { SkeletonGuy } from "@/components/skeleton";
import { getFavorites } from "@/lib/api/favoriteApi";
import { ErrorBoundary } from 'react-error-boundary';
import { useItemData } from "@/app/hooks/useItemData";
import { ItemComponentProps } from "@/lib/interfaces";
import { useAuthContext } from "@/components/Auth/AuthContext";
import ExpandedItemView from "@/components/Item/ExpandedItemView";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Item: React.FC<ItemComponentProps> = ({
  itemHash,
  itemInstanceId,
  alwaysExpanded = false,
}) => {
  const { membershipId } = useAuthContext();
  const [isExpanded, setIsExpanded] = useState(alwaysExpanded);
  const [isFavorite, setIsFavorite] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const itemData = useItemData(itemHash, itemInstanceId);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
      setIsExpanded(false);
    }
  }, []);

  const toggleExpand = useCallback(() => {
    if (!alwaysExpanded) {
      setIsExpanded((prev) => !prev);
    }
  }, [alwaysExpanded]);
  useEffect(() => {
    if (membershipId) {
      getFavorites(membershipId)
        .then(favorites => {
          const isFav = favorites.some((fav: any) => fav.itemInstanceId === itemInstanceId);
          setIsFavorite(isFav);
        })
        .catch(error => console.error("Failed to fetch favorites:", error));
    }
  }, [membershipId, itemInstanceId]);
  useEffect(() => {
    if (isExpanded && !alwaysExpanded) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isExpanded, alwaysExpanded, handleClickOutside]);

  const expandedStyle = useMemo(() => ({
    backgroundImage: `url(http://www.bungie.net${itemData?.itemData.screenshot})`,
    backgroundSize: "cover",
    backgroundPosition: "top",
  }), [itemData?.itemData.screenshot]);

  if (!itemData) {
    return <SkeletonGuy />;
  }

  const { itemData: item, primaryStatValue, damageTypeIcon, shouldShowPrimaryStat, sockets, statData } = itemData;

  return (
    <ErrorBoundary fallback={<div>Error loading item</div>}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className="flex flex-col items-center justify-center"
            >
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
                  ...(isExpanded ? expandedStyle : {
                    backgroundImage: `url(http://www.bungie.net${item.displayProperties.icon})`,
                    backgroundSize: "cover",
                  }),
                  position: "relative",
                }}
              >
                {isExpanded && (
                  <ExpandedItemView
                    itemData={item}
                    primaryStatValue={primaryStatValue}
                    damageTypeIcon={damageTypeIcon}
                    sockets={sockets}
                    statData={statData}
                    manifestData={itemData.manifestData}
                  />
                )}
              </motion.div>
              {!isExpanded && shouldShowPrimaryStat && primaryStatValue && membershipId &&(
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="flex flex-row"
                >
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
                  <Fave
                    username={membershipId}
                    itemInstanceId={itemInstanceId}
                    itemHash={itemHash}
                    initialFavorite={isFavorite}
                    onFavoriteChange={(newState) => setIsFavorite(newState)}
                  />
                </motion.div>
              )}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col font-xs">
              {item.displayProperties.name} - {item.itemTypeDisplayName}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default React.memo(Item);