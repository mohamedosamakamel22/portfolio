import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProfileService } from '../profile/profile.service';
import { getStat } from '../common/utils/stats.helper';

@ApiTags('Website - About Page')
@Controller('website/about')
export class WebsiteAboutController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get about page data (public)',
    description: 'Returns comprehensive profile data for the about page including gear, experience, and detailed bio'
  })
  async getAboutPageData() {
    const profile = await this.profileService.findActive();
    
    if (!profile) {
      return {
        message: 'Profile not found',
        data: null
      };
    }

    return {
      // Basic Information
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      detailedBio: profile.detailedBio,
      photographyJourney: profile.photographyJourney,
      callToAction: profile.callToAction,
      bookSessionButton: profile.bookSessionButton,
      introText: profile.introText,
      
      // Images
      profileImage: profile.profileImage,
      avatar: profile.avatar,
      coverImage: profile.coverImage,
      
      // Contact Information
      email: profile.email,
      phone: profile.phone,
      whatsapp: profile.whatsapp,
      address: profile.address,
      location: profile.location,
      website: profile.website,
      
      // Professional Experience
      experience: profile.experience || [],
      
      // Services and Skills
      services: profile.services || [],
      specialties: profile.specialties || [],
      
      // What clients will find
      clientBenefits: profile.clientBenefits || [],
      workApproach: profile.workApproach || [],
      
      // Comprehensive Gear Information
      gear: {
        cameras: profile.gear?.cameras || [],
        lenses: profile.gear?.lenses || [],
        accessories: profile.gear?.accessories || [],
        editingTools: profile.gear?.editingTools || []
      },
      
      // Statistics
      stats: profile.stats || [
        { key: 'hoursExperience', value: 15000 },
        { key: 'yearsExperience', value: 14 },
        { key: 'awards', value: 25 },
        { key: 'happyClients', value: 200 },
        { key: 'projectsCompleted', value: 500 }
      ],
      
      // Social Media
      socialMedia: profile.socialMedia || {},
      
      // Brands worked with
      brandsWorkedWith: profile.brandsWorkedWith || [],
      
      // Call-to-action buttons
      ctaButtons: profile.ctaButtons || {},
      moreAboutMe: profile.moreAboutMe || {},
      
      // FAQ for about page
      faq: profile.faq || [],
      
      // Additional info
      languages: profile.languages || [],
      availability: profile.availability || {},
      
      // YouTube video if available
      youtubeVideo: profile.youtubeVideo || null,
      
      // Pricing information (if public)
      pricing: profile.pricing || null,
    };
  }

  @Get('gear')
  @ApiOperation({ summary: 'Get gear information only (public)' })
  async getGearInfo() {
    const profile = await this.profileService.findActive();
    
    return {
      cameras: profile?.gear?.cameras || [],
      lenses: profile?.gear?.lenses || [],
      accessories: profile?.gear?.accessories || [],
      editingTools: profile?.gear?.editingTools || []
    };
  }

  @Get('experience')
  @ApiOperation({ summary: 'Get professional experience only (public)' })
  async getExperience() {
    const profile = await this.profileService.findActive();
    
    return {
      experience: profile?.experience || [],
      totalYears: getStat(profile?.stats, 'yearsExperience', 14),
      currentPosition: profile?.experience?.find(exp => exp.isPresent) || null
    };
  }

  @Get('benefits')
  @ApiOperation({ summary: 'Get client benefits and work approach (public)' })
  async getClientBenefits() {
    const profile = await this.profileService.findActive();
    
    return {
      clientBenefits: profile?.clientBenefits || [],
      workApproach: profile?.workApproach || [],
      services: profile?.services || []
    };
  }
} 