import { IRT } from "@/types/jwt-payload.type";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDTO implements IRT {
    @ApiProperty({ example: '', required: true })
    @IsString()
    @IsNotEmpty()
    refresh_token!: string;
}