import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'Иван Иванов' })
    @IsNotEmpty()
    @IsString()
    fio!: string;

    @ApiProperty({ example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'password123' })
    @IsNotEmpty()
    @IsString()
    password!: string;

    @ApiProperty({ example: 'Developer' })
    @IsNotEmpty()
    @IsString()
    position!: string;
}

