import { Controller, Get, Query } from '@nestjs/common';
import { KnowledgeSearchService } from './knowledge-search.service';

@Controller('knowledge/search')
export class KnowledgeSearchController {
  constructor(private readonly searchService: KnowledgeSearchService) {}

  @Get()
  search(
    @Query('q') q?: string,
    @Query('crop') crop?: string,
    @Query('activityType') activityType?: string,
    @Query('language') language?: string,
    @Query('includeAiAnswer') includeAiAnswer?: string
  ) {
    return this.searchService.search(q || '', {
      crop,
      activityType,
      language,
      includeAiAnswer: includeAiAnswer === 'true',
    });
  }
}
