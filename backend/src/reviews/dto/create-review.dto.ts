import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString, Min, Max, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'ID of the user being reviewed (photographer)', required: false })
  @IsOptional()
  @IsMongoId()
  reviewedBy?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'ID of the client user (if client is also a registered user)', required: false })
  @IsOptional()
  @IsMongoId()
  clientUserId?: string;

  @ApiProperty({ example: 'Michael T.' })
  @IsString()
  clientName: string;

  @ApiProperty({ example: 'Marketing Manager' })
  @IsString()
  clientTitle: string;

  @ApiProperty({ example: 'Stellar Designs' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'We are thrilled with the product photography provided by Saeed. They captured our products beautifully, highlighting their unique features and enhancing their appeal.' })
  @IsString()
  review: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/clients/michael-avatar.jpg', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: '2024-01-25T10:30:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  reviewDate?: Date;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ example: 'Product Photography', required: false })
  @IsOptional()
  @IsString()
  projectType?: string;

  @ApiProperty({ example: 'Product Photography', required: false })
  @IsOptional()
  @IsString()
  serviceUsed?: string;
} 