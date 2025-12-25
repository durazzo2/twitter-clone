// src/app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { RetweetsModule } from './retweets/retweets.module';
import { PrismaModule } from './prisma/prisma.module';
import { FeedModule } from './feed/feed.module';
import { CommentsModule } from './comments/comments.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    LikesModule,
    RetweetsModule,
    FeedModule,
    CommentsModule,
  ],
})
export class AppModule {}
