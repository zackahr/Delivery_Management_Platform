// src/clients/dto/create-client.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    address: string;

    @IsString()
    phoneNumber: string;
}
