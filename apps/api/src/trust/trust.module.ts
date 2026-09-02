import { Module, Global } from '@nestjs/common';
import { TrustController } from './trust.controller';
import { TrustService } from './trust.service';
import { ReliabilityService } from './reliability.service';
import { VerificationModule } from '../verification/verification.module';

@Global()
@Module({
  imports: [VerificationModule],
  controllers: [TrustController],
  providers: [TrustService, ReliabilityService],
  exports: [TrustService, ReliabilityService],
})
export class TrustModule {}
