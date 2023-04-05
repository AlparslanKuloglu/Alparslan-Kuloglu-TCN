import { Module,CacheModule } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BullModule } from '@nestjs/bull';
import { QueueService } from 'services/queue_service ';

import { UserModule } from '../modules/user.module';
import { ProductModule } from '../modules/product.module';
import { OrderModule } from '../modules/order.module';
import { CartModule } from '../modules/cart.module';
import { OfferModule } from '../modules/offer.module';
import { CategoryModule } from 'modules/category.module';

import { UserController } from '../controllers/user.controller';
import { ProductController } from '../controllers/product.controller';
import { OrderController } from '../controllers/order.controller';
import { CartController } from '../controllers/cart.controller';
import { OfferController } from '../controllers/offer.controller';

import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { CartService } from '../services/cart.service';
import { OfferService } from '../services/offer.service';

import { Cart } from '../models/cart.model';
import { Order } from '../models/order.model';
import { Offer } from '../models/offer.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { CategoryController } from 'controllers/category_controller';
import { CategoryService } from 'services/category.service';


@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12asd45ert',
      database: 'deneme',
      models: [Cart, Order, Offer, Product, User,],
      autoLoadModels: true, 
      synchronize: true,
    }),
    CacheModule.register({
      useFactory: async () => ({
        store: redisStore,
        host: 'localhost',
        port: 6379,
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'order',
    }),
    UserModule,
    ProductModule,
    OrderModule,
    CartModule,
    OfferModule,
    CategoryModule
  ],
  controllers: [ProductController, UserController, OrderController, OfferController, CartController,CategoryController],
  providers: [AppService, ProductService, UserService, OrderService, OfferService, CartService, QueueService, CategoryService],
})
export class AppModule {}
