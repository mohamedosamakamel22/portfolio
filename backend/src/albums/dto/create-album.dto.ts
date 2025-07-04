import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsNotEmpty, IsUrl, MinLength, MaxLength, ArrayMaxSize, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ImageDto {
  @ApiProperty({ example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/travel/india-1.jpg' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({ example: 'Colorful streets of India', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  alt?: string;
}

class FeatureDto {
  @ApiProperty({ example: '📸' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  icon: string;

  @ApiProperty({ example: 'Camera Used' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'Fujifilm X-T4' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  value: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsString()
  order: number;
}

class SpecificationDto {
  @ApiProperty({ example: '📂' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  icon: string;

  @ApiProperty({ example: 'Category' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Travel' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  value: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsString()
  order?: number;
}

class ActionButtonDto {
  @ApiProperty({ example: 'Buy Prints' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  text: string;

  @ApiProperty({ example: 'https://prints.saeedseka.com/colorful-india' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ example: 'primary', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  style?: string;
}

class YoutubeVideoDto {
  @ApiProperty({ example: 'YqeW9_5kURI' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  videoId: string;

  @ApiProperty({ example: 'Colorful India - Behind the Scenes' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Take a journey behind the scenes of our collaborative travel photography project in India, capturing the vibrant street life and cultural diversity.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  description: string;

  @ApiProperty({ example: 'https://img.youtube.com/vi/YqeW9_5kURI/maxresdefault.jpg' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  thumbnail: string;

  @ApiProperty({ example: 'https://www.youtube.com/embed/YqeW9_5kURI' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  embedUrl: string;

  @ApiProperty({ example: '4:32', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  duration?: string;
}

export class CreateAlbumDto {
  @ApiProperty({ example: 'Colorful India' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Travel photography collaboration showcasing the vibrant colors and culture of India' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(2000)
  description: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/travel/colorful-india-cover.jpg', required: false })
  @IsOptional()
  @IsString()
  @IsUrl()
  coverImage?: string;

  @ApiProperty({
    example: [
      {
        url: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/travel/india-1.jpg',
        alt: 'Vibrant Indian street scene'
      }
    ],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images?: ImageDto[];

  @ApiProperty({ example: ['Travel', 'Collaboration'], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  tags?: string[];

  @ApiProperty({
    example: [
      {
        icon: '📸',
        title: 'Camera Used',
        value: 'Fujifilm X-T4',
        order: 1
      }
    ],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features?: FeatureDto[];

  @ApiProperty({
    example: [
      {
        icon: '📂',
        name: 'Category',
        value: 'Travel',
        order: 1
      }
    ],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => SpecificationDto)
  specifications?: SpecificationDto[];

  @ApiProperty({
    example: {
      text: 'Buy Prints',
      url: 'https://prints.saeedseka.com/colorful-india',
      enabled: true,
      style: 'primary'
    },
    required: false
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ActionButtonDto)
  actionButton?: ActionButtonDto;

  @ApiProperty({
    example: {
      videoId: 'YqeW9_5kURI',
      title: 'Colorful India - Behind the Scenes',
      description: 'Take a journey behind the scenes of our collaborative travel photography project in India, capturing the vibrant street life and cultural diversity.',
      thumbnail: 'https://img.youtube.com/vi/YqeW9_5kURI/maxresdefault.jpg',
      embedUrl: 'https://www.youtube.com/embed/YqeW9_5kURI',
      duration: '4:32'
    },
    required: false
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => YoutubeVideoDto)
  youtubeVideo?: YoutubeVideoDto;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'ID of the user who created the album', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  createdBy?: string;
} 