import React from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import { Socket } from "@/lib/interfaces";
import Stats from "@/components/Item/stats";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExpandedItemViewProps {
  itemData: any;
  primaryStatValue: number;
  damageTypeIcon: string | null;
  sockets: Socket[];
  statData: any;
  manifestData: any;
}

const ExpandedItemView: React.FC<ExpandedItemViewProps> = ({
  itemData,
  primaryStatValue,
  damageTypeIcon,
  sockets,
  statData,
  manifestData,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="text-left text-sm mt-2 text-white"
    >
      <div className="flex flex-row justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-row"
        >
          {primaryStatValue && (
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
      <p>{itemData.flavorText}</p>
      <div className="flex justify-center mt-2">
        {sockets.map((socket: Socket, index: number) => {
          const socketItem = manifestData.DestinyInventoryItemDefinition[socket.plugHash];
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
  );
};

export default React.memo(ExpandedItemView);