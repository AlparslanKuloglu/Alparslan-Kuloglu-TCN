import { Column, Model, Table,ForeignKey, BelongsTo, Default  } from 'sequelize-typescript';
import { User }  from './user.model';
import { Product } from './product.model';
import { Order } from './order.model';

@Table
export class Cart extends Model {
  
  @Column({ primaryKey: true, autoIncrement: true })
  cart_id: Number;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @ForeignKey(() => Product)
  @Column
  product_id: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => Order)
  @Column
  order_id: number;

  @BelongsTo(() => Order)
  order: Order;

  @Column
  piece: number  

  @Column
  piecePrice: number

  @Column
  totalPrice: number;


  @Column({ defaultValue: 1 })
  active: number

  
}
