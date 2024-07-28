import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCommandDto {
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsNumber()
  @IsNotEmpty()
  productPrice: number;

  @IsNumber()
  @IsNotEmpty()
  productQuantity: number;

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @IsNumber()
  @IsNotEmpty()
  priceGivenByClient: number;

  @IsNumber()
  @IsNotEmpty()
  priceRest: number; // Added this field

  @IsString()
  @IsNotEmpty()
  clientStatus: string;
}
