import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum'; // Assuming you have an enum for roles

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsEnum(Role)
  @IsOptional()
  readonly role?: Role;

  @IsString()
  @IsOptional()
  readonly locationName?: string; // or use Location type if you have a Location entity
}
