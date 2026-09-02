import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('conversations')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getConversations(@Query('userId') userId?: string) {
    return this.chatService.getConversationsForUser(userId);
  }

  @Get(':id/messages')
  async getMessages(@Param('id') conversationId: string, @Query('userId') userId?: string) {
    return this.chatService.getMessages(conversationId, userId);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') conversationId: string,
    @Body() body: { senderId: string; content: string }
  ) {
    return this.chatService.sendMessage(conversationId, body.senderId, body.content);
  }
}
