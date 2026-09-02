import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EventBusService } from '../events/event-bus.service';

export interface Conversation {
  id: string;
  type: 'BOOKING' | 'PROJECT' | 'SUPPORT';
  bookingId?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  joinedAt: string;
  lastReadAt?: string | null;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  messageType: 'TEXT' | 'SYSTEM' | 'IMAGE';
  content: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: string;
}

@Injectable()
export class ChatService {
  constructor(private readonly eventBus: EventBusService) {
    // Listen for booking confirmed to automatically initialize chat
    this.eventBus.subscribe('BookingConfirmedEvent', async (event) => {
      const p = event.payload;
      const conv = await this.getOrCreateBookingConversation(p.bookingId, p.customerId, p.providerId);
      await this.sendSystemMessage(conv.id, `Booking confirmed for ${p.date} at ${p.time}. Amount: ₹${p.totalAmount}`);
    });

    // Listen for provider arrival
    this.eventBus.subscribe('ProviderArrivedEvent', async (event) => {
      const p = event.payload;
      const conv = this.conversations.find((c) => c.bookingId === p.bookingId);
      if (conv) {
        await this.sendSystemMessage(conv.id, 'Service provider has arrived at the farm location.');
      }
    });

    // Listen for work completed
    this.eventBus.subscribe('WorkCompletedEvent', async (event) => {
      const p = event.payload;
      const conv = this.conversations.find((c) => c.bookingId === p.bookingId);
      if (conv) {
        await this.sendSystemMessage(conv.id, 'Work operation marked as completed. Please verify and confirm completion.');
      }
    });
  }

  private conversations: Conversation[] = [
    {
      id: 'conv-001',
      type: 'BOOKING',
      bookingId: 'BK1001',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
  ];

  private participants: ConversationParticipant[] = [
    { id: 'cp-1', conversationId: 'conv-001', userId: 'usr-ravi-001', joinedAt: new Date().toISOString() },
    { id: 'cp-2', conversationId: 'conv-001', userId: 'to-suresh-002', joinedAt: new Date().toISOString() },
  ];

  private messages: Message[] = [
    {
      id: 'msg-001',
      conversationId: 'conv-001',
      senderId: 'SYSTEM',
      messageType: 'SYSTEM',
      content: 'Booking #BK1001 confirmed for September 10 at 7:00 AM.',
      status: 'READ',
      createdAt: '2026-09-02T06:00:00Z',
    },
    {
      id: 'msg-002',
      conversationId: 'conv-001',
      senderId: 'usr-ravi-001',
      messageType: 'TEXT',
      content: 'Hello Suresh, please arrive by 7:00 AM at the North field gate.',
      status: 'READ',
      createdAt: '2026-09-02T06:05:00Z',
    },
    {
      id: 'msg-003',
      conversationId: 'conv-001',
      senderId: 'to-suresh-002',
      messageType: 'TEXT',
      content: 'Sure Ravi garu, I will be there on time with the Mahindra tractor and rotavator.',
      status: 'READ',
      createdAt: '2026-09-02T06:07:00Z',
    },
  ];

  async getOrCreateBookingConversation(bookingId: string, customerId: string, providerId: string): Promise<Conversation> {
    let conv = this.conversations.find((c) => c.bookingId === bookingId);
    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        type: 'BOOKING',
        bookingId,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      this.conversations.push(conv);

      this.participants.push(
        { id: `cp-${Date.now()}-1`, conversationId: conv.id, userId: customerId, joinedAt: new Date().toISOString() },
        { id: `cp-${Date.now()}-2`, conversationId: conv.id, userId: providerId, joinedAt: new Date().toISOString() }
      );
    }
    return conv;
  }

  async getConversationsForUser(userId = 'usr-ravi-001'): Promise<any[]> {
    const userConvs = this.participants.filter((p) => p.userId === userId);
    const convIds = userConvs.map((p) => p.conversationId);

    return this.conversations
      .filter((c) => convIds.includes(c.id))
      .map((c) => {
        const lastMsg = this.messages.filter((m) => m.conversationId === c.id).slice(-1)[0];
        return {
          ...c,
          lastMessage: lastMsg ? lastMsg.content : null,
          lastMessageAt: lastMsg ? lastMsg.createdAt : c.createdAt,
        };
      });
  }

  async getMessages(conversationId: string, requesterUserId = 'usr-ravi-001'): Promise<Message[]> {
    const isParticipant = this.participants.some((p) => p.conversationId === conversationId && p.userId === requesterUserId);
    if (!isParticipant && requesterUserId !== 'admin-001') {
      throw new ForbiddenException('You do not have access to this private booking conversation');
    }
    return this.messages.filter((m) => m.conversationId === conversationId);
  }

  async sendMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
    const isParticipant = this.participants.some((p) => p.conversationId === conversationId && p.userId === senderId);
    if (!isParticipant && senderId !== 'admin-001') {
      throw new ForbiddenException('Sender is not an authorized participant in this conversation');
    }

    const msg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      messageType: 'TEXT',
      content,
      status: 'SENT',
      createdAt: new Date().toISOString(),
    };
    this.messages.push(msg);

    return msg;
  }

  async sendSystemMessage(conversationId: string, content: string): Promise<Message> {
    const msg: Message = {
      id: `msg-sys-${Date.now()}`,
      conversationId,
      senderId: 'SYSTEM',
      messageType: 'SYSTEM',
      content,
      status: 'SENT',
      createdAt: new Date().toISOString(),
    };
    this.messages.push(msg);
    return msg;
  }
}
