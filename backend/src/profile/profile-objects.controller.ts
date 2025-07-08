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



  @Get('stats')
  @ApiOperation({ summary: 'Get stats section ' })
  @ApiResponse({ status: 200, description: 'Stats section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getStatsByUserId() {
    const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
    if (!profile.stats) {
      throw new NotFoundException('Stats section not found for this user');
    }
    return profile.stats;
  }
  @Get('hero')
  @ApiOperation({ summary: 'Get hero section ' })
  @ApiResponse({ status: 200, description: 'Hero section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getHeroByUserId() {
    const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
    if (!profile.hero) {
      throw new NotFoundException('Hero section not found for this user');
    }
    return profile.hero;
  }

  @Get('about')
  @ApiOperation({ summary: 'Get about section ' })
  @ApiResponse({ status: 200, description: 'About section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getAboutByUserId() {
    const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
    if (!profile.about) {
      throw new NotFoundException('About section not found for this user');
    }
    return profile.about;
  }

  @Get('bio')
  @ApiOperation({ summary: 'Get bio section ' })
  @ApiResponse({ status: 200, description: 'Bio section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getBioByUserId() {
    const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
    if (!profile.bio) {
      throw new NotFoundException('Bio section not found for this user');
    }
    return profile.bio;
  }

  @Get('brands')
  @ApiOperation({ summary: 'Get brands section ' })
  @ApiResponse({ status: 200, description: 'Brands section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getBrandsByUserId() {
    const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
    if (!profile.brands) {
      throw new NotFoundException('Brands section not found for this user');
    }
    return profile.brands;
  }

  @Get('experience')
  @ApiOperation({ summary: 'Get experience section ' })
  @ApiResponse({ status: 200, description: 'Experience section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getExperienceByUserId() {
    const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
    if (!profile.experience) {
      throw new NotFoundException('Experience section not found for this user');
    }
    return profile.experience;
  }

  @Get('services')
  @ApiOperation({ summary: 'Get services section ' })
  @ApiResponse({ status: 200, description: 'Services section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getServicesByUserId() {
    const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
    if (!profile.services) {
      throw new NotFoundException('Services section not found for this user');
    }
    return profile.services;
  }

  @Get('faq')
  @ApiOperation({ summary: 'Get FAQ section ' })
  @ApiResponse({ status: 200, description: 'FAQ section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getFaqByUserId() {
    const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
    if (!profile.faq) {
      throw new NotFoundException('FAQ section not found for this user');
    }
    return profile.faq;
  }

  @Get('social-media')
  @ApiOperation({ summary: 'Get social media section ' })
  @ApiResponse({ status: 200, description: 'Social media section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getSocialMediaByUserId() {
    const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
    if (!profile.socialMedia) {
      throw new NotFoundException('Social media section not found for this user');
    }
    return {
      socialMedia: profile.socialMedia,
      firstName: profile.hero.firstName,
      lastName: profile.hero.lastName,
      phone: profile.hero.phone,
      email: profile.hero.email,
    };
  }

  @Get('gear')
  @ApiOperation({ summary: 'Get gear section ' })
  @ApiResponse({ status: 200, description: 'Gear section retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getGearByUserId() {
    const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
    if (!profile.gear) {
      throw new NotFoundException('Gear section not found for this user');
    }
    return profile.gear;
  }

} 