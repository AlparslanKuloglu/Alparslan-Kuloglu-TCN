import { Column, Model, Table, ForeignKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Cart } from './cart.model';

@Table
export class User extends Model {

  @Column({ primaryKey: true, autoIncrement: true })
  user_id: number

  @Column
  email: string;

  @Column
  password: string;

  @HasMany(() => Cart)
  carts: Cart[];

}