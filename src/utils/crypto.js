/**
 * Cryptographic Utilities
 * Secure random generation and comparison functions
 */

import { VALIDATION } from '../constants.js';

/**
 * Security: Constant-time string comparison to prevent timing attacks
 * SECURITY FIX: Uses fixed-length comparison to prevent timing leaks
 * @param {string} a - First string to compare
 * @param {string} b - Second string to compare
 * @returns {boolean} True if strings are equal
 */
export function constantTimeCompare(a, b) {
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
 * REFACTORED: Generic secure random string generator
 * Uses rejection sampling to eliminate modulo bias
 * @param {number} length - Length of string to generate
 * @param {string} charset - Character set to use (default: alphanumeric)
 * @returns {string} Cryptographically secure random string
 * @private
 */
function generateSecureRandomString(length, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
  const charsetSize = charset.length;
  let result = '';

  // Use rejection sampling to eliminate modulo bias
  // 248 = 62 * 4 (largest multiple of 62 that fits in a byte)
  const maxValid = Math.floor(256 / charsetSize) * charsetSize;

  while (result.length < length) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(length - result.length));

    for (let i = 0; i < randomBytes.length && result.length < length; i++) {
      // Reject bytes >= maxValid to eliminate bias
      if (randomBytes[i] < maxValid) {
        result += charset.charAt(randomBytes[i] % charsetSize);
      }
    }
  }

  return result;
}

/**
 * Helper: Generate random short code (cryptographically secure)
 * @param {Object} env - Worker environment bindings
 * @returns {Promise<string>} A unique 7-character short code
 * @throws {Error} If unable to generate unique code after max attempts
 */
export async function generateShortCode(env) {
  const maxAttempts = 10;

  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    const shortCode = generateSecureRandomString(VALIDATION.SHORT_CODE_LENGTH);

    const existing = await env.URL_STORE.get(shortCode);
    if (!existing) {
      return shortCode;
    }
  }

  throw new Error('Failed to generate unique short code');
}

/**
 * Helper: Generate secure edit token (cryptographically secure)
 * @returns {string} A unique 32-character edit token
 */
export function generateEditToken() {
  return generateSecureRandomString(VALIDATION.EDIT_TOKEN_LENGTH);
}
