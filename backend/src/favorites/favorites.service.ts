import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PropertiesService } from '../properties/properties.service';

@Injectable()
export class FavoritesService {
  // Map<userId, Set<propertyId>>
  private readonly store = new Map<string, Set<string>>();

  constructor(private readonly propertiesService: PropertiesService) {}

  private getOrCreate(userId: string): Set<string> {
    if (!this.store.has(userId)) {
      this.store.set(userId, new Set());
    }
    return this.store.get(userId)!;
  }

  getFavorites(userId: string) {
    const ids = this.getOrCreate(userId);
    const properties = this.propertiesService.findAll();
    return properties
      .filter((p) => ids.has(p.id))
      .map((p) => ({ ...p, isFavorite: true }));
  }

  addFavorite(userId: string, propertyId: string) {
    const property = this.propertiesService.findOne(propertyId);
    if (!property) throw new NotFoundException(`Property ${propertyId} not found`);
    this.getOrCreate(userId).add(propertyId);
    return { message: 'Added to favorites', propertyId };
  }

  removeFavorite(userId: string, propertyId: string) {
    const favorites = this.getOrCreate(userId);
    if (!favorites.has(propertyId)) {
      throw new BadRequestException(`Property ${propertyId} is not in favorites`);
    }
    favorites.delete(propertyId);
    return { message: 'Removed from favorites', propertyId };
  }

  isFavorite(userId: string, propertyId: string): boolean {
    return this.getOrCreate(userId).has(propertyId);
  }

  getUserFavoriteIds(userId: string): string[] {
    return Array.from(this.getOrCreate(userId));
  }
}
