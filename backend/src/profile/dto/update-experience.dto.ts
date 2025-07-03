import { IsString, IsBoolean, IsArray, ValidateNested, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Experience DTO
class ExperienceDto {
  @ApiProperty({ 
    example: 'Clavmen Studio',
    description: 'Company or organization name'
  })
  @IsString()
  company: string;

  @ApiProperty({ 
    example: 'Senior UX Designer',
    description: 'Job position or title'
  })
  @IsString()
  position: string;

  @ApiProperty({ 
    example: '2022-01-01',
    description: 'Start date of employment'
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @ApiProperty({ 
    example: '2022-12-31',
    required: false,
    description: 'End date of employment (null if current position)'
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : null)
  endDate?: Date;

  @ApiProperty({ 
    example: true,
    required: false,
    description: 'Whether this is the current position'
  })
  @IsOptional()
  @IsBoolean()
  isPresent?: boolean;

  @ApiProperty({ 
    example: 'Clavmen inspires creativity and makes learning piano fun.',
    description: 'Job description and responsibilities'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;
}

export class UpdateExperienceDto {
  @ApiProperty({ 
    example: 'My Experience',
    description: 'Experience section title',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    example: 'Professional journey and achievements',
    description: 'Experience section subtitle',
    required: false
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({
    example: [
      {
        company: 'Clavmen Studio',
        position: 'Senior UX Designer',
        startDate: '2022-01-01',
        endDate: null,
        isPresent: true,
        description: 'Clavmen inspires creativity and makes learning piano fun.',
        order: 1
      }
    ],
    description: 'Experience array',
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experience?: ExperienceDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the experience section is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 