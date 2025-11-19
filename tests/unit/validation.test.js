/**
 * Unit tests for URL validation
 * Run with: npm test
 */

import { describe, test, expect } from 'vitest';

// Mock validation functions (will import from src once refactored)
function isValidUrl(url, env = {}) {
  try {
    const parsed = new URL(url);
    
    // Protocol validation
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false;
    }
    
    // Dangerous protocols
    const dangerous = ['javascript:', 'data:', 'file:', 'vbscript:'];
    if (dangerous.some(proto => url.toLowerCase().startsWith(proto))) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

describe('URL Validation', () => {
  test('accepts valid HTTPS URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('https://subdomain.example.com/path')).toBe(true);
  });

  test('blocks dangerous protocols', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
    expect(isValidUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isValidUrl('file:///etc/passwd')).toBe(false);
  });

  test('rejects invalid URLs', () => {
    expect(isValidUrl('not a url')).toBe(false);
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('ftp://example.com')).toBe(false);
  });
});

describe('Short Code Validation', () => {
  function validateShortCode(code) {
    if (!code || typeof code !== 'string') {
      return { valid: false, error: 'Short code is required' };
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
      return { valid: false, error: 'Invalid characters' };
    }
    
    if (code.length < 1 || code.length > 50) {
      return { valid: false, error: 'Invalid length' };
    }
    
    return { valid: true };
  }

  test('accepts valid short codes', () => {
    expect(validateShortCode('abc123').valid).toBe(true);
    expect(validateShortCode('test-url').valid).toBe(true);
    expect(validateShortCode('my_link').valid).toBe(true);
  });

  test('rejects invalid characters', () => {
    expect(validateShortCode('test url').valid).toBe(false);
    expect(validateShortCode('test@url').valid).toBe(false);
    expect(validateShortCode('test/url').valid).toBe(false);
  });

  test('enforces length limits', () => {
    expect(validateShortCode('').valid).toBe(false);
    expect(validateShortCode('a'.repeat(51)).valid).toBe(false);
    expect(validateShortCode('a').valid).toBe(true);
    expect(validateShortCode('a'.repeat(50)).valid).toBe(true);
  });
});
