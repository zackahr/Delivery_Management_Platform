import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  location?: string; // Can be used to update the location if necessary

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsString()
  @IsOptional()
  status?: string;
}
