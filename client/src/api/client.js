import axios from "axios";

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const DEBOUNCE_DELAY = 200; // 200ms for search/autocomplete
const BATCH_DELAY = 50; // 50ms for batching POST requests

class APIClient {
  constructor() {
    // Initialize axios instance with same config as existing API
    this.api = axios.create({
      baseURL: "https://stackoverflow-backend-1afp.onrender.com/",
      // baseURL: "http://localhost:5000/",
    });

    // Add auth interceptor
    this.api.interceptors.request.use((req) => {
      if (localStorage.getItem("Profile")) {
        req.headers.authorization = `Bearer ${
          JSON.parse(localStorage.getItem("Profile")).token
        }`;
      }
      return req;
    });

    // Cache for GET requests
    this.cache = new Map();
    
    // Debounce tracking for GET requests
    this.debounceTimers = new Map();
    
    // Batch queue for POST requests
    this.batchQueue = [];
    this.batchTimer = null;
  }

  // Helper method to create cache key
  _createCacheKey(method, url, params) {
    return `${method}:${url}:${JSON.stringify(params || {})}`;
  }

  // Helper method to check if cache entry is valid
  _isCacheValid(entry) {
    return entry && (Date.now() - entry.timestamp) < CACHE_TTL;
  }

  // Helper method to store in cache
  _setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Helper method to clear expired cache entries
  _clearExpiredCache() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if ((now - entry.timestamp) >= CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }

  // Debounced GET method for search and autocomplete
  get(url, config = {}) {
    const { params } = config;
    const cacheKey = this._createCacheKey('GET', url, params);
    
    // Check cache first
    const cachedEntry = this.cache.get(cacheKey);
    if (this._isCacheValid(cachedEntry)) {
      return Promise.resolve(cachedEntry.data);
    }

    // Check if this is a search/autocomplete endpoint that should be debounced
    const shouldDebounce = url.includes('search') || url.includes('autocomplete');
    
    if (shouldDebounce) {
      return new Promise((resolve, reject) => {
        // Use cache key (method + url + params) for debounce key to debounce same endpoint calls with different params independently
        const debounceKey = this._createCacheKey('GET', url, params);
        
        // Clear existing timer for this key
        if (this.debounceTimers.has(debounceKey)) {
          clearTimeout(this.debounceTimers.get(debounceKey));
        }

        // Set new timer
        const timer = setTimeout(async () => {
          try {
            this.debounceTimers.delete(debounceKey);
            const response = await this.api.get(url, config);
            this._setCache(cacheKey, response);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        }, DEBOUNCE_DELAY);

        this.debounceTimers.set(debounceKey, timer);
      });
    } else {
      // Non-debounced GET request with caching
      return this.api.get(url, config).then(response => {
        this._setCache(cacheKey, response);
        return response;
      });
    }
  }

  // Process batch queue
  _processBatch() {
    if (this.batchQueue.length === 0) return;

    const requests = [...this.batchQueue];
    this.batchQueue = [];
    this.batchTimer = null;

    // Try to send as batch first, fallback to individual requests
    this._sendBatchRequest(requests).catch(() => {
      // If batch endpoint doesn't exist, send individual requests
      requests.forEach(({ method, url, data, config, resolve, reject }) => {
        this.api[method.toLowerCase()](url, data, config)
          .then(resolve)
          .catch(reject);
      });
    });
  }

  // Send batch request to server
  async _sendBatchRequest(requests) {
    const batchPayload = {
      requests: requests.map(({ method, url, data, config }) => ({
        method,
        url,
        data,
        headers: config?.headers || {}
      }))
    };

    try {
      const response = await this.api.post('/api/batch', batchPayload);
      
      // Process batch response and resolve individual promises
      response.data.responses.forEach((resp, index) => {
        const { resolve, reject } = requests[index];
        if (resp.error) {
          reject(new Error(resp.error));
        } else {
          resolve({ data: resp.data, status: resp.status });
        }
      });
    } catch (error) {
      throw error; // This will trigger the fallback
    }
  }

  // Batched POST method
  post(url, data, config = {}) {
    return new Promise((resolve, reject) => {
      // Add to batch queue
      this.batchQueue.push({
        method: 'POST',
        url,
        data,
        config,
        resolve,
        reject
      });

      // Set batch timer if not already set
      if (!this.batchTimer) {
        this.batchTimer = setTimeout(() => {
          this._processBatch();
        }, BATCH_DELAY);
      }
    });
  }

  // Pass-through methods for other HTTP verbs
  put(url, data, config = {}) {
    return this.api.put(url, data, config);
  }

  patch(url, data, config = {}) {
    return this.api.patch(url, data, config);
  }

  delete(url, config = {}) {
    return this.api.delete(url, config);
  }

  // Method to clear cache manually
  clearCache() {
    this.cache.clear();
  }

  // Method to clear cache for specific patterns
  clearCachePattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

// Create and export singleton instance
const client = new APIClient();

// Clean up expired cache entries periodically
setInterval(() => {
  client._clearExpiredCache();
}, 60000); // Clean every minute

export default client;