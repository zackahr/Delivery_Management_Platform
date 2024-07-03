import { IsString, IsNumber, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class updateCommandDto {
  @IsString()
  @IsNotEmpty()
  commandOwner: string;

  @IsString()
  @IsNotEmpty()
  userAddress: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  productPrice: number;

  @IsNumber()
  @IsNotEmpty()
  productQuantity: number;

  totalPrice: number;

  @IsNumber()
  @IsNotEmpty()
  paidAmount: number;

  paidRemain: number;

  paidStatus: boolean;

  @IsOptional()
  createdAt?: Date; // Created at
}
