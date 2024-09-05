import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsObject()
  clientLocation: {  // Make clientLocation required
    latitude: number;
    longitude: number;
    address?: string;
  };

  @IsString()
  @IsOptional()
  location?: string; // Can be used to update the location if necessary
}
