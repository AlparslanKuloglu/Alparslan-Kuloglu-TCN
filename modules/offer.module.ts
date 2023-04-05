import { CacheModule, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OfferController } from '../controllers/offer.controller';
import { OfferService } from '../services/offer.service';
import { Offer } from 'models/offer.model';
import { Product } from 'models/product.model';
import { ProductService } from 'services/product.service';
import { BullModule } from '@nestjs/bull';
import { CategoryService } from 'services/category.service';
import { Category } from 'models/category.model';

@Module({
  imports: [
  SequelizeModule.forFeature([Offer,Product, Category]),
  CacheModule.register(),
  BullModule.registerQueue({
    name: 'order',
  })
],
  providers: [OfferService,ProductService,CategoryService  ],
  controllers: [OfferController],
  exports:[OfferService,SequelizeModule]
})
export class OfferModule {}