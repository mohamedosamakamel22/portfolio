import { IsString, IsEmail, IsOptional, IsArray, ValidateNested, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ReportFileDto {
  @ApiProperty({ 
    example: 'https://res.cloudinary.com/example/image/upload/v1234567890/reports/document.pdf',
    description: 'URL of the uploaded file'
  })
  @IsUrl()
  url: string;

  @ApiProperty({ 
    example: 'document.pdf',
    description: 'Original filename of the uploaded file'
  })
  @IsString()
  filename: string;
}

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
    example: [
      {
        url: 'https://res.cloudinary.com/example/image/upload/v1234567890/reports/document.pdf',
        filename: 'document.pdf'
      },
      {
        url: 'https://res.cloudinary.com/example/image/upload/v1234567890/reports/screenshot.png',
        filename: 'screenshot.png'
      }
    ],
    description: 'Array of uploaded files with URLs and filenames (optional)',
    required: false,
    type: [ReportFileDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportFileDto)
  files?: ReportFileDto[];
} 