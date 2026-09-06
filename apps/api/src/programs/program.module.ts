import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramParticipantService } from './participant.service';
import { ProgramLocationService } from './location.service';
import { ProgramController } from './program.controller';

@Module({
  controllers: [ProgramController],
  providers: [ProgramService, ProgramParticipantService, ProgramLocationService],
  exports: [ProgramService, ProgramParticipantService, ProgramLocationService],
})
export class ProgramModule {}
