import { Controller, Post, Get, Delete, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IpAddressService } from './ip-address.service';
import { RecordVisitDto } from './dto/record-visit.dto';

@ApiTags('IP Address Tracking')
@Controller('ip-address')
export class IpAddressController {
    constructor(private readonly ipAddressService: IpAddressService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Record a visitor IP address',
        description: 'Records a new visitor IP or increments visit count for existing IP'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Visit recorded successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                isNewVisitor: { type: 'boolean' },
                visitCount: { type: 'number' },
                ip: { type: 'string' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Invalid IP address format' })
    async recordVisit(@Body() recordVisitDto: RecordVisitDto) {
        return this.ipAddressService.recordVisit(recordVisitDto);
    }

    @Get()
    @ApiOperation({ 
        summary: 'Get visitor statistics',
        description: 'Returns total visits count and distinct IP count'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Visitor statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalVisits: { type: 'number', description: 'Total count of visits including repeated visits' },
                uniqueIPs: { type: 'number', description: 'Distinct count of IP addresses' }
            }
        }
    })
    async getVisitorStats() {
        return this.ipAddressService.getVisitorStats();
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Delete all visits',
        description: 'Deletes all IP address records and resets visit count to 0'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'All visits deleted successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', description: 'Success message' },
                deletedCount: { type: 'number', description: 'Number of records deleted' }
            }
        }
    })
    async deleteAllVisits() {
        return this.ipAddressService.deleteAllVisits();
    }
} 