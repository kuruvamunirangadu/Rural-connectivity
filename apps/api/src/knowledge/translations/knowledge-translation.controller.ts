import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { KnowledgeTranslationService } from './knowledge-translation.service';

@Controller('knowledge/translations')
export class KnowledgeTranslationController {
  constructor(private readonly translationService: KnowledgeTranslationService) {}

  @Get(':articleId')
  getTranslationsForArticle(@Param('articleId') articleId: string) {
    return this.translationService.getTranslationsForArticle(articleId);
  }

  @Get(':articleId/:language')
  getTranslation(@Param('articleId') articleId: string, @Param('language') language: string) {
    return this.translationService.getTranslation(articleId, language);
  }

  @Post()
  createOrUpdateTranslation(@Body() body: any) {
    return this.translationService.createOrUpdateTranslation(body);
  }
}
