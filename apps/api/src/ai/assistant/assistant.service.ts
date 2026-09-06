import { Injectable, NotFoundException } from '@nestjs/common';
import { MockAIProvider } from '../providers/mock-ai.provider';
import { ActionPolicyService } from '../guardrails/action-policy.service';
import { SafetyService } from '../guardrails/safety.service';
import { AIValidationService } from '../guardrails/ai-validation.service';
import { AssistantToolsService } from './assistant.tools';
import { FarmContextService } from '../retrieval/farm-context.service';
import { AIConversationDTO, AIMessageDTO } from './assistant.types';
import { StructuredIntentResult } from '../providers/ai-provider.interface';

@Injectable()
export class AssistantService {
  constructor(
    private readonly aiProvider: MockAIProvider,
    private readonly actionPolicy: ActionPolicyService,
    private readonly safetyService: SafetyService,
    private readonly validationService: AIValidationService,
    private readonly toolsService: AssistantToolsService,
    private readonly farmContext: FarmContextService
  ) {}

  private conversations: AIConversationDTO[] = [
    {
      id: 'aiconv-001',
      userId: 'usr-ravi-001',
      title: 'Farm Work Planning & Tractor Request',
      contextType: 'FARM',
      contextId: 'farm-001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private messages: AIMessageDTO[] = [
    {
      id: 'aimsg-001',
      conversationId: 'aiconv-001',
      role: 'ASSISTANT',
      content: 'Hello Ravi garu! How can I assist with your 5-acre cotton farm today?',
      createdAt: new Date().toISOString(),
    },
  ];

  async createConversation(userId = 'usr-ravi-001', title = 'New Farm Assistant Session'): Promise<AIConversationDTO> {
    const conv: AIConversationDTO = {
      id: `aiconv-${Date.now()}`,
      userId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.conversations.push(conv);
    return conv;
  }

  async getConversations(userId = 'usr-ravi-001'): Promise<AIConversationDTO[]> {
    return this.conversations.filter((c) => c.userId === userId);
  }

  async getConversationById(id: string): Promise<AIConversationDTO> {
    const conv = this.conversations.find((c) => c.id === id);
    if (!conv) throw new NotFoundException(`AI conversation ${id} not found`);
    return conv;
  }

  async deleteConversation(id: string): Promise<{ success: boolean }> {
    this.conversations = this.conversations.filter((c) => c.id !== id);
    this.messages = this.messages.filter((m) => m.conversationId !== id);
    return { success: true };
  }

  async getMessages(conversationId: string): Promise<AIMessageDTO[]> {
    return this.messages.filter((m) => m.conversationId === conversationId);
  }

  async sendMessage(conversationId: string, content: string, userId = 'usr-ravi-001'): Promise<{ userMessage: AIMessageDTO; assistantMessage: AIMessageDTO }> {
    const conv = await this.getConversationById(conversationId);
    this.safetyService.ensureUserContextIsolation(conv.userId, userId);

    const sanitizedContent = this.safetyService.sanitizePrompt(content);

    const userMsg: AIMessageDTO = {
      id: `aimsg-${Date.now()}-u`,
      conversationId,
      role: 'USER',
      content: sanitizedContent,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(userMsg);

    // Interpret intent with validation
    const intentResult = await this.aiProvider.interpretIntent(sanitizedContent);
    this.validationService.validateStructuredIntent(intentResult);

    let replyText = intentResult.summary;
    let toolResult: any = null;

    if (intentResult.intent === 'CREATE_WORK_REQUEST') {
      replyText += `\n\n📌 **Draft Request Summary**:\n• Activity: ${intentResult.activityType}\n• Area: ${intentResult.area || 3} Acres\n• Date: ${intentResult.date || 'Tomorrow'}\n\nPlease click **Confirm** below to submit to the matching engine.`;
    } else if (intentResult.intent === 'FARM_PLAN_QUERY') {
      const farm = await this.farmContext.getFarmContext();
      toolResult = farm.upcomingActivities;
      replyText += `\n\n**Scheduled Activities for ${farm.farmName}**:\n` + farm.upcomingActivities.map((a) => `• ${a.activity} (Scheduled: ${a.scheduledDate})`).join('\n');
    }

    const assistantMsg: AIMessageDTO = {
      id: `aimsg-${Date.now()}-a`,
      conversationId,
      role: 'ASSISTANT',
      content: replyText,
      structuredIntent: intentResult,
      toolCall: toolResult ? { toolName: 'getUpcomingActivities', arguments: { farmId: 'farm-001' }, result: toolResult } : undefined,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(assistantMsg);

    conv.updatedAt = new Date().toISOString();

    return { userMessage: userMsg, assistantMessage: assistantMsg };
  }

  async interpretWorkRequest(message: string): Promise<StructuredIntentResult> {
    const sanitized = this.safetyService.sanitizePrompt(message);
    const intent = await this.aiProvider.interpretIntent(sanitized);
    this.validationService.validateStructuredIntent(intent);
    return intent;
  }
}
