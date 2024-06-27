import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommandDto {
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsOptional()
  totalPrice?: number;
}
