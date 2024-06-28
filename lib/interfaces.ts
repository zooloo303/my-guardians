export interface AuthContextProps {
  membershipId: string | null;
  displayName: string | null;
  setAuthInfo: (
    membershipId: string | null,
    displayName: string | null
  ) => void;
}
export interface ManifestData {
  [key: string]: any;
}

import { PanInfo } from "framer-motion";
import { ReactNode } from "react";

export interface DragEndEvent {
  event: MouseEvent | TouchEvent | PointerEvent;
  info: PanInfo;
}
export type DraggableItem = InventoryItem & { SOURCE: string };

export interface DragContextType {
  draggedItem: DraggableItem | null;
  setDraggedItem: (item: DraggableItem | null) => void;
  handleDrop: (targetCharacterId: string, targetSource: string) => Promise<void>;
}

export interface DragProviderProps {
  children: ReactNode;
}

export interface ProfileData {
  Response: {
    profileInventory: {
      data: {
        items: Array<{
          itemInstanceId: string;
          itemHash: number;
          bucketHash: number;
          location: number;
        }>;
        userInfo: {
          bungieGlobalDisplayName: string;
          membershipType: number;
        };
      };
    };
    itemComponents: {
      instances: {
        data: {
          [itemInstanceId: string]: {
            primaryStat: {
              value: number;
            };
          };
        };
      };
    };
    characterEquipment: {
      data: {
        [characterId: string]: {
          items: Array<{
            itemInstanceId: string;
            bucketHash: number;
            itemHash: number;
            location: number;
          }>;
        };
      };
    };
    characters: {
      data: {
        [characterId: string]: CharacterType;
      };
    };
    profile: {
      data: {
        characterIds: string[];
        userInfo: {
          bungieGlobalDisplayName: string;
          membershipType: number;
        };
        currentSeasonRewardPowerCap: number;
        currentGuardianRank: number;
        lifetimeHighestGuardianRank: number;
        renewedGuardianRank: number;
      };
    };
    characterInventories: {
      data: {
        [characterId: string]: {
          items: Array<{
            itemInstanceId: string;
            itemHash: number;
            location: number;
            bucketHash: number;
          }>;
        };
      };
    };
  };
}
export interface CharacterType {
  characterId: string;
  classType: number;
  raceType: number;
  genderType?: number;
  light: number;
  emblemPath: string;
  emblemBackgroundPath: string;
  emblemHash: number;
  titleRecordHash?: number;
  stats: {
    [key: string]: number;
  };
  baseCharacterLevel?: number;
}
export type Gender = "Male" | "Female";

export interface TitleInfo {
  titlesByGender: {
    [K in Gender]: string;
  };
  hasTitle: boolean;
}
export interface GuardianRankData {
  currentGuardianRank?: GuardianRankDefinition;
  lifetimeHighestGuardianRank?: GuardianRankDefinition;
  renewedGuardianRank?: GuardianRankDefinition;
}
export interface GuardianRankDefinition {
  rankNumber: number;
  displayProperties: {
    name: string;
    icon: string;
  };
}
export interface ItemDefinition {
  hash: number;
  itemInstanceId?: string;
  displayProperties: {
    name: string;
    icon: string;
  };
  itemCategoryHashes: number[];
  damageTypeHashes: number[];
  flavorText: string;
  screenshot: string;
  itemTypeDisplayName: string;
  itemType: number;
  itemSubType: number;
  defaultDamageTypeHash: number;
  inventory: {
    tierTypeName: string;
  };
  [key: string]: any;
}
export interface DamageTypeDefinition {
  hash: number;
  displayProperties: {
    name: string;
    icon: string;
  };
}

export interface StatDefinition {
  displayProperties: {
    name: string;
    description: string;
    icon: string;
  };
}
export interface DestinyInventoryBucketDefinition {
  hash: number;
  displayProperties: {
    description: string;
    name: string;
    hasIcon: boolean;
  };
}

export interface TransferData {
  username: string;
  itemReferenceHash: number;
  stackSize: number;
  transferToVault: boolean;
  itemId: string;
  characterId: string;
  membershipType: number;
}
export interface EquipData {
  username: string;
  itemId: string;
  characterId: string;
  membershipType: number;
}
export interface ItemProps {
  itemInstanceId: string;
  itemHash: number;
  isFavorite?: boolean;
  characterId?: string;
}
export interface Socket {
  plugHash: number;
  isEnabled: boolean;
  isVisible: boolean;
}
export interface Stat {
  statHash: number;
  value: number;
}
export interface StatsProps {
  stats: { [statHash: string]: Stat };
  manifestData: any;
}
export interface InventoryItem {
  bucketHash: number;
  itemHash: number;
  itemInstanceId: string;
  characterId: string;
  SOURCE?: string;
}
export interface VaultProps {
  noOfItems: number;
}
export interface CharacterInventoryProps {
  filteredItems: { [characterId: string]: { items: InventoryItem[] } };
}
export interface ProfileInventoryProps {
  filteredItems: InventoryItem[];
}
export interface CharacterEquipmentProps {
  showSubclass: boolean;
}
export interface CharacterEquipmentItem {
  itemInstanceId: string;
  bucketHash: number;
  itemHash: number;
  location: number;
}
export interface ItemComponentProps extends ItemProps {
  alwaysExpanded?: boolean;
}
export interface FaveProps {
  username: string;
  itemInstanceId: string;
  itemHash: number;
  initialFavorite?: boolean;
}
export interface WeaponFiltersProps {
  onFilterChange: (
    damageType: string | null,
    weaponType: string | null
  ) => void;
  damageOnly?: boolean;
  weaponOnly?: boolean;
}
export interface ArmorFiltersProps {
  onFilterChange: (classType: string | null, armorType: string | null) => void;
}
export interface FavoritesContextType {
  favorites: Set<string>;
  addFavorite: (itemInstanceId: string) => void;
  removeFavorite: (itemInstanceId: string) => void;
}
export interface SubclassSelectorProps {
  characterId: string;
}

export interface Subclass {
  itemHash: number;
  name: string;
  icon: string;
}
export interface SortableStatProps {
  id: string;
  icon: string;
  name: string;
}
