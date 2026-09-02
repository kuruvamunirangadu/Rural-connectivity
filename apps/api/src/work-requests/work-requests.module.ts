import { Module } from '@nestjs/common';
import { WorkRequestsController } from './work-requests.controller';
import { WorkRequestsService } from './work-requests.service';

@Module({
  controllers: [WorkRequestsController],
  providers: [WorkRequestsService],
  exports: [WorkRequestsService],
})
export class WorkRequestsModule {}
