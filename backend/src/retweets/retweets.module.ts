import {Module} from '@nestjs/common';
import {RetweetsController} from './retweets.controller';
import {RetweetsService} from './retweets.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RetweetsService],
  controllers: [RetweetsController],
  exports: [RetweetsService],
})
export class RetweetsModule {}