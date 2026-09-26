const test = require('node:test');
const assert = require('node:assert/strict');

// Luhn algorithm helper (mirrored directly from routes-payments.js logic)
function validateCardNumber(cardNumber) {
  const sanitizedNumber = String(cardNumber || '').replace(/\D/g, '');
  if (!sanitizedNumber || sanitizedNumber.length < 13 || sanitizedNumber.length > 19) {
    return { valid: false, message: 'Invalid card number format' };
  }

  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitizedNumber.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  if (sum % 10 !== 0) {
    return { valid: false, message: 'Invalid card checksum' };
  }

  return { valid: true, cardLast4: sanitizedNumber.slice(-4) };
}

test('PCI-DSS Card Validator: Validates standard test Visa card checksum', () => {
  // Standard test card passing Luhn
  const result = validateCardNumber('4242424242424242');
  assert.equal(result.valid, true);
  assert.equal(result.cardLast4, '4242');
});

test('PCI-DSS Card Validator: Rejects invalid card with tampered checksum', () => {
  const result = validateCardNumber('4242424242424243');
  assert.equal(result.valid, false);
  assert.equal(result.message, 'Invalid card checksum');
});

test('PCI-DSS Card Validator: Rejects malformed or too short card numbers', () => {
  const result = validateCardNumber('12345');
  assert.equal(result.valid, false);
  assert.equal(result.message, 'Invalid card number format');
});

test('PCI-DSS Card Validator: Rejects empty or null card input', () => {
  const result = validateCardNumber('');
  assert.equal(result.valid, false);
});
