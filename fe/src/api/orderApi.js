import { authFetch } from './bookApi';

const API_BASE = '/api';

export async function getOrders() {
  const res = await authFetch(`${API_BASE}/orders/`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function checkoutApi() {
  const res = await authFetch(`${API_BASE}/orders/`, { method: 'POST' });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function confirmOrder(id) {
  const res = await authFetch(`${API_BASE}/orders/${id}/confirm/`, { method: 'PATCH' });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}
