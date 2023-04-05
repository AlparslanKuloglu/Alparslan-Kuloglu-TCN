import { Column, Model, Table, ForeignKey, HasMany } from 'sequelize-typescript';
import { User } from '../models/user.model';
import { Cart } from '../models/cart.model';

@Table
export class Order extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  order_id: number;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @HasMany(() => Cart)
  products: Cart[] 

  @ForeignKey(() => User)
  @Column
  offer_id: number;

  @Column
  amount: number;

  @Column
  discounted_amount: number;
  
}