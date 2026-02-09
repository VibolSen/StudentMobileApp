import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const CACHE_PREFIX = 'step_mobile_cache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const cacheData = async (key: string, data: any) => {
  try {
    const cacheItem = {
      timestamp: Date.now(),
      data,
    };
    await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Failed to cache data:', error);
  }
};

export const getCachedData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (value) {
      const cacheItem = JSON.parse(value);
      const isExpired = Date.now() - cacheItem.timestamp > CACHE_EXPIRY;
      
      if (!isExpired) {
        return cacheItem.data;
      } else {
        // Optimistically return expired data but maybe warn? 
        // For now, return it but user can refresh.
        // Or better, delete it? No, keeping expired data is better than nothing offline.
        return cacheItem.data; 
      }
    }
  } catch (error) {
    console.error('Failed to retrieve cached data:', error);
  }
  return null;
};

export const isOffline = async () => {
  const state = await NetInfo.fetch();
  return !state.isConnected;
};
