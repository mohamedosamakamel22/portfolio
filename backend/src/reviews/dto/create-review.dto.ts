import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString, Min, Max, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {

  @ApiProperty({ example: '685fe192e9ad4407f2b52ce4', description: 'ID of the user being reviewed (photographer)', required: false })
  @IsOptional()
  @IsMongoId()
  userId: string="685fe192e9ad4407f2b52ce4";


  @ApiProperty({ example: 'Michael T.' })
  @IsString()
  clientName: string;

  @ApiProperty({ example: 'Marketing Manager' })
  @IsString()
  clientTitle: string;


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

  
  @ApiProperty({ example: 'Stellar Designs' })
  @IsString()
  company: string;

} 