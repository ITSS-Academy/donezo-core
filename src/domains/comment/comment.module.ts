import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Card } from '../card/entities/card.entity';
import { SupabaseService } from "../../services/supabase/supabase.service";

@Module({
  controllers: [CommentController],
  providers: [CommentService,SupabaseService],
  imports: [TypeOrmModule.forFeature([Comment, Card]),],
})
export class CommentModule {}
