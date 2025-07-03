import { IsString, IsBoolean, IsArray, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Brand DTO
class BrandDto {
  @ApiProperty({ 
    example: 'Canon',
    description: 'Brand name'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/brands/canon-logo.jpg',
    required: false,
    description: 'Brand logo URL'
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;
}

export class UpdateBrandsDto {
  @ApiProperty({ 
    example: 'Brands I Work With',
    description: 'Brands section title',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    example: 'Trusted by leading brands',
    description: 'Brands section subtitle',
    required: false
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({
    example: [
      { name: 'Canon', logo: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/brands/canon-logo.jpg', order: 1 },
      { name: 'Adobe', logo: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/brands/adobe-logo.jpg', order: 2 }
    ],
    description: 'Brands array',
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BrandDto)
  brands?: BrandDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the brands section is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 