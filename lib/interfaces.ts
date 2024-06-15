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

export interface ProfileData {
  Response: {
    profileInventory: {
      data: {
        items: Array<{
          itemName: string;
          itemIcon: string;
          locationDescription: string;
          itemCategoryNames: string[];
          damageTypeIcon: string | undefined;
          tierTypeName: string;
          powerLevel: number;
          characterId: string | undefined;
          itemHash: number;
          itemInstanceId?: string;
          quantity: number;
          bindStatus: number;
          location: number;
          bucketHash: number;
          transferStatus: number;
          lockable: boolean;
          state: number;
          dismantlePermission: number;
          isWrapper: boolean;
          tooltipNotificationIndexes: number[];
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
            itemHash: number;
            itemInstanceId?: string;
            quantity: number;
            bindStatus: number;
            location: number;
            bucketHash: number;
            transferStatus: number;
            lockable: boolean;
            state: number;
            dismantlePermission: number;
            isWrapper: boolean;
            tooltipNotificationIndexes: number[];
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

export interface Weapon {
  itemHash: number;
  itemInstanceId?: string;
  quantity: number;
  bindStatus: number;
  location: number;
  bucketHash: number;
  transferStatus: number;
  lockable: boolean;
  state: number;
  dismantlePermission: number;
  isWrapper: boolean;
  tooltipNotificationIndexes: number[];
  itemName: string;
  itemIcon: string;
  itemTypeDisplayName: string;
  itemTypeDescription: string;
  itemSubTypeDescription: string;
  locationDescription: string;
  itemCategoryNames: string[];
  damageTypeName: string;
  damageTypeIcon: string;
  tierTypeName: string;
  powerLevel: number;
  isFavorite?: boolean;
}

export interface Armor {
  itemHash: number;
  itemInstanceId?: string;
  quantity: number;
  bindStatus: number;
  location: number;
  bucketHash: number;
  transferStatus: number;
  lockable: boolean;
  state: number;
  dismantlePermission: number;
  isWrapper: boolean;
  tooltipNotificationIndexes: number[];
  itemName: string;
  itemIcon: string;
  itemTypeDisplayName: string;
  itemTypeDescription: string;
  itemSubTypeDescription: string;
  locationDescription: string;
  itemCategoryNames: string[];
  tierTypeName: string;
  powerLevel: number;
  isFavorite?: boolean;
}
export type CategorizedWeapons = {
  kinetic: Weapon[];
  energy: Weapon[];
  power: Weapon[];
};

export type CategorizedArmor = {
  helmet: Armor[];
  chest: Armor[];
  legs: Armor[];
  arms: Armor[];
  classItem: Armor[];
};


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