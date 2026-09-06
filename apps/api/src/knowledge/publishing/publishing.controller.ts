import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { PublishingService } from './publishing.service';

@Controller('knowledge/publishing')
export class PublishingController {
  constructor(private readonly publishingService: PublishingService) {}

  @Post(':id/submit-review')
  submitForReview(@Param('id') id: string, @Body() body: { authorId?: string }) {
    return this.publishingService.submitForReview(id, body?.authorId || 'usr-author');
  }

  @Post(':id/review')
  reviewArticle(@Param('id') id: string, @Body() body: any) {
    return this.publishingService.reviewArticle(id, body);
  }

  @Post(':id/publish')
  publishArticle(@Param('id') id: string, @Body() body: { adminId?: string }) {
    return this.publishingService.publishArticle(id, body?.adminId || 'usr-admin');
  }

  @Post(':id/archive')
  archiveArticle(@Param('id') id: string) {
    return this.publishingService.archiveArticle(id);
  }

  @Get(':id/reviews')
  getReviews(@Param('id') id: string) {
    return this.publishingService.getReviewLogs(id);
  }
}
