import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { RetweetsModule } from './retweets/retweets.module';

@Module({
  imports: [PrismaModule, UsersModule,PostsModule,LikesModule,RetweetsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
