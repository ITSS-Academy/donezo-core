import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Card } from '../card/entities/card.entity';
import { SupabaseService } from "../../services/supabase/supabase.service";

@Module({
  controllers: [ListController],
  providers: [ListService,SupabaseService],
  imports: [TypeOrmModule.forFeature([List, Card]),],
})
export class ListModule {}
