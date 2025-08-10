import client from './client';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn()
      }
    }
  }))
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

describe('APIClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    client.clearCache();
  });

  afterEach(() => {
    // Only run pending timers if fake timers are active
    if (jest.isMockFunction(setTimeout)) {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    }
  });

  describe('Caching', () => {
    test('should cache GET requests', async () => {
      const mockResponse = { data: { test: 'data' }, status: 200 };
      client.api.get.mockResolvedValue(mockResponse);

      // First request
      const result1 = await client.get('/test-endpoint');
      expect(client.api.get).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(mockResponse);

      // Second request should use cache
      const result2 = await client.get('/test-endpoint');
      expect(client.api.get).toHaveBeenCalledTimes(1); // Still only called once
      expect(result2).toEqual(mockResponse);
    });

    test('should cache with different parameters separately', async () => {
      const mockResponse1 = { data: { id: 1 }, status: 200 };
      const mockResponse2 = { data: { id: 2 }, status: 200 };
      
      client.api.get
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      // Requests with different parameters
      await client.get('/test', { params: { id: 1 } });
      await client.get('/test', { params: { id: 2 } });

      expect(client.api.get).toHaveBeenCalledTimes(2);
    });

    test('should expire cache after TTL', async () => {
      jest.useFakeTimers();
      
      const mockResponse = { data: { test: 'data' }, status: 200 };
      client.api.get.mockResolvedValue(mockResponse);

      // First request
      await client.get('/test-endpoint');
      expect(client.api.get).toHaveBeenCalledTimes(1);

      // Fast-forward time beyond cache TTL (5 minutes)
      jest.advanceTimersByTime(5 * 60 * 1000 + 1);

      // Second request should not use expired cache
      await client.get('/test-endpoint');
      expect(client.api.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('Debouncing', () => {
    test('should debounce search requests', async () => {
      jest.useFakeTimers();
      
      const mockResponse = { data: { results: ['test'] }, status: 200 };
      client.api.get.mockResolvedValue(mockResponse);

      // Make one search request
      const promise = client.get('/api/search');

      // Should not have called the API yet due to debouncing
      expect(client.api.get).toHaveBeenCalledTimes(0);

      // Fast-forward past debounce delay
      jest.advanceTimersByTime(200);

      // Wait for promise to resolve
      const result = await promise;

      // Should have made one API call
      expect(client.api.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    test('should debounce autocomplete requests with same URL', async () => {
      jest.useFakeTimers();
      
      const mockResponse = { data: { suggestions: ['test'] }, status: 200 };
      client.api.get.mockResolvedValue(mockResponse);

      // Make first autocomplete request
      client.get('/api/autocomplete', { params: { q: 'te' } });
      
      // Make second request quickly - should cancel first
      const finalPromise = client.get('/api/autocomplete', { params: { q: 'test' } });

      // Should not have called the API yet
      expect(client.api.get).toHaveBeenCalledTimes(0);

      // Fast-forward past debounce delay
      jest.advanceTimersByTime(200);

      await finalPromise;

      // Should have only made one API call (for the final request)
      expect(client.api.get).toHaveBeenCalledTimes(1);
    });

    test('should not debounce non-search GET requests', async () => {
      const mockResponse = { data: { test: 'data' }, status: 200 };
      client.api.get.mockResolvedValue(mockResponse);

      // Make request to non-search endpoint
      await client.get('/api/questions');

      // Should have called the API immediately
      expect(client.api.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('Batching', () => {
    test('should batch POST requests within time window', async () => {
      jest.useFakeTimers();
      
      const mockBatchResponse = {
        data: {
          responses: [
            { data: { id: 1 }, status: 200 },
            { data: { id: 2 }, status: 200 }
          ]
        },
        status: 200
      };

      client.api.post.mockResolvedValue(mockBatchResponse);

      // Make multiple POST requests
      const promise1 = client.post('/api/questions', { title: 'Question 1' });
      const promise2 = client.post('/api/questions', { title: 'Question 2' });

      // Should not have called the API yet
      expect(client.api.post).toHaveBeenCalledTimes(0);

      // Fast-forward past batch delay
      jest.advanceTimersByTime(50);

      await Promise.all([promise1, promise2]);

      // Should have made one batch call
      expect(client.api.post).toHaveBeenCalledTimes(1);
      expect(client.api.post).toHaveBeenCalledWith('/api/batch', {
        requests: [
          {
            method: 'POST',
            url: '/api/questions',
            data: { title: 'Question 1' },
            headers: {}
          },
          {
            method: 'POST',
            url: '/api/questions',
            data: { title: 'Question 2' },
            headers: {}
          }
        ]
      });
    });

    test('should fallback to individual requests if batch fails', async () => {
      jest.useFakeTimers();
      
      const mockIndividualResponse = { data: { id: 1 }, status: 200 };
      
      // Mock batch request to fail
      client.api.post
        .mockRejectedValueOnce(new Error('Batch endpoint not found'))
        .mockResolvedValue(mockIndividualResponse);

      // Make POST request
      const promise = client.post('/api/questions', { title: 'Question 1' });

      // Fast-forward past batch delay
      jest.advanceTimersByTime(50);

      const result = await promise;

      // Should have tried batch first, then fallback
      expect(client.api.post).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockIndividualResponse);
    });
  });

  describe('Cache Management', () => {
    test('should clear all cache', async () => {
      const mockResponse = { data: { test: 'data' }, status: 200 };
      client.api.get.mockResolvedValue(mockResponse);

      // Cache some data
      await client.get('/test1');
      await client.get('/test2');

      // Clear cache
      client.clearCache();

      // Next requests should hit API again
      await client.get('/test1');
      await client.get('/test2');

      expect(client.api.get).toHaveBeenCalledTimes(4);
    });

    test('should clear cache by pattern', async () => {
      const mockResponse = { data: { test: 'data' }, status: 200 };
      client.api.get.mockResolvedValue(mockResponse);

      // Cache some data
      await client.get('/api/questions');
      await client.get('/api/users');

      // Clear only questions cache
      client.clearCachePattern('questions');

      // Questions should hit API again, users should use cache
      await client.get('/api/questions');
      await client.get('/api/users');

      expect(client.api.get).toHaveBeenCalledTimes(3); // 2 initial + 1 questions after clear
    });
  });

  describe('Pass-through methods', () => {
    test('should pass through PUT requests', async () => {
      const mockResponse = { data: { updated: true }, status: 200 };
      client.api.put.mockResolvedValue(mockResponse);

      const result = await client.put('/api/questions/1', { title: 'Updated' });

      expect(client.api.put).toHaveBeenCalledWith('/api/questions/1', { title: 'Updated' }, {});
      expect(result).toEqual(mockResponse);
    });

    test('should pass through PATCH requests', async () => {
      const mockResponse = { data: { patched: true }, status: 200 };
      client.api.patch.mockResolvedValue(mockResponse);

      const result = await client.patch('/api/questions/1', { votes: 5 });

      expect(client.api.patch).toHaveBeenCalledWith('/api/questions/1', { votes: 5 }, {});
      expect(result).toEqual(mockResponse);
    });

    test('should pass through DELETE requests', async () => {
      const mockResponse = { data: { deleted: true }, status: 200 };
      client.api.delete.mockResolvedValue(mockResponse);

      const result = await client.delete('/api/questions/1');

      expect(client.api.delete).toHaveBeenCalledWith('/api/questions/1', {});
      expect(result).toEqual(mockResponse);
    });
  });
});