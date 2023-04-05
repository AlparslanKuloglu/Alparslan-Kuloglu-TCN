import { Controller, Get, HttpException, Req } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { OfferService } from '../services/offer.service';
import { Param } from '@nestjs/common/decorators';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { OrderService } from 'services/order.service';
import { error } from 'console';


@Controller()
export class OrderController {
  constructor(
    @InjectQueue('order') private orderQueue: Queue,
    private readonly CartService: CartService,
    private readonly OfferService: OfferService,
    private readonly OrderService: OrderService,
  ) { }

  @Get("/createOrder/:user_id")
  async createOrder (@Param('user_id') user_id: number): Promise<any> {

    try{

   const response  = await this.CartService.getAuthorsAndProductsAndTotalPrice(user_id)


   let totalPrice = response.totalPrice

   if (totalPrice===0) {

    throw new HttpException('In order to place an order, you need to add a product to your cart.', 400);
    
   }

   let productsInCart = response.productsInCart
   let authorsInCart = response.authorsInCart
   let piecesAuthors = response.piecesAuthors
   let authorsBooks = response.authorsBooks

   let categorysInCart = response.categorysInCart
   let piecesCategories = response.piecesCategories
   let categorysBooks = response.categorysBooks

   const authorTypeOffersTopDiscount = await this.OfferService.authorCondOfferDiscount(authorsInCart,authorsBooks,piecesAuthors)
   const categoryTypeOffersTopDiscount = await this.OfferService.categoryCondOfferDiscount(categorysInCart,categorysBooks,piecesCategories)
   const productConditionOfferDiscount = await this.OfferService.productConditionOfferDiscount(authorsBooks)
   const authorNcategoryTypeOffersTopDiscount = await this.OfferService.authorNCategoryCondOfferDiscount(authorsInCart,authorsBooks,piecesAuthors)
   const totalTypeOffersTopDiscount = await this.OfferService.totalCondOfferDiscount(totalPrice)

   const offers = [
    productConditionOfferDiscount,
    authorTypeOffersTopDiscount,
    categoryTypeOffersTopDiscount,
    authorNcategoryTypeOffersTopDiscount,
    totalTypeOffersTopDiscount
  ]

  // En fazla indirim sağlayan kampanyayı seçmek için topDiscount değerine göre sıralıyorum.
   let sortedOffers = offers.sort((p1, p2) => (p1.topDiscount < p2.topDiscount) ? 1 : (p1.topDiscount > p2.topDiscount) ? -1 : 0)
   let bestOffer = sortedOffers[0]

   await this.orderQueue.add('createOrder', {
    user_id: Number(user_id),
    productsInCart: productsInCart,
    totalPrice: totalPrice, 
    bestOffer: bestOffer,
  });

  return [
    productConditionOfferDiscount,
    authorTypeOffersTopDiscount,
    categoryTypeOffersTopDiscount,
    authorNcategoryTypeOffersTopDiscount,
    totalTypeOffersTopDiscount
  ]

}
catch(error) {

  throw error

}

  }


  @Get("/getOrder/:order_id")
  async getOrder (@Param('order_id') order_id: number): Promise<any> { 

    try{

    const order = await this.OrderService.findOne(order_id)

    return order

  }
  catch (error) {

    throw error

  }

  }



  @Get("/getAllOrders")
  async getAllOrders (): Promise<any> { 

    const orders = await this.OrderService.findAll()


    return orders

  }





}