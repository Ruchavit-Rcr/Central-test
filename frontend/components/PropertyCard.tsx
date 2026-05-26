'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Property } from '@/lib/api';

interface Props {
  property: Property;
  isFavorite: boolean;
  userId: string;
  onToggleFavorite: (propertyId: string, current: boolean) => Promise<void>;
}

function formatPrice(price: number) {
  if (price >= 1_000_000) return `฿${(price / 1_000_000).toFixed(1)}M`;
  return `฿${price.toLocaleString()}`;
}

export default function PropertyCard({ property, isFavorite, userId, onToggleFavorite }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFavorite = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await onToggleFavorite(property.id, isFavorite);
    } finally {
      setLoading(false);
    }
  };

  const hasMultipleImages = property.images.length > 1;

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image gallery */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        <Image
          src={property.images[imgIndex]}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Image dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {property.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === imgIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          disabled={!userId || loading}
          title={!userId ? 'Select a user first' : isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full shadow-md
            transition-all duration-200 active:scale-90
            ${!userId ? 'bg-white/60 cursor-not-allowed' : 'bg-white hover:scale-110 cursor-pointer'}
            ${loading ? 'opacity-60' : ''}
          `}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`w-5 h-5 transition-colors duration-200 ${
                isFavorite ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-gray-500'
              }`}
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          )}
        </button>

        {/* Price badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-sm font-semibold px-3 py-1 rounded-full">
          {formatPrice(property.price)}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1 truncate">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span className="truncate">{property.location}</span>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{property.description}</p>

        <div className="flex items-center gap-3 text-xs text-gray-500 border-t pt-3">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            {property.bedrooms} bed
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {property.bathrooms} bath
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            {property.area} m²
          </span>
        </div>
      </div>
    </div>
  );
}
