import { IsString, IsBoolean, IsArray, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Type for icons that can be either string or object with type and value
export type IconType = string | { type: string; value: string };

// Gear Item DTO
class GearItemDto {
  @ApiProperty({ 
    example: 'Canon EOS R5',
    description: 'Gear item title/name'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'fas fa-camera',
    description: 'Gear item icon (FontAwesome class) - can be string or object with type and value'
  })
  @IsOptional()
  icon: IconType;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;

  @ApiProperty({ 
    example: true,
    description: 'Whether the gear item is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// Gear Category DTO
class GearDto {
  @ApiProperty({ 
    example: 'Cameras',
    description: 'Gear category title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;

  @ApiProperty({ 
    example: 'Professional camera equipment',
    description: 'Gear category subtitle'
  })
  @IsString()
  subtitle: string;

  @ApiProperty({
    example: [
      { title: 'Canon EOS R5', icon: 'fas fa-camera', order: 1, isActive: true },
      { title: 'Sony A7S III', icon: 'fas fa-video', order: 2, isActive: true }
    ],
    description: 'Gear items in this category'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GearItemDto)
  gearItems: GearItemDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the gear category is active'
  })
  @IsBoolean()
  isActive: boolean;
}

export class UpdateGearDto {
  @ApiProperty({ 
    example: 'My Gear',
    description: 'Gear section title',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    example: 'Professional equipment I use',
    description: 'Gear section subtitle',
    required: false
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({
    example: [
      {
        title: 'Cameras',
        order: 1,
        subtitle: 'Professional camera equipment',
        isActive: true,
        gearItems: [
          { title: 'Canon EOS R5', icon: 'fas fa-camera', order: 1, isActive: true },
          { title: 'Sony A7S III', icon: 'fas fa-video', order: 2, isActive: true }
        ]
      },
      {
        title: 'Audio',
        order: 2,
        subtitle: 'Professional audio equipment',
        isActive: true,
        gearItems: [
          { title: 'Rode VideoMic Pro', icon: 'fas fa-microphone', order: 1, isActive: true },
          { title: 'Audio-Technica AT4040', icon: 'fas fa-microphone-alt', order: 2, isActive: true }
        ]
      }
    ],
    description: 'Gear categories array',
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GearDto)
  gearSection?: GearDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the gear section is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 