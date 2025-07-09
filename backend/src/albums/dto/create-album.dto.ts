import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsNotEmpty, IsUrl, MinLength, MaxLength, ArrayMaxSize, IsObject, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Type for icons that can be either string or object with type and value
export type IconType = string | { type: string; value: string };

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
  @IsOptional()
  icon: IconType;

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
  @IsOptional()
  icon: IconType;

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
  @IsNumber()
  order?: number;
}

class ActionButtonDto {
  @ApiProperty({ example: 'Buy Prints' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  text?: string;

  @ApiProperty({ example: 'https://prints.saeedseka.com/colorful-india' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @ApiProperty({ example: 'primary', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @IsOptional()
  style?: string;
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

  // @ApiProperty({
  //   example: [
  //     {
  //       icon: '📸',
  //       title: 'Camera Used',
  //       value: 'Fujifilm X-T4',
  //       order: 1
  //     }
  //   ],
  //   required: false
  // })
  // @IsOptional()
  // @IsArray()
  // @ArrayMaxSize(10)
  // @ValidateNested({ each: true })
  // @Type(() => FeatureDto)
  // features?: FeatureDto[];

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
    example: 'https://www.youtube.com/watch?v=YqeW9_5kURI',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  youtubeVideo?: string;



  @ApiProperty({ example: '685fe192e9ad4407f2b52ce4', description: 'ID of the user who created the album', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userId: string = "685fe192e9ad4407f2b52ce4";
} 