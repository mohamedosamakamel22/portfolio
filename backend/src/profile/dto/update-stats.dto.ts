import { IsString, IsBoolean, IsArray, ValidateNested, IsOptional, IsNumber, ValidationOptions, registerDecorator } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Custom validator for string or number
function IsStringOrNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' || typeof value === 'number';
        },
        defaultMessage() {
          return 'Value must be either a string or number';
        },
      },
    });
  };
}

// Stat DTO
class StatDto {
  @ApiProperty({ 
    example: 'Years of Experience',
    description: 'Statistic title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Professional Journey',
    description: 'Statistic subtitle'
  })
  @IsString()
  subtitle: string;

  @ApiProperty({ 
    example: 'yearsExperience',
    description: 'Statistic key identifier'
  })
  @IsString()
  key: string;

  @ApiProperty({ 
    example: 14,
    description: 'Can be either a string or number',
    oneOf: [
      { type: 'string' },
      { type: 'number' }
    ]
  })
  @IsStringOrNumber()
  value: string | number;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;
}

export class UpdateStatsDto {
  @ApiProperty({ 
    example: 'My Achievements',
    description: 'Stats section title',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    example: 'Numbers that tell my story',
    description: 'Stats section subtitle',
    required: false
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({
    example: [
      { title: 'Years of Experience', subtitle: 'Professional Journey', key: 'yearsExperience', value: 14, order: 1 },
      { title: 'Projects Completed', subtitle: 'Success Stories', key: 'projectsCompleted', value: 500, order: 2 }
    ],
    description: 'Statistics array',
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatDto)
  statsValues?: StatDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the stats section is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 