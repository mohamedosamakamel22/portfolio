import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ImageDto {
  @ApiProperty({ example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/travel/india-1.jpg' })
  @IsString()
  url: string;

  @ApiProperty({ example: 'portfolio/travel/india-1' })
  @IsString()
  publicId: string;

  @ApiProperty({ example: 'Colorful streets of India', required: false })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ example: 'Vibrant Indian street scene', required: false })
  @IsOptional()
  @IsString()
  alt?: string;
}

class MetadataDto {
  @ApiProperty({ example: 'Fujifilm X-T4', required: false })
  @IsOptional()
  @IsString()
  camera?: string;

  @ApiProperty({ example: 'Fujinon XF 23mm f/1.4 R, Fujinon XF 35mm f/2 R WR', required: false })
  @IsOptional()
  @IsString()
  lens?: string;

  @ApiProperty({ example: 'ISO 200, f/8, 1/125s', required: false })
  @IsOptional()
  @IsString()
  settings?: string;
}

class SpecificationDto {
  @ApiProperty({ example: '📂' })
  @IsString()
  icon: string;

  @ApiProperty({ example: 'Category' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Travel' })
  @IsString()
  value: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}

class ActionButtonDto {
  @ApiProperty({ example: 'Buy Prints' })
  @IsString()
  text: string;

  @ApiProperty({ example: 'https://prints.saeedseka.com/colorful-india' })
  @IsString()
  url: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ example: 'primary', required: false })
  @IsOptional()
  @IsString()
  style?: string;
}

class YoutubeVideoDto {
  @ApiProperty({ example: 'YqeW9_5kURI' })
  @IsString()
  videoId: string;

  @ApiProperty({ example: 'Colorful India - Behind the Scenes' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Take a journey behind the scenes of our collaborative travel photography project in India, capturing the vibrant street life and cultural diversity.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'https://img.youtube.com/vi/YqeW9_5kURI/maxresdefault.jpg' })
  @IsString()
  thumbnail: string;

  @ApiProperty({ example: 'https://www.youtube.com/embed/YqeW9_5kURI' })
  @IsString()
  embedUrl: string;

  @ApiProperty({ example: '4:32', required: false })
  @IsOptional()
  @IsString()
  duration?: string;
}

export class CreateAlbumDto {
  @ApiProperty({ example: 'Colorful India' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Travel photography collaboration showcasing the vibrant colors and culture of India' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Travel' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'Collaboration' })
  @IsString()
  projectType: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/travel/colorful-india-cover.jpg', required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({
    example: [
      {
        url: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/travel/india-1.jpg',
        publicId: 'portfolio/travel/india-1',
        caption: 'Colorful streets of India',
        alt: 'Vibrant Indian street scene'
      }
    ],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images?: ImageDto[];

  @ApiProperty({ example: ['Travel', 'Collaboration'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: 'India Tourism', required: false })
  @IsOptional()
  @IsString()
  client?: string;

  @ApiProperty({ example: 'India', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: '2024-04-15T10:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  shootDate?: Date;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ example: 324, required: false })
  @IsOptional()
  @IsNumber()
  viewCount?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({
    example: {
      camera: 'Fujifilm X-T4',
      lens: 'Fujinon XF 23mm f/1.4 R, Fujinon XF 35mm f/2 R WR',
      settings: 'ISO 200, f/8, 1/125s'
    },
    required: false
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;

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
  @ValidateNested()
  @Type(() => ActionButtonDto)
  actionButton?: ActionButtonDto;

  @ApiProperty({ example: '2024-04-15T18:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  eventDate?: Date;

  @ApiProperty({ example: 156, required: false })
  @IsOptional()
  @IsNumber()
  likes?: number;

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
  @ValidateNested()
  @Type(() => YoutubeVideoDto)
  youtubeVideo?: YoutubeVideoDto;

  @ApiProperty({ example: 'To capture the vibrant life, culture, and diversity of India\'s streets through a collaborative travel photography project. The aim was to document everyday moments, unique street scenes, and cultural events, showcasing the essence of Indian street life.', required: false })
  @IsOptional()
  @IsString()
  projectGoal?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'ID of the user who created the album', required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;
} 