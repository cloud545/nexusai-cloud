import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain both letters and numbers.',
  })
  @IsString()
  password?: string;

  @IsOptional()
  @IsString() // You might want a more specific enum validator if you have a predefined set of roles
  role?: UserRole;
}
