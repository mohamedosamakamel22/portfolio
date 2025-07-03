import { IsString, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContactType } from '../../schemas/contact.schema';

export class CreateContactDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'ID of the user being contacted (photographer)', required: false })
  @IsOptional()
  @IsString()
  contactingUser?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'ID of the client user (if registered)', required: false })
  @IsOptional()
  @IsString()
  clientUserId?: string;

  @ApiProperty({ example: 'Fahad Al-Mansour' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'fahad.almansour@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+966 50 444 5566', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Corporate Photography Services' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Hi Saeed! We need professional corporate photography for our new office in Riyadh. Could you provide information about your corporate packages?' })
  @IsString()
  message: string;

  @ApiProperty({ enum: ContactType, default: ContactType.GENERAL })
  @IsOptional()
  @IsEnum(ContactType)
  type?: ContactType;

  @ApiProperty({ example: 'email', required: false })
  @IsOptional()
  @IsString()
  preferredContactMethod?: string;

  @ApiProperty({ example: '2024-05-15', required: false })
  @IsOptional()
  @IsDateString()
  eventDate?: Date;

  @ApiProperty({ example: 'Riyadh, Saudi Arabia', required: false })
  @IsOptional()
  @IsString()
  eventLocation?: string;

  @ApiProperty({ example: '5000-8000 SAR', required: false })
  @IsOptional()
  @IsString()
  budget?: string;

  @ApiProperty({ example: 'Corporate Photography', required: false })
  @IsOptional()
  @IsString()
  serviceType?: string;
} 