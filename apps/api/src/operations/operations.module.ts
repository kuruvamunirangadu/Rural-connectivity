import { Module, Global } from '@nestjs/common';
import { OperationsController } from './operations.controller';
import { AlertService } from './alert.service';

@Global()
@Module({
  controllers: [OperationsController],
  providers: [AlertService],
  exports: [AlertService],
})
export class OperationsModule {}
