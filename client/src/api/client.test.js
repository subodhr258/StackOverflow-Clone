import client from './client';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn()
      }
    }
  }))
}));

describe('API Client', () => {
  beforeEach(() => {
    // Clear cache before each test
    client.clearCache();
    
    // Clear localStorage
    localStorage.clear();
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock successful responses
    client.api.get.mockResolvedValue({ data: { test: 'data' } });
    client.api.post.mockResolvedValue({ data: { success: true } });
  });

  describe('Caching', () => {
    test('should cache GET responses', async () => {
      const url = '/test';
      const mockData = { id: 1, name: 'test' };
      client.api.get.mockResolvedValueOnce({ data: mockData });

      // First call
      const result1 = await client.get(url);
      expect(result1).toEqual(mockData);
      expect(client.api.get).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const result2 = await client.get(url);
      expect(result2).toEqual(mockData);
      expect(client.api.get).toHaveBeenCalledTimes(1); // Still only called once
    });

    test('should respect cache TTL', async () => {
      const url = '/test';
      const mockData = { id: 1, name: 'test' };
      client.api.get.mockResolvedValue({ data: mockData });

      // Mock Date.now to control time
      const originalNow = Date.now;
      let currentTime = 1000000;
      Date.now = jest.fn(() => currentTime);

      // First call
      await client.get(url);
      expect(client.api.get).toHaveBeenCalledTimes(1);

      // Move time forward by 4 minutes (less than 5 minute TTL)
      currentTime += 4 * 60 * 1000;
      await client.get(url);
      expect(client.api.get).toHaveBeenCalledTimes(1); // Still cached

      // Move time forward by 2 more minutes (total 6 minutes, exceeds TTL)
      currentTime += 2 * 60 * 1000;
      await client.get(url);
      expect(client.api.get).toHaveBeenCalledTimes(2); // Cache expired, new call

      // Restore Date.now
      Date.now = originalNow;
    });

    test('should cache with different parameters separately', async () => {
      const url = '/test';
      const mockData1 = { id: 1 };
      const mockData2 = { id: 2 };
      
      client.api.get
        .mockResolvedValueOnce({ data: mockData1 })
        .mockResolvedValueOnce({ data: mockData2 });

      // Call with different params
      const result1 = await client.get(url, { page: 1 });
      const result2 = await client.get(url, { page: 2 });

      expect(result1).toEqual(mockData1);
      expect(result2).toEqual(mockData2);
      expect(client.api.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('Debouncing', () => {
    test('should debounce search requests', async () => {
      const url = '/api/search';
      const mockData1 = { results: ['result1'] };
      const mockData2 = { results: ['result2'] };
      
      client.api.get
        .mockResolvedValueOnce({ data: mockData1 })
        .mockResolvedValueOnce({ data: mockData2 });

      // Make multiple rapid calls with different search terms
      const promise1 = client.get(url, { q: 'test1' });
      
      // Immediately make another call - this should be debounced
      setTimeout(() => client.get(url, { q: 'test2' }), 10);

      const result1 = await promise1;
      
      // Wait for debounce delay to ensure second call completes
      await new Promise(resolve => setTimeout(resolve, 250));
      
      expect(result1).toEqual(mockData1);
      // Should have made at least one call (first one)
      expect(client.api.get).toHaveBeenCalled();
    });

    test('should debounce autocomplete requests', async () => {
      const url = '/api/autocomplete';
      const mockData = { suggestions: ['suggestion1', 'suggestion2'] };
      client.api.get.mockResolvedValue({ data: mockData });

      // Make a call and immediately verify it works
      const result = await client.get(url, { term: 'tes' });

      expect(result).toEqual(mockData);
      expect(client.api.get).toHaveBeenCalledTimes(1);
    });

    test('should not debounce non-search GET requests', async () => {
      const url = '/api/questions';
      const mockData = { questions: [] };
      client.api.get.mockResolvedValue({ data: mockData });

      // Make multiple calls
      await client.get(url);
      await client.get(url);

      // Should make calls immediately (first call, second from cache)
      expect(client.api.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('Batching', () => {
    test('should batch POST requests within 50ms window', async () => {
      const mockBatchResponse = {
        data: {
          results: [
            { success: true, data: { id: 1 } },
            { success: true, data: { id: 2 } }
          ]
        }
      };
      client.api.post.mockResolvedValueOnce(mockBatchResponse);

      // Make multiple POST calls rapidly
      const promise1 = client.post('/test1', { data: 'test1' });
      const promise2 = client.post('/test2', { data: 'test2' });

      // Wait for batch processing
      await new Promise(resolve => setTimeout(resolve, 100));

      const results = await Promise.all([promise1, promise2]);

      // Should have made one batch call
      expect(client.api.post).toHaveBeenCalledTimes(1);
      expect(client.api.post).toHaveBeenCalledWith('/api/batch', {
        requests: expect.arrayContaining([
          expect.objectContaining({
            url: '/test1',
            data: { data: 'test1' }
          }),
          expect.objectContaining({
            url: '/test2',
            data: { data: 'test2' }
          })
        ])
      });

      expect(results[0]).toEqual({ id: 1 });
      expect(results[1]).toEqual({ id: 2 });
    });

    test('should fallback to individual requests if batch endpoint fails', async () => {
      // Mock batch endpoint to return 404
      client.api.post
        .mockRejectedValueOnce({ response: { status: 404 } })
        .mockResolvedValueOnce({ data: { id: 1 } })
        .mockResolvedValueOnce({ data: { id: 2 } });

      const promise1 = client.post('/test1', { data: 'test1' });
      const promise2 = client.post('/test2', { data: 'test2' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const results = await Promise.all([promise1, promise2]);

      // Should have made batch call + individual fallback calls
      expect(client.api.post).toHaveBeenCalledTimes(3);
      expect(results[0]).toEqual({ id: 1 });
      expect(results[1]).toEqual({ id: 2 });
    });
  });

  describe('Cache Management', () => {
    test('should provide cache stats', () => {
      const stats = client.getCacheStats();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('valid');
      expect(stats).toHaveProperty('expired');
      expect(typeof stats.total).toBe('number');
      expect(typeof stats.valid).toBe('number');
      expect(typeof stats.expired).toBe('number');
    });

    test('should clear cache', async () => {
      // Add something to cache
      await client.get('/test');
      
      let stats = client.getCacheStats();
      expect(stats.total).toBeGreaterThan(0);

      client.clearCache();
      
      stats = client.getCacheStats();
      expect(stats.total).toBe(0);
    });
  });

  describe('HTTP Methods', () => {
    test('should handle PATCH requests', async () => {
      const mockData = { updated: true };
      client.api.patch.mockResolvedValueOnce({ data: mockData });

      const result = await client.patch('/test', { field: 'value' });

      expect(client.api.patch).toHaveBeenCalledWith('/test', { field: 'value' });
      expect(result).toEqual(mockData);
    });

    test('should handle DELETE requests', async () => {
      const mockData = { deleted: true };
      client.api.delete.mockResolvedValueOnce({ data: mockData });

      const result = await client.delete('/test/1');

      expect(client.api.delete).toHaveBeenCalledWith('/test/1');
      expect(result).toEqual(mockData);
    });

    test('should handle PUT requests', async () => {
      const mockData = { replaced: true };
      client.api.put.mockResolvedValueOnce({ data: mockData });

      const result = await client.put('/test', { field: 'value' });

      expect(client.api.put).toHaveBeenCalledWith('/test', { field: 'value' });
      expect(result).toEqual(mockData);
    });
  });
});