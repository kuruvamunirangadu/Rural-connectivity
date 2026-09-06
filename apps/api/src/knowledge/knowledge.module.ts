import { Module } from '@nestjs/common';
import { KnowledgeCategoryService } from './categories/knowledge-category.service';
import { KnowledgeCategoryController } from './categories/knowledge-category.controller';
import { KnowledgeSourceService } from './sources/knowledge-source.service';
import { KnowledgeSourceController } from './sources/knowledge-source.controller';
import { CropKnowledgeService } from './crops/crop-knowledge.service';
import { CropKnowledgeController } from './crops/crop-knowledge.controller';
import { KnowledgeArticleService } from './articles/knowledge-article.service';
import { KnowledgeArticleController } from './articles/knowledge-article.controller';
import { ActivityGuideService } from './activities/activity-guide.service';
import { ActivityGuideController } from './activities/activity-guide.controller';
import { PublishingService } from './publishing/publishing.service';
import { PublishingController } from './publishing/publishing.controller';
import { AdvisoryService } from './advisory/advisory.service';
import { AdvisoryController } from './advisory/advisory.controller';
import { FieldVisitService } from './field-visits/field-visit.service';
import { FieldVisitController } from './field-visits/field-visit.controller';
import { KnowledgeTranslationService } from './translations/knowledge-translation.service';
import { KnowledgeTranslationController } from './translations/knowledge-translation.controller';
import { KnowledgeGapService } from './gaps/knowledge-gap.service';
import { KnowledgeGapController } from './gaps/knowledge-gap.controller';
import { KnowledgeSearchService } from './search/knowledge-search.service';
import { KnowledgeSearchController } from './search/knowledge-search.controller';

@Module({
  controllers: [
    KnowledgeCategoryController,
    KnowledgeSourceController,
    CropKnowledgeController,
    KnowledgeArticleController,
    ActivityGuideController,
    PublishingController,
    AdvisoryController,
    FieldVisitController,
    KnowledgeTranslationController,
    KnowledgeGapController,
    KnowledgeSearchController,
  ],
  providers: [
    KnowledgeCategoryService,
    KnowledgeSourceService,
    CropKnowledgeService,
    KnowledgeArticleService,
    ActivityGuideService,
    PublishingService,
    AdvisoryService,
    FieldVisitService,
    KnowledgeTranslationService,
    KnowledgeGapService,
    KnowledgeSearchService,
  ],
  exports: [
    KnowledgeCategoryService,
    KnowledgeSourceService,
    CropKnowledgeService,
    KnowledgeArticleService,
    ActivityGuideService,
    PublishingService,
    AdvisoryService,
    FieldVisitService,
    KnowledgeTranslationService,
    KnowledgeGapService,
    KnowledgeSearchService,
  ],
})
export class KnowledgeModule {}
