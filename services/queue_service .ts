import { Process, Processor, OnQueueActive  } from '@nestjs/bull';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Job } from 'bull';
import { OrderService } from 'services/order.service';
import { Cache } from 'cache-manager';

@Processor('order')
export class QueueService {
  @Inject(CACHE_MANAGER) private cacheManager: Cache
  constructor(
    private readonly OrderService: OrderService,

  ) {}
  @Process('createOrder')
  async createOrder(job: Job) {

    const orderDetail = {
      user_id: job.data.user_id,
      offer_id : job.data.bestOffer.offer_id,
      productsInCart: job.data.productsInCart,
      amount: job.data.totalPrice,
      discounted_amount: (job.data.totalPrice) - (job.data.bestOffer.topDiscount) 
    }

   const newOrder = await this.OrderService.create(orderDetail)

  }



}