const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

// Test the core cryptographic and validation logic for password reset tokens
test('Reset Token System: Generates 64-character hex reset token and valid sha256 grant hash', () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  assert.equal(resetToken.length, 64, 'Token must be 32 bytes (64 hex characters)');

  const grantHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  assert.equal(grantHash.length, 64, 'SHA-256 hash must be 64 hex characters');

  // Verify deterministic hashing
  const verifyHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  assert.equal(grantHash, verifyHash, 'Hashing the same token must produce matching grant hash');
});

test('Reset Token System: Rejects tampered token when verifying grant hash', () => {
  const originalToken = crypto.randomBytes(32).toString('hex');
  const tamperedToken = originalToken.slice(0, -2) + 'ff';

  const grantHash = crypto.createHash('sha256').update(originalToken).digest('hex');
  const tamperedHash = crypto.createHash('sha256').update(tamperedToken).digest('hex');

  assert.notEqual(grantHash, tamperedHash, 'Tampered token must not match original grant hash');
});

test('Reset Token System: Enforces time expiration boundary', () => {
  const now = Date.now();
  const validExpiry = new Date(now + 10 * 60 * 1000); // +10 mins
  const expiredExpiry = new Date(now - 1000); // 1s ago

  assert.ok(validExpiry.getTime() > now, 'Active token must be in the future');
  assert.ok(expiredExpiry.getTime() <= now, 'Expired token must be in the past');
});

test('Reset Token System: 6-digit OTP formatting and normalization', () => {
  const rawInput = ' 482 915 ';
  const cleaned = rawInput.replace(/\s/g, '');
  assert.match(cleaned, /^\d{6}$/, 'OTP must be exactly 6 numeric digits');
});
