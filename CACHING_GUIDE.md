/\*\*

- CACHING SERVICE USAGE GUIDE
-
- This guide shows how to use the cacheService for offline data persistence
  \*/

// ============================================================================
// BASIC USAGE
// ============================================================================

// 1. Simple cache set/get
import { cacheService, CACHE_KEYS, CACHE_EXPIRATION } from '../../services/cacheService';

// Set value (expires in 30 minutes by default)
await cacheService.set('myKey', { name: 'John', age: 30 });

// Get value
const user = await cacheService.get('myKey');

// Get with custom expiration
await cacheService.set('sessionToken', 'abc123', {
expirationTime: CACHE_EXPIRATION.SHORT // 5 minutes
});

// Get with custom expiration check
const token = await cacheService.get('sessionToken', {
expirationTime: CACHE_EXPIRATION.SHORT
});

// ============================================================================
// FETCH WITH CACHE (RECOMMENDED)
// ============================================================================

// Cache a fetch operation - if cached and not expired, returns cached data
// Otherwise fetches fresh data and caches it
const salons = await cacheService.getOrFetch(
'salons:list',
async () => {
// This function only runs if cache miss/expired
return await fetch('https://api.example.com/salons').then(r => r.json());
},
{ expirationTime: CACHE_EXPIRATION.MEDIUM } // 30 minutes
);

// ============================================================================
// USING PREDEFINED CACHE KEYS
// ============================================================================

// Salons
const allSalons = await cacheService.get(CACHE_KEYS.SALON_LIST);
const salonDetail = await cacheService.get(CACHE_KEYS.SALON_DETAIL('salon-123'));

// Services
const services = await cacheService.get(CACHE_KEYS.SERVICES('salon-123'));

// Bookings
const myBookings = await cacheService.get(CACHE_KEYS.USER_BOOKINGS('user-456'));

// ============================================================================
// EXPIRATION TIMES
// ============================================================================

// SHORT: 5 minutes - for frequently changing data (user bookings, search results)
await cacheService.set('userData', data, { expirationTime: CACHE_EXPIRATION.SHORT });

// MEDIUM: 30 minutes - for moderately changing data (salon list)
await cacheService.set('salons', data, { expirationTime: CACHE_EXPIRATION.MEDIUM });

// LONG: 2 hours - for stable data (salon details, service info)
await cacheService.set('salonDetail', data, { expirationTime: CACHE_EXPIRATION.LONG });

// NEVER: Never expires (0) - for static data
await cacheService.set('categories', data, { expirationTime: CACHE_EXPIRATION.NEVER });

// ============================================================================
// INVALIDATING CACHE
// ============================================================================

// Remove single cache entry
await cacheService.remove(CACHE_KEYS.SALON_DETAIL('salon-123'));

// Clear cache by pattern (e.g., all nearby salon caches)
await cacheService.clearPattern('_nearby_');

// Clear all salon-related caches
await cacheService.clearPattern('salon:\*');

// Clear all caches
await cacheService.clear();

// ============================================================================
// BEST PRACTICES
// ============================================================================

// 1. Use getOrFetch for data fetching - it's simpler and more reliable
const user = await cacheService.getOrFetch(
CACHE_KEYS.USER_PROFILE('user-123'),
async () => {
const response = await fetch(`https://api.example.com/users/user-123`);
return response.json();
},
{ expirationTime: CACHE_EXPIRATION.MEDIUM }
);

// 2. Invalidate cache after mutations
async function updateSalon(id: string, data: any) {
// Update in database
await database.update('salons', id, data);

// Invalidate cache so next fetch gets fresh data
await cacheService.remove(CACHE_KEYS.SALON_DETAIL(id));
await cacheService.clearPattern('_nearby_'); // If location might have changed
}

// 3. Handle errors gracefully - cache failures are non-fatal
async function getSalon(id: string) {
try {
return await cacheService.get(CACHE_KEYS.SALON_DETAIL(id));
} catch (error) {
// Cache error, continue without cache
console.warn('Cache error:', error);
return null;
}
}

// 4. Monitor cache size in debug builds
if (**DEV**) {
const sizeBytes = await cacheService.getSize();
const sizeMB = sizeBytes / 1024 / 1024;
console.log(`Cache size: ${sizeMB.toFixed(2)} MB`);
}

// ============================================================================
// OFFLINE SUPPORT PATTERN
// ============================================================================

async function fetchWithOfflineSupport<T>(
cacheKey: string,
fetchFn: () => Promise<T>,
expirationTime = CACHE_EXPIRATION.MEDIUM
): Promise<T | null> {
try {
// Try online fetch first
const data = await fetchFn();
// Update cache on success
await cacheService.set(cacheKey, data, { expirationTime });
return data;
} catch (error) {
// Fall back to cache if online fetch fails
console.warn('Online fetch failed, trying cache:', error);
const cachedData = await cacheService.get<T>(cacheKey, { expirationTime: 0 }); // Ignore expiration
if (cachedData) {
console.log('Loaded from cache (offline mode)');
return cachedData;
}
// No cache available
throw new Error('No data available (offline and no cache)');
}
}

// Usage:
try {
const salons = await fetchWithOfflineSupport(
CACHE_KEYS.SALON_LIST,
() => salonService.getAllSalons(),
CACHE_EXPIRATION.MEDIUM
);
} catch (error) {
console.error('Failed to load salons:', error);
}

// ============================================================================
// REAL-WORLD EXAMPLES IN YOUR APP
// ============================================================================

// SearchScreen.tsx - Cache search results
const SearchScreen = () => {
const [salons, setSalons] = useState<Salon[]>([]);

useEffect(() => {
const loadSalons = async () => {
const results = await cacheService.getOrFetch(
`search:${searchQuery}`,
() => salonService.searchWithLocation(searchQuery, coords),
{ expirationTime: CACHE_EXPIRATION.SHORT }
);
setSalons(results);
};
loadSalons();
}, [searchQuery]);
};

// HomeScreen.tsx - Cache nearby salons for quick reload
const HomeScreen = () => {
const loadNearbySalons = async () => {
const [latitude, longitude] = await getCurrentCoordinates();
const nearby = await cacheService.getOrFetch(
'salons:nearby:current',
() => salonService.getNearbySorted(latitude, longitude),
{ expirationTime: CACHE_EXPIRATION.SHORT }
);
setNearbySalons(nearby);
};
};

// MyBookingsScreen.tsx - Cache user bookings
const MyBookingsScreen = () => {
useEffect(() => {
const loadBookings = async () => {
const bookings = await cacheService.getOrFetch(
CACHE_KEYS.USER_BOOKINGS(userId),
() => bookingService.getCustomerBookings(userId),
{ expirationTime: CACHE_EXPIRATION.SHORT }
);
setBookings(bookings);
};
loadBookings();
}, [userId]);
};

// Booking confirmation - Invalidate related caches
const BookingFormScreen = () => {
const handleConfirmBooking = async (bookingData: Booking) => {
const booking = await bookingService.createBooking(bookingData);

    // The bookingService.createBooking already invalidates cache,
    // but you can do additional cleanup here if needed

    showSuccessMessage('Booking confirmed!');

};
};
