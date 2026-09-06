import { Injectable } from '@nestjs/common';
import { KnowledgeArticleService, KnowledgeArticleDto } from '../articles/knowledge-article.service';
import { CropKnowledgeService, CropDto } from '../crops/crop-knowledge.service';
import { ActivityGuideService, ActivityGuideDto } from '../activities/activity-guide.service';
import { KnowledgeGapService } from '../gaps/knowledge-gap.service';
import { KnowledgeTranslationService } from '../translations/knowledge-translation.service';

export interface SearchResultDto {
  query: string;
  language: string;
  totalHits: number;
  articles: KnowledgeArticleDto[];
  crops: CropDto[];
  activityGuides: ActivityGuideDto[];
  aiSummary?: {
    answer: string;
    verifiedSources: { sourceName: string; citationText: string; organization?: string }[];
    safetyNote: string;
    suggestedActions?: { title: string; actionUrl: string }[];
  };
}

@Injectable()
export class KnowledgeSearchService {
  constructor(
    private readonly articleService: KnowledgeArticleService,
    private readonly cropService: CropKnowledgeService,
    private readonly guideService: ActivityGuideService,
    private readonly gapService: KnowledgeGapService,
    private readonly translationService: KnowledgeTranslationService
  ) {}

  search(
    query: string,
    options?: {
      crop?: string;
      activityType?: string;
      language?: string;
      includeAiAnswer?: boolean;
    }
  ): SearchResultDto {
    const rawQuery = (query || '').trim();
    const lang = options?.language || 'en';
    const cleanQuery = rawQuery.toLowerCase();

    // 1. Filter articles
    const allArticles = this.articleService.listArticles({
      crop: options?.crop,
      activityType: options?.activityType,
    });

    const matchingArticles = allArticles.filter((art) => {
      if (!cleanQuery) return true;
      const matchTitle = art.title.toLowerCase().includes(cleanQuery);
      const matchSummary = art.summary.toLowerCase().includes(cleanQuery);
      const matchContent = art.content.toLowerCase().includes(cleanQuery);
      const matchTags = art.tags.some((t) => t.toLowerCase().includes(cleanQuery));
      return matchTitle || matchSummary || matchContent || matchTags;
    });

    // 2. Filter crops
    const allCrops = this.cropService.listCrops();
    const matchingCrops = allCrops.filter((crop) => {
      if (!cleanQuery) return true;
      return (
        crop.name.toLowerCase().includes(cleanQuery) ||
        (crop.scientificName && crop.scientificName.toLowerCase().includes(cleanQuery)) ||
        crop.category.toLowerCase().includes(cleanQuery) ||
        crop.description.toLowerCase().includes(cleanQuery)
      );
    });

    // 3. Filter activity guides
    const allGuides = this.guideService.listGuides({
      cropName: options?.crop,
      activityType: options?.activityType,
    });
    const matchingGuides = allGuides.filter((guide) => {
      if (!cleanQuery) return true;
      return (
        guide.title.toLowerCase().includes(cleanQuery) ||
        guide.description.toLowerCase().includes(cleanQuery) ||
        guide.activityType.toLowerCase().includes(cleanQuery)
      );
    });

    const totalHits = matchingArticles.length + matchingCrops.length + matchingGuides.length;

    // 4. Zero-result telemetry logging into KnowledgeGap
    if (totalHits === 0 && rawQuery.length > 2) {
      this.gapService.recordQueryMiss(rawQuery, options?.crop, options?.activityType);
    }

    // 5. Synthesize AI Verified Answer if requested or when articles exist
    let aiSummary: SearchResultDto['aiSummary'] = undefined;
    if (options?.includeAiAnswer || cleanQuery.length > 0) {
      if (matchingArticles.length > 0) {
        const topArticle = matchingArticles[0];
        const allSources = matchingArticles.flatMap((a) => a.sources);
        aiSummary = {
          answer: `Based on verified agronomical guidelines for ${topArticle.cropName || 'field operations'}, follow official protocols: ${topArticle.summary}`,
          verifiedSources: allSources.map((s) => ({
            sourceName: s.sourceName,
            citationText: s.citationText,
            organization: s.organization,
          })),
          safetyNote:
            'Agricultural advisories are for decision support. Calibrate spray equipment, wear PPE, and confirm field threshold levels before chemical applications.',
          suggestedActions: [
            {
              title: `View Full Guide: ${topArticle.title}`,
              actionUrl: `/knowledge?articleId=${topArticle.id}`,
            },
            {
              title: 'Book Verified Sprayer / Tractor Service',
              actionUrl: '/booking',
            },
          ],
        };
      } else if (cleanQuery.length > 0) {
        aiSummary = {
          answer: `No verified university package of practices article currently matches "${rawQuery}". Our agronomy team has been notified of this knowledge gap.`,
          verifiedSources: [],
          safetyNote:
            'RuralConnect strictly avoids generating unverified chemical or pesticide recommendations without university citations.',
        };
      }
    }

    return {
      query: rawQuery,
      language: lang,
      totalHits,
      articles: matchingArticles,
      crops: matchingCrops,
      activityGuides: matchingGuides,
      aiSummary,
    };
  }
}
