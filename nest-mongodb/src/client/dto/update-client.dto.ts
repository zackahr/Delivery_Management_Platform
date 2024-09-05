import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsObject()
  @IsOptional()
  clientLocation?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsString()
  @IsOptional()
  location?: string; // Can be used to update the location if necessary
}
