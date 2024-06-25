import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCommandDto {
    @IsNotEmpty()
    @IsString()
    clientName: string;

    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}
