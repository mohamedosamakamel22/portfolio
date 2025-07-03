import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ContactService } from '../contact/contact.service';
import { CreateContactDto } from '../contact/dto/create-contact.dto';
import { ProfileService } from '../profile/profile.service';

@ApiTags('Website - Contact Page')
@Controller('website/:portfolioId/contact')
export class WebsiteContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly profileService: ProfileService,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get contact page data for portfolio (public)',
    description: 'Returns contact information, FAQ, and form configuration for specific portfolio'
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  async getContactPageData(@Param('portfolioId') portfolioId: string) {
    const profile = await this.profileService.findByUserId(portfolioId);
    
    return {
      portfolioId,
      contactInfo: {
        name: profile?.name || 'Saeed Sekka',
        email: profile?.email || 'SaeedSekka@email.com',
        phone: profile?.phone || '+966-53-868-3923',
        whatsapp: profile?.whatsapp || '+966-53-868-3923',
        address: profile?.address || 'Riyadh, Saudi Arabia',
        location: profile?.location || 'Riyadh, Saudi Arabia',
        website: profile?.website || 'https://saeedseka.framer.website/',
      },
      socialMedia: profile?.socialMedia || {},
      services: profile?.services || [],
      availability: profile?.availability || {
        status: 'available',
        message: 'Currently accepting new projects',
        responseTime: '24 hours',
      },
      businessHours: (profile as any)?.businessHours || {
        sunday: { open: '09:00', close: '17:00', isOpen: true },
        monday: { open: '09:00', close: '17:00', isOpen: true },
        tuesday: { open: '09:00', close: '17:00', isOpen: true },
        wednesday: { open: '09:00', close: '17:00', isOpen: true },
        thursday: { open: '09:00', close: '17:00', isOpen: true },
        friday: { open: '13:00', close: '17:00', isOpen: true },
        saturday: { open: '09:00', close: '17:00', isOpen: true },
      },
      faq: profile?.faq || [],
      pricing: {
        portraitSessions: 'Starting at $200',
        eventPhotography: 'Starting at $500',
        commercialPhotography: 'Custom pricing based on project scope',
        consultationFee: 'Free initial consultation',
      },
      ctaMessage: (profile as any)?.ctaMessage || "Let's create something extraordinary together!",
      responsePromise: "I'll get back to you within 24 hours to discuss your project.",
    };
  }

  @Get('info')
  @ApiOperation({ summary: 'Get contact information only for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  async getContactInfo(@Param('portfolioId') portfolioId: string) {
    const profile = await this.profileService.findByUserId(portfolioId);
    
    return {
      portfolioId,
      name: profile?.name || 'Saeed Sekka',
      email: profile?.email || 'SaeedSekka@email.com',
      phone: profile?.phone || '+966-53-868-3923',
      whatsapp: profile?.whatsapp || '+966-53-868-3923',
      address: profile?.address || 'Riyadh, Saudi Arabia',
      location: profile?.location || 'Riyadh, Saudi Arabia',
      website: profile?.website || 'https://saeedseka.framer.website/',
      socialMedia: profile?.socialMedia || {},
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