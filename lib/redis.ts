import { Redis } from 'ioredis';

// In-memory cache for when Redis isn't available
class MockRedis {
  private cache: Map<string, string> = new Map();
  private expirations: Map<string, NodeJS.Timeout> = new Map();

  async get(key: string): Promise<string | null> {
    return this.cache.get(key) || null;
  }

  async set(key: string, value: string, expiryMode?: string, time?: number): Promise<'OK'> {
    this.cache.set(key, value);
    
    // Handle expiration if specified
    if (expiryMode === 'EX' && time) {
      // Clear any existing timeout
      if (this.expirations.has(key)) {
        clearTimeout(this.expirations.get(key)!);
      }
      
      // Set new timeout
      const timeout = setTimeout(() => {
        this.cache.delete(key);
        this.expirations.delete(key);
      }, time * 1000);
      
      this.expirations.set(key, timeout);
    }
    
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const key of keys) {
      if (this.cache.has(key)) {
        this.cache.delete(key);
        if (this.expirations.has(key)) {
          clearTimeout(this.expirations.get(key)!);
          this.expirations.delete(key);
        }
        count++;
      }
    }
    return count;
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return Array.from(this.cache.keys()).filter(key => regex.test(key));
  }
}

// Initialize using the mock Redis client
console.log('Using in-memory mock implementation instead of Redis');
const redisClient = new MockRedis() as unknown as Redis;
export const redis = redisClient;

// Utility function to cache API responses
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600 // Default cache time of 1 hour (in seconds)
): Promise<T> {
  try {
    // Check if data exists in cache
    const cachedData = await redis.get(key);
    
    if (cachedData) {
      console.log(`Cache hit for key: ${key}`);
      return JSON.parse(cachedData) as T;
    }
    
    // If not in cache, fetch data
    console.log(`Cache miss for key: ${key}, fetching data...`);
    const data = await fetcher();
    
    // Store in cache with expiration
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
    
    return data;
  } catch (error) {
    console.error('Error with caching:', error);
    // Fallback to direct fetch if caching fails
    return fetcher();
  }
}

// Utility to clear cache by key pattern
export async function clearCache(keyPattern: string): Promise<void> {
  const keys = await redis.keys(keyPattern);
  if (keys.length > 0) {
    await redis.del(...keys);
    console.log(`Cleared ${keys.length} cache entries matching ${keyPattern}`);
  }
}