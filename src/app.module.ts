import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, UserService, UserRepository, PrismaService],
})
export class AppModule {}
