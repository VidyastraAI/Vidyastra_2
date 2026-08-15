const BASE_URL = 'http://localhost:5000/api';

async function fetchJson(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = (payload && payload.error) || response.statusText || 'API request failed';
    throw new Error(error);
  }
  return payload;
}

export function get(path) {
  return fetchJson(path, { method: 'GET' });
}

export function post(path, data) {
  return fetchJson(path, { method: 'POST', body: JSON.stringify(data) });
}

export function put(path, data) {
  return fetchJson(path, { method: 'PUT', body: JSON.stringify(data) });
}

export function remove(path, data) {
  return fetchJson(path, { method: 'DELETE', body: JSON.stringify(data) });
}
