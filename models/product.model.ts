import { Column, Model, Table,HasMany, BelongsTo, BelongsToMany, HasOne, ForeignKey } from 'sequelize-typescript';
import { Cart } from './cart.model';
import { Offer } from './offer.model';
import { Category } from './category.model';


@Table
export class Product extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  product_id: number;

  @Column
  title: string;

  @ForeignKey(() => Category)
  @Column
  category_id: number;

  @Column
  category_title: string;

  @HasMany(() => Cart)
  carts: Cart[];

  @HasMany(() => Offer)
  offers: Offer[];

  @Column
  author: string;

  @Column
  list_price: number;
  
  @Column
  stock_quantity: number;

}



