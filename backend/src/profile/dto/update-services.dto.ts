import { IsString, IsBoolean, IsArray, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Service DTO
class ServiceDto {
  @ApiProperty({ 
    example: 'Portrait Photography',
    description: 'Service title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Professional portrait sessions for individuals and families',
    description: 'Service description'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;
}

export class UpdateServicesDto {
  @ApiProperty({ 
    example: 'My Services',
    description: 'Services section title',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    example: 'What I offer',
    description: 'Services section subtitle',
    required: false
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({
    example: [
      { title: 'Portrait Photography', description: 'Professional portrait sessions', order: 1 },
      { title: 'Event Photography', description: 'Capturing special moments', order: 2 }
    ],
    description: 'Services array',
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  services?: ServiceDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the services section is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 