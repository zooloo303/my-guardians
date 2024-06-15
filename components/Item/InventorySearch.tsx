"use client";
import { useState, useEffect } from "react";
import WeaponFilters from "@/components/Item/WeaponFilters";
import ArmorFilters from "@/components/Item/ArmorFilters";
import CharacterInventory from "@/components/Item/CharacterInventory";
import ProfileInventory from "@/components/Item/ProfileInventory";
import { ProfileData, InventoryItem } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useManifestData } from "@/app/hooks/useManifest";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { Input } from "@/components/ui/input";
import {
  classes,
  unwantedBucketHash,
  itemOrder,
  damageType,
} from "@/lib/destinyEnums";

const InventorySearch: React.FC = () => {
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);
  const { data: manifestData } = useManifestData();
  const [searchQuery, setSearchQuery] = useState("");
  const [weaponFilters, setWeaponFilters] = useState<string[]>([]);
  const [armorFilters, setArmorFilters] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<"weapons" | "armor" | null>(null);

  if (isLoading || !manifestData || !profileData) {
    return <SkeletonGuy />;
  }

  const data = profileData as unknown as ProfileData | null;
  const characterInventoriesData = data?.Response.characterInventories.data || {};
  const profileInventoryData = data?.Response.profileInventory.data.items || [];

  const sortItems = (items: InventoryItem[]): InventoryItem[] => {
    return items
      .filter((item) => !unwantedBucketHash.includes(item.bucketHash) && item.itemInstanceId) // Filter out items without itemInstanceId
      .sort(
        (a, b) =>
          itemOrder.indexOf(a.bucketHash) - itemOrder.indexOf(b.bucketHash)
      );
  };

  const filterItems = (items: InventoryItem[]): InventoryItem[] => {
    const sortedItems = sortItems(items);

    if (searchQuery) {
      return sortedItems.filter((item) => {
        const itemData = manifestData.DestinyInventoryItemDefinition[item.itemHash];
        return itemData.displayProperties.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    if (searchType === null) {
      return [];
    }

    return sortedItems.filter((item) => {
      const itemData = manifestData.DestinyInventoryItemDefinition[item.itemHash];

      const matchesWeaponFilters = weaponFilters.length === 0 || weaponFilters.every(
        (filter) =>
          itemData.itemTypeDisplayName === filter ||
          damageType[itemData.defaultDamageType] === filter
      );

      const matchesArmorFilters = armorFilters.length === 0 || armorFilters.every((filter) =>
        classes[itemData.classType] === filter || itemData.itemTypeDisplayName === filter
      );

      const matchesFilters = searchType === "weapons"
        ? matchesWeaponFilters
        : searchType === "armor"
        ? matchesArmorFilters
        : false;

      return matchesFilters;
    });
  };

  const handleWeaponFilterChange = (filters: string[]) => {
    setWeaponFilters(filters);
    setSearchType(filters.length > 0 ? "weapons" : null);
    setArmorFilters([]); // Clear armor filters
  };

  const handleArmorFilterChange = (filters: string[]) => {
    setArmorFilters(filters);
    setSearchType(filters.length > 0 ? "armor" : null);
    setWeaponFilters([]); // Clear weapon filters
  };

  const filteredCharacterInventories = Object.entries(characterInventoriesData).reduce((acc: { [key: string]: { items: InventoryItem[] } }, [characterId, characterInventory]) => {
    acc[characterId] = { items: filterItems(characterInventory.items) };
    return acc;
  }, {});

  const filteredProfileInventory = filterItems(profileInventoryData);

  return (
    <div>
      <div className="flex flex-col mb-4">
        <Input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-2"
        />
        <WeaponFilters onFilterChange={handleWeaponFilterChange} />
        <ArmorFilters onFilterChange={handleArmorFilterChange} />
      </div>
      <CharacterInventory filteredItems={filteredCharacterInventories} />
      <ProfileInventory filteredItems={filteredProfileInventory} />
    </div>
  );
};

export default InventorySearch;
