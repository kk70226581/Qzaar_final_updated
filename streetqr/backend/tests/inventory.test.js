const test = require('node:test');
const assert = require('node:assert/strict');

// Pagination helper logic mirrored directly from routes-inventory.js
function calculatePagination({ page = 1, limit = 20, total = 0 }) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;
  const totalPages = Math.ceil(total / limitNum);

  return { page: pageNum, limit: limitNum, skip, total, totalPages };
}

test('Inventory Pagination: Accurately calculates skip and total pages for first page', () => {
  const res = calculatePagination({ page: 1, limit: 10, total: 45 });
  assert.equal(res.page, 1);
  assert.equal(res.limit, 10);
  assert.equal(res.skip, 0);
  assert.equal(res.totalPages, 5);
});

test('Inventory Pagination: Accurately calculates skip for page 3', () => {
  const res = calculatePagination({ page: 3, limit: 10, total: 45 });
  assert.equal(res.page, 3);
  assert.equal(res.skip, 20);
});

test('Inventory Pagination: Clamps invalid or negative page numbers to page 1', () => {
  const res = calculatePagination({ page: -5, limit: 20, total: 100 });
  assert.equal(res.page, 1);
  assert.equal(res.skip, 0);
});

test('Inventory Pagination: Caps limit to maximum of 100 to prevent DoS memory pressure', () => {
  const res = calculatePagination({ page: 1, limit: 5000, total: 10000 });
  assert.equal(res.limit, 100);
});
