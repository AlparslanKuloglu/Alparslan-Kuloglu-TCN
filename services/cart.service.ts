import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { Cache } from 'cache-manager';

@Injectable()
export class CartService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Cart)
    private cartModel: typeof Cart
  ) {}

  async findAll(user_id:number): Promise<Cart[]> {
    return await this.cartModel.findAll({
      where: {
        user_id: user_id,
        active:1
    },
    include: [ Product ]
    });
  }

  async findOne(user_id: number,product_id:number): Promise<Cart> {
    return await this.cartModel.findOne({
      where: {
        user_id:user_id,
        product_id: product_id,
        active:1
      },
      include: [ Product ]
    });
  }

  async create(user_id: number, product_id:number, piece:number,piecePrice:number): Promise<Cart> {
    return this.cartModel.create({
      user_id: user_id,
      product_id: product_id,
      piece:piece,
      piecePrice: piecePrice,
      totalPrice : piece * piecePrice

    })
  }

// Bu metot controllerda kategori,yazar ve kategori&yazar koşullu kampanyalar kontrol edilebilsin diye kullanıcının sepetinde hangi yazar ve kategorilere ait kitaplar olduğunu saptıyor.
  async getAuthorsAndProductsAndTotalPrice(user_id: number): Promise<any> {

  let productsInCart = await this.findAll(user_id)


  let authorsInCart = [] 
  let piecesAuthors = []
  let authorsBooks = []

  let categorysInCart = [] 
  let piecesCategories = []
  let categorysBooks = []

  let totalPrice = 0      

  for (let i = 0; i < productsInCart.length; i++) {

    totalPrice += productsInCart[i].totalPrice

    if (!(authorsInCart.includes(await productsInCart[i].product.author))) {

      authorsInCart.push(await productsInCart[i].product.author)
      piecesAuthors.push(await productsInCart[i].piece)
      authorsBooks.push([productsInCart[i]])

    } else {

      let index = authorsInCart.indexOf(productsInCart[i].product.author)
      piecesAuthors[index] += await productsInCart[i].piece
      authorsBooks[index].push(productsInCart[i])

    }

    if (!(categorysInCart.includes(await productsInCart[i].product.category_title))) {
      
      categorysInCart.push(await productsInCart[i].product.category_title)
      piecesCategories.push(await productsInCart[i].piece)
      categorysBooks.push([productsInCart[i]])

    } else {

      let index = categorysInCart.indexOf(productsInCart[i].product.category_title)
      piecesCategories[index] += await productsInCart[i].piece
      categorysBooks[index].push(productsInCart[i])

    }

  }

  const response = {
    productsInCart:productsInCart,
    authorsInCart:authorsInCart, 
    piecesAuthors: piecesAuthors,
    authorsBooks:authorsBooks,
    categorysInCart: categorysInCart,
    piecesCategories: piecesCategories,
    categorysBooks: categorysBooks,
    totalPrice 
    //Toplam tutar koşullu indirimlerde kontrolünün yapılması için totalPrice'ı da hesaplatıp döndürüyorum.
  }

// Response içinde authorsInCart şöyle bir array olacaktır:
// ["Peyami Safa","Stephan Hawking"]
// Response'un diğer arrayi  arrayi ise diğer arraya indexli arrayler içerir, içlerindeyse Cart modeline ait nesneler bulunur:
// [ 1, 3 ]
// Bu iki array indexleriyle eşleşerek Peyami Safa'nın 1, Stephan Hawking'in ise 3 kitabının sepette olduğunu gösterir.
// ÖRN: authorsInCart: ["Peyami Safa","Stephan Hawking"]
//        piecesAuthors  [  1    ,  3    ]
//        authorsBooks:  [ [obj] , [obj,obj,obj]  ]
// Ve aynı zamanda authorsBooks arrayi de array içinde sepetteki yazarlara indexle ürünleri tutar.
// Sepetteki kategoriler ve kategori ürünleri de aynı şekilde bir yapıdadır.
  return response

  }


}