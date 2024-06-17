"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { SkeletonGuy } from "@/components/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import ArmorFilters from "@/components/Item/ArmorFilters";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import WeaponFilters from "@/components/Item/WeaponFilters";
import { ProfileData, InventoryItem } from "@/lib/interfaces";
import { useAuthContext } from "@/components/Auth/AuthContext";
import ProfileInventory from "@/components/Item/ProfileInventory";
import CharacterInventory from "@/components/Item/CharacterInventory";
import  CharacterDropzone from "@/components/Character/characterDropzones";
import {
  classes,
  unwantedBucketHash,
  itemOrder,
  damageType,
} from "@/lib/destinyEnums";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const InventorySearch: React.FC = () => {
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);
  const { data: manifestData } = useManifestData();
  const [searchQuery, setSearchQuery] = useState("");
  const [weaponFilters, setWeaponFilters] = useState<string[]>([]);
  const [armorFilters, setArmorFilters] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<"weapons" | "armor" | null>(
    null
  );

  if (isLoading || !manifestData || !profileData) {
    return <SkeletonGuy />;
  }

  const data = profileData as unknown as ProfileData | null;
  const characterInventoriesData =
    data?.Response.characterInventories.data || {};
  const profileInventoryData = data?.Response.profileInventory.data.items || [];

  const sortItems = (items: InventoryItem[]): InventoryItem[] => {
    return items
      .filter(
        (item) =>
          !unwantedBucketHash.includes(item.bucketHash) && item.itemInstanceId
      ) // Filter out items without itemInstanceId
      .sort(
        (a, b) =>
          itemOrder.indexOf(a.bucketHash) - itemOrder.indexOf(b.bucketHash)
      );
  };

  const filterItems = (items: InventoryItem[]): InventoryItem[] => {
    const sortedItems = sortItems(items);

    const classItemNames = ["Warlock Bond", "Hunter Cloak", "Titan Mark"];

    if (searchQuery) {
      return sortedItems.filter((item) => {
        const itemData =
          manifestData.DestinyInventoryItemDefinition[item.itemHash];
        return itemData.displayProperties.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
    }

    if (searchType === null) {
      return [];
    }

    return sortedItems.filter((item) => {
      const itemData =
        manifestData.DestinyInventoryItemDefinition[item.itemHash];

      const matchesWeaponFilters = weaponFilters.every(
        (filter) =>
          itemData.itemTypeDisplayName === filter ||
          damageType[itemData.defaultDamageType] === filter
      );

      const matchesArmorFilters = armorFilters.every(
        (filter) =>
          classes[itemData.classType] === filter ||
          itemData.itemTypeDisplayName === filter ||
          classItemNames.includes(itemData.itemTypeDisplayName)
      );

      const matchesFilters =
        searchType === "weapons"
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

  const filteredCharacterInventories = Object.entries(
    characterInventoriesData
  ).reduce(
    (
      acc: { [key: string]: { items: InventoryItem[] } },
      [characterId, characterInventory]
    ) => {
      acc[characterId] = { items: filterItems(characterInventory.items) };
      return acc;
    },
    {}
  );

  const filteredProfileInventory = filterItems(profileInventoryData);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">My Precious</Button>
      </DrawerTrigger>
      <DrawerContent className='h-screen top-0 mt-0'>
        <ScrollArea className='h-screen'>
        <div className='mx-auto w-full p-5'>
        <DrawerHeader>
          <DrawerTitle>Search Inventory</DrawerTitle>
          <DrawerDescription>Drag to move</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-row justify-between p-2">
          <div className="flex flex-col mb-2 justify-center">
            <div className="relative mx-auto flex-1 md:grow-0 pb-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[500px]"
              />
            </div>
            <WeaponFilters onFilterChange={handleWeaponFilterChange} />
            <ArmorFilters onFilterChange={handleArmorFilterChange} />
            
          </div>
          <CharacterDropzone />
          </div>
          <CharacterInventory filteredItems={filteredCharacterInventories} />
          <ProfileInventory filteredItems={filteredProfileInventory} />
        </div>
          </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
        
      </DrawerContent>
    </Drawer>
  );
};

export default InventorySearch;
