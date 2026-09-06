import { StructuredIntentResult } from '../providers/ai-provider.interface';

export interface AIConversationDTO {
  id: string;
  userId: string;
  title: string;
  contextType?: string;
  contextId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessageDTO {
  id: string;
  conversationId: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM' | 'TOOL';
  content: string;
  structuredIntent?: StructuredIntentResult | null;
  toolCall?: {
    toolName: string;
    arguments: Record<string, any>;
    result?: any;
  };
  createdAt: string;
}

export interface CreateConversationInput {
  userId?: string;
  title?: string;
  contextType?: string;
  contextId?: string;
}

