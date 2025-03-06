import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from "../../services/supabase/supabase.service";
import * as admin from 'firebase-admin';
import * as process from 'node:process';
import * as dotenv from 'dotenv';

dotenv.config();
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

@Injectable()
export class AuthService {
  constructor(private supabase: SupabaseService) {

  }

  async login(accessToken: any) {
    let decodedUser;
    console.log(accessToken);
    try {
      const decodedToken = await admin.auth().verifyIdToken(accessToken);
      console.log(decodedToken);
      decodedUser = decodedToken;
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException('Invalid token');
    }

    const { data: existingUser, error: findError } = await this.supabase.client
      .from('user')
      .select()
      .eq('id', decodedUser.uid)
      .single();

    if (!existingUser) {
      const { data, error: insertError } = await this.supabase.client
        .from('user')
        .insert([
          {
            id: decodedUser.uid,
            name: decodedUser.name,
            email: decodedUser.email,
            photoUrl: decodedUser.picture,
          },
        ]);

      if (insertError) {
        throw new BadRequestException(insertError.message);
      }
    }
    return existingUser;
  }
}