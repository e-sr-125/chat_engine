import { Controller, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get(':userId')
  async getUserMessages(@Param('userId') userId: string) {
    return this.messageService.getUserMessages(userId);
  }
}

