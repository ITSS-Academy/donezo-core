import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { SupabaseService } from "../../services/supabase/supabase.service";

@Module({
  controllers: [BoardController],
  providers: [BoardService,SupabaseService],
  imports: [TypeOrmModule.forFeature([Board]), ],
})
export class BoardModule {}
