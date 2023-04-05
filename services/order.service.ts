import { Injectable ,HttpException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '../models/order.model';
import { ProductService } from './product.service';
import { Cart } from 'models/cart.model';
import { CartService } from './cart.service';


@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(Cart)
    private CartModel: typeof Cart,
    private readonly ProductService: ProductService,
  ) {}

  async findAll(): Promise<Order[]> {

    return this.orderModel.findAll({ include:[ Cart ] })
    }

  

   async findOne(order_id: number): Promise<Order> {

    const order = await this.orderModel.findOne({
      where: {
        order_id: order_id
      },
      include:[ Cart ]
    })

    if (! order) {

      throw new HttpException('Order not found',400)
      
    }

    return order
  }

  async create(detail) {

    const newOrder = await this.orderModel.create(detail)

    for (let i = 0; i < detail.productsInCart.length; i++) {
      
      const product = await this.ProductService.findOne(detail.productsInCart[i].product_id)
      product.stock_quantity -= detail.productsInCart[i].piece
      product.save()
      
    }

  
    this.CartModel.update({active:0,order_id: newOrder.order_id},{
      where: { user_id: detail.user_id , active:1}
    })


    return newOrder
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await order.destroy();
  }
}