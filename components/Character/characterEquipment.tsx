"use client";
import React from "react";
import { useProfileData } from "@/app/hooks/useProfileData";
import Item from "@/components/Item/item";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { ProfileData } from "@/lib/interfaces";

const CharacterEquipment: React.FC = () => {
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!profileData) {
    return <div>No profile data found</div>;
  }

  // Type assertion to ensure profileData matches the ProfileData interface
  const data = profileData as unknown as ProfileData;

  // Extract character equipment data from the profile data
  const equipmentData = data.Response.characterEquipment.data;

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(equipmentData).map(
        ([characterId, characterEquipment]) => (
          <div key={characterId} className="border p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4">Character: {characterId}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {characterEquipment.items.map((item) => (
                <Item key={item.itemInstanceId} itemHash={item.itemHash} />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CharacterEquipment;
