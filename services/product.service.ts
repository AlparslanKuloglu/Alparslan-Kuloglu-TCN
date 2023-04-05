import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../models/product.model';
import { CreateProductDTO } from 'dto/createProductDTO';
import { Category } from 'models/category.model';
import { CategoryService } from './category.service';
import { error } from 'console';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    private CategoryService: CategoryService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  async findOne(product_id:number ): Promise<Product> {

    return this.productModel.findOne({
      where: {
        product_id:product_id,
      },
    });
  }

  async potancialProduct(title:string, author:string ): Promise<Product> {

    return this.productModel.findOne({
      where: {
        title:title,
        author : author
      },
    });
  }

  async create(productDto:CreateProductDTO ): Promise<Product> {

    try {
      const potancialProduct = await this.potancialProduct(productDto.title,productDto.author)

      if(potancialProduct){ throw error }


   let category = await this.CategoryService.findOne(productDto.category_id)
   let category_title = category.dataValues.title

    return this.productModel.create({
      title: productDto.title,
      category_id: productDto.category_id,
      category_title:category_title,
      list_price: productDto.list_price,
      author: productDto.author,
      stock_quantity: productDto.stock_quantity
    });
  }

  catch {
    throw new HttpException('Product title should be unique to the author ', 400);
  }

  }

  async updateStok(product_id:number, stok:number ): Promise<Product> {
    try {
    const product = await this.productModel.findOne({
      where: {
        product_id:product_id,
      },
    })

    if (! product) {
      throw error
    }

    product.stock_quantity = stok
    product.save()

    return product

   } catch {

    throw new HttpException('Product not found', 400);
  }

  }
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await product.destroy();
  }
}