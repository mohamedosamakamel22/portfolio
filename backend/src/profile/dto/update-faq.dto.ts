import { IsString, IsBoolean, IsArray, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// FAQ DTO
class FaqDto {
  @ApiProperty({ 
    example: 'How do I book a photography session?',
    description: 'FAQ question'
  })
  @IsString()
  question: string;

  @ApiProperty({ 
    example: 'You can book a session by filling out the contact form on my website.',
    description: 'FAQ answer'
  })
  @IsString()
  answer: string;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;
}

export class UpdateFaqDto {
  @ApiProperty({ 
    example: 'Frequently Asked Questions',
    description: 'FAQ section title',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    example: 'Common questions answered',
    description: 'FAQ section subtitle',
    required: false
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({
    example: [
      {
        question: 'How do I book a photography session?',
        answer: 'You can book a session by filling out the contact form on my website.',
        order: 1
      }
    ],
    description: 'FAQ array',
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqDto)
  faq?: FaqDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the FAQ section is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 