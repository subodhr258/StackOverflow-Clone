import axios from "axios";

class APIClient {
  constructor(baseURL = "https://stackoverflow-backend-1afp.onrender.com/") {
    this.baseURL = baseURL;
    this.cache = new Map();
    this.postBatch = [];
    this.batchTimeout = null;
    this.debounceMap = new Map();
    
    // Cache TTL: 5 minutes
    this.cacheTimeout = 5 * 60 * 1000;
    
    // Create axios instance
    this.api = axios.create({
      baseURL: this.baseURL,
    });

    // Add request interceptor for auth
    this.api.interceptors.request.use((req) => {
      if (localStorage.getItem("Profile")) {
        req.headers.authorization = `Bearer ${
          JSON.parse(localStorage.getItem("Profile")).token
        }`;
      }
      return req;
    });
  }

  // Utility to create cache key
  getCacheKey(url, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${url}${paramString ? `?${paramString}` : ''}`;
  }

  // Check if cache entry is valid
  isCacheValid(entry) {
    return entry && (Date.now() - entry.timestamp) < this.cacheTimeout;
  }

  // Get from cache
  getFromCache(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (this.isCacheValid(cached)) {
      return cached.data;
    }
    // Remove expired entry
    if (cached) {
      this.cache.delete(cacheKey);
    }
    return null;
  }

  // Set cache
  setCache(cacheKey, data) {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  // Debounce function
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      return new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await func.apply(this, args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    };
  }

  // GET request with caching and debouncing
  async get(url, params = {}) {
    const cacheKey = this.getCacheKey(url, params);
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // For search and autocomplete endpoints, apply debouncing
    if (url.includes('/api/search') || url.includes('/api/autocomplete')) {
      const debounceKey = `${url}_${JSON.stringify(params)}`;
      
      if (!this.debounceMap.has(debounceKey)) {
        const debouncedFn = this.debounce(async (url, params) => {
          return await this._performGet(url, params);
        }, 200);
        this.debounceMap.set(debounceKey, debouncedFn);
      }
      
      const debouncedFn = this.debounceMap.get(debounceKey);
      const result = await debouncedFn(url, params);
      
      // Cache the result
      this.setCache(cacheKey, result);
      return result;
    }

    // Regular GET request
    const result = await this._performGet(url, params);
    this.setCache(cacheKey, result);
    return result;
  }

  // Internal method to perform GET request
  async _performGet(url, params = {}) {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  // POST request with batching
  async post(url, data) {
    return new Promise((resolve, reject) => {
      // Add to batch
      this.postBatch.push({
        url,
        data,
        resolve,
        reject,
        timestamp: Date.now()
      });

      // Set timeout for batch processing if not already set
      if (!this.batchTimeout) {
        this.batchTimeout = setTimeout(() => {
          this.processBatch();
        }, 50); // 50ms window
      }
    });
  }

  // Process batched POST requests
  async processBatch() {
    if (this.postBatch.length === 0) {
      this.batchTimeout = null;
      return;
    }

    const batch = [...this.postBatch];
    this.postBatch = [];
    this.batchTimeout = null;

    try {
      // Send batch request
      const batchPayload = batch.map(item => ({
        url: item.url,
        data: item.data,
        timestamp: item.timestamp
      }));

      const response = await this.api.post('/api/batch', { requests: batchPayload });
      const results = response.data.results || [];

      // Resolve individual requests
      batch.forEach((item, index) => {
        if (results[index] && results[index].success) {
          item.resolve(results[index].data);
        } else {
          item.reject(new Error(results[index]?.error || 'Batch request failed'));
        }
      });
    } catch (error) {
      // If batch endpoint doesn't exist, fall back to individual requests
      if (error.response?.status === 404) {
        console.warn('Batch endpoint not available, falling back to individual requests');
        await this.processBatchFallback(batch);
      } else {
        // Reject all requests on other errors
        batch.forEach(item => item.reject(error));
      }
    }
  }

  // Fallback to individual POST requests if batch endpoint is not available
  async processBatchFallback(batch) {
    const promises = batch.map(async (item) => {
      try {
        const response = await this.api.post(item.url, item.data);
        item.resolve(response.data);
      } catch (error) {
        item.reject(error);
      }
    });

    await Promise.allSettled(promises);
  }

  // PATCH request (direct)
  async patch(url, data) {
    const response = await this.api.patch(url, data);
    return response.data;
  }

  // DELETE request (direct)
  async delete(url) {
    const response = await this.api.delete(url);
    return response.data;
  }

  // PUT request (direct)
  async put(url, data) {
    const response = await this.api.put(url, data);
    return response.data;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    const valid = entries.filter(([key, value]) => 
      (now - value.timestamp) < this.cacheTimeout
    ).length;
    
    return {
      total: entries.length,
      valid,
      expired: entries.length - valid
    };
  }
}

// Create and export a singleton instance
const client = new APIClient();

export default client;