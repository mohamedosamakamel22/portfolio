import { ApiProperty } from '@nestjs/swagger';

export class UploadImageResponseDto {
  @ApiProperty({
    example: 'Profile image uploaded successfully',
    description: 'Success message'
  })
  message: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/profile/saeed-main.jpg',
    description: 'URL of the uploaded image'
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Updated profile object'
  })
  profile: any;
} 