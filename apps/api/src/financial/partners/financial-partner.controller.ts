import { Controller, Get, Param, Query } from '@nestjs/common';
import { FinancialPartnerService } from './financial-partner.service';

@Controller('financial/partners')
export class FinancialPartnerController {
  constructor(private readonly partnerService: FinancialPartnerService) {}

  @Get()
  listPartners() {
    return this.partnerService.listPartners();
  }

  @Get('products')
  listProducts(
    @Query('purpose') purpose?: string,
    @Query('partnerId') partnerId?: string
  ) {
    return this.partnerService.listProducts({ purpose, partnerId });
  }

  @Get(':id')
  getPartner(@Param('id') id: string) {
    return this.partnerService.getPartner(id);
  }
}
