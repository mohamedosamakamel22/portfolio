import { IsString, IsEmail, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'ID of the user submitting the report', required: false })
  @IsOptional()
  @IsString()
  userId: string = "685fe192e9ad4407f2b52ce4";

  @ApiProperty({ example: 'John Doe', description: 'Full name of the person submitting the report' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@email.com', description: 'Email address of the person submitting the report' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+966 50 123 4567', description: 'Phone number of the person submitting the report' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'I would like to report an issue with...', description: 'The message content of the report' })
  @IsString()
  message: string;

  @ApiProperty({
    example: ['https://res.cloudinary.com/example/image/upload/v1234567890/reports/file.pdf', 'https://res.cloudinary.com/example/image/upload/v1234567890/reports/file.pdf'],
    description: 'URL of the uploaded file (optional)',
    required: false
  })
  @IsOptional()
  @IsArray()
  files?: string[];
} 