"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { SkeletonGuy } from "@/components/skeleton";
import CharacterList from "../Character/characterList";
import { ScrollArea } from "@/components/ui/scroll-area";
import ArmorFilters from "@/components/Item/ArmorFilters";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import WeaponFilters from "@/components/Item/WeaponFilters";
import { ProfileData, InventoryItem } from "@/lib/interfaces";
import { useAuthContext } from "@/components/Auth/AuthContext";
import ProfileInventory from "@/components/Item/profileInventory";
import CharacterInventory from "@/components/Item/characterInventory";
import CharacterEquipment from "@/components/Item/characterEquipment";
import {
  classes,
  unwantedBucketHash,
  itemOrder,
  damageType,
} from "@/lib/destinyEnums";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

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

    if (searchType === null && weaponFilters.length === 0 && armorFilters.length === 0) {
      return sortedItems;
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">My Precious</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[80vh] overflow-y-auto">
        <ScrollArea className="h-full">
          <DialogHeader>
            <div className="p-4">
                <Search className="absolute left-6 top-7 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[500px]"
                />
              </div>
          </DialogHeader>
          <div className="flex flex-row p-4 items-center justify-between">
              <WeaponFilters onFilterChange={handleWeaponFilterChange} />
              <ArmorFilters onFilterChange={handleArmorFilterChange} />
            </div>
          <CharacterList />
          <CharacterEquipment showSubclass={false} />
          <CharacterInventory filteredItems={filteredCharacterInventories} />
          <ProfileInventory filteredItems={filteredProfileInventory} />
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InventorySearch;
