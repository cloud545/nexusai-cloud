import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' }) // 只保留这一个，并可以自定义消息
  email: string;


 //@Length(2, 20, { message: 'Nickname must be between 2 and 20 characters.' })
  @IsNotEmpty({ message: 'Nickname should not be empty.' })
  @IsString()
  nickname: string;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: 'Password must be at least 8 characters long and contain both letters and numbers.' })
  @IsString()
  password: string;
}