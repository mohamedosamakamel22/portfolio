import { IsString, IsDate, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddExperienceDto {
  @ApiProperty({ 
    example: 'Clavmen Studio',
    description: 'Company or organization name'
  })
  @IsString()
  company: string;

  @ApiProperty({ 
    example: 'Senior UX Designer',
    description: 'Job title or position'
  })
  @IsString()
  position: string;

  @ApiProperty({ 
    example: '2022-01-01T00:00:00.000Z',
    description: 'Start date of the position'
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @ApiProperty({ 
    example: null,
    description: 'End date of the position (null if currently employed)',
    required: false
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : null)
  endDate?: Date;

  @ApiProperty({ 
    example: true,
    description: 'Whether this is the current position',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isPresent?: boolean;

  @ApiProperty({ 
    example: 'Riyadh, Saudi Arabia',
    description: 'Location of the position',
    required: false
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ 
    example: 'Full-time',
    description: 'Type of employment',
    required: false
  })
  @IsOptional()
  @IsString()
  employmentType?: string;

  @ApiProperty({ 
    example: 'Clavmen inspires creativity and makes learning piano fun. The sleek, lightweight body fits easily into gig bags for portability.',
    description: 'Description of the role and responsibilities'
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: [
      'Led UX design for innovative piano learning platform',
      'Improved user engagement by 40%',
      'Designed portable and user-friendly interfaces',
      'Collaborated with cross-functional teams'
    ],
    description: 'List of achievements and accomplishments',
    required: false,
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];
} 