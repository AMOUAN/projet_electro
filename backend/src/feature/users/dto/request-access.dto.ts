import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RequestAccessDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @MinLength(2)
  company: string;

  @ApiPropertyOptional({ example: '+33123456789' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'I want to use LoRaWAN for IoT monitoring' })
  @IsString()
  @MinLength(10)
  usageDescription: string;
}

