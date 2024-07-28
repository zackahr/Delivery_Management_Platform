import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum'; // Import the Role enum if you have one

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsEnum(Role)
  @IsOptional()
  readonly role?: Role;

  @IsString()
  @IsOptional()
  readonly location?: string; // or use Location type if you have a Location entity
}
