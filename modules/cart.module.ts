import { Module, CacheModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from '../models/cart.model';
import { CartService } from '../services/cart.service';
import { CartController } from '../controllers/cart.controller';
import { ProductService } from 'services/product.service';
import { Product } from 'models/product.model';
import { Order } from 'models/order.model';
import { BullModule } from '@nestjs/bull';
import { CategoryService } from 'services/category.service';
import { Category } from 'models/category.model';


@Module({
  imports: [SequelizeModule.forFeature([Cart,Product,Order,Category]),
  CacheModule.register(),
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
  providers: [CartService,ProductService, CategoryService],
  controllers: [CartController],
  exports:[CartService]
})
export class CartModule{}