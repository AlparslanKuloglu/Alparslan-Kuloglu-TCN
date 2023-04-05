import { IsNotEmpty,IsNumber } from 'class-validator';

export class UpdateStokDTO {

  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsNotEmpty()
  @IsNumber()
  stock_quantity: number

}
