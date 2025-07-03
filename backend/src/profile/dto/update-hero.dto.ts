import { IsString, IsBoolean, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHeroDto {
  @ApiProperty({ 
    example: 'Saeed',
    description: 'First name',
    required: false
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ 
    example: 'Sekka',
    description: 'Last name',
    required: false
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ 
    example: '+966-53-868-3923',
    description: 'Phone number',
    required: false
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ 
    example: 'Riyadh, Saudi Arabia',
    description: 'Address or location',
    required: false
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ 
    example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/profile/saeed-main.jpg',
    description: 'Profile image URL',
    required: false
  })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ 
    example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/cover/saeed-cover.jpg',
    description: 'Cover image URL',
    required: false
  })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ 
    example: 'I am a passionate photographer dedicated to capturing life\'s most precious moments.',
    description: 'About me text',
    required: false
  })
  @IsOptional()
  @IsString()
  aboutMe?: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether the hero section is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ 
    example: ['Photography', 'Photo Editing', 'Designer'],
    description: 'Professional specialties',
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];
} 