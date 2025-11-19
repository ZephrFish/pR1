/**
 * Constants and Configuration
 * Centralized configuration values for the URL shortener
 */

export const RATE_LIMITS = {
  AUTH: { limit: 10, window: 60 },           // 10 auth attempts per minute
  CREATE: { limit: 20, window: 3600 },       // 20 URL creations per hour
  REDIRECT: { limit: 100, window: 60 },      // 100 redirects per minute
  EDIT_TOKEN: { limit: 10, window: 300 },    // 10 edit token operations per 5 minutes
};

export const ANALYTICS = {
  MAX_VISITS_PER_URL: 100,                   // Reduced from 1000 to prevent storage bloat
  MAX_RECENT_VISITS_GLOBAL: 50,              // Max visits to return in global analytics
  SAMPLE_RATE: 50,                           // Write detailed analytics every Nth visit (1 in 50 = 2% sample)
  COUNTER_BATCH_SIZE: 20,                    // Batch counter updates every N visits (1 in 20 = 5% writes)
  ENABLE_GLOBAL_COUNTER: false,              // Disable global visitor counter to save writes
};

export const RETRY = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY_MS: 50,
};

export const VALIDATION = {
  SHORT_CODE_MIN_LENGTH: 1,                  // Allow single-character custom short codes
  SHORT_CODE_MAX_LENGTH: 50,
  URL_MAX_LENGTH: 2048,
  MAX_EXPIRATION_SECONDS: 315360000,         // 10 years
  EDIT_TOKEN_LENGTH: 32,
  SHORT_CODE_LENGTH: 7,                      // Auto-generated short codes are 7 characters
  CHARSET_SIZE: 62,                          // Size of alphanumeric charset (a-z, A-Z, 0-9)
  MAX_HEADER_LENGTH: 200,                    // Maximum length for sanitized headers
};

export const CACHE = {
  REDIRECT_TTL: 300,                         // 5 minutes cache for redirects
  HOME_MAX_AGE: 3600,                        // 1 hour cache for home page
  HOME_SWR: 86400,                           // 24 hours stale-while-revalidate
  STATS_MAX_AGE: 300,                        // 5 minutes cache for stats
  STATS_SWR: 600,                            // 10 minutes stale-while-revalidate
  OFFLINE_MAX_AGE: 31536000,                 // 1 year cache for offline page
  SW_MAX_AGE: 0,                             // Always revalidate service worker
};

export const PREFETCH = {
  TOP_URLS_COUNT: 3,                         // Number of top URLs to prefetch
  TOP_URLS_SAMPLE: 20,                       // Sample size for finding top URLs
  URL_LIST_LIMIT: 100,                       // Max URLs to scan for prefetch candidates
  TIMEOUT_MS: 50,                            // Timeout for prefetch to avoid blocking page load
};
