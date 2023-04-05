import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from '../services/queue_service '
import { OrderService } from '../services/order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Offer } from 'models/offer.model';
import { Order } from 'models/order.model';
import { Product } from 'models/product.model';
import { User } from 'models/user.model';
import { Category } from 'models/category.model';
import { Cart } from 'models/cart.model';
import { OfferService } from 'services/offer.service';
import { ProductService } from 'services/product.service';
import { UserService } from 'services/user.service';
import { CategoryService } from 'services/category.service';
import { CartService } from 'services/cart.service';
@Module({
  imports: [
    SequelizeModule.forFeature([Offer,Order,Product,User,Category,Cart]),
    BullModule.registerQueue({
      name: 'order'
    }),
    ],
    providers:[QueueService,OrderService,OfferService,OrderService,ProductService,UserService,CategoryService,CartService]
})
export class BullQueueModule {}