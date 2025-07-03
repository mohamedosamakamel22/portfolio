import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProfileService } from '../profile/profile.service';
import { getStat } from '../common/utils/stats.helper';

@ApiTags('Website - About Page')
@Controller('website/about')
export class WebsiteAboutController {
  constructor(
    private readonly profileService: ProfileService,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get about page data (public)',
    description: 'Returns comprehensive profile data for the about page including gear, experience, and detailed bio'
  })
  async getAboutPageData() {
    const profile = await this.profileService.findActive();

    return {
      // Basic profile info
      name: profile?.hero ? `${profile.hero.firstName} ${profile.hero.lastName}` : 'Saeed Sekka',
      title: profile?.hero?.aboutMe || 'Professional Photographer',
      bio: profile?.hero?.aboutMe,
      detailedBio: profile?.hero?.aboutMe,
      photographyJourney: profile?.hero?.aboutMe,
      callToAction: profile?.hero?.aboutMe,
      bookSessionButton: profile?.ctaButtons?.primary,
      introText: profile?.hero?.aboutMe,
      
      // Contact info
      profileImage: profile?.hero?.profileImage,
      avatar: profile?.hero?.profileImage,
      coverImage: profile?.hero?.coverImage,
      
      // Contact details
      email: profile?.hero?.phone, // Using phone as email for now
      phone: profile?.hero?.phone,
      whatsapp: profile?.hero?.phone,
      address: profile?.hero?.address,
      location: profile?.hero?.address,
      website: 'https://saeedseka.framer.website/',
      
      // Professional info
      specialties: profile?.hero?.specialties || [],
      clientBenefits: [], // Not in new schema
      workApproach: [], // Not in new schema
      
      // Gear information (not in new schema)
      gear: {
        cameras: [],
        lenses: [],
        accessories: [],
        editingTools: []
      },
      
      // Experience and brands
      experience: profile?.experience?.experience || [],
      brandsWorkedWith: profile?.brands?.brands || [],
      
      // Additional info (not in new schema)
      moreAboutMe: {},
      languages: [],
      availability: {},
      
      // Pricing information (not in new schema)
      pricing: null,
    };
  }

  @Get('gear')
  @ApiOperation({ summary: 'Get gear information only (public)' })
  async getGearInfo() {
    const profile = await this.profileService.findActive();

    return {
      cameras: [],
      lenses: [],
      accessories: [],
      editingTools: []
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get about page statistics (public)' })
  async getStats() {
    const profile = await this.profileService.findActive();

    return {
      totalYears: getStat(profile?.stats?.statsValues, 'yearsExperience', 14),
      currentPosition: profile?.experience?.experience?.find(exp => exp.isPresent) || null,
      totalProjects: getStat(profile?.stats?.statsValues, 'projectsCompleted', 500),
      happyClients: getStat(profile?.stats?.statsValues, 'happyClients', 200),
      awards: getStat(profile?.stats?.statsValues, 'awards', 25),
    };
  }

  @Get('benefits')
  @ApiOperation({ summary: 'Get client benefits and work approach (public)' })
  async getClientBenefits() {
    const profile = await this.profileService.findActive();

    return {
      clientBenefits: [],
      workApproach: [],
    };
  }
} 