import { authFetch } from './bookApi';

const API_BASE = '/api';

export async function getCategories() {
  const res = await authFetch(`${API_BASE}/categories/`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(data) {
  const res = await authFetch(`${API_BASE}/categories/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function updateCategory(id, data) {
  const res = await authFetch(`${API_BASE}/categories/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function deleteCategory(id) {
  const res = await authFetch(`${API_BASE}/categories/${id}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete category');
}
