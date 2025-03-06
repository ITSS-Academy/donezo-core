import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SupabaseService } from "../../services/supabase/supabase.service";

@Injectable()
export class UserService {
  constructor(private supabase: SupabaseService) {}

  async search(email: string) {
    const { data, error } = await this.supabase.client
      .from('user')
      .select('*')
      .eq('email', email);

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }
}
