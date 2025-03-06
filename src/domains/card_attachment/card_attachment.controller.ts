import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CardAttachmentService } from './card_attachment.service';
import { CreateCardAttachmentDto } from './dto/create-card_attachment.dto';
import { UpdateCardAttachmentDto } from './dto/update-card_attachment.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('card-attachment')
export class CardAttachmentController {
  constructor(private readonly cardAttachmentService: CardAttachmentService) {}

  @Post('/upload-file')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createCardAttachmentDto: CreateCardAttachmentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(createCardAttachmentDto);
    console.log(file);
    return this.cardAttachmentService.create({
      ...createCardAttachmentDto,
      file,
    });
  }

  @Get('/:id')
  findAll(@Param('id') cardId: string) {
    return this.cardAttachmentService.findAll(cardId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardAttachmentService.remove(id);
  }
}
