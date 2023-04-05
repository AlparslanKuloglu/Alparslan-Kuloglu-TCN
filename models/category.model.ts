import { Column, Model, Table, ForeignKey, HasOne, BelongsTo, HasMany } from 'sequelize-typescript';
import { Product } from './product.model';

@Table
export class Category extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  category_id: number;

  @Column
  title: String; 

  @HasMany(() => Product)
  products: Product[]

}