import { Controller, Get, Param } from '@nestjs/common';
import { KnowledgeCategoryService } from './knowledge-category.service';

@Controller('knowledge/categories')
export class KnowledgeCategoryController {
  constructor(private readonly categoryService: KnowledgeCategoryService) {}

  @Get()
  listCategories() {
    return this.categoryService.listCategories();
  }

  @Get('tree')
  getCategoryTree() {
    return this.categoryService.getCategoryTree();
  }

  @Get(':idOrSlug')
  getCategory(@Param('idOrSlug') idOrSlug: string) {
    return this.categoryService.getCategory(idOrSlug);
  }
}
