import { IsString, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Bio Button DTO
class BioButtonDto {
  @ApiProperty({ 
    example: 'Read More',
    description: 'Button text'
  })
  @IsString()
  text: string;

  @ApiProperty({ 
    example: '/about',
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

export class UpdateBioDto {
  @ApiProperty({ 
    example: 'About Me',
    description: 'Bio section title',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    example: 'I am a passionate photographer dedicated to capturing life\'s most precious moments.',
    description: 'Bio description',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether the bio section is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: {
      text: 'Read More',
      url: '/about',
      enabled: true
    },
    description: 'Bio button configuration',
    required: false
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BioButtonDto)
  button?: BioButtonDto;
} 