import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseService } from "../../services/supabase/supabase.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService,SupabaseService],
})
export class AuthModule {}
