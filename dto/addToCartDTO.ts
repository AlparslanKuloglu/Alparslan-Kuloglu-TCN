import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddToCartDTO {

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @IsNotEmpty()
  @IsNumber()
  piece: number  

}
