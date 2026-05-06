import { Controller, Get, Post, Body } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  findAll() {
    return this.servicesService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  create(@Body() data: { title: string; icon: string; description: string; price: string }) {
    return this.servicesService.create(data);
  }
}
