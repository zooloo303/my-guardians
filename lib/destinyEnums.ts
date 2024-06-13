export const MALE = 0;
export const FEMALE = 1;

export const TITAN = 0;
export const HUNTER = 1;
export const WARLOCK = 2;
export const NO_CLASS = 3;

export const HUMAN = 0;
export const AWOKEN = 1;
export const EXO = 2;
export const UNKNOWN = 3;

export const KINETIC_WEAPON = 2;
export const ENERGY_WEAPON = 3;
export const POWER_WEAPON = 4;

export const XBOX = 1;
export const PLAYSTATION = 2;
export const PC_STEAM = 3;
export const PC_BLIZZARD = 4;
export const TIGERDEMON = 10;
export const BUNGIENEXT = 254;

export const Genders: { [key: number]: string } = {
  [MALE]: 'Male',
  [FEMALE]: 'Female'
};

export const Classes: { [key: number]: string } = {
  [WARLOCK]: 'Warlock',
  [TITAN]: 'Titan',
  [HUNTER]: 'Hunter'
};

export const Races: { [key: number]: string } = {
  [HUMAN]: 'Human',
  [AWOKEN]: 'Awoken',
  [EXO]: 'Exo'
};

export const DestinyItemType: { [key: number]: string } = {
  0: 'None',
  1: 'Currency',
  2: 'Armor',
  3: 'Weapon',
  7: 'Message',
  8: 'Engram',
  9: 'Consumable',
  10: 'ExchangeMaterial',
  11: 'MissionReward',
  12: 'QuestStep',
  13: 'QuestStepComplete',
  14: 'Emblem',
  15: 'Quest',
  16: 'Subclass',
  17: 'ClanBanner',
  18: 'Aura',
  19: 'Mod',
  20: 'Dummy',
  21: 'Ship',
  22: 'Vehicle',
  23: 'Emote',
  24: 'Ghost',
  25: 'Package',
  26: 'Bounty',
  27: 'Wrapper',
  28: 'SeasonalArtifact',
  29: 'Finisher'
};

export const DestinyItemSubType: { [key: number]: string } = {
  0: 'None',
  1: 'Crucible',
  2: 'Vanguard',
  5: 'Exotic',
  6: 'AutoRifle',
  7: 'Shotgun',
  8: 'Machinegun',
  9: 'HandCannon',
  10: 'RocketLauncher',
  11: 'FusionRifle',
  12: 'SniperRifle',
  13: 'PulseRifle',
  14: 'ScoutRifle',
  16: 'Crm',
  17: 'Sidearm',
  18: 'Sword',
  19: 'Mask',
  20: 'Shader',
  21: 'Ornament',
  22: 'FusionRifleLine',
  23: 'GrenadeLauncher',
  24: 'SubmachineGun',
  25: 'TraceRifle',
  26: 'HelmetArmor',
  27: 'GauntletsArmor',
  28: 'ChestArmor',
  29: 'LegArmor',
  30: 'ClassArmor',
  31: 'Bow',
  32: 'DummyRepeatableBounty',
  33: 'Glaive'
};

export const DestinyItemLocation: { [key: number]: string } = {
  0: 'Unknown',
  1: 'Inventory',
  2: 'Vault',
  3: 'Vendor',
  4: 'Postmaster'
};
