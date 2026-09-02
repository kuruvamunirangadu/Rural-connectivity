import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('verifications')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  async submitVerification(@Body() body: any) {
    return this.verificationService.submitVerification(body);
  }

  @Get('me')
  async getMyVerifications() {
    return this.verificationService.getMyVerifications();
  }

  @Get(':id')
  async getVerificationById(@Param('id') id: string) {
    return this.verificationService.getVerificationById(id);
  }

  @Post(':id/documents')
  async uploadDocument(@Param('id') id: string, @Body() body: any) {
    return this.verificationService.uploadDocument(id, body);
  }
}
