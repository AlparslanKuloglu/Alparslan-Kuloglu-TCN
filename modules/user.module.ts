import { Module,CacheModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [SequelizeModule.forFeature([User]),
  CacheModule.register(),
  BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }),
  BullModule.registerQueue({
    name: 'order',
  })
],
  exports: [SequelizeModule, UserService],
  providers: [UserService,]
})
export class UserModule {}