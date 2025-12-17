import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheOptions {
  expirationTime?: number; // milliseconds, 0 = never expire
}

const DEFAULT_EXPIRATION = 30 * 60 * 1000; // 30 minutes

class CacheService {
  private prefix = '@saloon_cache_';

  /**
   * Set a value in cache
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
      };
      const cacheKey = this.prefix + key;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    try {
      const cacheKey = this.prefix + key;
      const item = await AsyncStorage.getItem(cacheKey);

      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      const expirationTime = options?.expirationTime ?? DEFAULT_EXPIRATION;

      // Check if expired (expirationTime: 0 = never expire)
      if (expirationTime > 0 && Date.now() - entry.timestamp > expirationTime) {
        await this.remove(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Get value from cache or fetch from provider if not cached/expired
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key, options);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const data = await fetchFn();
    await this.set(key, data, options);
    return data;
  }

  /**
   * Remove a value from cache
   */
  async remove(key: string): Promise<void> {
    try {
      const cacheKey = this.prefix + key;
      await AsyncStorage.removeItem(cacheKey);
    } catch (error) {
      console.error(`Cache remove error for key ${key}:`, error);
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter((key) => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Clear cache for a pattern (e.g., 'salons:*')
   */
  async clearPattern(pattern: string): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const regex = new RegExp(
        '^' + this.prefix + pattern.replace('*', '.*') + '$'
      );
      const keysToRemove = allKeys.filter((key) => regex.test(key));
      await AsyncStorage.multiRemove(keysToRemove);
    } catch (error) {
      console.error(`Cache clear pattern error for ${pattern}:`, error);
    }
  }

  /**
   * Get cache size (bytes)
   */
  async getSize(): Promise<number> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter((key) => key.startsWith(this.prefix));
      let totalSize = 0;

      for (const key of cacheKeys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Cache size error:', error);
      return 0;
    }
  }
}

export const cacheService = new CacheService();

// Cache key constants
export const CACHE_KEYS = {
  // Salons
  SALON_LIST: 'salons:list',
  SALON_DETAIL: (id: string) => `salon:${id}`,
  NEARBY_SALONS: 'salons:nearby',

  // Services
  SERVICES: (salonId: string) => `services:${salonId}`,

  // Bookings
  USER_BOOKINGS: (userId: string) => `bookings:${userId}`,
  BOOKING_DETAIL: (bookingId: string) => `booking:${bookingId}`,

  // User
  USER_PROFILE: (userId: string) => `user:${userId}`,

  // Search results
  SEARCH_RESULTS: (query: string) => `search:${query}`,
};

// Cache expiration constants
export const CACHE_EXPIRATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 2 * 60 * 60 * 1000, // 2 hours
  NEVER: 0, // Never expire
};
