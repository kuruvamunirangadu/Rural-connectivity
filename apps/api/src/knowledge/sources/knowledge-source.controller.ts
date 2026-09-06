import { Controller, Get, Param } from '@nestjs/common';
import { KnowledgeSourceService } from './knowledge-source.service';

@Controller('knowledge/sources')
export class KnowledgeSourceController {
  constructor(private readonly sourceService: KnowledgeSourceService) {}

  @Get()
  listSources() {
    return this.sourceService.listSources();
  }

  @Get(':id')
  getSource(@Param('id') id: string) {
    return this.sourceService.getSource(id);
  }
}
