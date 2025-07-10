import { PartialType } from '@nestjs/swagger';
import { CreateAgentDto } from './create-agent.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAgentDto extends PartialType(CreateAgentDto) {
  @ApiProperty({ example: true, description: 'Active status of the agent', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 