import { IsNotEmpty,IsEmail, IsString, IsNumber } from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @IsNumber()
  @IsNotEmpty()
  category_id: number

  @IsNotEmpty()
  @IsString()
  author: string

  @IsNumber()
  @IsNotEmpty()
  list_price: number

  @IsNumber()
  @IsNotEmpty()
  stock_quantity: number

}
