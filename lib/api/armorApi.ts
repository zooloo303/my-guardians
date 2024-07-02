import apiService from './apiService';

export interface ArmorOptimizationData {
  username: string;
  chatInput: string;
  characterId: string;
  exoticId: {
    instanceId: string;
    itemHash: string;
  };
  statPriorities: string[];
  subclass: string;
}

export async function optimizeArmor(data: ArmorOptimizationData) {
  return apiService.post('/api/armor_maxx/optimize/', data);
}