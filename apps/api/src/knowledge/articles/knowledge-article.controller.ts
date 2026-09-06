import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { KnowledgeArticleService } from './knowledge-article.service';

@Controller('knowledge/articles')
export class KnowledgeArticleController {
  constructor(private readonly articleService: KnowledgeArticleService) {}

  @Get()
  listArticles(
    @Query('status') status?: string,
    @Query('crop') crop?: string,
    @Query('activityType') activityType?: string,
    @Query('category') category?: string,
    @Query('contentType') contentType?: string,
    @Query('language') language?: string
  ) {
    return this.articleService.listArticles({ status, crop, activityType, category, contentType, language });
  }

  @Get(':idOrSlug')
  getArticle(@Param('idOrSlug') idOrSlug: string) {
    return this.articleService.getArticle(idOrSlug);
  }

  @Post()
  createArticle(@Body() body: any) {
    return this.articleService.createArticle(body);
  }

  @Patch(':id')
  updateArticle(@Param('id') id: string, @Body() body: { updates: any; updatedById: string }) {
    return this.articleService.updateArticle(id, body.updates, body.updatedById || 'usr-author');
  }
}
