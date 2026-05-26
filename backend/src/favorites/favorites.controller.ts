import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get(':userId')
  getFavorites(@Param('userId') userId: string) {
    if (!userId.trim()) throw new BadRequestException('userId is required');
    return this.favoritesService.getFavorites(userId);
  }

  @Get(':userId/ids')
  getFavoriteIds(@Param('userId') userId: string) {
    if (!userId.trim()) throw new BadRequestException('userId is required');
    return { userId, favoriteIds: this.favoritesService.getUserFavoriteIds(userId) };
  }

  @Post(':userId/:propertyId')
  addFavorite(
    @Param('userId') userId: string,
    @Param('propertyId') propertyId: string,
  ) {
    if (!userId.trim()) throw new BadRequestException('userId is required');
    return this.favoritesService.addFavorite(userId, propertyId);
  }

  @Delete(':userId/:propertyId')
  removeFavorite(
    @Param('userId') userId: string,
    @Param('propertyId') propertyId: string,
  ) {
    if (!userId.trim()) throw new BadRequestException('userId is required');
    return this.favoritesService.removeFavorite(userId, propertyId);
  }
}
