import { Module } from '@nestjs/common';
import { WorkOffersController } from './work-offers.controller';
import { WorkOffersService } from './work-offers.service';

@Module({
  controllers: [WorkOffersController],
  providers: [WorkOffersService],
  exports: [WorkOffersService],
})
export class WorkOffersModule {}
