import {
  Controller,
  Put,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { UpdateStatsDto } from './dto/update-stats.dto';
import { UpdateBioDto } from './dto/update-bio.dto';
import { UpdateBrandsDto } from './dto/update-brands.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { UpdateServicesDto } from './dto/update-services.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
import { UpdateGearDto } from './dto/update-gear.dto';
import { UpdateAboutDto } from './dto/update-about.dto';

@ApiTags('Profile Update Objects (CMS)')
@Controller('profile-update-objects')
export class ProfileUpdateObjectsController {
  constructor(
    private readonly profileService: ProfileService,
  ) { }

  @Put('hero')
  @ApiOperation({ summary: 'Update hero section of a profile' })
  @ApiBody({ type: UpdateHeroDto })
  @ApiResponse({ status: 200, description: 'Hero section updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  async updateHeroByUserId(
    @Body() updateHeroDto: UpdateHeroDto
  ) {
    try {
      const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      // Merge existing hero data with updates
      const updatedHero = {
        ...profile.hero,
        ...updateHeroDto
      };
      // Update the profile with new hero data
      const updateData = { hero: updatedHero };
      const updatedProfile = await this.profileService.update("685fe192e9ad4407f2b52ce4", updateData);
      
      return {
        message: 'Hero section updated successfully',
        data: updatedProfile.hero
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update hero section');
    }
  }

  @Put('about')
  @ApiOperation({ summary: 'Update about section of a profile' })
  @ApiBody({ type: UpdateAboutDto })
  @ApiResponse({ status: 200, description: 'About section updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  async updateAboutByUserId(
    @Body() updateAboutDto: UpdateAboutDto
  ) {
    try {
      const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      // Merge existing about data with updates
      const updatedAbout = {
        ...profile.about,
        ...updateAboutDto
      };

      // Update the profile with new about data
      const updateData = { about: updatedAbout };
      const updatedProfile = await this.profileService.update("685fe192e9ad4407f2b52ce4", updateData);
      
      return {
        message: 'About section updated successfully',
        data: updatedProfile.about
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update about section');
    }
  }

  @Put('stats')
  @ApiOperation({ summary: 'Update stats section of a profile' })
  @ApiBody({ type: UpdateStatsDto })
  @ApiResponse({ status: 200, description: 'Stats section updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  async updateStatsByUserId(
    @Body() updateStatsDto: UpdateStatsDto
  ) {
    try {
      const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      // Merge existing stats data with updates
      const updatedStats = {
        ...profile.stats,
        ...updateStatsDto
      };

      // Update the profile with new stats data
      const updateData = { stats: updatedStats };
      const updatedProfile = await this.profileService.update("685fe192e9ad4407f2b52ce4", updateData);
      
      return {
        message: 'Stats section updated successfully',
        data: updatedProfile.stats
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update stats section');
    }
  }

  @Put('bio')
  @ApiOperation({ summary: 'Update bio section of a profile' })
  @ApiBody({ type: UpdateBioDto })
  @ApiResponse({ status: 200, description: 'Bio section updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  async updateBioByUserId(
    @Body() updateBioDto: UpdateBioDto
  ) {
    try {
      const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      // Merge existing bio data with updates
      const updatedBio = {
        ...profile.bio,
        ...updateBioDto
      };

      // Update the profile with new bio data
      const updateData = { bio: updatedBio };
      const updatedProfile = await this.profileService.update("685fe192e9ad4407f2b52ce4", updateData);
      
      return {
        message: 'Bio section updated successfully',
        data: updatedProfile.bio
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update bio section');
    }
  }

  @Put('brands')
  @ApiOperation({ summary: 'Update brands section of a profile' })
  @ApiBody({ type: UpdateBrandsDto })
  @ApiResponse({ status: 200, description: 'Brands section updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  async updateBrandsByUserId(
    @Body() updateBrandsDto: UpdateBrandsDto
  ) {
    try {
      const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      // Merge existing brands data with updates
      const updatedBrands = {
        ...profile.brands,
        ...updateBrandsDto
      };

      // Update the profile with new brands data
      const updateData = { brands: updatedBrands };
      const updatedProfile = await this.profileService.update("685fe192e9ad4407f2b52ce4", updateData);
      
      return {
        message: 'Brands section updated successfully',
        data: updatedProfile.brands
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update brands section');
    }
  }

  @Put('experience')
  @ApiOperation({ summary: 'Update experience section of a profile' })
  @ApiBody({ type: UpdateExperienceDto })
  @ApiResponse({ status: 200, description: 'Experience section updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  async updateExperienceByUserId(
    @Body() updateExperienceDto: UpdateExperienceDto
  ) {
    try {
      const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      // Merge existing experience data with updates
      const updatedExperience = {
        ...profile.experience,
        ...updateExperienceDto
      };

      // Update the profile with new experience data
      const updateData = { experience: updatedExperience };
      const updatedProfile = await this.profileService.update("685fe192e9ad4407f2b52ce4", updateData);
      
      return {
        message: 'Experience section updated successfully',
        data: updatedProfile.experience
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update experience section');
    }
  }

  @Put('services')
  @ApiOperation({ summary: 'Update services section of a profile' })
  @ApiBody({ type: UpdateServicesDto })
  @ApiResponse({ status: 200, description: 'Services section updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  async updateServicesByUserId(
    @Body() updateServicesDto: UpdateServicesDto
  ) {
    try {
      const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      // Merge existing services data with updates
      const updatedServices = {
        ...profile.services,
        ...updateServicesDto
      };

      // Update the profile with new services data
      const updateData = { services: updatedServices };
      const updatedProfile = await this.profileService.update("685fe192e9ad4407f2b52ce4", updateData);
      
      return {
        message: 'Services section updated successfully',
        data: updatedProfile.services
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update services section');
    }
  }

  @Put('faq')
  @ApiOperation({ summary: 'Update FAQ section of a profile' })
  @ApiBody({ type: UpdateFaqDto })
  @ApiResponse({ status: 200, description: 'FAQ section updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  async updateFaqByUserId(
    @Body() updateFaqDto: UpdateFaqDto
  ) {
    try {
      const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      // Merge existing FAQ data with updates
      const updatedFaq = {
        ...profile.faq,
        ...updateFaqDto
      };

      // Update the profile with new FAQ data
      const updateData = { faq: updatedFaq };
      const updatedProfile = await this.profileService.update("685fe192e9ad4407f2b52ce4", updateData);
      
      return {
        message: 'FAQ section updated successfully',
        data: updatedProfile.faq
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update FAQ section');
    }
  }

  @Put('social-media')
  @ApiOperation({ summary: 'Update social media section of a profile' })
  @ApiBody({ type: UpdateSocialMediaDto })
  @ApiResponse({ status: 200, description: 'Social media section updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  async updateSocialMediaByUserId(
    @Body() updateSocialMediaDto: UpdateSocialMediaDto
  ) {
    try {
      const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      // Merge existing social media data with updates
      const updatedSocialMedia = {
        email: profile.hero.email || updateSocialMediaDto.email,
        phone: profile.hero.phone || updateSocialMediaDto.phone,
        ...profile.socialMedia,
        ...updateSocialMediaDto
      };

      // Update the profile with new social media data
      const updateData = { socialMedia: updatedSocialMedia };
      const updatedProfile = await this.profileService.update("685fe192e9ad4407f2b52ce4", updateData);
      
      return {
        message: 'Social media section updated successfully',
        data: updatedProfile.socialMedia
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update social media section');
    }
  }

  @Put('gear')
  @ApiOperation({ summary: 'Update gear section of a profile' })
  @ApiBody({ type: UpdateGearDto })
  @ApiResponse({ status: 200, description: 'Gear section updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  async updateGearByUserId(
    @Body() updateGearDto: UpdateGearDto
  ) {
    try {
      const profile = await this.profileService.findOne("685fe192e9ad4407f2b52ce4");
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      // Merge existing gear data with updates
      const updatedGear = {
        ...profile.gear,
        ...updateGearDto
      };

      // Update the profile with new gear data
      const updateData = { gear: updatedGear };
      const updatedProfile = await this.profileService.update("685fe192e9ad4407f2b52ce4", updateData);
      
      return {
        message: 'Gear section updated successfully',
        data: updatedProfile.gear
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update gear section');
    }
  }
} 