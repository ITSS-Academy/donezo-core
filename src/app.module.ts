import {MiddlewareConsumer, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as process from 'node:process';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { BackgroundModule } from "./domains/background/background.module";
import { BoardModule } from "./domains/board/board.module";
import { BoardLabelModule } from "./domains/board_label/board_label.module";
import { CardModule } from "./domains/card/card.module";
import { CardAttachmentModule } from "./domains/card_attachment/card_attachment.module";
import { ChecklistItemModule } from "./domains/checklist-item/checklist-item.module";
import { CommentModule } from "./domains/comment/comment.module";
import { ListModule } from "./domains/list/list.module";
import { NotificationsModule } from "./domains/notifications/notifications.module";
import { UserModule } from "./domains/user/user.module";
import {AuthMiddleware} from "./middlewares/auth/auth.middleware";
import { AuthModule } from './middlewares/auth/auth.module';

dotenv.config()

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),
    BackgroundModule,
    BoardModule,
    BoardLabelModule,
    CardModule,
    CardAttachmentModule,
    ChecklistItemModule,
    CommentModule,
    ListModule,
    NotificationsModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}

