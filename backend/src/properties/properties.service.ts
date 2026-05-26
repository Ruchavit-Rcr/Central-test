import { Injectable } from '@nestjs/common';
import { Property } from './property.interface';

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Condo',
    location: 'Bangkok, Silom',
    description: 'Sleek high-rise condo in the heart of the financial district with stunning city views.',
    price: 8500000,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
    bedrooms: 2,
    bathrooms: 2,
    area: 75,
  },
  {
    id: '2',
    title: 'Riverside Villa',
    location: 'Chiang Mai, Riverside',
    description: 'Peaceful villa with a private garden along the Ping River, perfect for families.',
    price: 12000000,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    ],
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
  },
  {
    id: '3',
    title: 'Beachfront Studio',
    location: 'Phuket, Patong',
    description: 'Cozy studio steps from the beach, ideal as a holiday retreat or rental investment.',
    price: 4200000,
    images: [
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 38,
  },
  {
    id: '4',
    title: 'Luxury Penthouse',
    location: 'Bangkok, Sukhumvit',
    description: 'Top-floor penthouse with rooftop terrace, infinity pool access, and panoramic skyline views.',
    price: 35000000,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6d349c8f?w=800',
    ],
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
  },
  {
    id: '5',
    title: 'Garden Townhouse',
    location: 'Pattaya, Jomtien',
    description: 'Spacious townhouse with a lush private garden in a quiet gated community near the beach.',
    price: 6800000,
    images: [
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ],
    bedrooms: 3,
    bathrooms: 2,
    area: 145,
  },
  {
    id: '6',
    title: 'Old Town Shophouse',
    location: 'Chiang Mai, Old City',
    description: 'Renovated heritage shophouse blending traditional Lanna architecture with modern interiors.',
    price: 5500000,
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
    ],
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
  },
];

@Injectable()
export class PropertiesService {
  findAll(): Property[] {
    return MOCK_PROPERTIES;
  }

  findOne(id: string): Property | undefined {
    return MOCK_PROPERTIES.find((p) => p.id === id);
  }
}
