import { IsArray, ValidateNested, IsString, IsNumber, ValidationOptions, registerDecorator } from 'class-validator';
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

class StatDto {
  @ApiProperty({ 
    example: 'yearsExperience',
    description: 'The key identifier for the statistic'
  })
  @IsString()
  key: string;

  @ApiProperty({ 
    example: 14,
    description: 'The value of the statistic (can be string or number)',
    oneOf: [
      { type: 'string' },
      { type: 'number' }
    ]
  })
  @IsStringOrNumber()
  value: string | number;
}

export class UpdateStatsDto {
  @ApiProperty({
    example: [
      { key: 'yearsExperience', value: 14 },
      { key: 'projectsCompleted', value: 500 },
      { key: 'happyClients', value: 200 },
      { key: 'awards', value: 25 },
      { key: 'hoursExperience', value: 15000 }
    ],
    description: 'Array of statistics to update',
    type: [StatDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatDto)
  stats: StatDto[];
} 