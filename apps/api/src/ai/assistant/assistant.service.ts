import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { MockAIProvider } from '../providers/mock-ai.provider';
import { ActionPolicyService } from '../guardrails/action-policy.service';
import { StructuredIntentResult } from '../providers/ai-provider.interface';

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  contextType?: string;
  contextId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM' | 'TOOL';
  content: string;
  structuredIntent?: StructuredIntentResult | null;
  createdAt: string;
}

@Injectable()
export class AssistantService {
  constructor(
    private readonly aiProvider: MockAIProvider,
    private readonly actionPolicy: ActionPolicyService
  ) {}

  private conversations: AIConversation[] = [
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

  private messages: AIMessage[] = [
    {
      id: 'aimsg-001',
      conversationId: 'aiconv-001',
      role: 'ASSISTANT',
      content: 'Hello Ravi garu! How can I assist with your 5-acre cotton farm today?',
      createdAt: new Date().toISOString(),
    },
  ];

  async createConversation(userId = 'usr-ravi-001', title = 'New Farm Assistant Session'): Promise<AIConversation> {
    const conv: AIConversation = {
      id: `aiconv-${Date.now()}`,
      userId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.conversations.push(conv);
    return conv;
  }

  async getConversations(userId = 'usr-ravi-001'): Promise<AIConversation[]> {
    return this.conversations.filter((c) => c.userId === userId);
  }

  async getMessages(conversationId: string): Promise<AIMessage[]> {
    return this.messages.filter((m) => m.conversationId === conversationId);
  }

  async sendMessage(conversationId: string, content: string, userId = 'usr-ravi-001'): Promise<{ userMessage: AIMessage; assistantMessage: AIMessage }> {
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (!conv) throw new NotFoundException(`AI conversation ${conversationId} not found`);

    const userMsg: AIMessage = {
      id: `aimsg-${Date.now()}-u`,
      conversationId,
      role: 'USER',
      content,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(userMsg);

    // Interpret intent
    const intentResult = await this.aiProvider.interpretIntent(content);

    let replyText = intentResult.summary;
    if (intentResult.intent === 'CREATE_WORK_REQUEST') {
      replyText += ` Please review and confirm to search matching resources.`;
    }

    const assistantMsg: AIMessage = {
      id: `aimsg-${Date.now()}-a`,
      conversationId,
      role: 'ASSISTANT',
      content: replyText,
      structuredIntent: intentResult,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(assistantMsg);

    conv.updatedAt = new Date().toISOString();

    return { userMessage: userMsg, assistantMessage: assistantMsg };
  }

  async interpretWorkRequest(message: string): Promise<StructuredIntentResult> {
    return this.aiProvider.interpretIntent(message);
  }
}
