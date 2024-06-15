import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ItemProps } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { DestinyItemType, defaultDamageType } from "@/lib/destinyEnums";

const Item: React.FC<ItemProps> = ({ itemHash, itemInstanceId }) => {
  const { membershipId } = useAuthContext();
  const { data: manifestData } = useManifestData();
  const { data: profileData } = useProfileData(membershipId);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!manifestData) {
    return <SkeletonGuy />;
  }
  const itemData = manifestData.DestinyInventoryItemDefinition[itemHash];
  if (!itemData) {
    return <div>Item data not found</div>;
  }
  const instanceData = profileData.Response.itemComponents.instances.data[itemInstanceId];
  const primaryStatValue = instanceData?.primaryStat?.value;
  const damageType = instanceData?.damageType;

  const damageTypeIcon = damageType ? defaultDamageType[damageType] : null;
  const shouldShowPrimaryStat = itemData.itemType === 2 || itemData.itemType === 3; // 2: Armor, 3: Weapon

  return (
    <motion.div
      transition={{ layout: { duration: 0.5, type: "spring" } }}
      layout
      // className="p-2"
      onClick={toggleExpand}
      animate={{ borderRadius: isExpanded ? 20 : 10 }}
    >
      <motion.div
        layout="position"
        className="flex flex-row justify-between items-center"
      >
        <div className="flex flex-col items-center">
          <Image
            className="rounded-md"
            src={`http://www.bungie.net${itemData.displayProperties.icon}`}
            alt={itemData.displayProperties.name}
            width={64}
            height={64}
          />
          <div className="flex flex-row">
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
                    width={10}
                    height={10}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        {isExpanded && (
          <div className="flex flex-col pt-2 p-2 ml-4">
            <motion.h2 className="text-left text-base">
              {itemData.displayProperties.name}
            </motion.h2>
            <motion.p className="text-left text-sm">
              {itemData.itemTypeDisplayName}
            </motion.p>
          </div>
        )}
      </motion.div>
      {isExpanded && (
        <motion.div className="text-center text-xs">
          <p>{itemData.flavorText}</p>
        </motion.div>
      )}
      <motion.div>
        {isExpanded && (
          <Image
            className="rounded-md"
            src={`http://www.bungie.net${itemData.screenshot}`}
            alt={itemData.displayProperties.name}
            width={2000}
            height={2000}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default Item;
