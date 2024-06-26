"use client";
import Link from 'next/link';
import Item from "@/components/Item/item";
import { ProfileData } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { subclassBucketHash } from "@/lib/destinyEnums";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { motion } from 'framer-motion';

interface CharacterSubclassProps {
  characterId: string;
}

const CharacterSubclass: React.FC<CharacterSubclassProps> = ({
  characterId,
}) => {
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);

  if (isLoading) {
    return <SkeletonGuy />;
  }

  const data = profileData as unknown as ProfileData | null;
  const equipmentData = data?.Response.characterEquipment.data;

  if (!equipmentData || !equipmentData[characterId]) {
    return <div className="hidden">No subclass data found</div>; // Subtle empty state
  }

  const characterEquipment = equipmentData[characterId];

  return (
    <motion.div 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="flex flex-grid flex-wrap justify-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {characterEquipment.items
        .filter((item) => subclassBucketHash.includes(item.bucketHash))
        .map((item) => (
          <Link href={`/character/${characterId}`} key={item.itemInstanceId}>
            <div className="cursor-pointer">
              <Item
                itemHash={item.itemHash}
                itemInstanceId={item.itemInstanceId}
                alwaysExpanded={true}
              />
            </div>
          </Link>
        ))}
    </motion.div>
  );
};

export default CharacterSubclass;
