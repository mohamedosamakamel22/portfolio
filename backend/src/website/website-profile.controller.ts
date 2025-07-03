import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProfileService } from '../profile/profile.service';

@ApiTags('Website - Public Profile')
@Controller('website/:portfolioId')
export class WebsiteProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get active photographer profile for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  @ApiResponse({ status: 200, description: 'Active profile retrieved successfully' })
  async findActive(@Param('portfolioId') portfolioId: string) {
    return await this.profileService.findByUserId(portfolioId);
  }

  @Get('profile/:id')
  @ApiOperation({ summary: 'Get profile by ID for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async findOne(
    @Param('portfolioId') portfolioId: string,
    @Param('id') id: string
  ) {
    return await this.profileService.findOneByPortfolio(id, portfolioId);
  }
} 