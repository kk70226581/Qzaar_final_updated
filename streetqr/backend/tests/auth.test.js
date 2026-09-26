const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { authenticateToken, verifyShopOwner, JWT_SECRET } = require('../middleware/auth');

test('Auth Middleware: Rejects request with 401 when Authorization header is missing', (t, done) => {
  const req = { headers: {} };
  const res = {
    status(code) {
      assert.equal(code, 401);
      return {
        json(body) {
          assert.equal(body.success, false);
          assert.match(body.message, /Access denied/i);
          done();
        }
      };
    }
  };
  const next = () => {
    assert.fail('next() should not have been called');
  };

  authenticateToken(req, res, next);
});

test('Auth Middleware: Rejects invalid or forged token with 403', (t, done) => {
  const req = { headers: { authorization: 'Bearer invalid.tampered.token' } };
  const res = {
    status(code) {
      assert.equal(code, 403);
      return {
        json(body) {
          assert.equal(body.success, false);
          done();
        }
      };
    }
  };
  const next = () => {
    assert.fail('next() should not have been called');
  };

  authenticateToken(req, res, next);
});

test('Auth Middleware: Successfully verifies valid token and attaches req.user', (t, done) => {
  const payload = { userId: 'user_123', email: 'owner@restaurant.com', role: 'shopkeeper', shopId: 'shop_abc' };
  const validToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  const req = { headers: { authorization: `Bearer ${validToken}` } };
  const res = {};
  const next = () => {
    assert.ok(req.user, 'req.user should be populated');
    assert.equal(req.user.userId, 'user_123');
    assert.equal(req.user.shopId, 'shop_abc');
    done();
  };

  authenticateToken(req, res, next);
});

test('Shop Ownership Middleware: Allows shopkeeper with matching shopId', (t, done) => {
  const req = {
    user: { userId: 'user_123', shopId: 'shop_abc' },
    params: { shopId: 'shop_abc' }
  };
  const res = {};
  const next = () => {
    assert.equal(req.shopId, 'shop_abc');
    done();
  };

  verifyShopOwner(req, res, next);
});

test('Shop Ownership Middleware: Blocks shopkeeper attempting to modify another shop', (t, done) => {
  const req = {
    user: { userId: 'user_123', shopId: 'shop_abc' },
    params: { shopId: 'different_shop_xyz' }
  };
  const res = {
    status(code) {
      assert.equal(code, 403);
      return {
        json(body) {
          assert.equal(body.success, false);
          assert.match(body.message, /Forbidden/i);
          done();
        }
      };
    }
  };
  const next = () => {
    assert.fail('next() should not have been called');
  };

  verifyShopOwner(req, res, next);
});

test('Shop Ownership Middleware: Grants access to admin role unconditionally', (t, done) => {
  const req = {
    user: { userId: 'admin_1', role: 'admin' },
    params: { shopId: 'any_shop_id' }
  };
  const res = {};
  const next = () => {
    done();
  };

  verifyShopOwner(req, res, next);
});
