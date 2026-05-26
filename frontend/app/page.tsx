'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Property } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import UserSelector from '@/components/UserSelector';

type Filter = 'all' | 'favorites';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Load properties once
  useEffect(() => {
    api
      .getProperties()
      .then(setProperties)
      .catch(() => setError('Failed to load properties. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  // Load favorites when userId changes
  useEffect(() => {
    if (!userId) {
      setFavoriteIds(new Set());
      return;
    }
    api
      .getFavoriteIds(userId)
      .then((data) => setFavoriteIds(new Set(data.favoriteIds)))
      .catch(() => setFavoriteIds(new Set()));
  }, [userId]);

  const handleToggleFavorite = useCallback(
    async (propertyId: string, current: boolean) => {
      if (!userId) return;
      try {
        if (current) {
          await api.removeFavorite(userId, propertyId);
          setFavoriteIds((prev) => {
            const next = new Set(prev);
            next.delete(propertyId);
            return next;
          });
          showToast('Removed from favorites');
        } else {
          await api.addFavorite(userId, propertyId);
          setFavoriteIds((prev) => new Set([...prev, propertyId]));
          showToast('Added to favorites');
        }
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Something went wrong');
      }
    },
    [userId],
  );

  const displayed =
    filter === 'favorites'
      ? properties.filter((p) => favoriteIds.has(p.id))
      : properties;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span className="text-xl font-bold text-gray-900 tracking-tight">PropFind</span>
          </div>
          <UserSelector value={userId} onChange={setUserId} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page title + filter tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Listings</h1>
            <p className="text-gray-500 text-sm mt-1">
              {properties.length} properties available
            </p>
          </div>

          <div className="sm:ml-auto flex items-center bg-gray-100 rounded-lg p-1 gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                if (!userId) { showToast('Please select a user first'); return; }
                setFilter('favorites');
              }}
              className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all flex items-center gap-1 ${
                filter === 'favorites'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500">
                <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-2.184C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.536a22.049 22.049 0 0 1-3.744 2.862l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
              </svg>
              Favorites
              {favoriteIds.size > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoriteIds.size}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* No user banner */}
        {!userId && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            Select a user at the top to save your favorites.
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-4 text-sm flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            {error}
          </div>
        )}

        {/* Empty favorites */}
        {!loading && !error && filter === 'favorites' && displayed.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <p className="text-lg font-medium text-gray-500">No favorites yet</p>
            <p className="text-sm mt-1">Click the heart on any property to save it here.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && displayed.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={favoriteIds.has(property.id)}
                userId={userId}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg animate-fade-in z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
