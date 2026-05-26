import { Module } from '@nestjs/common';
import { PropertiesModule } from './properties/properties.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [PropertiesModule, FavoritesModule],
})
export class AppModule {}
