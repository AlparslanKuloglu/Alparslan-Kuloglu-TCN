import { Controller, Get, Post, Body, ValidationPipe , HttpException} from '@nestjs/common';
import { Param, UsePipes } from '@nestjs/common/decorators';
import { CartService } from '../services/cart.service';
import { ProductService } from 'services/product.service';
import {AddToCartDTO} from 'dto/addToCartDTO';

@Controller()
export class CartController {
  constructor(
  private readonly CartService: CartService,
  private readonly ProductService: ProductService
   ) {}


  @UsePipes(ValidationPipe) 
  @Post('addToCart')
 async addToCart (@Body()AddToCartDTO:AddToCartDTO ): Promise<string> {

 try {

   const product = await this.ProductService.findOne(AddToCartDTO.product_id)
    if (product.stock_quantity < AddToCartDTO.piece ) {
     throw new HttpException(`The quantity you want to buy is not available. Current stock:${product.stock_quantity}`, 400)
    }
    
    const productInCart = await this.CartService.findOne(AddToCartDTO.user_id,product.product_id) // Kullanıcının sepetinin ürünü içerip içermediğini kontrol ediyorum.


   
    if(productInCart){ // 

      if (productInCart.piece + AddToCartDTO.piece > product.stock_quantity ) { // Eğer kullanıcının sepetindeki mevcut ürün miktarı ile eklemek istediğinin toplamı ürünün klana stoğunu aşıyorsa ne kadar ekleyebileceğini hata olarak döndürüyorum.
        throw new HttpException(` The maximum amount you can add is ${product.stock_quantity - productInCart.piece }`, 400)
      }
     productInCart.piece += AddToCartDTO.piece  // Eğer sepet ürünü içeriyorsa ve stok da uygunsa adetini ve toplam fiyatlarını body'den gelen adet sayısına göre arttırıyorum.
     productInCart.totalPrice += AddToCartDTO.piece * productInCart.piecePrice
     productInCart.save() // kaydediyorum.
    }
    else { //içermiyorsa yeni bir cart datası oluşturuyorum.
      const newData = await this.CartService.create( // Parametrelerimi user_id, ürün id'si , adet ve ürünün adet fiyatı şeklinde sırayla giriyorum.   
         AddToCartDTO.user_id,
         product.product_id,
         AddToCartDTO.piece,
         product.list_price
         ) 

    }
    
      return "You have successfully added the product to the cart."

}
catch(error) {
  throw error
}
 } 

 @Get('getTheCart/:user_id')
 async getTheCart (@Param('user_id') user_id: number ): Promise<any> {
  const cart = await this.CartService.findAll(user_id)
  return cart
 } 

}