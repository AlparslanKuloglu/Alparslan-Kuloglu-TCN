import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Offer } from '../models/offer.model';
import { Product } from '../models/product.model';
import { CreateOfferDTO } from 'dto/createOfferDTO';
import { Cart } from 'models/cart.model';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ProductService } from './product.service';
import { Cache } from 'cache-manager';
import { error } from 'console';

@Injectable()
export class OfferService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Offer)
    private offerModel: typeof Offer,
    private readonly ProductService: ProductService
  ) {}

  async findAll(condition_type: string): Promise<Offer[]> {
    return this.offerModel.findAll({
      where: {
        condition_type:condition_type
      },
    });
  }


  findOne(id: number): Promise<Offer> {
    return this.offerModel.findOne({
      where: {
        id:id,
      },
    });
  }

  async create(offerDto: CreateOfferDTO): Promise<any> {
    try{

      if (offerDto.piece_condition < offerDto.discount_piece ) {
        throw error
      }

      const newOffer = new this.offerModel()
  
      newOffer.condition_type = offerDto.condition_type
      newOffer.author_condition = offerDto.author_condition
      newOffer.category_condition = offerDto.category_condition
      newOffer.piece_condition = offerDto.piece_condition
      newOffer.discount_piece = offerDto.discount_piece
      newOffer.total_condition = offerDto.total_condition
      newOffer.discount_percantage = offerDto.discount_percantage
      newOffer.condition_product_id = offerDto.condition_product_id
  
      let cacheName = offerDto.condition_type + "Offers"
      await this.cacheManager.del(cacheName) // Önbellekteki veriyi temizliyorum.
      newOffer.save()

      return newOffer

    } catch {
      throw new HttpException('Discount piece must be lower or equel to piece condition ', 400);
    }
}
  async remove(id: number): Promise<void> {
    const offer = await this.findOne(id);
    await offer.destroy();
  }

// A yazarından X kadar ürün alana Y kadar ürünü % C indirimli  
 async authorCondOfferDiscount (authorsInCart: Array<string>, authorsBooks : Array<Array<Cart>> , piecesAuthors : Array<number>  ): Promise<any> {

     // İndirim şartı, yalnızca belirli yazarın kitaplarını belirli sayıda almak olan kampanyaları cache'den çağırıyorum.   
     let offers: any =  await this.cacheManager.get('authorOffers')

     // Metotlarda hız sağlamak adına cacheManager ile kategori kampanyalarımı eğer önbellekte yoksa önbelleğe alıyorum. 
       if (!offers) {
         offers = await this.findAll('author')
         await this.cacheManager.set('authorOffers', offers, 300);
       }
  
    let topDiscount = 0
    let offer_id
  
    for (let i = 0; i < offers.length; i++) {

      let currentDiscount = 0
  
  // Kampanyanın koşul yazarının sepetteki ürünlerin yazarları arasında olup olmadığını kontrol ediyoruz ki içinde bulunmuyorsa boşuna işlem yapılmasın.     
      if (authorsInCart.includes(offers[i].dataValues.author_condition)) {
        //Gelen authorsInCart array'inde yazarımızın kaçıncı sırada olduğunu saptayıp authorsBooks arrayının index'inci elemanının uzunluğunu,yani o yazarın kaç ürününün sepette olduğunu bulduk. 
        let index = authorsInCart.indexOf(offers[i].dataValues.author_condition)
        let piece = piecesAuthors[index]
    
        //O yazara ait ürün adetinin kampanyanın koşul adetine uyup uymadığını kontrol ediyorum.  
        if (piece >= offers[i].dataValues.piece_condition) {
      
          // Kullanıcıya maksimum faydayı sağlayabilmek, en pahalı ürünlere öncelikli indirim uygulayabilmek için o yazara ait ürünleri "list_price" değerine göre büyükten küçüğe sıraladım.
          let sortedProducts = authorsBooks[index].sort((p1, p2) => (p1.dataValues.list_price < p2.dataValues.list_price) ? 1 : (p1.dataValues.list_price > p2.dataValues.list_price) ? -1 : 0)
          let leftDiscountPiece = offers[i].dataValues.discount_piece

          for (let s = 0; s < sortedProducts.length; s++) {

            if (sortedProducts[s].dataValues.piecePrice <= offers[i].dataValues.piece_condition ) {
              currentDiscount += ((sortedProducts[s].dataValues.piecePrice) * offers[i].dataValues.discount_percantage / 100 ) *  offers[i].dataValues.piece_condition 
              break
            } 
            
            if(leftDiscountPiece >= sortedProducts[s].dataValues.piece ) {
              currentDiscount += ((sortedProducts[s].dataValues.piecePrice) * offers[i].dataValues.discount_percantage / 100 ) * sortedProducts[s].dataValues.piece
              leftDiscountPiece -= sortedProducts[s].dataValues.piece
            }

            else {
              currentDiscount += ((sortedProducts[s].dataValues.piecePrice) * offers[i].dataValues.discount_percantage / 100 ) * leftDiscountPiece
              break
            }
          }
        }
      }
  
      // Mevcut indirimin mevcut en yüksek indirimden yüksek olup olmadığını kontrol ediyorum.Eğer yüksek ise mevcut en yüksek indirim'i mevcut indirime eşitliyorum.
      if (currentDiscount>topDiscount) {
  
        topDiscount = currentDiscount
        offer_id = offers[i].dataValues.offer_id
        
      }
      
    }
    // Döngüden çıkan en yüksek indirim değerini return ediyorum.
    return {topDiscount:topDiscount,offer_id:offer_id}
    
    }

// A yazarından X kadar ürün alana Y kadar ürünü % C indirimli  
async categoryCondOfferDiscount (categorysInCart: Array<string>, categorysBooks : Array<Array<Cart>> , piecesCategories : Array<number>  ): Promise<any> {

  // İndirim şartı, yalnızca belirli bir kategoriden belirli sayıda almak olan kampanyaları cache'den çağırıyorum.   
    let offers: any =  await this.cacheManager.get('categoryOffers')

  // Metotlarda hız sağlamak adına cacheManager ile kategori kampanyalarımı eğer önbellekte yoksa önbelleğe alıyorum. 
    if (!offers) {
      offers = await this.findAll('category')
      await this.cacheManager.set('categoryOffers', offers, 300);
    }
  
    let topDiscount = 0
    let offer_id
  
    for (let i = 0; i < offers.length; i++) {
  
      let currentDiscount = 0
  
  // Kampanyanın koşul yazarının sepetteki ürünlerin yazarları arasında olup olmadığını kontrol ediyoruz ki içinde bulunmuyorsa boşuna işlem yapılmasın.     
      if (categorysInCart.includes(offers[i].dataValues.category_condition)) {

        //Gelen categorysInCart array'inde yazarımızın kaçıncı sırada olduğunu saptayıp authorsBooks arrayının index'inci elemanının uzunluğunu,yani o yazarın kaç ürününün sepette olduğunu bulduk. 
        let index = categorysInCart.indexOf(offers[i].dataValues.category_condition)
        let piece = piecesCategories[index]
      
        //O yazara ait ürün adetinin kampanyanın koşul adetine uyup uymadığını kontrol ediyorum.  
        if (piece >= offers[i].dataValues.piece_condition) {
       
        // Kullanıcıya maksimum faydayı sağlayabilmek, en pahalı ürünlere öncelikli indirim uygulayabilmek için o yazara ait ürünleri "list_price" değerine göre büyükten küçüğe sıraladım.
          let sortedProducts = categorysBooks[index].sort((p1, p2) => (p1.dataValues.list_price < p2.dataValues.list_price) ? 1 : (p1.dataValues.list_price > p2.dataValues.list_price) ? -1 : 0)
          let leftDiscountPiece = offers[i].dataValues.discount_piece

          for (let s = 0; s < sortedProducts.length; s++) {
            if (sortedProducts[s].dataValues.piecePrice <= offers[i].dataValues.piece_condition ) {
              currentDiscount += ((sortedProducts[s].dataValues.piecePrice) * offers[i].dataValues.discount_percantage / 100 ) *  offers[i].dataValues.piece_condition 
              break  
            } 
            if(leftDiscountPiece >= sortedProducts[s].dataValues.piece ) {
              currentDiscount += ((sortedProducts[s].dataValues.piecePrice) * offers[i].dataValues.discount_percantage / 100 ) * sortedProducts[s].dataValues.piece
              leftDiscountPiece -= sortedProducts[s].dataValues.piece
            }
            else {
              currentDiscount += ((sortedProducts[s].dataValues.piecePrice) * offers[i].dataValues.discount_percantage / 100 ) * leftDiscountPiece
              break
            }
          }
        }
      }
      // Mevcut indirimin mevcut en yüksek indirimden yüksek olup olmadığını kontrol ediyorum.Eğer yüksek ise mevcut en yüksek indirim'i mevcut indirime eşitliyorum.
      if (currentDiscount>topDiscount) {
        topDiscount = currentDiscount
        offer_id = offers[i].dataValues.offer_id
      }
      
    }
    // Döngüden çıkan en yüksek indirim değerini return ediyorum.
    return {topDiscount:topDiscount,offer_id:offer_id}
    
    }    
  
  // A yazarının B kategorisinden X kadar ürün alana Y kadar ürünü % C indirimli  
    async authorNCategoryCondOfferDiscount (authorsInCart: Array<string>, authorsBooks : Array<Array<Cart>> ,  piecesAuthors : Array<number> ): Promise<any> {
  
    // İndirim şartı, yalnızca belirli yazarın kitaplarını belirli sayıda almak olan kampanyaları cache'den çağırıyorum.   
      let offers : any =  await this.cacheManager.get('author&categoryOffers')
    // Metotlarda hız sağlamak adına cacheManager ile kategori kampanyalarımı eğer önbellekte yoksa önbelleğe alıyorum. 
      if (!offers) {
        offers = await this.findAll('author&category')
        await this.cacheManager.set('author&categoryOffers', offers, 300);
      }
  
      let topDiscount = 0
      let offer_id
  
      for (let i = 0; i < offers.length; i++) {
  
        let currentDiscount = 0
        // Kampanyanın koşul yazarının sepetteki ürünlerden birinin yazarı olup olmadığına bakıyorum. 
        if (authorsInCart.includes(offers[i].dataValues.author_condition)) {
    
          // Yukarıdaki fonksiyonda yaptığım gibi authorsInCart arrayide yazarımızın kaçıncı sırada olduğunu bulup sepette kendisinin kaç kitabı olduğunu bulduk.
          let index = authorsInCart.indexOf(offers[i].dataValues.author_condition)
          let piece = piecesAuthors[index]
          let conditionCategoryPiece = 0
  
          //Eğer mevcut yazarın kitaplarının adeti koşul adetine eşitse ya da daha fazlaysa işleme devam ediyorum.
          if (piece >= offers[i].dataValues.piece_condition) {
  
            let a = await authorsBooks[0]
    
            //Mevcut yazarın kitaplarını map döngüsüne sokup koşul kategorisine kaçının uyduğunu hesaplıyorum.
            await Promise.all(authorsBooks[index].map(async element => {
              const categoryTitle = await element.product.dataValues.category_title;
              const categoryCondition = offers[i].dataValues.category_condition
              if (categoryTitle === categoryCondition ) {
                conditionCategoryPiece += element.piece
              }
            }))

          }
  
          // Eğer koşul kategorisinden koşul adetince ya da daha fazla sayıda kitap bulunuyorsa indirimi hesaplamaya başlıyorum.
          if (conditionCategoryPiece >= offers[i].dataValues.piece_condition) {

            // Koşul yazarına ait ürünlerin bulunduğu array'den koşul kategorisine uyan ürünleri filtreliyorum çünkü indirim yalnızca onlara uygulanacak.
            const filteredArray = authorsBooks[index].filter(async obj => await obj.product.category_title === offers[i].dataValues.category_condition)

            // Kullanıcıya en fazla faydayı sağlamak için filterelenmiş arrayimdeki objeleri fiyatına göre büyükten küçüğe sıralıyorum.
            let sortedProducts = filteredArray.sort((p1, p2) => p1.product.list_price < p2.product.list_price ? 1 : (p1.product.list_price > p2.product.list_price) ? -1 : 0);
  
            let leftDiscountPiece = offers[i].dataValues.discount_piece

            for (let s = 0; s < sortedProducts.length; s++) {

            if (sortedProducts[s].dataValues.piecePrice <= offers[i].dataValues.piece_condition ) {
              currentDiscount += ((sortedProducts[s].dataValues.piecePrice) * offers[i].dataValues.discount_percantage / 100 ) *  offers[i].dataValues.piece_condition 
              break
            } 
            
            if(leftDiscountPiece >= sortedProducts[s].dataValues.piece ) {
              currentDiscount += ((sortedProducts[s].dataValues.piecePrice) * offers[i].dataValues.discount_percantage / 100 ) * sortedProducts[s].dataValues.piece
              leftDiscountPiece -= sortedProducts[s].dataValues.piece
            }
            else {
              currentDiscount += ((sortedProducts[s].dataValues.piecePrice) * offers[i].dataValues.discount_percantage / 100 ) * leftDiscountPiece
              break
            }
          }
              // Mevcut indirimin mevcut en yüksek indirimden yüksek olup olmadığını kontrol ediyorum.Eğer yüksek ise mevcut en yüksek indirim'i mevcut indirime eşitliyorum.
            if (currentDiscount>topDiscount) {
             topDiscount = currentDiscount
             offer_id = offers[i].dataValues.offer_id
            }
          }
        }
      }
    //En yüksek indirim değerini dönüyorum.
    return {topDiscount:topDiscount,offer_id:offer_id}
      
    }
  
  
  // X TL'LİK ALIŞVERİŞE % Y TL İNDİRİM
    async totalCondOfferDiscount (totalPrice: number ): Promise<any> {
      let topDiscount =0
      let offer_id
      // Koşul türü "total", yani sepette belli bir tutarı geçmek olan kampanyaları bulduk.
      const offers = await this.findAll("total")
  
      for (let i = 0; i < offers.length; i++) {
        let currentDiscount = 0
        if (offers[i].dataValues.condition_type === "total" && totalPrice >= offers[i].dataValues.total_condition) {
          currentDiscount = (totalPrice * offers[i].dataValues.discount_percantage) / 100
        }
  
    // Mevcut indirimin mevcut en yüksek indirimden yüksek olup olmadığını kontrol ediyorum.Eğer yüksek ise mevcut en yüksek indirim'i mevcut indirime eşitliyorum.
      if (currentDiscount>topDiscount) {
        topDiscount = currentDiscount
        offer_id = offers[i].dataValues.offer_id
      }
      }
      return {topDiscount:topDiscount,offer_id:offer_id}
    }

    // A kategorisinden Y kadar ürün alana X kadar ürün % C indirimli  
async categoryConditionOfferDiscount (categorysInCart: Array<string>, categorysBooks : Array<Array<Product>>  ): Promise<any> {

  // İndirim şartı, yalnızca belirli bir kategorinin kitaplarını belirli sayıda almak olan kampanyaları bulduk.   
    const offers = await this.findAll("category")
    let topDiscount = 0
    let offer_id
    for (let i = 0; i < offers.length; i++) {
      let currentDiscount = 0
      // Kampanyanın koşul kategorisinin sepetteki ürünlerin kategorileri arasında olup olmadığını kontrol ediyoruz ki içinde bulunmuyorsa boşuna işlem yapılmasın.     
      if (categorysInCart.includes(offers[i].dataValues.author_condition)) {

        //Gelen categorysInCart array'inde kategorinin kaçıncı sırada olduğunu saptayıp categorysBooks arrayının index'inci elemanının uzunluğunu,yani o kategoriden kaç ürününün sepette olduğunu bulduk. 
        let index = categorysInCart.indexOf(offers[i].dataValues.author_condition)
        let piece = categorysBooks[index].length
  
        //O yazara ait ürün adetinin kampanyanın koşul adetine uyup uymadığını kontrol ediyorum.  
        if (piece >= offers[i].dataValues.piece_condition) {
  
          // Kullanıcıya maksimum faydayı sağlayabilmek, en pahalı ürünlere öncelikli indirim uygulayabilmek için o kategoriye ait sepetteki ürünleri "list_price" değerine göre büyükten küçüğe sıraladım.
          let sortedProducts = categorysBooks[index].sort((p1, p2) => (p1.list_price < p2.list_price) ? 1 : (p1.list_price > p2.list_price) ? -1 : 0)
  
          // Kampanyanın maksimum indirim adetince döngüye sokup en pahalıdan başlayarak indirim hesaplıyorum. 
          let leftDiscountPiece = offers[i].dataValues.discount_piece

          for (let s = 0; s < sortedProducts.length; s++) {

            if (sortedProducts[s].dataValues.piecePrice <= offers[i].dataValues.piece_condition ) {
              currentDiscount += ((sortedProducts[s].dataValues.piecePrice) * offers[i].dataValues.discount_percantage / 100 ) *  offers[i].dataValues.piece_condition 
              break  
            } 
        
            if(leftDiscountPiece >= sortedProducts[s].dataValues.piece ) {

              currentDiscount += ((sortedProducts[s].dataValues.piecePrice) * offers[i].dataValues.discount_percantage / 100 ) * sortedProducts[s].dataValues.piece
              leftDiscountPiece -= sortedProducts[s].dataValues.piece

            }
            else {
              currentDiscount += ((sortedProducts[s].dataValues.piecePrice) * offers[i].dataValues.discount_percantage / 100 ) * leftDiscountPiece
              break
            }
          }
        }
      }
  
      // Mevcut indirimin mevcut en yüksek indirimden yüksek olup olmadığını kontrol ediyorum.Eğer yüksek ise mevcut en yüksek indirim'i mevcut indirime eşitliyorum.
      if (currentDiscount>topDiscount) {
        topDiscount = currentDiscount
        offer_id = offers[i].dataValues.offer_id
      }
    }

    // Döngüden çıkan en yüksek indirim değerini return ediyorum.
    return {topDiscount:topDiscount,offer_id:offer_id}
    
    }


 // A yazarından X kadar ürün alana Y kadar ürünü % C indirimli  
 async productConditionOfferDiscount (authorsBooks : Array<Array<Cart>>  ): Promise<any> {

    // İndirim şartı, yalnızca belirli üründen belirli sayıda almak olan kampanyaları cache'den çağırıyorum.   
    let offers : any =  await this.cacheManager.get('productOffers')

  // Metotlarda hız sağlamak adına cacheManager ile kategori kampanyalarımı eğer önbellekte yoksa önbelleğe alıyorum. 
    if (!offers) {
      offers = await this.findAll('product')
      await this.cacheManager.set('productOffers', offers, 300);
    }
    
    let products = []
    let pieces_products = []
    let currentDiscount = 0
    let topDiscount = 0
    let offer_id = 0

    authorsBooks.forEach(element => {

      element.forEach(e => {

        products.push(e.product_id)
        pieces_products.push(e.piece)
        
      })
      
    })

    for (let i = 0; i < offers.length; i++) {

      let condition_product_id = offers[i].dataValues.condition_product_id
      let condition_piece = offers[i].dataValues.piece_condition

      if (products.includes(condition_product_id)) {
        let index = products.indexOf(condition_product_id)
        let piece = pieces_products[index]

        if (piece >= condition_piece) {
          let product = await this.ProductService.findOne(condition_product_id)
          currentDiscount = ((product.list_price) * offers[i].dataValues.discount_percantage / 100 ) * offers[i].dataValues.discount_piece
        }

        if (currentDiscount>topDiscount) {
  
          topDiscount = currentDiscount
          offer_id = offers[i].dataValues.offer_id
          
        }
      }
    }
    // Döngüden çıkan en yüksek indirim değerini return ediyorum.
    return {topDiscount:topDiscount,offer_id:offer_id}
    
    }
 
}