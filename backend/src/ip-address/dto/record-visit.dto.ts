import { IsIP } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecordVisitDto {
    @ApiProperty({ 
        description: 'IP address of the visitor',
        example: '192.168.1.1'
    })
    @IsIP()
    ip: string;
} 