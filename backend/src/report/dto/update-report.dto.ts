import { IsString, IsEmail, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReportDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the person submitting the report', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'john.doe@email.com', description: 'Email address of the person submitting the report', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+966 50 123 4567', description: 'Phone number of the person submitting the report', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'I would like to report an issue with...', description: 'The message content of the report', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ 
    example: 'https://res.cloudinary.com/example/image/upload/v1234567890/reports/file.pdf',
    description: 'URL of the uploaded file (optional)',
    required: false 
  })
  @IsOptional()
  @IsArray()
  file?: string[];
} 