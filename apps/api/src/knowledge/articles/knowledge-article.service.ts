import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ArticleCitationDto } from '../sources/knowledge-source.service';

export interface ArticleVersionDto {
  version: number;
  title: string;
  content: string;
  summary: string;
  createdById: string;
  createdAt: string;
}

export interface KnowledgeArticleDto {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  contentType: 'ARTICLE' | 'GUIDE' | 'CHECKLIST' | 'FAQ' | 'VIDEO' | 'INFOGRAPHIC' | 'SAFETY_NOTICE';
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED' | 'EXPIRED';
  language: string;
  categoryId?: string;
  categoryName?: string;
  cropName?: string;
  activityType?: string;
  authorId: string;
  authorName: string;
  reviewedById?: string;
  reviewedByName?: string;
  publishedAt?: string;
  expiresAt?: string;
  currentVersion: number;
  versions: ArticleVersionDto[];
  sources: ArticleCitationDto[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class KnowledgeArticleService {
  private articles: KnowledgeArticleDto[] = [
    {
      id: 'art-cot-spray-guide',
      title: 'Cotton Spraying & Protective Agrochemical Stewardship Guide',
      slug: 'cotton-spraying-guide',
      summary:
        'Standard operational protocol for protective spraying in Bt-Cotton against sucking pests and pink bollworm with environmental threshold guidelines.',
      content: `### 1. Pre-Application Field Assessment
Before initiating any chemical application in cotton, verify economic threshold levels (ETL):
- Sucking Pests (Aphids/Jassids): > 5-10 nymphs per leaf on 20 random index plants.
- Whitefly: > 6-8 adults per leaf.
- Pink Bollworm: > 8 male moths per pheromone trap for 3 consecutive nights.

### 2. Weather & Field Conditions
- **Wind Speed**: Apply when wind speed is between 3 to 10 km/h. Avoid high winds (> 15 km/h) to prevent chemical drift.
- **Timing**: Early morning (06:30 - 09:30 AM) or late afternoon (04:00 - 06:30 PM). Never spray during peak mid-day heat.
- **Rain Warning**: Ensure a minimum 4-6 hour rain-free window after foliar application.

### 3. Equipment Calibration
- Use hollow cone nozzles for insecticidal foliar coverage and flat fan nozzles for systemic soil applications.
- Maintain operating pressure at 40-50 PSI for uniform droplet distribution (200-300 microns).
- Calibrate water volume: 200 Litres of spray solution per acre for tractor-mounted or power sprayers.`,
      contentType: 'GUIDE',
      status: 'PUBLISHED',
      language: 'en',
      categoryId: 'cat-cotton',
      categoryName: 'Cotton',
      cropName: 'Cotton',
      activityType: 'SPRAYING',
      authorId: 'usr-agronomist-01',
      authorName: 'Dr. V. Prasad (PJTSAU Agronomist)',
      reviewedById: 'usr-senior-reviewer-99',
      reviewedByName: 'Dr. K. Somasekhar (State Technical Reviewer)',
      publishedAt: '2026-01-15T09:00:00Z',
      expiresAt: '2027-01-15T00:00:00Z',
      currentVersion: 1,
      versions: [
        {
          version: 1,
          title: 'Cotton Spraying & Protective Agrochemical Stewardship Guide',
          summary: 'Standard operational protocol for protective spraying in Bt-Cotton.',
          content: 'Initial reviewed release.',
          createdById: 'usr-agronomist-01',
          createdAt: '2026-01-15T09:00:00Z',
        },
      ],
      sources: [
        {
          articleId: 'art-cot-spray-guide',
          sourceId: 'src-pjtsau-01',
          sourceName: 'Professor Jayashankar Telangana State Agricultural University',
          organization: 'PJTSAU Agronomy Directorate',
          citationText: 'PJTSAU Package of Practices for Cotton 2025-26, Bulletin No. 42',
          referenceUrl: 'https://pjtsau.edu.in/agronomy/cotton-pop-2025',
        },
        {
          articleId: 'art-cot-spray-guide',
          sourceId: 'src-icar-cicr-02',
          sourceName: 'ICAR - Central Institute for Cotton Research',
          organization: 'ICAR',
          citationText: 'CICR Pink Bollworm Management Advisory, Technical Circular 88',
        },
      ],
      tags: ['Cotton', 'Spraying', 'IPM', 'Pest Management', 'PJTSAU Verified'],
      createdAt: '2026-01-15T09:00:00Z',
      updatedAt: '2026-01-15T09:00:00Z',
    },
    {
      id: 'art-sprayer-ppe-safety',
      title: 'Operator Personal Protective Equipment (PPE) & Chemical Safety Checklist',
      slug: 'sprayer-ppe-safety-checklist',
      summary:
        'Mandatory health and safety checklist for agricultural sprayer operators and farm workers handling agrochemicals.',
      content: `### Mandatory Operator PPE Checklist
1. **Respiratory Protection**: Wear N95 or activated-carbon organic vapor mask while mixing and spraying.
2. **Eye Protection**: Chemical splash safety goggles with indirect ventilation.
3. **Body Covering**: Full-sleeve water-resistant apron or coverall suit and broad-brimmed cap.
4. **Hands & Feet**: Nitrile chemical-resistant gloves and rubber knee-high gumboots.

### Safe Mixing & Decontamination Protocol
- Always mix chemicals in well-ventilated outdoor shaded spaces using designated measuring cylinders.
- Triple-rinse empty chemical containers immediately; puncture container bottoms to prevent reuse for domestic storage.
- Never blow clogged nozzles with the mouth; use a nylon brush or water flush.
- Operators must take a complete soap bath and wash clothing separately immediately following spray operations.`,
      contentType: 'CHECKLIST',
      status: 'PUBLISHED',
      language: 'en',
      categoryId: 'cat-safety',
      categoryName: 'Operator & Chemical Safety',
      activityType: 'SPRAYING',
      authorId: 'usr-safety-officer-02',
      authorName: 'R. Sreenivas (Agri-Safety Specialist)',
      reviewedById: 'usr-senior-reviewer-99',
      reviewedByName: 'Dr. K. Somasekhar (State Technical Reviewer)',
      publishedAt: '2026-01-18T10:00:00Z',
      expiresAt: '2027-01-18T00:00:00Z',
      currentVersion: 1,
      versions: [
        {
          version: 1,
          title: 'Operator Personal Protective Equipment (PPE) & Chemical Safety Checklist',
          summary: 'Mandatory health and safety checklist for agricultural sprayer operators.',
          content: 'Initial certified safety protocol release.',
          createdById: 'usr-safety-officer-02',
          createdAt: '2026-01-18T10:00:00Z',
        },
      ],
      sources: [
        {
          articleId: 'art-sprayer-ppe-safety',
          sourceId: 'src-cibrc-safety-04',
          sourceName: 'Central Insecticides Board & Registration Committee (CIBRC)',
          organization: 'Ministry of Agriculture & Farmers Welfare',
          citationText: 'CIBRC Safety Manual for Agrochemical Applicators, 2025 Norms',
        },
      ],
      tags: ['Safety', 'PPE', 'Spraying', 'Chemical Handling', 'Operator Health'],
      createdAt: '2026-01-18T10:00:00Z',
      updatedAt: '2026-01-18T10:00:00Z',
    },
    {
      id: 'art-paddy-awd-irrigation',
      title: 'Alternate Wetting and Drying (AWD) Water Conservation in Paddy',
      slug: 'paddy-awd-water-conservation',
      summary:
        'Field implementation guide for saving 25-35% irrigation water in Sona Masoori and BPT 5204 paddy using perforated pani-pipe field tubes.',
      content: `### Principle of Alternate Wetting and Drying (AWD)
AWD is a water-saving technology where paddy fields are not kept continuously submerged, but allowed to dry periodically without reducing grain yield.

### Installation of Field Water Tube (Pani Pipe)
1. Install a 30 cm long PVC pipe (10-15 cm diameter) with perforations in the bottom 20 cm into the soil.
2. Maintain water depth 5 cm above soil surface during initial transplanting and flowering.
3. During vegetative tillering, re-irrigate only when water level drops to 15 cm below ground level inside the pipe.
4. Withhold AWD during flowering window (one week before to one week after flowering) to safeguard spikelet fertility.`,
      contentType: 'GUIDE',
      status: 'PUBLISHED',
      language: 'en',
      categoryId: 'cat-irrigation',
      categoryName: 'Water & Irrigation Systems',
      cropName: 'Paddy / Rice',
      activityType: 'IRRIGATION',
      authorId: 'usr-agronomist-01',
      authorName: 'Dr. V. Prasad (PJTSAU Agronomist)',
      reviewedById: 'usr-senior-reviewer-99',
      reviewedByName: 'Dr. K. Somasekhar (State Technical Reviewer)',
      publishedAt: '2026-01-20T11:00:00Z',
      expiresAt: '2027-01-20T00:00:00Z',
      currentVersion: 1,
      versions: [
        {
          version: 1,
          title: 'Alternate Wetting and Drying (AWD) Water Conservation in Paddy',
          summary: 'Field implementation guide for saving water in paddy.',
          content: 'Initial release.',
          createdById: 'usr-agronomist-01',
          createdAt: '2026-01-20T11:00:00Z',
        },
      ],
      sources: [
        {
          articleId: 'art-paddy-awd-irrigation',
          sourceId: 'src-pjtsau-01',
          sourceName: 'Professor Jayashankar Telangana State Agricultural University',
          organization: 'PJTSAU Water Technology Centre',
          citationText: 'PJTSAU AWD Water Conservation Protocol for Southern Telangana Zone',
        },
      ],
      tags: ['Paddy', 'Irrigation', 'Water Conservation', 'AWD', 'Sona Masoori'],
      createdAt: '2026-01-20T11:00:00Z',
      updatedAt: '2026-01-20T11:00:00Z',
    },
  ];

  listArticles(filter?: {
    status?: string;
    crop?: string;
    activityType?: string;
    category?: string;
    contentType?: string;
    language?: string;
  }): KnowledgeArticleDto[] {
    return this.articles.filter((a) => {
      // Default public filter: only published articles unless specified
      if (filter?.status) {
        if (a.status !== filter.status) return false;
      } else {
        if (a.status !== 'PUBLISHED') return false;
      }

      if (filter?.crop && a.cropName && !a.cropName.toLowerCase().includes(filter.crop.toLowerCase())) {
        return false;
      }
      if (filter?.activityType && a.activityType && a.activityType.toUpperCase() !== filter.activityType.toUpperCase()) {
        return false;
      }
      if (filter?.category && a.categoryId !== filter.category) {
        return false;
      }
      if (filter?.contentType && a.contentType !== filter.contentType) {
        return false;
      }
      if (filter?.language && a.language !== filter.language) {
        return false;
      }
      return true;
    });
  }

  getArticle(idOrSlug: string): KnowledgeArticleDto {
    const article = this.articles.find(
      (a) => a.id === idOrSlug || a.slug.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (!article) {
      throw new NotFoundException(`Knowledge article ${idOrSlug} not found`);
    }
    return article;
  }

  createArticle(data: {
    title: string;
    slug?: string;
    summary: string;
    content: string;
    contentType?: 'ARTICLE' | 'GUIDE' | 'CHECKLIST' | 'FAQ' | 'VIDEO' | 'INFOGRAPHIC' | 'SAFETY_NOTICE';
    language?: string;
    categoryId?: string;
    categoryName?: string;
    cropName?: string;
    activityType?: string;
    authorId: string;
    authorName?: string;
    tags?: string[];
    sources?: ArticleCitationDto[];
  }): KnowledgeArticleDto {
    const id = `art-${Date.now().toString(36)}`;
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    const newArticle: KnowledgeArticleDto = {
      id,
      title: data.title,
      slug,
      summary: data.summary,
      content: data.content,
      contentType: data.contentType || 'ARTICLE',
      status: 'DRAFT', // Mandatory draft initiation
      language: data.language || 'en',
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      cropName: data.cropName,
      activityType: data.activityType,
      authorId: data.authorId,
      authorName: data.authorName || 'Registered Agricultural Author',
      currentVersion: 1,
      versions: [
        {
          version: 1,
          title: data.title,
          summary: data.summary,
          content: data.content,
          createdById: data.authorId,
          createdAt: now,
        },
      ],
      sources: data.sources || [],
      tags: data.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    this.articles.push(newArticle);
    return newArticle;
  }

  updateArticle(
    id: string,
    updates: Partial<{
      title: string;
      summary: string;
      content: string;
      tags: string[];
      sources: ArticleCitationDto[];
    }>,
    updatedById: string
  ): KnowledgeArticleDto {
    const article = this.getArticle(id);
    const nextVersion = article.currentVersion + 1;
    const now = new Date().toISOString();

    if (updates.title) article.title = updates.title;
    if (updates.summary) article.summary = updates.summary;
    if (updates.content) article.content = updates.content;
    if (updates.tags) article.tags = updates.tags;
    if (updates.sources) article.sources = updates.sources;

    article.currentVersion = nextVersion;
    article.updatedAt = now;

    // Snapshot immutable version history
    article.versions.push({
      version: nextVersion,
      title: article.title,
      summary: article.summary,
      content: article.content,
      createdById: updatedById,
      createdAt: now,
    });

    return article;
  }
}
