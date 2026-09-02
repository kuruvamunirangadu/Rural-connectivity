import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MatchingService } from './matching.service';

@Controller()
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('matching/search')
  async searchMatching(@Body() body: any) {
    return this.matchingService.searchHyperlocal(body);
  }

  @Get('resources/search')
  async searchResources(
    @Query('resourceType') resourceType?: string,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
    @Query('radiusKm') radiusKm?: string,
    @Query('date') date?: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
    @Query('sortMode') sortMode?: string
  ) {
    return this.matchingService.searchHyperlocal({
      location: {
        latitude: latitude ? Number(latitude) : 17.25,
        longitude: longitude ? Number(longitude) : 77.58,
      },
      resourceType: resourceType || 'TRACTOR',
      radiusKm: radiusKm ? Number(radiusKm) : 25,
      date: date || '2026-09-10',
      startTime: startTime || '07:00',
      endTime: endTime || '11:00',
      sortMode: (sortMode as any) || 'BEST_MATCH',
    });
  }
}
