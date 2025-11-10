import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivateAccountDto {
  @ApiProperty({ example: 'token-uuid-here' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'newpassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'newpassword123' })
  @IsString()
  @MinLength(6)
  confirmPassword: string;
}

