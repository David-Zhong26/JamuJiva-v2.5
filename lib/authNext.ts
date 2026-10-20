const AUTH_NEXT_KEY = 'jj_auth_next';

export function safeAuthNext(value: string | null, fallback = '/account') {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
}

export function rememberAuthNext(path: string) {
  try {
    sessionStorage.setItem(AUTH_NEXT_KEY, safeAuthNext(path));
  } catch {
    // ignore quota / private mode
  }
}

export function takeAuthNext(fallback = '/account') {
  try {
    const value = sessionStorage.getItem(AUTH_NEXT_KEY);
    sessionStorage.removeItem(AUTH_NEXT_KEY);
    return safeAuthNext(value, fallback);
  } catch {
    return fallback;
  }
}
