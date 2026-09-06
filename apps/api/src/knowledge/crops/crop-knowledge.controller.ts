import { Controller, Get, Param } from '@nestjs/common';
import { CropKnowledgeService } from './crop-knowledge.service';

@Controller('knowledge/crops')
export class CropKnowledgeController {
  constructor(private readonly cropKnowledgeService: CropKnowledgeService) {}

  @Get()
  listCrops() {
    return this.cropKnowledgeService.listCrops();
  }

  @Get(':idOrName')
  getCrop(@Param('idOrName') idOrName: string) {
    return this.cropKnowledgeService.getCrop(idOrName);
  }

  @Get(':idOrName/articles')
  getKnowledgeForCrop(@Param('idOrName') idOrName: string) {
    return this.cropKnowledgeService.getKnowledgeForCrop(idOrName);
  }
}
