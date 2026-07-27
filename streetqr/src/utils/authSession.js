const SESSION_STARTED_AT = 'qzaar_session_started_at';
const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;

export function startSession({ userId, email }) {
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('shopId', userId);
  localStorage.setItem('email', email || '');
  localStorage.setItem(SESSION_STARTED_AT, String(Date.now()));
}

export function clearSession() {
  ['loggedIn', 'shopId', 'email', 'qr_id', SESSION_STARTED_AT].forEach((key) => localStorage.removeItem(key));
}

export function hasActiveSession() {
  const hasAccount = localStorage.getItem('loggedIn') === 'true' || Boolean(localStorage.getItem('shopId'));
  const startedAt = Number(localStorage.getItem(SESSION_STARTED_AT));
  if (!hasAccount) return false;
  // Existing sessions created before this upgrade continue to work once, then
  // receive a timestamp on their next successful sign-in.
  return !startedAt || Date.now() - startedAt < SESSION_MAX_AGE_MS;
}

export function isSessionExpired() {
  return Boolean(localStorage.getItem(SESSION_STARTED_AT)) && !hasActiveSession();
}
