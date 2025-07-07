import { IsString, IsBoolean, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// About Button DTO
class AboutButtonDto {
  @ApiProperty({ 
    example: 'Learn More',
    description: 'Button text'
  })
  @IsString()
  text: string;

  @ApiProperty({ 
    example: '/about-me',
    description: 'Button URL'
  })
  @IsString()
  url: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether the button is enabled'
  })
  @IsBoolean()
  enabled: boolean;
}

export class UpdateAboutDto {
  @ApiProperty({ 
    example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/about-me.jpg',
    description: 'About section image URL',
    required: false
  })
  @IsOptional()
  @IsString()
  aboutImage?: string;

  @ApiProperty({ 
    example: 'I am a passionate photographer dedicated to capturing life\'s most precious moments.',
    description: 'About description',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({ 
    example: 'Photograpgher',
    description: 'Title',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;
  @ApiProperty({ 
    example: 'i am photographer.',
    description: 'subtitle',
    required: false
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ 
    example: 'My journey started 15 years ago when I picked up my first camera...',
    description: 'Journey story',
    required: false
  })
  @IsOptional()
  @IsString()
  journey?: string;

  @ApiProperty({ 
    example: 'What motivates me is the ability to freeze time and create lasting memories...',
    description: 'Motivation text',
    required: false
  })
  @IsOptional()
  @IsString()
  motivation?: string;

  @ApiProperty({ 
    example: 'Let\'s work together to create something amazing!',
    description: 'Ending text',
    required: false
  })
  @IsOptional()
  @IsString()
  endingText?: string;

  @ApiProperty({ 
    example: [
      'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/gallery-1.jpg',
      'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/gallery-2.jpg',
      'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/gallery-3.jpg'
    ],
    description: 'Array of image URLs for the about section gallery',
    required: false,
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the about section is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: {
      text: 'Learn More',
      url: '/about-me',
      enabled: true
    },
    description: 'About button configuration',
    required: false
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AboutButtonDto)
  button?: AboutButtonDto;
} 