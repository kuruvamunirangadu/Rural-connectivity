import { Injectable, NotFoundException } from '@nestjs/common';

export interface KnowledgeCategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  status: string;
  children?: KnowledgeCategoryDto[];
  createdAt: string;
}

@Injectable()
export class KnowledgeCategoryService {
  private categories: KnowledgeCategoryDto[] = [
    {
      id: 'cat-crops',
      name: 'Crops & Agronomy',
      slug: 'crops',
      description: 'Crop-specific packages of practices, growth stages, and agronomic management.',
      status: 'ACTIVE',
      createdAt: '2026-01-10T00:00:00Z',
    },
    {
      id: 'cat-cotton',
      name: 'Cotton',
      slug: 'crops-cotton',
      description: 'Bt-Cotton and long-staple cotton agronomy, pests, and harvest practices.',
      parentId: 'cat-crops',
      status: 'ACTIVE',
      createdAt: '2026-01-10T00:00:00Z',
    },
    {
      id: 'cat-paddy',
      name: 'Paddy / Rice',
      slug: 'crops-paddy',
      description: 'Sona Masoori, BPT 5204, and SRI paddy water and nutrient management.',
      parentId: 'cat-crops',
      status: 'ACTIVE',
      createdAt: '2026-01-10T00:00:00Z',
    },
    {
      id: 'cat-groundnut',
      name: 'Groundnut & Oilseeds',
      slug: 'crops-groundnut',
      description: 'Bold pod oilseeds, gypsum application, and pod borer prevention.',
      parentId: 'cat-crops',
      status: 'ACTIVE',
      createdAt: '2026-01-10T00:00:00Z',
    },
    {
      id: 'cat-safety',
      name: 'Operator & Chemical Safety',
      slug: 'safety',
      description: 'Personal protective equipment (PPE), safe spraying, and chemical handling precautions.',
      status: 'ACTIVE',
      createdAt: '2026-01-10T00:00:00Z',
    },
    {
      id: 'cat-irrigation',
      name: 'Water & Irrigation Systems',
      slug: 'irrigation',
      description: 'Drip, sprinkler, furrow, and borewell water conservation techniques.',
      status: 'ACTIVE',
      createdAt: '2026-01-10T00:00:00Z',
    },
    {
      id: 'cat-machinery',
      name: 'Machinery & Implements',
      slug: 'machinery',
      description: 'Tractor calibration, rotavators, power sprayers, and combine harvesters.',
      status: 'ACTIVE',
      createdAt: '2026-01-10T00:00:00Z',
    },
    {
      id: 'cat-pest-mgmt',
      name: 'Integrated Pest Management (IPM)',
      slug: 'pest-management',
      description: 'Pheromone traps, biological controls, and threshold-based pest interventions.',
      status: 'ACTIVE',
      createdAt: '2026-01-10T00:00:00Z',
    },
  ];

  listCategories(): KnowledgeCategoryDto[] {
    return this.categories;
  }

  getCategoryTree(): KnowledgeCategoryDto[] {
    const rootCategories = this.categories.filter((c) => !c.parentId);
    return rootCategories.map((root) => ({
      ...root,
      children: this.categories.filter((c) => c.parentId === root.id),
    }));
  }

  getCategory(idOrSlug: string): KnowledgeCategoryDto {
    const category = this.categories.find(
      (c) => c.id === idOrSlug || c.slug.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (!category) {
      throw new NotFoundException(`Knowledge category ${idOrSlug} not found`);
    }
    return category;
  }
}
