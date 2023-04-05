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
import { UserService } from 'services/user.service';
import { User } from 'models/user.model';


@Module({
  imports: [SequelizeModule.forFeature([Cart,Product,Order,Category, User, ]),
  CacheModule.register(),
  BullModule.registerQueue({
    name: 'order',
  })
],
  providers: [CartService,ProductService, CategoryService, UserService],
  controllers: [CartController],
  exports:[CartService]
})
export class CartModule{}