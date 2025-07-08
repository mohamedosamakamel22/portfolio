import { IsString, IsBoolean, IsArray, ValidateNested, IsOptional, IsNumber, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Social Media Item DTO
class SocialMediaItemDto {
  @ApiProperty({ 
    example: 'fab fa-instagram',
    description: 'Social media icon class or URL'
  })
  @IsString()
  icon: string;

  @ApiProperty({ 
    example: 'https://instagram.com/saeedsekka',
    description: 'Social media profile URL'
  })
  @IsString()
  url: string;

  @ApiProperty({ 
    example: 'Instagram',
    description: 'Social media platform title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;
}

export class UpdateSocialMediaDto {

  @ApiProperty({
    example: 'saeed@example.com',
    description: 'Email address',
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '+966-53-868-3923',
    description: 'Phone number',
    required: false
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether the social media section is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: [
      { icon: 'fab fa-instagram', url: 'https://instagram.com/saeedsekka', title: 'Instagram', order: 1 },
      { icon: 'fab fa-facebook', url: 'https://facebook.com/saeedsekka', title: 'Facebook', order: 2 },
      { icon: 'fab fa-twitter', url: 'https://twitter.com/saeed_sekka', title: 'Twitter', order: 3 },
      { icon: 'fab fa-linkedin', url: 'https://linkedin.com/in/saeed-sekka', title: 'LinkedIn', order: 4 },
      { icon: 'fab fa-youtube', url: 'https://youtube.com/@saeedsekka', title: 'YouTube', order: 5 },
      { icon: 'fab fa-tiktok', url: 'https://tiktok.com/@saeedsekka', title: 'TikTok', order: 6 }
    ],
    description: 'Array of social media platforms',
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaItemDto)
  socialMedia?: SocialMediaItemDto[];
} 