import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { KnowledgeArticleService, KnowledgeArticleDto } from '../articles/knowledge-article.service';

export interface ReviewRecordDto {
  id: string;
  articleId: string;
  reviewerId: string;
  reviewerName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  comments?: string;
  reviewedAt: string;
}

@Injectable()
export class PublishingService {
  constructor(private readonly articleService: KnowledgeArticleService) {}

  private reviewLogs: ReviewRecordDto[] = [];

  submitForReview(articleId: string, authorId: string): KnowledgeArticleDto {
    const article = this.articleService.getArticle(articleId);

    if (article.status !== 'DRAFT' && article.status !== 'ARCHIVED') {
      throw new BadRequestException(`Cannot submit article in status '${article.status}' for review`);
    }

    article.status = 'UNDER_REVIEW';
    article.updatedAt = new Date().toISOString();

    const reviewId = `rev-${Date.now().toString(36)}`;
    this.reviewLogs.push({
      id: reviewId,
      articleId,
      reviewerId: '',
      reviewerName: 'Assigned Technical Agronomist',
      status: 'PENDING',
      reviewedAt: new Date().toISOString(),
    });

    return article;
  }

  reviewArticle(
    articleId: string,
    data: {
      reviewerId: string;
      reviewerName: string;
      action: 'APPROVE' | 'REJECT' | 'CHANGES_REQUESTED';
      comments?: string;
    }
  ): { article: KnowledgeArticleDto; review: ReviewRecordDto } {
    const article = this.articleService.getArticle(articleId);

    if (article.status !== 'UNDER_REVIEW') {
      throw new BadRequestException(`Article ${articleId} is not under review`);
    }

    const reviewId = `rev-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const review: ReviewRecordDto = {
      id: reviewId,
      articleId,
      reviewerId: data.reviewerId,
      reviewerName: data.reviewerName,
      status:
        data.action === 'APPROVE'
          ? 'APPROVED'
          : data.action === 'REJECT'
          ? 'REJECTED'
          : 'CHANGES_REQUESTED',
      comments: data.comments,
      reviewedAt: now,
    };

    this.reviewLogs.push(review);

    article.reviewedById = data.reviewerId;
    article.reviewedByName = data.reviewerName;
    article.updatedAt = now;

    if (data.action === 'APPROVE') {
      article.status = 'APPROVED';
    } else if (data.action === 'REJECT') {
      article.status = 'ARCHIVED';
    } else {
      article.status = 'DRAFT'; // Returned to author for edits
    }

    return { article, review };
  }

  publishArticle(articleId: string, adminId: string): KnowledgeArticleDto {
    const article = this.articleService.getArticle(articleId);

    if (article.status !== 'APPROVED') {
      throw new BadRequestException(
        `Cannot publish article ${articleId} without prior expert approval (current status: '${article.status}')`
      );
    }

    const now = new Date().toISOString();
    const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1-year review cycle

    article.status = 'PUBLISHED';
    article.publishedAt = now;
    article.expiresAt = expiry;
    article.updatedAt = now;

    return article;
  }

  archiveArticle(articleId: string): KnowledgeArticleDto {
    const article = this.articleService.getArticle(articleId);
    article.status = 'ARCHIVED';
    article.updatedAt = new Date().toISOString();
    return article;
  }

  expireArticle(articleId: string): KnowledgeArticleDto {
    const article = this.articleService.getArticle(articleId);
    article.status = 'EXPIRED';
    article.updatedAt = new Date().toISOString();
    return article;
  }

  getReviewLogs(articleId: string): ReviewRecordDto[] {
    return this.reviewLogs.filter((r) => r.articleId === articleId);
  }
}
