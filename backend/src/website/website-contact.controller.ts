import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ContactService } from '../contact/contact.service';
import { CreateContactDto } from '../contact/dto/create-contact.dto';
import { ProfileService } from '../profile/profile.service';

@ApiTags('Website - Contact Page')
@Controller('website/contact')
export class WebsiteContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly profileService: ProfileService,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get contact page data (public)',
    description: 'Returns contact information and availability for the contact page'
  })
  async getContactPageData() {
    const profile = await this.profileService.findActive();

    return {
      // Basic contact info
      name: profile?.hero ? `${profile.hero.firstName} ${profile.hero.lastName}` : 'Saeed Sekka',
      email: profile?.hero?.phone || 'SaeedSekka@email.com', // Using phone as email for now
      phone: profile?.hero?.phone || '+966-53-868-3923',
      whatsapp: profile?.hero?.phone || '+966-53-868-3923',
      address: profile?.hero?.address || 'Riyadh, Saudi Arabia',
      location: profile?.hero?.address || 'Riyadh, Saudi Arabia',
      website: 'https://saeedseka.framer.website/',
      
      // Availability (not in new schema)
      availability: {
        weekdays: true,
        weekends: true,
        holidays: false,
        bookingAdvance: '2 weeks'
      },
      
      // Social media
      socialMedia: profile?.socialMedia || {},
      
      // Call-to-action buttons
      ctaButtons: profile?.ctaButtons || {},
    };
  }

  @Get('info')
  @ApiOperation({ summary: 'Get basic contact information only (public)' })
  async getContactInfo() {
    const profile = await this.profileService.findActive();

    return {
      name: profile?.hero ? `${profile.hero.firstName} ${profile.hero.lastName}` : 'Saeed Sekka',
      email: profile?.hero?.phone || 'SaeedSekka@email.com', // Using phone as email for now
      phone: profile?.hero?.phone || '+966-53-868-3923',
      whatsapp: profile?.hero?.phone || '+966-53-868-3923',
      address: profile?.hero?.address || 'Riyadh, Saudi Arabia',
      location: profile?.hero?.address || 'Riyadh, Saudi Arabia',
      website: 'https://saeedseka.framer.website/',
    };
  }

  @Get('pricing')
  @ApiOperation({ summary: 'Get pricing information (public)' })
  async getPricingInfo() {
    return {
      pricing: {
        portraitSessions: 200,
        eventPhotography: 500,
        commercialPhotography: 'Custom pricing based on project scope',
      }
    };
  }

  @Post()
  @ApiOperation({ summary: 'Submit contact inquiry for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  submit(
    @Param('portfolioId') portfolioId: string,
    @Body() createContactDto: CreateContactDto
  ) {
    // Add portfolio ID to the contact data
    const contactData = {
      ...createContactDto,
      portfolioId: portfolioId
    };
    return this.contactService.create(contactData);
  }
} 