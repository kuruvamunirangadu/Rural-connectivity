import { Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SafetyService {
  private forbiddenKeywords = [
    'bypass escrow',
    'pay directly in cash to skip fee',
    'fake verification',
    'delete ledger',
    'force approval',
  ];

  sanitizePrompt(prompt: string): string {
    const lower = prompt.toLowerCase();
    for (const keyword of this.forbiddenKeywords) {
      if (lower.includes(keyword)) {
        throw new ForbiddenException(`Prompt contains prohibited action or security violation: '${keyword}'`);
      }
    }
    return prompt.trim();
  }

  ensureUserContextIsolation(requestedUserId: string, authenticatedUserId: string): void {
    if (authenticatedUserId && requestedUserId && requestedUserId !== authenticatedUserId) {
      throw new ForbiddenException(`Unauthorized: Cannot access AI farm context for another user`);
    }
  }
}

