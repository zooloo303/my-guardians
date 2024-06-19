"use client";
import Item from "@/components/Item/item";
import { ProfileData } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { subclassBucketHash } from "@/lib/destinyEnums";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";

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
    <div className="flex flex-grid flex-wrap justify-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {characterEquipment.items
        .filter((item) => subclassBucketHash.includes(item.bucketHash))
        .map((item) => (
          <div key={item.itemInstanceId}>
            <Item
              itemHash={item.itemHash}
              itemInstanceId={item.itemInstanceId}
              alwaysExpanded={true}
            />
          </div>
        ))}
    </div>
  );
};

export default CharacterSubclass;
