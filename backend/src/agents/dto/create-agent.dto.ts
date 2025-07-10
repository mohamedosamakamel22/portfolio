import { IsString, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the agent' })
  @IsString()
  userName: string;

  @ApiProperty({ example: 'john.doe@email.com', description: 'Email address of the agent', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+966 50 444 5566', description: 'Phone number of the agent' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Looking for collaboration opportunities', description: 'Optional message from the agent', required: false })
  @IsOptional()
  @IsString()
  message?: string;
} 