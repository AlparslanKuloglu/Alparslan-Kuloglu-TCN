import { IsNotEmpty,IsEmail,IsString } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @IsString()
  readonly password: string
}
