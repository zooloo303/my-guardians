"use client";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { SkeletonGuy } from "@/components/skeleton";
import CharacterList from "../Character/characterList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DragProvider } from "@/app/hooks/useDragContext";
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

const sortItems = (items: InventoryItem[]): InventoryItem[] => {
  return items
    .filter(
      (item) =>
        !unwantedBucketHash.includes(item.bucketHash) && item.itemInstanceId
    )
    .sort(
      (a, b) =>
        itemOrder.indexOf(a.bucketHash) - itemOrder.indexOf(b.bucketHash)
    );
};

const filterItems = (
  items: InventoryItem[],
  searchQuery: string,
  searchType: "weapons" | "armor" | null,
  weaponDamageFilter: string | null,
  weaponTypeFilter: string | null,
  armorClassFilter: string | null,
  armorTypeFilter: string | null,
  manifestData: any
): InventoryItem[] => {
  const sortedItems = sortItems(items);

  if (searchQuery) {
    return sortedItems.filter((item) => {
      const itemData =
        manifestData.DestinyInventoryItemDefinition[item.itemHash];
      return itemData.displayProperties.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
  }

  if (
    searchType === null &&
    !weaponDamageFilter &&
    !weaponTypeFilter &&
    !armorClassFilter &&
    !armorTypeFilter
  ) {
    return sortedItems;
  }

  return sortedItems.filter((item) => {
    const itemData =
      manifestData.DestinyInventoryItemDefinition[item.itemHash];

    if (searchType === "weapons" || weaponDamageFilter || weaponTypeFilter) {
      const matchesDamageType =
        !weaponDamageFilter ||
        damageType[itemData.defaultDamageType] === weaponDamageFilter;
      const matchesWeaponType =
        !weaponTypeFilter ||
        itemData.itemTypeDisplayName === weaponTypeFilter;
      return matchesDamageType && matchesWeaponType;
    } else if (
      searchType === "armor" ||
      armorClassFilter ||
      armorTypeFilter
    ) {
      const matchesClassType =
        !armorClassFilter || classes[itemData.classType] === armorClassFilter;
      const matchesArmorType =
        !armorTypeFilter || itemData.itemTypeDisplayName === armorTypeFilter;
      return matchesClassType && matchesArmorType;
    }

    return false;
  });
};

const Inventory: React.FC = () => {
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);
  const { data: manifestData } = useManifestData();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"weapons" | "armor" | null>(
    null
  );
  const [weaponDamageFilter, setWeaponDamageFilter] = useState<string | null>(
    null
  );
  const [weaponTypeFilter, setWeaponTypeFilter] = useState<string | null>(null);
  const [armorClassFilter, setArmorClassFilter] = useState<string | null>(null);
  const [armorTypeFilter, setArmorTypeFilter] = useState<string | null>(null);

  const filteredCharacterInventories = useMemo(() => {
    if (!profileData || !manifestData) return {};
    
    const characterInventoriesData = (profileData as ProfileData).Response.characterInventories.data || {};
    return Object.entries(characterInventoriesData).reduce(
      (acc: { [key: string]: { items: InventoryItem[] } }, [characterId, characterInventory]) => {
        acc[characterId] = {
          items: filterItems(
            characterInventory.items.map((item) => ({ ...item, characterId })),
            searchQuery,
            searchType,
            weaponDamageFilter,
            weaponTypeFilter,
            armorClassFilter,
            armorTypeFilter,
            manifestData
          ),
        };
        return acc;
      },
      {}
    );
  }, [profileData, manifestData, searchQuery, searchType, weaponDamageFilter, weaponTypeFilter, armorClassFilter, armorTypeFilter]);

  const filteredProfileInventory = useMemo(() => {
    if (!profileData || !manifestData) return [];
    
    const profileInventoryData = (profileData as ProfileData).Response.profileInventory.data.items || [];
    return filterItems(
      profileInventoryData.map((item) => ({ ...item, characterId: "" })),
      searchQuery,
      searchType,
      weaponDamageFilter,
      weaponTypeFilter,
      armorClassFilter,
      armorTypeFilter,
      manifestData
    );
  }, [profileData, manifestData, searchQuery, searchType, weaponDamageFilter, weaponTypeFilter, armorClassFilter, armorTypeFilter]);

  if (isLoading || !manifestData || !profileData) {
    return <SkeletonGuy />;
  }

  const handleWeaponFilterChange = (
    damageType: string | null,
    weaponType: string | null
  ) => {
    if (damageType !== null) {
      setWeaponDamageFilter(damageType);
    }
    if (weaponType !== null) {
      setWeaponTypeFilter(weaponType);
    }
    setSearchType("weapons");
    // Reset armor filters
    setArmorClassFilter(null);
    setArmorTypeFilter(null);
  };

  const handleArmorFilterChange = (
    classType: string | null,
    armorType: string | null
  ) => {
    setArmorClassFilter(classType);
    setArmorTypeFilter(armorType);
    setSearchType("armor");
    // Reset weapon filters
    setWeaponDamageFilter(null);
    setWeaponTypeFilter(null);
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <DragProvider>
        <ScrollArea className="h-full">
          <div className="p-2 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md bg-background pl-9 pr-3 py-1 text-sm"
              />
            </div>
            <div className="flex w-full space-x-2 items-center">
              <div className="flex-1">
                <WeaponFilters
                  onFilterChange={handleWeaponFilterChange}
                  damageOnly={true}
                />
              </div>
              <div className="flex-1">
                <WeaponFilters
                  onFilterChange={handleWeaponFilterChange}
                  weaponOnly={true}
                />
              </div>
              <div className="flex-1">
                <ArmorFilters onFilterChange={handleArmorFilterChange} />
              </div>
            </div>
          </div>
          <CharacterList />
          <CharacterEquipment showSubclass={false} />
          <CharacterInventory filteredItems={filteredCharacterInventories} />
          <ProfileInventory filteredItems={filteredProfileInventory} />
        </ScrollArea>
      </DragProvider>
    </div>
  );
};

export default Inventory;