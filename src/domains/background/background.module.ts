import { Module } from '@nestjs/common';
import { BackgroundService } from './background.service';
import { BackgroundController } from './background.controller';
import { SupabaseService } from "../../services/supabase/supabase.service";

@Module({
  controllers: [BackgroundController],
  providers: [BackgroundService,SupabaseService],
})
export class BackgroundModule {}
