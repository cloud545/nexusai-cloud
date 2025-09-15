import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty.' })
  @IsString()
  password: string;
}
