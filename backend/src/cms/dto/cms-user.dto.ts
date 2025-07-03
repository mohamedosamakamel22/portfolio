import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsEnum,
  IsNotEmpty,
  Matches,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'SaeedSekka@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Saeed',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Sekka',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.CUSTOMER;

  @ApiPropertyOptional({
    description: 'User active status',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+966-53-868-3923',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'User date of birth',
    example: '1990-01-01',
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    description: 'User bio/description',
    example: 'Professional photographer dedicated to capturing life\'s most precious moments',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({
    description: 'User website URL',
    example: 'https://saeedseka.framer.website/',
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({
    description: 'User location',
    example: 'Riyadh, Saudi Arabia',
  })
  @IsString()
  @IsOptional()
  location?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'User password (minimum 8 characters) - Leave empty to keep current password',
    example: 'NewSecurePass123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  @IsOptional()
  password?: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'SaeedSekka@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Saeed',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Sekka',
  })
  lastName: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role: UserRole;

  @ApiProperty({
    description: 'User active status',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+966-53-868-3923',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'User date of birth',
    example: '1990-01-01T00:00:00.000Z',
  })
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    description: 'User bio/description',
    example: 'Professional photographer dedicated to capturing life\'s most precious moments',
  })
  bio?: string;

  @ApiPropertyOptional({
    description: 'User website URL',
    example: 'https://saeedseka.framer.website/',
  })
  website?: string;

  @ApiPropertyOptional({
    description: 'User location',
    example: 'Riyadh, Saudi Arabia',
  })
  location?: string;

  @ApiProperty({
    description: 'User creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'User last login date',
    example: '2024-01-01T00:00:00.000Z',
  })
  lastLogin?: Date;
} 