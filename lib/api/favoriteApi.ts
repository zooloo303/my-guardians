import apiService from './apiService';

export async function setFavorite(username: string, itemInstanceId: string, itemHash: number) {
    return apiService.post('/api/user/faveItem/set', { username, itemInstanceId, itemHash });
}

export async function unsetFavorite(username: string, itemInstanceId: string) {
  return apiService.delete('/api/user/faveItem/unset', { username, itemInstanceId });
}

export async function getFavorites(username: string) {
  return apiService.get(`/api/user/faveItems/get?username=${username}`);
}