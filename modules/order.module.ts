import { Module, CacheModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from '../models/order.model';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../services/order.service';
import { CartService } from 'services/cart.service';
import { Cart } from 'models/cart.model';
import { OfferService } from 'services/offer.service';
import { Offer } from 'models/offer.model';
import { ProductService } from 'services/product.service';
import { Product } from 'models/product.model';
import { BullModule } from '@nestjs/bull';
import { CategoryService } from 'services/category.service';
import { Category } from 'models/category.model';

@Module({
  imports:[
  SequelizeModule.forFeature([Order,Cart, Offer, Product, Category]),
  CacheModule.register(),  
  BullModule.registerQueue({
    name: 'order',
  })
 ],
  controllers: [OrderController],
  providers: [OrderService, CartService, OfferService, ProductService, CategoryService ],
  exports:[SequelizeModule]
})
export class OrderModule {}