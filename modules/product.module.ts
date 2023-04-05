import { Module, CacheModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from '../models/product.model';
import { ProductController } from '../controllers/product.controller';
import { CartController } from '../controllers/cart.controller';
import { ProductService } from '../services/product.service';
import { CartService } from 'services/cart.service';
import { Cart } from 'models/cart.model';
import { Offer } from 'models/offer.model';
import { BullModule } from '@nestjs/bull';
import { Category } from 'models/category.model';
import { CategoryService } from 'services/category.service';
import { UserService } from 'services/user.service';
import { User } from 'models/user.model';


@Module({
  imports: [SequelizeModule.forFeature([Product,Cart,Offer,Category, User]),
  CacheModule.register(),
  BullModule.registerQueue({
    name: 'order',
  })
],
  providers: [ProductService,CartController,CartService,CategoryService,CategoryService, UserService ],
  controllers: [ProductController],
  exports : [SequelizeModule,ProductService,SequelizeModule]
})
export class ProductModule {}