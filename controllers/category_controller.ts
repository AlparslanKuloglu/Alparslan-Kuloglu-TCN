import { Controller, Post, Body ,Req, ValidationPipe } from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDTO } from 'dto/createCategoryDTO';

@Controller()
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) {}

  @UsePipes(ValidationPipe)
  @Post('createCategory')
 async createCategory (@Body() CreateCategoryDTO: CreateCategoryDTO) {

  try{
    let category = await this.CategoryService.create(CreateCategoryDTO)
    return category
  }
  catch(error) {
    throw error
  }
 }

}