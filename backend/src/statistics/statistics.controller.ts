import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) { }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get statistics for a specific user',
    description: 'Returns the count of reviews, albums, home sections, and reports for a specific user ID'
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user to get statistics for',
    example: '685fe192e9ad4407f2b52ce4'
  })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
    example: {
      userId: '685fe192e9ad4407f2b52ce4',
      statistics: {
        reviews: 5,
        albums: 3,
        homeSections: 8,
        reports: 2
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUserStatistics(@Param('userId') userId: string) {
    try {
      return await this.statisticsService.getUserStatistics(userId);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch user statistics: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


} 