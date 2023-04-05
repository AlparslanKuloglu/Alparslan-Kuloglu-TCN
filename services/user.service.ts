import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Json } from 'sequelize/types/utils';
import { retry } from 'rxjs';
import { CreateUserDTO } from 'dto/createUserDTO';
import { validate } from 'class-validator';
import { error } from 'console';
import { send } from 'process';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  findOne(id: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }

  async potencialUser(email: string): Promise<User> {
    return await this.userModel.findOne({
      where: {
        email: email
      },
    });
  }

  async create(userDto: CreateUserDTO): Promise<any> {
    try {
      const potencialUser = await this.potencialUser(userDto.email)
      if (potencialUser) {
        throw error
    }
    else{
      const newUser = new this.userModel()
      newUser.email = userDto.email
      newUser.password = userDto.password
      newUser.save()

    return newUser

    }

    } catch {

      throw new HttpException('Email must be unique', 400);
    }


}

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}