import { Module } from '@nestjs/common';
import { CardAttachmentService } from './card_attachment.service';
import { CardAttachmentController } from './card_attachment.controller';
import { SupabaseService } from "../../services/supabase/supabase.service";

@Module({
  controllers: [CardAttachmentController],
  providers: [CardAttachmentService,SupabaseService],
})
export class CardAttachmentModule {}
