import { Controller, Get, Body, Post, ValidationPipe  } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { UsePipes } from '@nestjs/common/decorators';
import { ProductService } from '../services/product.service';
import { CreateProductDTO } from 'dto/createProductDTO';
import { UpdateStokDTO } from 'dto/updateStokDTO';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
@Controller()
export class ProductController {
  constructor(private readonly ProductService: ProductService) {}

  @UsePipes(ValidationPipe) 
  @Post("/createProduct")
  async createProduct ( @Body() CreateProductDTO:CreateProductDTO ): Promise<any> {
    try {
      let product = await this.ProductService.create(CreateProductDTO);
      return product
    } catch(error) {
      throw error
    }
   }

   @UsePipes(ValidationPipe) 
   @Post("updateProductStok")
   async updateProductSok ( @Body() UpdateStokDTO:UpdateStokDTO ): Promise<any> {
    try {
      let product = await this.ProductService.updateStok(UpdateStokDTO.product_id,UpdateStokDTO.stock_quantity);
      return product
    } 
    catch(error) {
      throw error
    }
   }
}