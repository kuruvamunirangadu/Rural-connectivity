import { Module } from '@nestjs/common';
import { FarmPlansController } from './farm-plans.controller';
import { FarmPlansService } from './farm-plans.service';

@Module({
  controllers: [FarmPlansController],
  providers: [FarmPlansService],
  exports: [FarmPlansService],
})
export class FarmPlansModule {}
