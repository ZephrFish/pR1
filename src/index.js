import { getHomePage, getEditPage, getOfflinePage } from './html.js';
import serviceWorkerCode from './sw.js';
import { generateShortCode, generateEditToken } from './utils/crypto.js';
import { RATE_LIMITS, ANALYTICS, RETRY, VALIDATION, CACHE, PREFETCH } from './constants.js';

// PERFORMANCE OPTIMIZATION: Module-level caches (persist across requests in same worker instance)
const moduleCache = {
  passwordValidated: new Map(), // Cache password validation by password value
  securityHeaders: null,        // Base security headers (created once)
};

// PERFORMANCE OPTIMIZATION: Bot detection patterns (created once at module level)
const BOT_PATTERNS = [
  { pattern: /bot|crawler|spider|crawling|slurp/i, name: 'Generic Bot' },
  { pattern: /googlebot/i, name: 'Googlebot' },
  { pattern: /bingbot|msnbot/i, name: 'Bingbot' },
  { pattern: /yandex/i, name: 'YandexBot' },
  { pattern: /baidu/i, name: 'Baiduspider' },
  { pattern: /duckduckbot/i, name: 'DuckDuckBot' },
  { pattern: /slackbot/i, name: 'Slackbot' },
  { pattern: /facebookexternalhit|facebookbot/i, name: 'Facebook Bot' },
  { pattern: /twitterbot/i, name: 'Twitterbot' },
  { pattern: /linkedinbot/i, name: 'LinkedInBot' },
  { pattern: /whatsapp/i, name: 'WhatsApp' },
  { pattern: /telegrambot/i, name: 'Telegram Bot' },
  { pattern: /discordbot/i, name: 'Discord Bot' },
  { pattern: /semrushbot/i, name: 'SemrushBot' },
  { pattern: /ahrefsbot/i, name: 'AhrefsBot' },
  { pattern: /dotbot/i, name: 'DotBot' },
  { pattern: /petalbot/i, name: 'PetalBot' },
];

// Fast bot detection keywords (for quick string check before regex)
const BOT_KEYWORDS = ['bot', 'crawler', 'spider', 'crawling', 'slurp'];

/**
 * SECURITY: Validate edit token format
 * @param {string} editToken - Edit token to validate
 * @returns {{valid: boolean, error?: string}}
 */
function validateEditToken(editToken) {
  if (!editToken || typeof editToken !== 'string') {
    return { valid: false, error: 'Invalid edit token' };
  }

  if (editToken.length !== VALIDATION.EDIT_TOKEN_LENGTH) {
    return { valid: false, error: 'Invalid edit token format' };
  }

  if (!/^[a-zA-Z0-9]+$/.test(editToken)) {
    return { valid: false, error: 'Invalid edit token characters' };
  }

  return { valid: true };
}

/**
 * SECURITY FIX: Validate password strength
 * Enforces minimum security requirements for admin password
 * @param {string} password - Password to validate
 * @returns {object} Validation result with valid flag and error message
 */
function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  // Minimum length requirement
  if (password.length < 12) {
    return {
      valid: false,
      error: 'Password must be at least 12 characters long'
    };
  }

  // Require at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one uppercase letter'
    };
  }

  // Require at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one lowercase letter'
    };
  }

  // Require at least one digit
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one number'
    };
  }

  // Require at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>?/)'
    };
  }

  // Check for common weak passwords
  const weakPasswords = [
    'password123', 'admin123456', 'administrator',
    'changeme123', 'welcome123!', 'qwerty123456'
  ];
  if (weakPasswords.some(weak => password.toLowerCase().includes(weak))) {
    return {
      valid: false,
      error: 'Password contains common weak patterns. Please choose a stronger password'
    };
  }

  return { valid: true };
}

/**
 * Helper: Retry KV operations with exponential backoff
 * @param {Function} operation - The KV operation to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<any>} The result of the operation
 */
async function retryKVOperation(operation, maxRetries = RETRY.MAX_ATTEMPTS) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      // Only retry on transient errors
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 50ms, 100ms, 200ms
        const delay = RETRY.INITIAL_DELAY_MS * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

/**
 * Security: Constant-time string comparison to prevent timing attacks
 * @param {string} a - First string to compare
 * @param {string} b - Second string to compare
 * @returns {boolean} True if strings are equal
 */
function constantTimeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  // SECURITY FIX: Don't reassign b, use original length check
  const lengthMatch = a.length === b.length;

  // Always perform comparison to prevent timing attacks
  // Use the longer length to ensure we always do the same amount of work
  const compareLength = Math.max(a.length, b.length);

  let result = 0;
  for (let i = 0; i < compareLength; i++) {
    // If one string is shorter, use 0 as a placeholder
    const aChar = i < a.length ? a.charCodeAt(i) : 0;
    const bChar = i < b.length ? b.charCodeAt(i) : 0;
    result |= aChar ^ bChar;
  }

  return result === 0 && lengthMatch;
}

/**
 * Helper: Create JSON error response
 * @param {string} error - Error message
 * @param {number} status - HTTP status code
 * @param {Object} corsHeaders - CORS headers
 * @returns {Response}
 */
function jsonError(error, status, corsHeaders) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Helper: Validate expiration time
 * @param {any} expiresIn - Expiration time in seconds
 * @returns {{valid: boolean, error?: string, value?: number}}
 */
function validateExpiration(expiresIn) {
  if (expiresIn === undefined || expiresIn === null || expiresIn === '') {
    return { valid: true };
  }
  const value = parseInt(expiresIn);
  if (isNaN(value) || value <= 0) {
    return { valid: false, error: 'Expiration time must be a positive number' };
  }
  if (value > VALIDATION.MAX_EXPIRATION_SECONDS) {
    return { valid: false, error: 'Expiration time cannot exceed 10 years' };
  }
  return { valid: true, value };
}

/**
 * Helper: Validate short code
 * @param {string} code - Short code to validate
 * @returns {{valid: boolean, error?: string}}
 */
function validateShortCode(code) {
  if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
    return { valid: false, error: 'Short code can only contain letters, numbers, hyphens, and underscores' };
  }
  if (code.length < VALIDATION.SHORT_CODE_MIN_LENGTH) {
    return { valid: false, error: `Short code must be at least ${VALIDATION.SHORT_CODE_MIN_LENGTH} characters long` };
  }
  if (code.length > VALIDATION.SHORT_CODE_MAX_LENGTH) {
    return { valid: false, error: `Short code must not exceed ${VALIDATION.SHORT_CODE_MAX_LENGTH} characters` };
  }
  return { valid: true };
}

/**
 * Security: Native Cloudflare rate limiting (more efficient than KV-based)
 * Uses Cloudflare's edge-cached rate limiting API for low latency
 * @param {Object} rateLimiter - Rate limiter binding from env
 * @param {string} key - Unique identifier for rate limiting (e.g., IP address)
 * @returns {Promise<{allowed: boolean}>}
 */
async function checkRateLimit(rateLimiter, key) {
  try {
    // Use native Cloudflare rate limiting if available
    if (rateLimiter && typeof rateLimiter.limit === 'function') {
      const { success } = await rateLimiter.limit({ key });
      return { allowed: success };
    }
    // Fallback: allow if rate limiter not configured
    return { allowed: true };
  } catch (error) {
    // Fail open on errors to prevent DoS
    console.error('Rate limit error:', error);
    return { allowed: true };
  }
}

/**
 * Security: Extract and verify password from Authorization header
 * @param {Request} request - The incoming request
 * @param {Object} env - Worker environment bindings
 * @param {Object} corsHeaders - CORS headers to include in response
 * @returns {Promise<{success: boolean, response?: Response}>}
 */
async function verifyAuth(request, env, corsHeaders) {
  // Get client IP for rate limiting
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Check rate limit using native Cloudflare rate limiting
  const rateLimit = await checkRateLimit(env.RATE_LIMIT_AUTH, clientIP);
  if (!rateLimit.allowed) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({
          error: 'Too many authentication attempts. Please try again later.',
          retryAfter: 60,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      ),
    };
  }

  // Extract password from Authorization header (Bearer token) only - no insecure fallbacks
  let password = null;

  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    password = authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  if (!password) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: 'Authentication required. Provide password in Authorization header.' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      ),
    };
  }

  // Use constant-time comparison to prevent timing attacks
  if (!constantTimeCompare(password, env.ADMIN_PASSWORD)) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: 'Invalid password' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      ),
    };
  }

  return { success: true };
}

/**
 * Main Cloudflare Worker entry point
 * Handles all incoming HTTP requests and routes them appropriately
 */
export default {
  async fetch(request, env, ctx) {
    // Security: Validate critical environment variables on startup
    if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD === '') {
      console.error('CRITICAL: ADMIN_PASSWORD not set in environment variables');
      return new Response(
        JSON.stringify({
          error: 'Service configuration error. Please contact administrator.',
          code: 'ENV_CONFIG_ERROR'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // PERFORMANCE + SECURITY: Validate password strength (cached per worker instance)
    if (!moduleCache.passwordValidated.has(env.ADMIN_PASSWORD)) {
      const passwordValidation = validatePasswordStrength(env.ADMIN_PASSWORD);
      if (!passwordValidation.valid) {
        console.error('CRITICAL: Weak admin password detected:', passwordValidation.error);
        return new Response(
          JSON.stringify({
            error: 'Service configuration error: Weak admin password detected.',
            details: passwordValidation.error,
            code: 'WEAK_PASSWORD',
            requirements: [
              'At least 12 characters long',
              'Contains uppercase letters (A-Z)',
              'Contains lowercase letters (a-z)',
              'Contains numbers (0-9)',
              'Contains special characters (!@#$%^&*()_+-=[]{};\':"|,.<>?/)',
              'Does not contain common weak patterns'
            ]
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      // Cache successful validation
      moduleCache.passwordValidated.set(env.ADMIN_PASSWORD, true);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // PERFORMANCE: Cache base security headers (created once per worker instance)
    if (!moduleCache.securityHeaders) {
      moduleCache.securityHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        'Content-Security-Policy': "default-src 'self'; script-src 'unsafe-inline' 'self' https://cdnjs.cloudflare.com; style-src 'unsafe-inline' 'self'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https: http:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Vary': 'Accept-Encoding',
        'Alt-Svc': 'h3=":443"; ma=86400',
        'Accept-CH': 'Sec-CH-UA-Platform, Sec-CH-UA-Mobile',
      };
    }

    // Security: Strict CORS validation - exact domain match only
    const origin = request.headers.get('Origin');
    const allowedOrigins = [
      `https://${env.DOMAIN}`,
      `http://${env.DOMAIN}`,
      `https://www.${env.DOMAIN}`,
      `http://localhost:8787`,
    ];

    // SECURITY FIX: Only allow credentials when origin is explicitly allowed
    const isOriginAllowed = origin && allowedOrigins.includes(origin);
    const allowedOrigin = isOriginAllowed ? origin : `https://${env.DOMAIN}`;

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...(isOriginAllowed && { 'Access-Control-Allow-Credentials': 'true' }),
    };

    // Merge base security headers with CORS headers
    const securityHeaders = { ...moduleCache.securityHeaders, ...corsHeaders };

    // Handle OPTIONS for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Route: Service Worker
    if (path === '/sw.js') {
      return new Response(serviceWorkerCode, {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate', // Always check for updates
          'Service-Worker-Allowed': '/',
        },
      });
    }

    // Route: Offline page
    if (path === '/offline') {
      const offlineHtml = getOfflinePage();
      return new Response(offlineHtml, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          ...securityHeaders,
        },
      });
    }

    // Route: Home page with URL creation form
    if (path === '/' || path === '/admin') {
      // FREE TIER: Global visitor counter disabled to save KV writes
      if (ANALYTICS.ENABLE_GLOBAL_COUNTER) {
        ctx.waitUntil(incrementGlobalVisitors(env));
      }

      const html = getHomePage();

      // DISABLED: Predictive prefetching causes browser to fetch shortened URLs
      // which triggers redirects and CSP issues with external domains
      // const topUrls = await Promise.race([
      //   getTopUrlsForPrefetch(env),
      //   new Promise(resolve => setTimeout(() => resolve([]), PREFETCH.TIMEOUT_MS))
      // ]).catch(() => []);

      const headers = {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': `public, max-age=${CACHE.HOME_MAX_AGE}, stale-while-revalidate=${CACHE.HOME_SWR}`,
        ...securityHeaders,
      };

      // // Add Link headers for prefetching popular redirects
      // if (topUrls.length > 0) {
      //   const linkHeaders = topUrls.map(shortCode =>
      //     `</${shortCode}>; rel=prefetch; as=document`
      //   ).join(', ');
      //   headers['Link'] = linkHeaders;
      // }

      return new Response(html, { headers });
    }

    // Route: Get global stats (public, no auth required)
    if (path === '/api/stats' && request.method === 'GET') {
      return handleGetStats(env, securityHeaders);
    }

    // Route: Create short URL (API)
    if (path === '/api/create' && request.method === 'POST') {
      return handleCreate(request, env, securityHeaders);
    }

    // Route: Get all URLs (API) - requires auth
    if (path === '/api/urls' && request.method === 'GET') {
      return handleGetUrls(request, env, securityHeaders);
    }

    // Route: Update URL (API) - requires auth
    if (path.startsWith('/api/update/') && request.method === 'PUT') {
      const shortCode = path.replace('/api/update/', '');
      return handleUpdate(shortCode, request, env, securityHeaders);
    }

    // Route: Delete URL (API) - requires auth
    if (path.startsWith('/api/delete/') && request.method === 'DELETE') {
      const shortCode = path.replace('/api/delete/', '');
      return handleDelete(shortCode, request, env, securityHeaders);
    }

    // Route: Get global analytics (API) - requires auth
    if (path === '/api/analytics/global' && request.method === 'GET') {
      return handleGetGlobalAnalytics(request, env, securityHeaders);
    }

    // Route: Get analytics (API) - requires auth
    if (path.startsWith('/api/analytics/') && request.method === 'GET') {
      const shortCode = path.replace('/api/analytics/', '');
      return handleGetAnalytics(shortCode, request, env, securityHeaders);
    }

    // Route: Public edit page (no auth required, uses edit token)
    if (path.startsWith('/e/')) {
      const editToken = path.replace('/e/', '');
      return handleEditPage(editToken, env, securityHeaders);
    }

    // Route: Get URL by edit token (public API)
    if (path.startsWith('/api/url/') && request.method === 'GET') {
      const editToken = path.replace('/api/url/', '');
      return handleGetByEditToken(editToken, request, env, securityHeaders);
    }

    // Route: Update URL by edit token (public API)
    if (path.startsWith('/api/url/') && request.method === 'PUT') {
      const editToken = path.replace('/api/url/', '');
      return handleUpdateByEditToken(editToken, request, env, securityHeaders);
    }

    // Route: Delete URL by edit token (public API)
    if (path.startsWith('/api/url/') && request.method === 'DELETE') {
      const editToken = path.replace('/api/url/', '');
      return handleDeleteByEditToken(editToken, request, env, securityHeaders);
    }

    // Route: Redirect short URL
    if (path.length > 1) {
      return handleRedirect(path.substring(1), env, ctx, request);
    }

    return new Response('Not Found', { status: 404, headers: securityHeaders });
  },
};

/**
 * Get top URLs for predictive prefetching
 * Returns short codes of the most visited URLs for Link prefetch hints
 * @param {Object} env - Worker environment bindings
 * @returns {Promise<string[]>} Array of short codes to prefetch
 */
async function getTopUrlsForPrefetch(env) {
  try {
    // Get list of all URLs (limit to avoid scanning entire KV)
    const { keys } = await env.URL_STORE.list({ limit: PREFETCH.URL_LIST_LIMIT });

    // Filter to actual URL entries (not analytics or hash indexes)
    const urlKeys = keys.filter(k =>
      !k.name.startsWith('analytics:') &&
      !k.name.startsWith('urlhash:') &&
      !k.name.startsWith('ratelimit:') &&
      !k.name.startsWith('global:') &&
      k.name.length <= VALIDATION.SHORT_CODE_MAX_LENGTH
    );

    // Get visit counts for sample of URLs
    const urlsWithVisits = await Promise.all(
      urlKeys.slice(0, PREFETCH.TOP_URLS_SAMPLE).map(async (key) => {
        const visits = await env.ANALYTICS.get(key.name);
        return {
          shortCode: key.name,
          visits: parseInt(visits || '0', 10)
        };
      })
    );

    // Sort by visits descending and return top N
    const topUrls = urlsWithVisits
      .filter(u => u.visits > 0)
      .sort((a, b) => b.visits - a.visits)
      .slice(0, PREFETCH.TOP_URLS_COUNT)
      .map(u => u.shortCode);

    return topUrls;
  } catch (error) {
    console.error('Error getting top URLs for prefetch:', error);
    return [];
  }
}

/**
 * Handle creating a new short URL
 * @param {Request} request - The incoming request
 * @param {Object} env - Worker environment bindings
 * @param {Object} corsHeaders - CORS headers
 * @returns {Promise<Response>}
 */
async function handleCreate(request, env, corsHeaders) {
  try {
    // Rate limit URL creation using native Cloudflare rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimit = await checkRateLimit(env.RATE_LIMIT_CREATE, clientIP);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: 60,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }

    // Safely parse JSON with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return jsonError('Invalid JSON in request body', 400, corsHeaders);
    }

    const { url: longUrl, shortCode, expiresIn } = body;

    // Validate URL
    if (!longUrl) {
      return jsonError('URL is required', 400, corsHeaders);
    }
    if (!isValidUrl(longUrl, env)) {
      const allowHttp = env?.ALLOW_HTTP === 'true';
      const allowPrivate = env?.ALLOW_PRIVATE_IPS === 'true';
      const protocol = allowHttp ? 'HTTP/HTTPS' : 'HTTPS';
      const ipMsg = allowPrivate ? '' : ' or private IPs';
      return jsonError(`Invalid URL. Must be a valid ${protocol} URL without credentials${ipMsg} (max ${VALIDATION.URL_MAX_LENGTH} characters)`, 400, corsHeaders);
    }

    // Check if URL already exists (duplicate detection)
    // Only check if not forcing a new short code
    if (!shortCode && !body.forceNew) {
      const existingShortCode = await findExistingUrl(longUrl, env);
      if (existingShortCode) {
        const existingData = await env.URL_STORE.get(existingShortCode);
        const existing = JSON.parse(existingData);

        return new Response(
          JSON.stringify({
            success: true,
            duplicate: true,
            message: 'This URL has already been shortened',
            shortUrl: `https://${env.DOMAIN}/${existingShortCode}`,
            shortCode: existingShortCode,
            expiresAt: existing.expiresAt,
            editToken: existing.editToken,
            editUrl: `https://${env.DOMAIN}/e/${existing.editToken}`,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Generate or validate short code
    let finalShortCode = shortCode;
    if (!finalShortCode) {
      finalShortCode = await generateShortCode(env);
    } else {
      // Validate custom short code
      const codeValidation = validateShortCode(finalShortCode);
      if (!codeValidation.valid) {
        return jsonError(codeValidation.error, 400, corsHeaders);
      }

      // Check if short code already exists
      const existing = await env.URL_STORE.get(finalShortCode);
      if (existing) {
        return jsonError('Short code already in use', 409, corsHeaders);
      }
    }

    // Generate secure edit token for this URL
    const editToken = generateEditToken();

    // Store the URL mapping
    const urlData = {
      longUrl,
      shortCode: finalShortCode,
      createdAt: new Date().toISOString(),
      editToken: editToken,
    };

    // Add expiration if specified
    const expirationValidation = validateExpiration(expiresIn);
    if (!expirationValidation.valid) {
      return jsonError(expirationValidation.error, 400, corsHeaders);
    }
    if (expirationValidation.value) {
      urlData.expiresAt = new Date(Date.now() + expirationValidation.value * 1000).toISOString();
    }

    // PERFORMANCE OPTIMIZATION: Compute hash first, then parallelize all KV writes
    const urlHash = await hashUrl(longUrl);
    const urlDataJson = JSON.stringify(urlData);

    // Parallelize all 4 KV writes for 4x performance improvement
    await Promise.all([
      retryKVOperation(() => env.URL_STORE.put(finalShortCode, urlDataJson)),
      retryKVOperation(() => env.ANALYTICS.put(finalShortCode, '0')),
      retryKVOperation(() => env.URL_STORE.put(`edit:${editToken}`, finalShortCode)),
      retryKVOperation(() => env.URL_STORE.put(`urlhash:${urlHash}`, finalShortCode)),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        shortUrl: `https://${env.DOMAIN}/${finalShortCode}`,
        shortCode: finalShortCode,
        expiresAt: urlData.expiresAt,
        editToken: editToken,
        editUrl: `https://${env.DOMAIN}/e/${editToken}`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Handle URL redirection from short code to long URL
 * @param {string} shortCode - The short code to redirect
 * @param {Object} env - Worker environment bindings
 * @param {ExecutionContext} ctx - Worker execution context
 * @param {Request} request - The incoming request
 * @returns {Promise<Response>}
 */
async function handleRedirect(shortCode, env, ctx, request) {
  const startTime = Date.now();

  try {
    // PERFORMANCE OPTIMIZATION: Check cache first (fast path for majority of requests)
    const cache = caches.default;
    const cacheKey = new Request(`https://cache.url/${shortCode}`, { method: 'GET' });
    let cachedResponse = await cache.match(cacheKey);

    // Check rate limit once at the start using native Cloudflare rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimit = await checkRateLimit(env.RATE_LIMIT_REDIRECT, clientIP);
    if (!rateLimit.allowed) {
      return new Response('Rate limit exceeded. Please try again later.', {
        status: 429,
        headers: {
          'Retry-After': '60',
        },
      });
    }

    let urlData;
    if (cachedResponse) {
      // Cache hit - fast path
      const cachedData = await cachedResponse.text();
      urlData = JSON.parse(cachedData);
    } else {
      // Cache miss - fetch from KV
      const urlDataStr = await env.URL_STORE.get(shortCode);

      if (!urlDataStr) {
        // Rick roll for non-existent URLs
        return Response.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 302);
      }

      try {
        urlData = JSON.parse(urlDataStr);

        // Cache URL data for 5 minutes to reduce KV reads
        const cacheResponse = new Response(urlDataStr, {
          headers: {
            'Cache-Control': 'public, max-age=300',
            'Content-Type': 'application/json'
          }
        });
        ctx.waitUntil(cache.put(cacheKey, cacheResponse));
      } catch (parseError) {
        console.error('Error parsing URL data:', parseError);
        return new Response('Unable to read URL data. The stored data may be corrupted. Please contact support.', { status: 500 });
      }
    }

    // Check if URL has expired
    if (urlData.expiresAt) {
      const expirationDate = new Date(urlData.expiresAt);
      if (Date.now() > expirationDate.getTime()) {
        return new Response('This short URL has expired and is no longer available.', { status: 410 });
      }
    }

    // Record detailed analytics asynchronously
    ctx.waitUntil(recordVisit(shortCode, request, env));

    // Create redirect response with performance timing
    const totalTime = Date.now() - startTime;

    // BUGFIX: Response.redirect() returns immutable response, can't modify headers
    // Create custom redirect response with Server-Timing header
    return new Response(null, {
      status: 302,
      headers: {
        'Location': urlData.longUrl,
        'Server-Timing': `total;dur=${totalTime}`
      }
    });
  } catch (error) {
    return new Response('An error occurred while processing your request. Please try again later.', { status: 500 });
  }
}

// Get all URLs
async function handleGetUrls(request, env, corsHeaders) {
  try {
    // Verify authentication using secure header-based auth
    const authResult = await verifyAuth(request, env, corsHeaders);
    if (!authResult.success) {
      return authResult.response;
    }

    // List all keys in KV with pagination support
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit')) || 100;
    const cursor = url.searchParams.get('cursor') || undefined;

    const list = await env.URL_STORE.list({ limit, cursor });

    // Filter out non-URL keys BEFORE fetching (performance optimization)
    const urlKeys = list.keys.filter(k =>
      !k.name.startsWith('edit:') &&
      !k.name.startsWith('analytics:') &&
      !k.name.startsWith('ratelimit:') &&
      !k.name.startsWith('global:')
    );

    // Batch fetch URLs and analytics in parallel
    const urlPromises = urlKeys.map(async (key) => {
      const [urlDataStr, visits] = await Promise.all([
        env.URL_STORE.get(key.name),
        env.ANALYTICS.get(key.name)
      ]);

      if (urlDataStr) {
        try {
          const urlData = JSON.parse(urlDataStr);
          return {
            ...urlData,
            visits: parseInt(visits || '0'),
          };
        } catch (parseError) {
          console.error(`Error parsing URL data for ${key.name}:`, parseError);
          return null;
        }
      }
      return null;
    });

    const urls = (await Promise.all(urlPromises)).filter(url => url !== null);

    return new Response(JSON.stringify({
      urls,
      pagination: {
        total: urls.length,
        cursor: list.cursor,
        list_complete: list.list_complete
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Update a short URL
async function handleUpdate(shortCode, request, env, corsHeaders) {
  try {
    // Verify authentication using secure header-based auth
    const authResult = await verifyAuth(request, env, corsHeaders);
    if (!authResult.success) {
      return authResult.response;
    }

    // Safely parse JSON with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return jsonError('Invalid JSON in request body', 400, corsHeaders);
    }

    const { url: newLongUrl, expiresIn, removeExpiration } = body;

    // Get existing URL data
    const existingDataStr = await env.URL_STORE.get(shortCode);
    if (!existingDataStr) {
      return jsonError('Short URL not found', 404, corsHeaders);
    }

    // Validate new URL
    if (!newLongUrl) {
      return jsonError('URL is required', 400, corsHeaders);
    }
    if (!isValidUrl(newLongUrl, env)) {
      const allowHttp = env?.ALLOW_HTTP === 'true';
      const allowPrivate = env?.ALLOW_PRIVATE_IPS === 'true';
      const protocol = allowHttp ? 'HTTP/HTTPS' : 'HTTPS';
      const ipMsg = allowPrivate ? '' : ' or private IPs';
      return jsonError(`Invalid URL. Must be a valid ${protocol} URL without credentials${ipMsg} (max ${VALIDATION.URL_MAX_LENGTH} characters)`, 400, corsHeaders);
    }

    const existingData = JSON.parse(existingDataStr);

    // Update the URL
    const updatedData = {
      ...existingData,
      longUrl: newLongUrl,
      updatedAt: new Date().toISOString(),
    };

    // Handle expiration updates
    if (removeExpiration) {
      delete updatedData.expiresAt;
    } else {
      const expirationValidation = validateExpiration(expiresIn);
      if (!expirationValidation.valid) {
        return jsonError(expirationValidation.error, 400, corsHeaders);
      }
      if (expirationValidation.value) {
        updatedData.expiresAt = new Date(Date.now() + expirationValidation.value * 1000).toISOString();
      }
    }

    // Update URL data with retry logic
    await retryKVOperation(() => env.URL_STORE.put(shortCode, JSON.stringify(updatedData)));

    // Invalidate cache for this short code
    try {
      const cache = caches.default;
      const cacheKey = new Request(`https://cache.url/${shortCode}`, { method: 'GET' });
      await cache.delete(cacheKey);
    } catch (cacheError) {
      console.error('Error invalidating cache:', cacheError);
      // Don't fail the request if cache invalidation fails
    }

    return new Response(JSON.stringify({ success: true, data: updatedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Delete a short URL
async function handleDelete(shortCode, request, env, corsHeaders) {
  try {
    // Verify authentication using secure header-based auth
    const authResult = await verifyAuth(request, env, corsHeaders);
    if (!authResult.success) {
      return authResult.response;
    }

    // Get URL data to retrieve edit token and URL hash before deletion
    const urlDataStr = await env.URL_STORE.get(shortCode);
    let urlHash = null;
    if (urlDataStr) {
      try {
        const urlData = JSON.parse(urlDataStr);
        // Delete edit token mapping if it exists
        if (urlData.editToken) {
          await retryKVOperation(() => env.URL_STORE.delete(`edit:${urlData.editToken}`));
        }
        // Get URL hash for index deletion
        if (urlData.longUrl) {
          urlHash = await hashUrl(urlData.longUrl);
        }
      } catch (parseError) {
        console.error('Error parsing URL data during deletion:', parseError);
        // Continue with deletion even if parsing fails
      }
    }

    // Delete data with retry logic
    await retryKVOperation(() => env.URL_STORE.delete(shortCode));
    await retryKVOperation(() => env.ANALYTICS.delete(shortCode));
    await retryKVOperation(() => env.ANALYTICS.delete(`analytics:${shortCode}`));

    // Delete URL hash index
    if (urlHash) {
      await retryKVOperation(() => env.URL_STORE.delete(`urlhash:${urlHash}`));
    }

    // Invalidate cache for this short code
    try {
      const cache = caches.default;
      const cacheKey = new Request(`https://cache.url/${shortCode}`, { method: 'GET' });
      await cache.delete(cacheKey);
    } catch (cacheError) {
      console.error('Error invalidating cache:', cacheError);
      // Don't fail the request if cache invalidation fails
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get analytics for a short URL
async function handleGetAnalytics(shortCode, request, env, corsHeaders) {
  try {
    // Verify authentication - analytics contains sensitive visitor data
    const authResult = await verifyAuth(request, env, corsHeaders);
    if (!authResult.success) {
      return authResult.response;
    }

    const urlDataStr = await env.URL_STORE.get(shortCode);
    if (!urlDataStr) {
      return jsonError('Short URL not found', 404, corsHeaders);
    }

    const urlData = JSON.parse(urlDataStr);

    // Get consolidated analytics (new format)
    const detailedKey = `analytics:${shortCode}`;
    const detailedDataStr = await env.ANALYTICS.get(detailedKey);

    let analytics = {};
    if (detailedDataStr) {
      const analyticsData = JSON.parse(detailedDataStr);
      const detailedVisits = analyticsData.visits || [];

      // Calculate unique metrics
      const uniqueSessions = new Set(detailedVisits.map(v => v.sessionId).filter(s => s)).size;
      const uniqueVisitors = new Set(detailedVisits.map(v => v.ip).filter(ip => ip && ip !== 'unknown')).size;

      // Filter out bot visits for human-only analytics
      const humanVisits = detailedVisits.filter(v => !v.isBot);
      const onlyBotVisits = detailedVisits.filter(v => v.isBot);

      // Calculate average processing time
      const avgProcessingTime = detailedVisits.length > 0
        ? (detailedVisits.reduce((sum, v) => sum + (v.processingTime || 0), 0) / detailedVisits.length).toFixed(2)
        : 0;

      analytics = {
        // Overall metrics
        totalVisits: analyticsData.totalVisits || 0,
        humanVisits: humanVisits.length,
        botVisits: analyticsData.botVisits || 0,
        uniqueVisitors: uniqueVisitors,
        uniqueSessions: uniqueSessions,
        avgProcessingTime: parseFloat(avgProcessingTime),

        // Detailed visits
        detailedVisits: detailedVisits,

        // Traffic sources
        topReferers: aggregateTopItems(humanVisits, 'referer', 10),
        topUtmSources: aggregateTopItems(humanVisits.filter(v => v.utmSource), 'utmSource', 10),
        topUtmMediums: aggregateTopItems(humanVisits.filter(v => v.utmMedium), 'utmMedium', 10),
        topUtmCampaigns: aggregateTopItems(humanVisits.filter(v => v.utmCampaign), 'utmCampaign', 10),

        // Location analytics
        topCountries: aggregateTopItems(humanVisits, 'country', 10),
        topCities: aggregateTopItems(humanVisits, 'city', 10),
        topContinents: aggregateTopItems(humanVisits, 'continent', 5),
        topRegions: aggregateTopItems(humanVisits, 'region', 10),
        topTimezones: aggregateTopItems(humanVisits, 'timezone', 10),

        // Technology analytics
        topBrowsers: aggregateTopItems(humanVisits, 'browser', 10),
        topDevices: aggregateTopItems(humanVisits, 'device', 5),
        topOS: aggregateTopItems(humanVisits, 'os', 10),
        topLanguages: aggregateTopItems(humanVisits, 'language', 10),
        topTlsVersions: aggregateTopItems(humanVisits, 'tlsVersion', 5),
        topHttpProtocols: aggregateTopItems(humanVisits, 'httpProtocol', 5),

        // Network analytics
        topAsn: aggregateTopItems(humanVisits, 'asn', 10),
        topAsOrganizations: aggregateTopItems(humanVisits, 'asOrganization', 10),
        topDataCenters: aggregateTopItems(humanVisits, 'colo', 10),

        // Bot analytics
        topBots: aggregateTopItems(onlyBotVisits, 'botName', 10),
      };
    } else {
      // No analytics data yet - provide default structure
      analytics = {
        totalVisits: 0,
        humanVisits: 0,
        botVisits: 0,
        uniqueVisitors: 0,
        uniqueSessions: 0,
        avgProcessingTime: 0,
        detailedVisits: [],
        topReferers: [],
        topUtmSources: [],
        topUtmMediums: [],
        topUtmCampaigns: [],
        topCountries: [],
        topCities: [],
        topContinents: [],
        topRegions: [],
        topTimezones: [],
        topBrowsers: [],
        topDevices: [],
        topOS: [],
        topLanguages: [],
        topTlsVersions: [],
        topHttpProtocols: [],
        topAsn: [],
        topAsOrganizations: [],
        topDataCenters: [],
        topBots: [],
      };
    }

    return new Response(
      JSON.stringify({
        ...urlData,
        visits: analytics.totalVisits,
        analytics,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get global analytics across all URLs (requires auth)
async function handleGetGlobalAnalytics(request, env, corsHeaders) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request, env, corsHeaders);
    if (!authResult.success) {
      return authResult.response;
    }

    // Get all URLs
    const list = await env.URL_STORE.list();
    let totalVisits = 0;
    const allVisits = [];

    // Filter out non-URL keys (edit tokens, analytics)
    const urlKeys = list.keys.filter(k =>
      !k.name.startsWith('edit:') &&
      !k.name.startsWith('analytics:')
    );

    // Batch all KV reads for performance (fixes N+1 query problem)
    const analyticsPromises = urlKeys.map(key =>
      Promise.all([
        env.ANALYTICS.get(key.name),
        env.ANALYTICS.get(`analytics:${key.name}`)
      ]).then(([visitCount, detailedData]) => ({
        shortCode: key.name,
        visitCount,
        detailedData
      }))
    );

    const analyticsResults = await Promise.all(analyticsPromises);

    // Aggregate results and build URL performance data
    const urlPerformance = [];
    for (const result of analyticsResults) {
      const visitCount = result.visitCount ? parseInt(result.visitCount) : 0;
      if (result.visitCount) {
        totalVisits += visitCount;
      }

      // Track URL performance
      if (visitCount > 0) {
        urlPerformance.push({
          shortCode: result.shortCode,
          visits: visitCount
        });
      }

      if (result.detailedData) {
        try {
          const visits = JSON.parse(result.detailedData);
          allVisits.push(...visits.map(v => ({...v, shortCode: result.shortCode})));
        } catch (parseError) {
          console.error(`Error parsing analytics for ${result.shortCode}:`, parseError);
        }
      }
    }

    // Sort visits by timestamp (most recent first)
    allVisits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Sort URL performance by visits (descending)
    urlPerformance.sort((a, b) => b.visits - a.visits);

    // Filter human vs bot visits
    const humanVisits = allVisits.filter(v => !v.isBot);
    const botVisits = allVisits.filter(v => v.isBot);

    // Calculate unique visitors and sessions
    const uniqueIPs = new Set(humanVisits.map(v => v.ip).filter(ip => ip && ip !== 'unknown'));
    const uniqueVisitors = uniqueIPs.size;
    const uniqueSessions = new Set(humanVisits.map(v => v.sessionId).filter(s => s)).size;

    // Calculate average processing time
    const avgProcessingTime = allVisits.length > 0
      ? (allVisits.reduce((sum, v) => sum + (v.processingTime || 0), 0) / allVisits.length).toFixed(2)
      : 0;

    // Calculate mobile vs desktop
    let mobileCount = 0;
    let desktopCount = 0;
    let tabletCount = 0;
    humanVisits.forEach(visit => {
      const device = (visit.device || '').toLowerCase();
      if (device.includes('mobile') || device.includes('phone')) {
        mobileCount++;
      } else if (device.includes('tablet')) {
        tabletCount++;
      } else {
        desktopCount++;
      }
    });

    // Calculate time-based patterns (visits by hour)
    const visitsByHour = new Array(24).fill(0);
    const visitsByDay = {};
    humanVisits.forEach(visit => {
      if (visit.timestamp) {
        const date = new Date(visit.timestamp);
        const hour = date.getUTCHours();
        visitsByHour[hour]++;

        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        visitsByDay[dayName] = (visitsByDay[dayName] || 0) + 1;
      }
    });

    // Convert visitsByDay to sorted array
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const visitsByDayArray = dayOrder.map(day => ({
      name: day,
      count: visitsByDay[day] || 0
    }));

    // Aggregate analytics
    const analytics = {
      // Overall metrics
      totalVisits,
      humanVisits: humanVisits.length,
      botVisits: botVisits.length,
      totalUrls: urlKeys.length,
      uniqueVisitors,
      uniqueSessions,
      avgVisitsPerUrl: urlKeys.length > 0 ? (totalVisits / urlKeys.length).toFixed(2) : 0,
      avgProcessingTime: parseFloat(avgProcessingTime),

      // Recent activity
      recentVisits: allVisits.slice(0, ANALYTICS.MAX_RECENT_VISITS_GLOBAL),

      // Traffic sources
      topReferers: aggregateTopItems(humanVisits, 'referer', 10),
      topUtmSources: aggregateTopItems(humanVisits.filter(v => v.utmSource), 'utmSource', 10),
      topUtmMediums: aggregateTopItems(humanVisits.filter(v => v.utmMedium), 'utmMedium', 10),
      topUtmCampaigns: aggregateTopItems(humanVisits.filter(v => v.utmCampaign), 'utmCampaign', 10),

      // Location analytics
      topCountries: aggregateTopItems(humanVisits, 'country', 10),
      topCities: aggregateTopItems(humanVisits, 'city', 10),
      topContinents: aggregateTopItems(humanVisits, 'continent', 5),
      topRegions: aggregateTopItems(humanVisits, 'region', 10),
      topTimezones: aggregateTopItems(humanVisits, 'timezone', 10),

      // Technology analytics
      topBrowsers: aggregateTopItems(humanVisits, 'browser', 10),
      topDevices: aggregateTopItems(humanVisits, 'device', 5),
      topOS: aggregateTopItems(humanVisits, 'os', 10),
      topLanguages: aggregateTopItems(humanVisits, 'language', 10),
      topTlsVersions: aggregateTopItems(humanVisits, 'tlsVersion', 5),
      topHttpProtocols: aggregateTopItems(humanVisits, 'httpProtocol', 5),

      // Network analytics
      topAsn: aggregateTopItems(humanVisits, 'asn', 10),
      topAsOrganizations: aggregateTopItems(humanVisits, 'asOrganization', 10),
      topDataCenters: aggregateTopItems(humanVisits, 'colo', 10),

      // URL performance
      topUrls: urlPerformance.slice(0, 10),

      // Device breakdown
      deviceBreakdown: {
        mobile: mobileCount,
        desktop: desktopCount,
        tablet: tabletCount
      },

      // Time patterns
      visitsByHour: visitsByHour.map((count, hour) => ({ hour, count })),
      visitsByDay: visitsByDayArray,

      // Bot analytics
      topBots: aggregateTopItems(botVisits, 'botName', 10),
    };

    return new Response(JSON.stringify(analytics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get URL data by edit token (public, no auth)
async function handleGetByEditToken(editToken, request, env, corsHeaders) {
  try {
    // SECURITY FIX: Validate edit token format
    const tokenValidation = validateEditToken(editToken);
    if (!tokenValidation.valid) {
      return jsonError(tokenValidation.error, 400, corsHeaders);
    }

    // Rate limit edit token operations using native Cloudflare rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimit = await checkRateLimit(env.RATE_LIMIT_EDIT, clientIP);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: 60,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }

    // Look up shortCode from edit token
    const shortCode = await env.URL_STORE.get(`edit:${editToken}`);
    if (!shortCode) {
      return jsonError('Invalid or expired edit link', 404, corsHeaders);
    }

    // Get URL data
    const urlDataStr = await env.URL_STORE.get(shortCode);
    if (!urlDataStr) {
      return jsonError('URL not found', 404, corsHeaders);
    }

    const urlData = JSON.parse(urlDataStr);
    const visits = await env.ANALYTICS.get(shortCode) || '0';

    return new Response(
      JSON.stringify({
        ...urlData,
        visits: parseInt(visits),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Update URL by edit token (public, no auth)
async function handleUpdateByEditToken(editToken, request, env, corsHeaders) {
  try {
    // SECURITY FIX: Validate edit token format before processing
    const tokenValidation = validateEditToken(editToken);
    if (!tokenValidation.valid) {
      return jsonError(tokenValidation.error, 400, corsHeaders);
    }

    // Rate limit edit token operations using native Cloudflare rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimit = await checkRateLimit(env.RATE_LIMIT_EDIT, clientIP);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: 60,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }

    // Look up shortCode from edit token
    const shortCode = await env.URL_STORE.get(`edit:${editToken}`);
    if (!shortCode) {
      return jsonError('Invalid or expired edit link', 404, corsHeaders);
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return jsonError('Invalid JSON in request body', 400, corsHeaders);
    }

    const { url: newLongUrl, expiresIn, removeExpiration } = body;

    // Get existing URL data
    const existingDataStr = await env.URL_STORE.get(shortCode);
    if (!existingDataStr) {
      return jsonError('URL not found', 404, corsHeaders);
    }

    // Validate new URL
    if (!newLongUrl) {
      return jsonError('URL is required', 400, corsHeaders);
    }
    if (!isValidUrl(newLongUrl, env)) {
      const allowHttp = env?.ALLOW_HTTP === 'true';
      const allowPrivate = env?.ALLOW_PRIVATE_IPS === 'true';
      const protocol = allowHttp ? 'HTTP/HTTPS' : 'HTTPS';
      const ipMsg = allowPrivate ? '' : ' or private IPs';
      return jsonError(`Invalid URL. Must be a valid ${protocol} URL without credentials${ipMsg} (max ${VALIDATION.URL_MAX_LENGTH} characters)`, 400, corsHeaders);
    }

    const existingData = JSON.parse(existingDataStr);

    // Update the URL
    const updatedData = {
      ...existingData,
      longUrl: newLongUrl,
      updatedAt: new Date().toISOString(),
    };

    // Handle expiration updates
    if (removeExpiration) {
      delete updatedData.expiresAt;
    } else {
      const expirationValidation = validateExpiration(expiresIn);
      if (!expirationValidation.valid) {
        return jsonError(expirationValidation.error, 400, corsHeaders);
      }
      if (expirationValidation.value) {
        updatedData.expiresAt = new Date(Date.now() + expirationValidation.value * 1000).toISOString();
      }
    }

    // Update URL data with retry logic
    await retryKVOperation(() => env.URL_STORE.put(shortCode, JSON.stringify(updatedData)));

    // Invalidate cache for this short code
    try {
      const cache = caches.default;
      const cacheKey = new Request(`https://cache.url/${shortCode}`, { method: 'GET' });
      await cache.delete(cacheKey);
    } catch (cacheError) {
      console.error('Error invalidating cache:', cacheError);
      // Don't fail the request if cache invalidation fails
    }

    return new Response(JSON.stringify({ success: true, data: updatedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Delete URL by edit token (public, no auth)
async function handleDeleteByEditToken(editToken, request, env, corsHeaders) {
  try {
    // SECURITY FIX: Validate edit token format before processing
    const tokenValidation = validateEditToken(editToken);
    if (!tokenValidation.valid) {
      return jsonError(tokenValidation.error, 400, corsHeaders);
    }

    // Rate limit edit token operations using native Cloudflare rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimit = await checkRateLimit(env.RATE_LIMIT_EDIT, clientIP);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: 60,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }

    // Look up shortCode from edit token
    const shortCode = await env.URL_STORE.get(`edit:${editToken}`);
    if (!shortCode) {
      return jsonError('Invalid or expired edit link', 404, corsHeaders);
    }

    // Get URL data to retrieve URL hash before deletion
    let urlHash = null;
    const urlDataStr = await env.URL_STORE.get(shortCode);
    if (urlDataStr) {
      try {
        const urlData = JSON.parse(urlDataStr);
        if (urlData.longUrl) {
          urlHash = await hashUrl(urlData.longUrl);
        }
      } catch (parseError) {
        console.error('Error parsing URL data during deletion:', parseError);
      }
    }

    // Delete URL data, analytics, and edit token mapping
    await retryKVOperation(() => env.URL_STORE.delete(shortCode));
    await retryKVOperation(() => env.ANALYTICS.delete(shortCode));
    await retryKVOperation(() => env.ANALYTICS.delete(`analytics:${shortCode}`));
    await retryKVOperation(() => env.URL_STORE.delete(`edit:${editToken}`));

    // Delete URL hash index
    if (urlHash) {
      await retryKVOperation(() => env.URL_STORE.delete(`urlhash:${urlHash}`));
    }

    // Invalidate cache for this short code
    try {
      const cache = caches.default;
      const cacheKey = new Request(`https://cache.url/${shortCode}`, { method: 'GET' });
      await cache.delete(cacheKey);
    } catch (cacheError) {
      console.error('Error invalidating cache:', cacheError);
      // Don't fail the request if cache invalidation fails
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Serve public edit page HTML
async function handleEditPage(editToken, env, securityHeaders) {
  const html = getEditPage(editToken);
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      ...securityHeaders,
    },
  });
}

// Helper: Aggregate top items from analytics
function aggregateTopItems(visits, field, limit = 10) {
  const counts = {};
  visits.forEach(visit => {
    const value = visit[field] || 'unknown';
    counts[value] = (counts[value] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

/**
 * Helper: Sanitize header values
 * @param {string} value - Header value to sanitize
 * @param {number} maxLength - Maximum length of sanitized value
 * @returns {string} Sanitized header value
 */
function sanitizeHeader(value, maxLength = 200) {
  if (!value) return 'unknown';
  // Remove control characters and limit length
  const sanitized = value
    .substring(0, maxLength)
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control chars
    .trim();
  return sanitized || 'unknown';
}

// Helper: Parse user agent for browser and device info
function parseUserAgent(ua) {
  if (!ua || ua === 'unknown') return { browser: 'Unknown', device: 'Unknown', os: 'Unknown', isBot: false, botName: null };

  // PERFORMANCE OPTIMIZATION: Fast string check before expensive regex matching
  const uaLower = ua.toLowerCase();
  let isBot = false;
  let botName = null;

  // Quick check: if UA doesn't contain common bot keywords, skip regex entirely
  const mightBeBot = BOT_KEYWORDS.some(keyword => uaLower.includes(keyword));

  if (mightBeBot) {
    // Only run regex patterns if preliminary check suggests it's a bot
    for (const { pattern, name } of BOT_PATTERNS) {
      if (pattern.test(ua)) {
        isBot = true;
        botName = name;
        break;
      }
    }
  }

  // Browser detection
  let browser = 'Other';
  if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome/') && !ua.includes('Edg/')) browser = 'Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('MSIE') || ua.includes('Trident/')) browser = 'IE';
  else if (ua.includes('Opera/') || ua.includes('OPR/')) browser = 'Opera';

  // Device type detection
  let device = 'Desktop';
  if (ua.includes('Mobile') || ua.includes('Android')) device = 'Mobile';
  else if (ua.includes('Tablet') || ua.includes('iPad')) device = 'Tablet';

  // OS detection
  let os = 'Other';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { browser, device, os, isBot, botName };
}

/**
 * Helper: Parse UTM parameters from referer URL
 * @param {string} referer - Referer URL
 * @returns {Object} UTM parameters object
 */
function parseUTMParams(referer) {
  const utmParams = {
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmTerm: null,
    utmContent: null,
  };

  if (!referer || referer === 'unknown') return utmParams;

  try {
    const url = new URL(referer);
    utmParams.utmSource = url.searchParams.get('utm_source');
    utmParams.utmMedium = url.searchParams.get('utm_medium');
    utmParams.utmCampaign = url.searchParams.get('utm_campaign');
    utmParams.utmTerm = url.searchParams.get('utm_term');
    utmParams.utmContent = url.searchParams.get('utm_content');
  } catch (e) {
    // Invalid URL, return null UTM params
  }

  return utmParams;
}

/**
 * Helper: Generate unique session ID
 * @param {string} ip - Anonymized IP
 * @param {string} ua - User agent
 * @returns {string} Session ID hash
 */
function generateSessionId(ip, ua) {
  // Create a simple hash-based session ID (client IP + UA + date)
  // This groups visits from same user within same day
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const data = `${ip}:${ua}:${date}`;
  // Simple hash function (not cryptographic, just for session grouping)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `session_${Math.abs(hash).toString(36)}`;
}

/**
 * Helper: Anonymize IP address for GDPR compliance
 * @param {string} ip - IP address to anonymize
 * @returns {string} Anonymized IP address
 */
function anonymizeIP(ip) {
  if (!ip || ip === 'unknown') return 'unknown';

  // For IPv4: mask last octet (e.g., 192.168.1.100 -> 192.168.1.0)
  if (ip.includes('.') && !ip.includes(':')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = '0';
      return parts.join('.');
    }
  }

  // For IPv6: mask last 80 bits (e.g., 2001:db8::1 -> 2001:db8::)
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length > 2) {
      return parts.slice(0, 3).join(':') + '::';
    }
  }

  return 'anonymized';
}

// Helper: Record detailed visit analytics
async function recordVisit(shortCode, request, env) {
  try {
    const startTime = Date.now();

    // Get and parse user agent
    const userAgent = sanitizeHeader(request.headers.get('User-Agent'), 200);
    const uaInfo = parseUserAgent(userAgent);

    // Get request details with sanitization and IP anonymization
    const rawIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const anonymizedIP = anonymizeIP(rawIP);
    const referer = sanitizeHeader(request.headers.get('Referer') || request.headers.get('Referrer'), 500);

    // Parse UTM parameters from referer
    const utmParams = parseUTMParams(referer);

    // Generate session ID
    const sessionId = generateSessionId(anonymizedIP, userAgent);

    // Get language preference
    const language = sanitizeHeader(request.headers.get('Accept-Language'), 100);
    const primaryLanguage = language ? language.split(',')[0].split(';')[0].trim() : 'unknown';

    // Get Cloudflare data (enhanced)
    const timezone = request.cf?.timezone || 'unknown';
    const continent = request.cf?.continent || 'unknown';
    const region = request.cf?.region || 'unknown';
    const regionCode = request.cf?.regionCode || 'unknown';
    const postalCode = request.cf?.postalCode || 'unknown';
    const metroCode = request.cf?.metroCode || 'unknown';
    const latitude = request.cf?.latitude || null;
    const longitude = request.cf?.longitude || null;
    const asn = request.cf?.asn || 'unknown';
    const asOrganization = request.cf?.asOrganization || 'unknown';
    const colo = request.cf?.colo || 'unknown'; // Cloudflare data center

    // Connection info
    const tlsVersion = request.cf?.tlsVersion || 'unknown';
    const httpProtocol = request.cf?.httpProtocol || 'unknown';

    // Performance metric
    const processingTime = Date.now() - startTime;

    const visitData = {
      // Basic info
      timestamp: new Date().toISOString(),
      sessionId: sessionId,

      // Request info
      referer: referer,
      userAgent: userAgent,

      // Parsed info
      browser: uaInfo.browser,
      device: uaInfo.device,
      os: uaInfo.os,
      isBot: uaInfo.isBot,
      botName: uaInfo.botName,

      // UTM tracking
      utmSource: utmParams.utmSource,
      utmMedium: utmParams.utmMedium,
      utmCampaign: utmParams.utmCampaign,
      utmTerm: utmParams.utmTerm,
      utmContent: utmParams.utmContent,

      // Location data
      country: sanitizeHeader(request.cf?.country, 50),
      city: sanitizeHeader(request.cf?.city, 100),
      continent: continent,
      region: region,
      regionCode: regionCode,
      postalCode: postalCode,
      metroCode: metroCode,
      latitude: latitude,
      longitude: longitude,
      timezone: timezone,
      ip: anonymizedIP,

      // Network info
      asn: asn,
      asOrganization: asOrganization,
      colo: colo,
      tlsVersion: tlsVersion,
      httpProtocol: httpProtocol,

      // Language
      language: primaryLanguage,

      // Performance
      processingTime: processingTime,
    };

    // FREE TIER OPTIMIZATION: Random sampling to stay under 1000 writes/day
    // Use random sampling (not modulo) because Workers are stateless
    const counterKey = shortCode;
    const detailedKey = `analytics:${shortCode}`;

    // Random sampling: write with probability 1/SAMPLE_RATE for detailed, 1/COUNTER_BATCH_SIZE for counter
    const shouldWriteDetailed = (Math.random() < 1 / ANALYTICS.SAMPLE_RATE);
    const shouldWriteCounter = (Math.random() < 1 / ANALYTICS.COUNTER_BATCH_SIZE) || shouldWriteDetailed;

    const writes = [];

    // Write detailed analytics at sample rate
    if (shouldWriteDetailed) {
      const existingDataStr = await env.ANALYTICS.get(detailedKey);

      const analytics = existingDataStr ? JSON.parse(existingDataStr) : {
        totalVisits: 0,
        botVisits: 0,
        visits: []
      };

      // Ensure visits array exists
      if (!analytics.visits) {
        analytics.visits = [];
      }

      // Increment counters (each write represents ~SAMPLE_RATE visits)
      analytics.totalVisits = (analytics.totalVisits || 0) + ANALYTICS.SAMPLE_RATE;
      if (uaInfo.isBot) {
        analytics.botVisits = (analytics.botVisits || 0) + 1;
      }

      // Add visit data and maintain limit
      analytics.visits.push(visitData);
      if (analytics.visits.length > ANALYTICS.MAX_VISITS_PER_URL) {
        analytics.visits.shift();
      }

      writes.push(env.ANALYTICS.put(detailedKey, JSON.stringify(analytics)));
    }

    // Write counter at sample rate (increment by batch size for estimated total)
    if (shouldWriteCounter) {
      const currentCountStr = await env.ANALYTICS.get(counterKey);
      const currentCount = currentCountStr ? parseInt(currentCountStr) : 0;
      const newCount = currentCount + ANALYTICS.COUNTER_BATCH_SIZE;
      writes.push(env.ANALYTICS.put(counterKey, newCount.toString()));
    }

    // Execute all writes in parallel (if any)
    if (writes.length > 0) {
      await Promise.all(writes);
    }
  } catch (error) {
    console.error('Error recording visit:', error);
  }
}

/**
 * Helper: Find existing short code for a URL (duplicate detection)
 * @param {string} url - The long URL to search for
 * @param {Object} env - Worker environment bindings
 * @returns {Promise<string|null>} Existing short code or null
 */
async function findExistingUrl(url, env) {
  try {
    // Create URL hash for indexing
    const urlHash = await hashUrl(url);
    const hashKey = `urlhash:${urlHash}`;

    // Check if we have this URL indexed
    const existingShortCode = await env.URL_STORE.get(hashKey);

    if (existingShortCode) {
      // Verify the URL still exists and matches
      const urlData = await env.URL_STORE.get(existingShortCode);
      if (urlData) {
        const data = JSON.parse(urlData);
        // Exact match check
        if (data.longUrl === url) {
          return existingShortCode;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding existing URL:', error);
    return null; // Fail gracefully - create new short code
  }
}

/**
 * Helper: Create hash of URL for indexing
 * @param {string} url - URL to hash
 * @returns {Promise<string>} Hex hash of URL
 */
async function hashUrl(url) {
  const encoder = new TextEncoder();
  const data = encoder.encode(url);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 16); // Use first 16 chars
}

// NOTE: generateShortCode and generateEditToken are now imported from utils/crypto.js

/**
 * Helper: Check if IP is private/internal (SSRF protection)
 * @param {string} hostname - Hostname or IP address to check
 * @returns {boolean} True if hostname is a private/internal address
 */
function isPrivateIP(hostname) {
  // Check for localhost variations
  if (hostname === 'localhost' || hostname === '0.0.0.0' || hostname === '127.0.0.1') {
    return true;
  }

  // IPv4 private ranges
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = hostname.match(ipv4Regex);

  if (match) {
    const octets = match.slice(1).map(Number);

    // Invalid octets
    if (octets.some(octet => octet > 255)) return true;

    // 10.0.0.0/8 - Private
    if (octets[0] === 10) return true;

    // 127.0.0.0/8 - Loopback
    if (octets[0] === 127) return true;

    // 172.16.0.0/12 - Private
    if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;

    // 192.168.0.0/16 - Private
    if (octets[0] === 192 && octets[1] === 168) return true;

    // 169.254.0.0/16 - Link-local
    if (octets[0] === 169 && octets[1] === 254) return true;

    // 0.0.0.0/8 - Current network
    if (octets[0] === 0) return true;

    // 100.64.0.0/10 - Shared address space
    if (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127) return true;

    // 224.0.0.0/4 - Multicast
    if (octets[0] >= 224 && octets[0] <= 239) return true;

    // 240.0.0.0/4 - Reserved
    if (octets[0] >= 240) return true;
  }

  // IPv6 private/special ranges
  if (hostname.includes(':')) {
    const lower = hostname.toLowerCase();
    // Loopback
    if (lower === '::1' || lower === '0:0:0:0:0:0:0:1') return true;
    // Link-local
    if (lower.startsWith('fe80:')) return true;
    // Unique local
    if (lower.startsWith('fc00:') || lower.startsWith('fd00:')) return true;
    // Unspecified
    if (lower === '::' || lower === '0:0:0:0:0:0:0:0') return true;
  }

  return false;
}

/**
 * Helper: Validate URL with SSRF protection
 * @param {string} string - URL string to validate
 * @param {Object} env - Worker environment bindings (for configuration)
 * @returns {boolean} True if URL is valid and safe
 */
function isValidUrl(string, env) {
  try {
    // SECURITY FIX: Trim whitespace to prevent bypass attacks
    const trimmedString = string.trim();

    // SECURITY FIX: Block URLs with leading/trailing whitespace or control chars
    if (trimmedString !== string) {
      return false; // URL has leading/trailing whitespace
    }

    // SECURITY FIX: Check for control characters before parsing
    if (/[\x00-\x1F\x7F]/.test(trimmedString)) {
      return false;
    }

    const url = new URL(trimmedString);

    // Check protocol - allow HTTP if configured
    const allowHttp = env?.ALLOW_HTTP === 'true';
    if (url.protocol === 'http:') {
      if (!allowHttp) {
        return false; // Block HTTP unless explicitly allowed
      }
    } else if (url.protocol !== 'https:') {
      return false; // Block all protocols except HTTP/HTTPS
    }

    // SECURITY FIX: Block dangerous protocols (check both original and lowercase)
    const dangerousProtocols = ['javascript:', 'data:', 'file:', 'vbscript:', 'about:', 'blob:'];
    const lowerString = trimmedString.toLowerCase();
    if (dangerousProtocols.some(proto => lowerString.startsWith(proto) || lowerString.startsWith('%20' + proto))) {
      return false;
    }

    // SECURITY FIX: Normalize Unicode hostname to prevent IDN homograph attacks
    const hostname = url.hostname.toLowerCase();

    // Block Punycode/IDN domains that might resolve to private IPs
    if (hostname.startsWith('xn--')) {
      // This is a punycode domain - extra validation needed
      console.warn('Punycode domain detected:', hostname);
    }

    // SECURITY FIX: Block private IPs - check after normalization
    const allowPrivateIPs = env?.ALLOW_PRIVATE_IPS === 'true';
    if (!allowPrivateIPs) {
      // Check the normalized hostname
      if (isPrivateIP(hostname)) {
        return false;
      }

      // SECURITY FIX: Additional check - block domains that might resolve to private IPs
      // Block localhost variations
      if (hostname === 'localhost' || hostname.endsWith('.localhost') ||
          hostname === 'local' || hostname.endsWith('.local')) {
        return false;
      }

      // Block internal TLDs
      const internalTLDs = ['.internal', '.corp', '.home', '.lan', '.intranet'];
      if (internalTLDs.some(tld => hostname.endsWith(tld))) {
        return false;
      }
    }

    // Block credentials in URL
    if (url.username || url.password) {
      return false;
    }

    // Block URLs that are too long (prevent DoS)
    if (trimmedString.length > VALIDATION.URL_MAX_LENGTH) {
      return false;
    }

    // Ensure hostname is valid (not empty, no control characters)
    if (!hostname || hostname.length === 0 || hostname.length > 253) {
      return false; // Max DNS hostname length is 253 chars
    }

    // SECURITY FIX: Block IPv6 bracket notation that might hide private IPs
    if (hostname.includes('[') || hostname.includes(']')) {
      // Extract IPv6 address
      const ipv6Match = hostname.match(/\[([^\]]+)\]/);
      if (ipv6Match && !allowPrivateIPs && isPrivateIP(ipv6Match[1])) {
        return false;
      }
    }

    return true;
  } catch (_) {
    return false;
  }
}

// Helper: Increment global visitor counter (batched for free tier)
async function incrementGlobalVisitors(env) {
  try {
    const key = 'global:visitors';
    const currentCount = await env.ANALYTICS.get(key) || '0';
    const newCount = parseInt(currentCount) + 1;

    // FREE TIER OPTIMIZATION: Only write every 10th visitor to reduce KV writes
    if (newCount % 10 === 0) {
      await env.ANALYTICS.put(key, newCount.toString());
    }
  } catch (error) {
    console.error('Error incrementing global visitors:', error);
  }
}

// Get global stats
async function handleGetStats(env, corsHeaders) {
  try {
    const visitors = await env.ANALYTICS.get('global:visitors') || '0';
    const urlCount = (await env.URL_STORE.list()).keys.length;

    return new Response(
      JSON.stringify({
        totalVisitors: parseInt(visitors),
        totalUrls: urlCount,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
