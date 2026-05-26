const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Property {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  isFavorite?: boolean;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getProperties: () => request<Property[]>('/properties'),

  getFavoriteIds: (userId: string) =>
    request<{ userId: string; favoriteIds: string[] }>(`/favorites/${userId}/ids`),

  addFavorite: (userId: string, propertyId: string) =>
    request<{ message: string }>(`/favorites/${userId}/${propertyId}`, { method: 'POST' }),

  removeFavorite: (userId: string, propertyId: string) =>
    request<{ message: string }>(`/favorites/${userId}/${propertyId}`, { method: 'DELETE' }),
};
