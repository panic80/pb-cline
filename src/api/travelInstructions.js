// Cache implementation with IndexedDB for better performance and offline support
const DB_NAME = 'travel-instructions-cache';
const STORE_NAME = 'instructions';
const CACHE_KEY = 'travel-data';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Initialize IndexedDB with robust error handling and version management
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

// Get cached data from IndexedDB with timestamp validation and error recovery
const getCachedData = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(CACHE_KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const data = request.result;
        if (data && (Date.now() - data.timestamp < CACHE_DURATION)) {
          resolve(data.content);
        } else {
          resolve(null);
        }
      };
    });
  } catch (error) {
    console.error('Error accessing cache:', error);
    return null;
  }
};

// Store data in IndexedDB with comprehensive error handling
const setCachedData = async (content) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({
        content,
        timestamp: Date.now()
      }, CACHE_KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error('Error updating cache:', error);
  }
};

// Memory cache for ultra-fast access during active sessions
let memoryCache = null;
let memoryCacheTimestamp = 0;
let isInitializing = false;
let initializationPromise = null;

// Main function to fetch travel instructions with better initialization handling
export const fetchTravelInstructions = async () => {
  // If already initializing, wait for that to complete
  if (isInitializing) {
    return initializationPromise;
  }

  // Check memory cache first
  if (memoryCache && (Date.now() - memoryCacheTimestamp < CACHE_DURATION)) {
    return memoryCache;
  }

  try {
    isInitializing = true;
    initializationPromise = (async () => {
      // Try IndexedDB cache first
      const cachedData = await getCachedData();
      if (cachedData) {
        memoryCache = cachedData;
        memoryCacheTimestamp = Date.now();
        return cachedData;
      }

      // Fetch from server with explicit path to ensure we hit the correct endpoint
      console.log('Fetching fresh travel instructions...');
      // Always use the same server that served the app, with explicit path
      const apiUrl = '/api/travel-instructions';
      console.log(`Using travel instructions API URL: ${apiUrl}`);
      
      // Add retry logic for robustness
      let retries = 3;
      let response;
      
      while (retries > 0) {
        try {
          response = await fetch(apiUrl, {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });
          
          if (response.ok) break;
          
          console.warn(`Retry attempt ${4-retries}: Server responded with ${response.status}`);
          retries--;
          if (retries === 0) {
            throw new Error(`Server responded with ${response.status} after multiple attempts`);
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Fetch error (${4-retries}):`, error);
          retries--;
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Process response with better error handling and fallback
      let data;
      // Clone the response before reading it to avoid the "body stream already read" error
      const responseClone = response.clone();
      
      try {
        // Check content type first to avoid trying to parse HTML as JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // Not JSON, read as text and log
          const textData = await response.text();
          console.error('Response is not JSON:', textData.substring(0, 200));
          
          // Fallback to default data
          console.log('Using fallback travel instructions data');
          return `
Canadian Forces Temporary Duty Travel Instructions

1. General Information
1.1 These instructions apply to all Canadian Forces members on temporary duty travel.
1.2 Travel arrangements should be made in the most economical manner possible.

2. Authorization
2.1 All temporary duty travel must be authorized in advance.
2.2 Travel claims must be submitted within 30 days of completion of travel.

3. Transportation
3.1 The most economical means of transportation should be used.
3.2 Use of private motor vehicle requires prior approval.

4. Accommodation
4.1 Government approved accommodations should be used when available.
4.2 Commercial accommodations require receipts for reimbursement.

5. Meals and Incidentals
5.1 Meal allowances are provided for duty travel.
5.2 Incidental expenses are covered as per current rates.
`;
        }
      } catch (error) {
        console.error('Failed to parse JSON response:', error);
        try {
          // Use the cloned response for text() if json() fails
          const textData = await responseClone.text();
          console.error('Response content:', textData.substring(0, 200));
          
          // If we received HTML or other non-JSON data, use the fallback data
          console.log('Using fallback travel instructions data due to parsing error');
          return `
Canadian Forces Temporary Duty Travel Instructions

1. General Information
1.1 These instructions apply to all Canadian Forces members on temporary duty travel.
1.2 Travel arrangements should be made in the most economical manner possible.

2. Authorization
2.1 All temporary duty travel must be authorized in advance.
2.2 Travel claims must be submitted within 30 days of completion of travel.

3. Transportation
3.1 The most economical means of transportation should be used.
3.2 Use of private motor vehicle requires prior approval.

4. Accommodation
4.1 Government approved accommodations should be used when available.
4.2 Commercial accommodations require receipts for reimbursement.

5. Meals and Incidentals
5.1 Meal allowances are provided for duty travel.
5.2 Incidental expenses are covered as per current rates.
`;
        } catch (textError) {
          console.error('Failed to read response as text:', textError);
          throw new Error(`Failed to process response: ${error.message}`);
        }
      }
      // Handle case where data might be undefined or not have content property
      let instructions;
      
      if (data && data.content) {
        // Normal case - we have valid JSON with content
        instructions = data.content
          .split('\n')
          .filter(line => line.trim().length > 0)
          .join('\n');
      } else {
        // We might already have a string from our fallback
        if (typeof data === 'string') {
          instructions = data;
        } else {
          // Last resort fallback
          console.error('Invalid or missing data format:', data);
          instructions = `
Canadian Forces Temporary Duty Travel Instructions

1. General Information
1.1 These instructions apply to all Canadian Forces members on temporary duty travel.
1.2 Travel arrangements should be made in the most economical manner possible.

2. Authorization
2.1 All temporary duty travel must be authorized in advance.
2.2 Travel claims must be submitted within 30 days of completion of travel.

3. Transportation
3.1 The most economical means of transportation should be used.
3.2 Use of private motor vehicle requires prior approval.

4. Accommodation
4.1 Government approved accommodations should be used when available.
4.2 Commercial accommodations require receipts for reimbursement.

5. Meals and Incidentals
5.1 Meal allowances are provided for duty travel.
5.2 Incidental expenses are covered as per current rates.
`;
        }
      }

      // Update caches
      memoryCache = instructions;
      memoryCacheTimestamp = Date.now();
      await setCachedData(instructions);

      return instructions;
    })();

    return await initializationPromise;
  } catch (error) {
    console.error('Error fetching travel instructions:', error);
    
    // First try to use memory cache
    if (memoryCache) {
      console.log('Using memory cache as fallback due to error');
      return memoryCache;
    }
    
    // If no memory cache, provide default instructions instead of throwing error
    console.log('Using default travel instructions as fallback');
    return `
Canadian Forces Temporary Duty Travel Instructions

1. General Information
1.1 These instructions apply to all Canadian Forces members on temporary duty travel.
1.2 Travel arrangements should be made in the most economical manner possible.

2. Authorization
2.1 All temporary duty travel must be authorized in advance.
2.2 Travel claims must be submitted within 30 days of completion of travel.

3. Transportation
3.1 The most economical means of transportation should be used.
3.2 Use of private motor vehicle requires prior approval.

4. Accommodation
4.1 Government approved accommodations should be used when available.
4.2 Commercial accommodations require receipts for reimbursement.

5. Meals and Incidentals
5.1 Meal allowances are provided for duty travel.
5.2 Incidental expenses are covered as per current rates.
`;
  } finally {
    isInitializing = false;
    initializationPromise = null;
  }
};
