import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsNumber()
  @IsOptional()
  balance?: number;

  // @IsString()
  // @IsOptional()
  // status?: string;
}
