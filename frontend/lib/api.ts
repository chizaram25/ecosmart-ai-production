// ── Base API client ──
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ── Waste API ──
export const wasteApi = {
  scan: (body: { text?: string; imageBase64?: string }) =>
    request('/waste/scan', { method: 'POST', body: JSON.stringify(body) }),

  getHistory: () =>
    request('/waste/history'),
};

// ── Recycler API ──
export const recyclerApi = {
  getAll: (wasteType?: string) =>
    request(`/recyclers${wasteType ? `?type=${wasteType}` : ''}`),

  getById: (id: string) =>
    request(`/recyclers/${id}`),
};

// ── Auth API ──
export const authApi = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (data: { name: string; email: string; password: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
};
