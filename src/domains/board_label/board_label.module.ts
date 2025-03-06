import { Module } from '@nestjs/common';
import { BoardLabelService } from './board_label.service';
import { BoardLabelController } from './board_label.controller';
import { SupabaseService } from "../../services/supabase/supabase.service";

@Module({
  controllers: [BoardLabelController],
  providers: [BoardLabelService,SupabaseService],
})
export class BoardLabelModule {}
