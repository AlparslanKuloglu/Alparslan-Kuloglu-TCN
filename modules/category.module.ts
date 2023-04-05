import { Module, CacheModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BullModule } from '@nestjs/bull';
import { Category } from 'models/category.model';
import { CategoryService } from 'services/category.service';
import { CategoryController } from 'controllers/category_controller';
import { Product } from 'models/product.model';


@Module({
  imports: [SequelizeModule.forFeature([Category,Product]),
  BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    }
  }),
  BullModule.registerQueue({
    name: 'order',
  })
],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports:[SequelizeModule,CategoryService]
})
export class CategoryModule{}