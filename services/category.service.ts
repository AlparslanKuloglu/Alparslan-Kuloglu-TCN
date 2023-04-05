import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InjectModel } from '@nestjs/sequelize';
import { error } from 'console';
import { CreateCategoryDTO } from 'dto/createCategoryDTO';

import { Category } from 'models/category.model';


@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async findOne(id: number): Promise<Category> {
    return await this.categoryModel.findOne({
      where: {
        category_id: id
      },
    });
  }
  async potancialCategory(title: string): Promise<Category> {
    return await this.categoryModel.findOne({
      where: {
        title: title
      },
    });
  }

  async create(categoryDto: CreateCategoryDTO): Promise<any> {
    try {
    const potancialCategory = await this.potancialCategory(categoryDto.title)
    if (potancialCategory) {
      throw error
    }

    else{  
    const newCategory = new this.categoryModel()
    newCategory.title = categoryDto.title
    newCategory.save()
    return newCategory
    }
    } catch {
      throw new HttpException('Category title must be unique', 400);
    }
}
 
}