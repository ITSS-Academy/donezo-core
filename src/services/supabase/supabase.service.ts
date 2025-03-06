import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  )

  get client() {
    return this.supabase
  }
  constructor() {
  }
}
