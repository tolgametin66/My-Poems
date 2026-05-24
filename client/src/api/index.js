const BASE = '/api';

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  getEntries:   (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
    ).toString();
    return req('GET', `/entries${qs ? `?${qs}` : ''}`);
  },
  getEntry:     (id)          => req('GET',    `/entries/${id}`),
  createEntry:  (data)        => req('POST',   '/entries', data),
  updateEntry:  (id, data)    => req('PUT',    `/entries/${id}`, data),
  deleteEntry:  (id)          => req('DELETE', `/entries/${id}`),

  getPoets:     ()            => req('GET',    '/poets'),
  createPoet:   (data)        => req('POST',   '/poets', data),
  updatePoet:   (id, data)    => req('PUT',    `/poets/${id}`, data),
  deletePoet:   (id)          => req('DELETE', `/poets/${id}`),
};
