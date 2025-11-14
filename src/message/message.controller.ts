import { Controller, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
    constructor(private  messageService: MessageService) {}

    @Get(':id')
    async getUserMessage(@Param('id') id: string) {
        return this.messageService.getUserMessages(id);
    }
}