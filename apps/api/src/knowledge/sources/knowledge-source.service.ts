import { Injectable, NotFoundException } from '@nestjs/common';

export interface KnowledgeSourceDto {
  id: string;
  name: string;
  organization: string;
  sourceType: 'GOVERNMENT' | 'AGRICULTURAL_INSTITUTION' | 'UNIVERSITY' | 'RESEARCH' | 'INTERNAL' | 'EXPERT' | 'OTHER';
  reference?: string;
  description?: string;
  status: string;
  createdAt: string;
}

export interface ArticleCitationDto {
  articleId: string;
  sourceId: string;
  sourceName: string;
  organization: string;
  citationText: string;
  referenceUrl?: string;
}

@Injectable()
export class KnowledgeSourceService {
  private sources: KnowledgeSourceDto[] = [
    {
      id: 'src-pjtsau-01',
      name: 'Professor Jayashankar Telangana State Agricultural University (PJTSAU)',
      organization: 'PJTSAU Agronomy Extension Directorate',
      sourceType: 'AGRICULTURAL_INSTITUTION',
      reference: 'PJTSAU-PoP-2025/Cotton-04',
      description: 'Standard package of practices for dryland and irrigated crops in Telangana.',
      status: 'VERIFIED',
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'src-icar-cicr-02',
      name: 'ICAR - Central Institute for Cotton Research (CICR)',
      organization: 'Indian Council of Agricultural Research',
      sourceType: 'RESEARCH',
      reference: 'ICAR-CICR-IPM-Bul.88',
      description: 'National guidelines on pink bollworm IPM, pheromone trapping, and safe chemical stewardship.',
      status: 'VERIFIED',
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'src-telangana-agri-03',
      name: 'Department of Agriculture, Government of Telangana',
      organization: 'Government of Telangana',
      sourceType: 'GOVERNMENT',
      reference: 'TS-AGRI-ADVISORY-2026/Q1',
      description: 'Official state agricultural advisories, pest surveillance bulletins, and subsidized input norms.',
      status: 'VERIFIED',
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'src-cibrc-safety-04',
      name: 'Central Insecticides Board & Registration Committee (CIBRC)',
      organization: 'Ministry of Agriculture & Farmers Welfare',
      sourceType: 'GOVERNMENT',
      reference: 'CIBRC-LABEL-CLAIM-2025',
      description: 'Mandatory statutory guidelines on pesticide waiting periods, toxicity labels, and operator PPE.',
      status: 'VERIFIED',
      createdAt: '2026-01-01T00:00:00Z',
    },
  ];

  listSources(): KnowledgeSourceDto[] {
    return this.sources;
  }

  getSource(id: string): KnowledgeSourceDto {
    const source = this.sources.find((s) => s.id === id);
    if (!source) {
      throw new NotFoundException(`Knowledge source ${id} not found`);
    }
    return source;
  }
}
