import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [PrismaModule, UsersModule,PostsModule,LikesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
