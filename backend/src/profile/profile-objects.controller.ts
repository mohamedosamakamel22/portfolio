import {
  Controller,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ProfileService } from './profile.service';

@ApiTags('Profile Objects (Website)')
@Controller('profile-objects')
export class ProfileObjectsController {
  constructor(
    private readonly profileService: ProfileService,
  ) { }

  @Get('hero/:userId')
  @ApiOperation({ summary: 'Get hero section by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Hero section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getHeroByUserId(@Param('userId') userId: string) {
    const profile = await this.profileService.findOne(userId);
    if (!profile.hero) {
      throw new NotFoundException('Hero section not found for this user');
    }
    return profile.hero;
  }

  @Get('stats/:userId')
  @ApiOperation({ summary: 'Get stats section by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Stats section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getStatsByUserId(@Param('userId') userId: string) {
    const profile = await this.profileService.findOne(userId);
    if (!profile.stats) {
      throw new NotFoundException('Stats section not found for this user');
    }
    return profile.stats;
  }

  @Get('bio/:userId')
  @ApiOperation({ summary: 'Get bio section by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Bio section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getBioByUserId(@Param('userId') userId: string) {
    const profile = await this.profileService.findOne(userId);
    if (!profile.bio) {
      throw new NotFoundException('Bio section not found for this user');
    }
    return profile.bio;
  }

  @Get('brands/:userId')
  @ApiOperation({ summary: 'Get brands section by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Brands section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getBrandsByUserId(@Param('userId') userId: string) {
    const profile = await this.profileService.findOne(userId);
    if (!profile.brands) {
      throw new NotFoundException('Brands section not found for this user');
    }
    return profile.brands;
  }

  @Get('experience/:userId')
  @ApiOperation({ summary: 'Get experience section by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Experience section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getExperienceByUserId(@Param('userId') userId: string) {
    const profile = await this.profileService.findOne(userId);
    if (!profile.experience) {
      throw new NotFoundException('Experience section not found for this user');
    }
    return profile.experience;
  }

  @Get('services/:userId')
  @ApiOperation({ summary: 'Get services section by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Services section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getServicesByUserId(@Param('userId') userId: string) {
    const profile = await this.profileService.findOne(userId);
    if (!profile.services) {
      throw new NotFoundException('Services section not found for this user');
    }
    return profile.services;
  }

  @Get('faq/:userId')
  @ApiOperation({ summary: 'Get FAQ section by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'FAQ section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getFaqByUserId(@Param('userId') userId: string) {
    const profile = await this.profileService.findOne(userId);
    if (!profile.faq) {
      throw new NotFoundException('FAQ section not found for this user');
    }
    return profile.faq;
  }

  @Get('social-media/:userId')
  @ApiOperation({ summary: 'Get social media section by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Social media section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getSocialMediaByUserId(@Param('userId') userId: string) {
    const profile = await this.profileService.findOne(userId);
    if (!profile.socialMedia) {
      throw new NotFoundException('Social media section not found for this user');
    }
    return profile.socialMedia;
  }



} 