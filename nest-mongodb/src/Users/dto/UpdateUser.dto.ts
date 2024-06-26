// UpdateUser.dto.ts
import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    username?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    password?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsIn(['admin', 'delivery'])
    role?: string;
}
