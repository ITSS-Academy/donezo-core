import { Injectable } from '@nestjs/common';
import { SupabaseService } from "../../services/supabase/supabase.service";

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {
  }

  async login() {

  }
}
