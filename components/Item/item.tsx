import Image from "next/image";
import { motion } from "framer-motion";
import Fave from "@/components/Item/Fave";
import { useFavorites } from "@/app/hooks/useFavorites";
import { SkeletonGuy } from "@/components/skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { useItemData } from "@/app/hooks/useItemData";
import { ItemComponentProps } from "@/lib/interfaces";
import { useAuthContext } from "@/components/Auth/AuthContext";
import ExpandedItemView from "@/components/Item/ExpandedItemView";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
  isSelected = false,
  onClick,
}) => {
  const { membershipId } = useAuthContext();
  const [isExpanded, setIsExpanded] = useState(alwaysExpanded);
  const { favorites, addFavorite, removeFavorite } = useFavorites(); 
  const itemRef = useRef<HTMLDivElement>(null);
  const itemData = useItemData(itemHash, itemInstanceId);
  const isFavorite = favorites.some(
    (fav: any) => fav.itemInstanceId === itemInstanceId
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
      setIsExpanded(false);
    }
  }, []);

  const toggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!alwaysExpanded) {
      setIsExpanded((prev) => !prev);
    }
    onClick && onClick(itemHash, itemInstanceId);
  }, [alwaysExpanded, onClick, itemHash, itemInstanceId]);


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

  if (!itemData) {
    return <SkeletonGuy />;
  }
  const {
    itemData: item,
    primaryStatValue,
    damageTypeIcon,
    shouldShowPrimaryStat,
    sockets,
    statData,
    manifestData,
    overrideStyleItemHash,
    screenshot
  } = itemData;
  
  // Get the correct icon based on overrideStyleItemHash
  const iconPath = overrideStyleItemHash
    ? manifestData.DestinyInventoryItemDefinition[overrideStyleItemHash]?.displayProperties.icon
    : item.displayProperties.icon;

  const expandedStyle = useMemo(
    () => ({
      backgroundImage: `url(https://www.bungie.net${item.screenshot})`,
      backgroundSize: "cover",
      backgroundPosition: "top",
    }),
    [item.screenshot]
  );

  return (
    <ErrorBoundary fallback={<div>Error loading item</div>}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div className="flex flex-col items-center justify-center">
              <motion.div
                ref={itemRef}
                transition={{ layout: { duration: 0.5, type: "spring" } }}
                layout
                className={`
                  p-2 rounded-md relative
                  ${isExpanded ? "w-96 h-auto" : "w-14 h-14"}
                  ${isSelected ? 'animate-subtle-glow' : ''}
                `}
                onClick={toggleExpand}
                style={{
                  zIndex: isExpanded ? 10 : "auto",
                  ...(isExpanded
                    ? { backgroundImage: `url(https://www.bungie.net${screenshot})` }
                    : {
                        backgroundImage: `url(https://www.bungie.net${iconPath})`,
                        backgroundSize: "cover",
                      }),
                  position: "relative",
                }}
                aria-selected={isSelected}
                aria-label={`${item.displayProperties.name} - ${item.itemTypeDisplayName}${isSelected ? ' (Selected)' : ''}`}
              >
                {isExpanded && (
                  <ExpandedItemView
                    itemData={item}
                    primaryStatValue={primaryStatValue}
                    damageTypeIcon={damageTypeIcon}
                    sockets={sockets}
                    statData={statData}
                    manifestData={manifestData}
                    screenshot={screenshot}
                  />
                )}
              </motion.div>
              {!isExpanded &&
                shouldShowPrimaryStat &&
                primaryStatValue &&
                membershipId && (
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
                          width={10}
                          height={10}
                        />
                      )}
                    </div>
                    <Fave
                      username={membershipId}
                      itemInstanceId={itemInstanceId}
                      itemHash={itemHash}
                      initialFavorite={isFavorite}
                      onFavoriteChange={(newState) => {
                        if (newState) {
                          addFavorite({ itemInstanceId, itemHash });
                        } else {
                          removeFavorite(itemInstanceId);
                        }
                      }}
                    />
                  </motion.div>
                )}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col font-xs">
              {item.displayProperties.name} - {item.itemTypeDisplayName}
              {isSelected && <span className="text-green-500">Selected</span>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default React.memo(Item);
