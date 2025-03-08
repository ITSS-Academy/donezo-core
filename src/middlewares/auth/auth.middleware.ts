import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization;
    console.log('asdasd',token);

    if (!token) {
      throw new UnauthorizedException('Authorization token not found');
    }


    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      console.log('decodedToken',decodedToken);
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
