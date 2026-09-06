import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { KnowledgeGapService } from './knowledge-gap.service';

@Controller('knowledge/gaps')
export class KnowledgeGapController {
  constructor(private readonly gapService: KnowledgeGapService) {}

  @Get()
  listGaps(
    @Query('status') status?: string,
    @Query('priority') priority?: string
  ) {
    return this.gapService.listGaps({ status, priority });
  }

  @Post('record-miss')
  recordMiss(
    @Body() body: { query: string; cropName?: string; activityType?: string }
  ) {
    return this.gapService.recordQueryMiss(body.query, body.cropName, body.activityType);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'OPEN' | 'IN_REVIEW' | 'CONTENT_CREATED' | 'RESOLVED'; resultingArticleId?: string }
  ) {
    return this.gapService.updateGapStatus(id, body.status, body.resultingArticleId);
  }
}
