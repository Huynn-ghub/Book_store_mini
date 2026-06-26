import { authFetch } from './bookApi';

const API_BASE = '/api';

export async function getCart() {
  const res = await authFetch(`${API_BASE}/cart/`);
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
}

export async function addToCart(bookId) {
  const res = await authFetch(`${API_BASE}/cart/`, {
    method: 'POST',
    body: JSON.stringify({ book_id: bookId }),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function removeFromCart(bookId) {
  const res = await authFetch(`${API_BASE}/cart/${bookId}/`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}
