import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PropertiesService } from './properties.service';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  findAll() {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const property = this.propertiesService.findOne(id);
    if (!property) throw new NotFoundException(`Property ${id} not found`);
    return property;
  }
}
