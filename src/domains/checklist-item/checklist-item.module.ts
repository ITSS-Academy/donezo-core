import { Module } from '@nestjs/common';
import { ChecklistItemService } from './checklist-item.service';
import { ChecklistItemController } from './checklist-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistItem } from './entities/checklist-item.entity';
import { Card } from '../card/entities/card.entity';
import { SupabaseService } from '../../services/supabase/supabase.service';

@Module({
  controllers: [ChecklistItemController],
  providers: [ChecklistItemService,SupabaseService],
  imports: [TypeOrmModule.forFeature([ChecklistItem, Card])],
})
export class ChecklistItemModule {}
