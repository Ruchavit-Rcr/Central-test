import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { PropertiesService } from '../properties/properties.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoritesService, PropertiesService],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should start with empty favorites for a new user', () => {
    expect(service.getFavorites('alice')).toEqual([]);
  });

  it('should add a property to favorites', () => {
    service.addFavorite('alice', '1');
    const favorites = service.getFavorites('alice');
    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe('1');
    expect(favorites[0].isFavorite).toBe(true);
  });

  it('should remove a property from favorites', () => {
    service.addFavorite('alice', '1');
    service.removeFavorite('alice', '1');
    expect(service.getFavorites('alice')).toHaveLength(0);
  });

  it('should keep favorites separate per user', () => {
    service.addFavorite('alice', '1');
    service.addFavorite('bob', '2');
    expect(service.getUserFavoriteIds('alice')).toEqual(['1']);
    expect(service.getUserFavoriteIds('bob')).toEqual(['2']);
  });

  it('should throw NotFoundException for unknown property', () => {
    expect(() => service.addFavorite('alice', 'invalid-id')).toThrow(NotFoundException);
  });

  it('should throw BadRequestException when removing a non-favorited property', () => {
    expect(() => service.removeFavorite('alice', '1')).toThrow(BadRequestException);
  });

  it('should correctly report isFavorite', () => {
    expect(service.isFavorite('alice', '1')).toBe(false);
    service.addFavorite('alice', '1');
    expect(service.isFavorite('alice', '1')).toBe(true);
  });
});
