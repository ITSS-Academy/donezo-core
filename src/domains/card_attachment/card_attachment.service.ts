import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCardAttachmentDto } from './dto/create-card_attachment.dto';
import { UpdateCardAttachmentDto } from './dto/update-card_attachment.dto';
import { SupabaseService } from "../../services/supabase/supabase.service";

@Injectable()
export class CardAttachmentService {
  constructor(private supabase: SupabaseService) {}

  async create(createCardAttachmentDto: {
    file: Express.Multer.File;
    cardId: string;
  }) {
    const { data: uploadedFile, error } = await this.supabase.client.storage
      .from('card_attachment')
      .upload(
        `${createCardAttachmentDto.cardId}/${createCardAttachmentDto.file.originalname}`,
        createCardAttachmentDto.file.buffer,
        {
          upsert: true,
          contentType: createCardAttachmentDto.file.mimetype,
        },
      );
    if (error) {
      throw new BadRequestException(error.message);
    }
    console.log(uploadedFile);

    const { data } = this.supabase.client.storage
      .from('card_attachment')
      .getPublicUrl(
        `${createCardAttachmentDto.cardId}/${createCardAttachmentDto.file.originalname}`,
      );

    const newCardAttachment = {
      cardId: createCardAttachmentDto.cardId,
      fileUrl: data,
      fileName: createCardAttachmentDto.file.originalname,
    };

    return this.supabase.client
      .from('card_attachment')
      .insert(newCardAttachment)
      .select();
  }

  findAll(cardId: string) {
    return this.supabase.client
      .from('card_attachment')
      .select()
      .eq('cardId', cardId);
  }

  findOne(id: number) {
    return `This action returns a #${id} cardAttachment`;
  }

  update(id: number, updateCardAttachmentDto: UpdateCardAttachmentDto) {
    return `This action updates a #${id} cardAttachment`;
  }

  async remove(id: string) {
    const { data, error } = await this.supabase.client
      .from('card_attachment')
      .select('id')
      .eq('id', id);
    if (error) {
      throw new BadRequestException(error.message);
    }
    if (data.length === 0) {
      throw new BadRequestException('Attachment not found');
    }

    //delelte from storage
    const { data: deletedFile, error: deleteFileError } =
      await this.supabase.client.storage
        .from('card_attachment')
        .remove([`${id}`]);

    const { data: deletedAttachment, error: deleteError } =
      await this.supabase.client
        .from('card_attachment')
        .delete()
        .eq('id', id)
        .select();
    if (deleteError) {
      throw new BadRequestException(deleteError.message);
    }
    return deletedAttachment;
  }
}
