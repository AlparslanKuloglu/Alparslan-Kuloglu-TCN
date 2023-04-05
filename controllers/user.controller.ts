import { Controller, Post, Body ,Req, ValidationPipe } from '@nestjs/common';
import { Param, UsePipes } from '@nestjs/common/decorators';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from 'dto/createUserDTO';
import { request } from 'http';

@Controller()
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @UsePipes(ValidationPipe)
  @Post('createUser')
 async createUser (@Body() CreateUserDTO: CreateUserDTO) {
  try {

      var res = await this.UserService.create(CreateUserDTO) 
      return res

  }
  catch(error) {
    throw error
  }
 }
}