import { IsString } from 'class-validator';

export class CreateLocationDto {
    @IsString()
    readonly name: string;
}
