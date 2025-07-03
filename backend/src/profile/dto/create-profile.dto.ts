import { IsString, IsEmail, IsOptional, IsBoolean, IsNumber, IsArray, ValidateNested, IsDate, IsMongoId, ValidationOptions, registerDecorator } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Custom validator for string or number
function IsStringOrNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' || typeof value === 'number';
        },
        defaultMessage() {
          return 'Value must be either a string or number';
        },
      },
    });
  };
}

class StatDto {
  @ApiProperty({ 
    example: 'yearsExperience',
    description: 'Statistic key identifier'
  })
  @IsString()
  key: string;

  @ApiProperty({ 
    example: 14,
    description: 'Can be either a string or number',
    oneOf: [
      { type: 'string' },
      { type: 'number' }
    ]
  })
  @IsStringOrNumber()
  value: string | number;
}

class PricingDto {
  @ApiProperty({ 
    example: 200,
    description: 'Price for portrait sessions in SAR'
  })
  @IsNumber()
  portraitSessions: number;

  @ApiProperty({ 
    example: 500,
    description: 'Price for event photography in SAR'
  })
  @IsNumber()
  eventPhotography: number;

  @ApiProperty({ 
    example: 'Customized based on project scope',
    description: 'Commercial photography rates description'
  })
  @IsString()
  commercialRates: string;
}

class SocialMediaDto {
  @ApiProperty({ 
    example: 'https://instagram.com/saeedsekka', 
    required: false,
    description: 'Instagram profile URL'
  })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ 
    example: 'https://facebook.com/saeedsekka', 
    required: false,
    description: 'Facebook profile URL'
  })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiProperty({ 
    example: 'https://twitter.com/saeed_sekka', 
    required: false,
    description: 'Twitter profile URL'
  })
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiProperty({ 
    example: 'https://linkedin.com/in/saeed-sekka', 
    required: false,
    description: 'LinkedIn profile URL'
  })
  @IsOptional()
  @IsString()
  linkedin?: string;
}

class ExperienceDto {
  @ApiProperty({ 
    example: 'Clavmen Studio',
    description: 'Company or organization name'
  })
  @IsString()
  company: string;

  @ApiProperty({ 
    example: 'Senior UX Designer',
    description: 'Job position or title'
  })
  @IsString()
  position: string;

  @ApiProperty({ 
    example: '2022-01-01',
    description: 'Start date of employment'
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @ApiProperty({ 
    example: '2022-12-31',
    required: false,
    description: 'End date of employment (null if current position)'
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : null)
  endDate?: Date;

  @ApiProperty({ 
    example: true,
    required: false,
    description: 'Whether this is the current position'
  })
  @IsOptional()
  @IsBoolean()
  isPresent?: boolean;

  @ApiProperty({ 
    example: 'Clavmen inspires creativity and makes learning piano fun. The sleek, lightweight body fits easily into gig bags for portability.',
    description: 'Job description and responsibilities'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: [
      'Led UX design for innovative piano learning platform',
      'Improved user engagement by 40%',
      'Designed portable and user-friendly interfaces',
      'Collaborated with cross-functional teams'
    ],
    required: false,
    description: 'List of achievements and accomplishments'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @ApiProperty({ 
    example: 'Riyadh, Saudi Arabia',
    required: false,
    description: 'Work location'
  })
  @IsOptional() 
  @IsString()
  location?: string;

  @ApiProperty({ 
    example: 'Full-time',
    required: false,
    description: 'Type of employment'
  })
  @IsOptional()
  @IsString()
  employmentType?: string;
}

class BrandDto {
  @ApiProperty({ 
    example: 'Canon',
    description: 'Brand name'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/brands/canon-logo.jpg',
    required: false,
    description: 'Brand logo URL'
  })
  @IsOptional()
  @IsString()
  logo?: string;
}

class MoreAboutMeDto {
  @ApiProperty({ 
    example: 'More About Me',
    description: 'Button text'
  })
  @IsString()
  text: string;

  @ApiProperty({ 
    example: '/about',
    description: 'URL to redirect to'
  })
  @IsString()
  url: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether the button is enabled'
  })
  @IsBoolean()
  enabled: boolean;
}

class BrandWorkedWithDto {
  @ApiProperty({ 
    example: 'Canon',
    description: 'Brand name'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: '📷',
    description: 'Brand icon or emoji'
  })
  @IsString()
  icon: string;

  @ApiProperty({ 
    example: 'https://canon.com',
    required: false,
    description: 'Brand website URL'
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ 
    example: 1,
    required: false,
    description: 'Display order'
  })
  @IsOptional()
  @IsNumber()
  order?: number;
}

class FaqContentBodyDto {
  @ApiProperty({ 
    example: 'text',
    description: 'Content type: text, list, highlight, or separator',
    enum: ['text', 'list', 'highlight', 'separator']
  })
  @IsString()
  type: 'text' | 'list' | 'highlight' | 'separator';

  @ApiProperty({ 
    example: 'You can book a session by filling out the contact form on my website or by emailing me directly at',
    required: false,
    description: 'Text content'
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ 
    example: [
      { text: 'Pre-shoot consultation', prefix: '✓' },
      { text: 'The photography session', prefix: '✓' },
      { text: 'Professional editing of selected images', prefix: '✓' }
    ],
    required: false,
    description: 'List items with optional prefixes'
  })
  @IsOptional()
  @IsArray()
  items?: Array<{
    text: string;
    prefix?: string;
  }>;

  @ApiProperty({ 
    example: { bold: true, color: '#D4A574' },
    required: false,
    description: 'Styling options for the content'
  })
  @IsOptional()
  style?: {
    bold?: boolean;
    italic?: boolean;
    color?: string;
    size?: string;
  };

  @ApiProperty({ 
    example: '<strong>Custom HTML content</strong>',
    required: false,
    description: 'Custom HTML content'
  })
  @IsOptional()
  @IsString()
  html?: string;
}

class FaqContentDto {
  @ApiProperty({ 
    example: 'Booking a Photography Session',
    required: false,
    description: 'FAQ content title'
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    example: 'Simple and straightforward process',
    required: false,
    description: 'FAQ content subtitle'
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ 
    example: 'Easy steps to book your photography session',
    required: false,
    description: 'FAQ content description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: [
      {
        type: 'text',
        content: 'You can book a session by filling out the contact form on my website or by emailing me directly at'
      },
      {
        type: 'highlight',
        content: 'SaeedSekka@email.com',
        style: { bold: true, color: '#D4A574' }
      },
      {
        type: 'text',
        content: 'I\'ll get back to you within 24 hours to discuss the details and schedule your shoot.'
      }
    ],
    required: false,
    description: 'FAQ content body sections'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqContentBodyDto)
  body?: FaqContentBodyDto[];
}

class FaqDto {
  @ApiProperty({ 
    example: 'How do I book a photography session with you?',
    description: 'FAQ question'
  })
  @IsString()
  question: string;

  @ApiProperty({ 
    example: 'You can book a session by filling out the contact form on my website or by emailing me directly at SaeedSekka@email.com',
    required: false,
    description: 'Simple text answer (alternative to content)'
  })
  @IsOptional()
  @IsString()
  answer?: string;

  @ApiProperty({ 
    example: {
      title: 'Booking a Photography Session',
      subtitle: 'Simple and straightforward process',
      description: 'Easy steps to book your photography session',
      body: [
        {
          type: 'text',
          content: 'You can book a session by filling out the contact form on my website or by emailing me directly at'
        },
        {
          type: 'highlight',
          content: 'SaeedSekka@email.com',
          style: { bold: true, color: '#D4A574' }
        },
        {
          type: 'text',
          content: 'I\'ll get back to you within 24 hours to discuss the details and schedule your shoot.'
        }
      ]
    },
    required: false,
    description: 'Rich content answer with formatting'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FaqContentDto)
  content?: FaqContentDto;

  @ApiProperty({ 
    example: '📅',
    required: false,
    description: 'FAQ icon or emoji'
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ 
    example: 'Booking',
    required: false,
    description: 'FAQ category'
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ 
    example: 1,
    required: false,
    description: 'Display order'
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({ 
    example: true,
    required: false,
    description: 'Whether the FAQ is visible'
  })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

class GearItemDto {
  @ApiProperty({ 
    example: 'Canon EOS R5',
    description: 'Gear item name'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'Canon EOS R5',
    description: 'Gear item model'
  })
  @IsString()
  model: string;

  @ApiProperty({ 
    example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/canon-eos-r5.jpg',
    required: false,
    description: 'Gear item image URL'
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ 
    example: 'Professional mirrorless camera with 45MP sensor',
    required: false,
    description: 'Gear item description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: 'Camera',
    required: false,
    description: 'Gear category'
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ 
    example: 1,
    required: false,
    description: 'Display order'
  })
  @IsOptional()
  @IsNumber()
  order?: number;
}

class GearDto {
  @ApiProperty({ 
    example: [
      {
        name: 'Canon EOS R5',
        model: 'Canon EOS R5',
        image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/canon-eos-r5.jpg',
        description: 'Professional mirrorless camera with 45MP sensor',
        order: 1
      },
      {
        name: 'Sony Alpha a7 III',
        model: 'Sony Alpha a7 III',
        image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/sony-a7iii.jpg',
        description: 'Full-frame mirrorless camera for versatile shooting',
        order: 2
      }
    ],
    required: false,
    description: 'Camera equipment list'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GearItemDto)
  cameras?: GearItemDto[];

  @ApiProperty({ 
    example: [
      {
        name: 'Canon RF 24-70mm f/2.8L IS USM',
        model: 'Canon RF 24-70mm f/2.8L IS USM',
        image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/canon-rf-24-70.jpg',
        description: 'Professional standard zoom lens with image stabilization',
        order: 1
      },
      {
        name: 'Fujinon XF 16-55mm f/2.8 R LM WR',
        model: 'Fujinon XF 16-55mm f/2.8 R LM WR',
        image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/fujinon-16-55.jpg',
        description: 'Weather-resistant standard zoom lens for Fujifilm X-mount',
        order: 2
      }
    ],
    required: false,
    description: 'Lens equipment list'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GearItemDto)
  lenses?: GearItemDto[];

  @ApiProperty({ 
    example: [
      {
        name: 'Godox AD200 Pro',
        model: 'Godox AD200 Pro',
        image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/godox-ad200.jpg',
        description: 'Portable flash strobe for versatile lighting',
        category: 'Lighting',
        order: 1
      },
      {
        name: 'Manfrotto Befree Advanced Tripod',
        model: 'Manfrotto Befree Advanced Tripod',
        image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/manfrotto-tripod.jpg',
        description: 'Lightweight carbon fiber travel tripod',
        category: 'Support',
        order: 2
      }
    ],
    required: false,
    description: 'Accessories equipment list'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GearItemDto)
  accessories?: GearItemDto[];

  @ApiProperty({ 
    example: [
      {
        name: 'Adobe Creative Cloud',
        model: 'Adobe Creative Cloud',
        image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/adobe-cc.jpg',
        description: 'Complete suite of creative applications',
        category: 'Software',
        order: 1
      },
      {
        name: 'Wacom Intuos Pro Tablet',
        model: 'Wacom Intuos Pro Tablet',
        image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/wacom-intuos.jpg',
        description: 'Professional pen tablet for precise editing',
        category: 'Hardware',
        order: 2
      }
    ],
    required: false,
    description: 'Editing tools and software list'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GearItemDto)
  editingTools?: GearItemDto[];
}

class ClientBenefitDto {
  @ApiProperty({ 
    example: 'Creative Vision',
    description: 'Benefit title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Bringing unique artistic perspective to every project with innovative composition and lighting techniques.',
    description: 'Benefit description'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: '🎨',
    required: false,
    description: 'Benefit icon or emoji'
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ 
    example: 1,
    required: false,
    description: 'Display order'
  })
  @IsOptional()
  @IsNumber()
  order?: number;
}

class WorkApproachDto {
  @ApiProperty({ 
    example: 'Discovery & Planning',
    description: 'Work approach step title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Understanding your needs, vision, and goals to create the perfect photography strategy.',
    description: 'Work approach step description'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: '🔍',
    required: false,
    description: 'Work approach step icon or emoji'
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ 
    example: 1,
    required: false,
    description: 'Display order'
  })
  @IsOptional()
  @IsNumber()
  order?: number;
}

class BookSessionButtonDto {
  @ApiProperty({ 
    example: 'Book a session',
    description: 'Button text'
  })
  @IsString()
  text: string;

  @ApiProperty({ 
    example: '/contact',
    description: 'Button redirect URL'
  })
  @IsString()
  url: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether the button is enabled'
  })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ 
    example: 'primary',
    required: false,
    description: 'Button style'
  })
  @IsOptional()
  @IsString()
  style?: string;

  @ApiProperty({ 
    example: '📸',
    required: false,
    description: 'Button icon or emoji'
  })
  @IsOptional()
  @IsString()
  icon?: string;
}

export class CreateProfileDto {
  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011', 
    required: false,
    description: 'Associated user ID'
  })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiProperty({ 
    example: 'Saeed Sekka',
    description: 'Full name'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'Photography • Photo Editing • Designer',
    description: 'Professional title or tagline'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'I am Saeed, a passionate photographer dedicated to capturing life\'s most precious moments. With a keen eye for detail and a love for storytelling, I strive to create images that are not just beautiful, but that also evoke emotion and tell a compelling story.',
    description: 'Short bio or introduction'
  })
  @IsString()
  bio: string;

  @ApiProperty({ 
    example: 'I am Saeed, a passionate photographer dedicated to crafting moments and capturing stories through the lens',
    required: false,
    description: 'Additional intro text'
  })
  @IsOptional()
  @IsString()
  introText?: string;

  @ApiProperty({ 
    example: {
      text: 'More About Me',
      url: '/about',
      enabled: true
    },
    required: false,
    description: 'More about me button configuration'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MoreAboutMeDto)
  moreAboutMe?: MoreAboutMeDto;

  @ApiProperty({ 
    example: [
      { name: 'Canon', icon: '📷', url: 'https://canon.com', order: 1 },
      { name: 'Adobe', icon: '🎨', url: 'https://adobe.com', order: 2 },
      { name: 'Lightroom', icon: '📸', url: 'https://lightroom.adobe.com', order: 3 },
      { name: 'DJI', icon: '🚁', url: 'https://dji.com', order: 4 },
      { name: 'Fujifilm', icon: '📹', url: 'https://fujifilm.com', order: 5 },
      { name: 'National Geographic', icon: '🌍', url: 'https://nationalgeographic.com', order: 6 }
    ],
    required: false,
    description: 'Brands worked with'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BrandWorkedWithDto)
  brandsWorkedWith?: BrandWorkedWithDto[];

  @ApiProperty({ 
    example: 'SaeedSekka@email.com',
    description: 'Contact email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: '+966-53-868-3923',
    description: 'Contact phone number'
  })
  @IsString()
  phone: string;

  @ApiProperty({ 
    example: 'Riyadh, Saudi Arabia',
    description: 'Location or address'
  })
  @IsString()
  address: string;

  @ApiProperty({ 
    example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/profile/saeed-main.jpg', 
    required: false,
    description: 'Profile image URL'
  })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({
    example: [
      { key: 'yearsExperience', value: 14 },
      { key: 'projectsCompleted', value: 500 },
      { key: 'happyClients', value: 200 },
      { key: 'awards', value: 25 },
      { key: 'hoursExperience', value: 15000 }
    ],
    required: false,
    description: 'Professional statistics'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatDto)
  stats?: StatDto[];

  @ApiProperty({ 
    example: ['Photography', 'Photo Editing', 'Designer'], 
    required: false,
    description: 'Professional specialties'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @ApiProperty({ 
    example: [
      'Event Photography',
      'Aerial Photography', 
      'Corporate Photography',
      'Editorial Photography',
      'Photography',
      'Photo Editing',
      'Designer'
    ], 
    required: false,
    description: 'Services offered'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @ApiProperty({
    example: {
      portraitSessions: 200,
      eventPhotography: 500,
      commercialRates: 'Customized based on project scope'
    },
    required: false,
    description: 'Pricing information'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PricingDto)
  pricing?: PricingDto;

  @ApiProperty({
    example: {
      instagram: 'https://instagram.com/saeedsekka',
      facebook: 'https://facebook.com/saeedsekka',
      twitter: 'https://twitter.com/saeed_sekka',
      linkedin: 'https://linkedin.com/in/saeed-sekka'
    },
    required: false,
    description: 'Social media links'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  socialMedia?: SocialMediaDto;

  @ApiProperty({
    example: [
      {
        company: 'Clavmen Studio',
        position: 'Senior UX Designer',
        startDate: '2022-01-01',
        endDate: null,
        isPresent: true,
        location: 'Riyadh, Saudi Arabia',
        employmentType: 'Full-time',
        description: 'Clavmen inspires creativity and makes learning piano fun. The sleek, lightweight body fits easily into gig bags for portability.',
        achievements: [
          'Led UX design for innovative piano learning platform',
          'Improved user engagement by 40%',
          'Designed portable and user-friendly interfaces',
          'Collaborated with cross-functional teams'
        ]
      },
      {
        company: 'Losify',
        position: 'Lead Product Designer',
        startDate: '2013-01-01',
        endDate: '2022-12-31',
        isPresent: false,
        location: 'Saudi Arabia',
        employmentType: 'Full-time',
        description: 'Fitness and well-being with personalized coaching and innovative wellness solutions.',
        achievements: [
          'Led product design for fitness platform',
          'Developed personalized coaching interfaces',
          'Created innovative wellness solutions',
          'Managed design team of 5 designers',
          'Launched 3 major product updates'
        ]
      }
    ],
    required: false,
    description: 'Work experience history'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experience?: ExperienceDto[];

  @ApiProperty({
    example: [
      { name: 'Canon', logo: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/brands/canon-logo.jpg' },
      { name: 'Adobe', logo: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/brands/adobe-logo.jpg' }
    ],
    required: false,
    description: 'Brands associated with'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BrandDto)
  brands?: BrandDto[];

  @ApiProperty({
    example: [
      {
        question: 'How do I book a photography session with you?',
        content: {
          title: 'Booking a Photography Session',
          subtitle: 'Simple and straightforward process',
          description: 'Easy steps to book your photography session',
          body: [
            {
              type: 'text',
              content: 'You can book a session by filling out the contact form on my website or by emailing me directly at'
            },
            {
              type: 'highlight',
              content: 'SaeedSekka@email.com',
              style: { bold: true, color: '#D4A574' }
            },
            {
              type: 'text',
              content: 'I\'ll get back to you within 24 hours to discuss the details and schedule your shoot.'
            }
          ]
        },
        icon: '📅',
        category: 'Booking',
        order: 1,
        isVisible: true
      },
      {
        question: 'What are your rates for photography sessions?',
        content: {
          title: 'Photography Session Rates',
          subtitle: 'Competitive and transparent pricing',
          body: [
            {
              type: 'list',
              items: [
                { text: 'Portrait sessions start at $200', prefix: '+' },
                { text: 'Event photography starts at $500', prefix: '+' },
                { text: 'Commercial and product photography pricing is customized based on the project scope', prefix: '+' }
              ]
            }
          ]
        },
        icon: '💰',
        category: 'Pricing',
        order: 2,
        isVisible: true
      }
    ],
    required: false,
    description: 'Frequently asked questions'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqDto)
  faq?: FaqDto[];

  @ApiProperty({ 
    example: true,
    required: false,
    description: 'Whether the profile is active'
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: {
      cameras: [
        {
          name: 'Canon EOS R5',
          model: 'Canon EOS R5',
          image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/canon-eos-r5.jpg',
          description: 'Professional mirrorless camera with 45MP sensor',
          order: 1
        }
      ],
      lenses: [
        {
          name: 'Canon RF 24-70mm f/2.8L IS USM',
          model: 'Canon RF 24-70mm f/2.8L IS USM',
          image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/canon-rf-24-70.jpg',
          description: 'Professional standard zoom lens with image stabilization',
          order: 1
        }
      ],
      accessories: [
        {
          name: 'Godox AD200 Pro',
          model: 'Godox AD200 Pro',
          image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/godox-ad200.jpg',
          description: 'Portable flash strobe for versatile lighting',
          category: 'Lighting',
          order: 1
        }
      ],
      editingTools: [
        {
          name: 'Adobe Creative Cloud',
          model: 'Adobe Creative Cloud',
          image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/adobe-cc.jpg',
          description: 'Complete suite of creative applications',
          category: 'Software',
          order: 1
        }
      ]
    },
    required: false,
    description: 'Photography equipment and gear'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => GearDto)
  gear?: GearDto;

  @ApiProperty({
    example: [
      {
        title: 'Creative Vision',
        description: 'Bringing unique artistic perspective to every project with innovative composition and lighting techniques.',
        icon: '🎨',
        order: 1
      },
      {
        title: 'Technical Expertise',
        description: 'Mastery of professional equipment and post-processing techniques to deliver exceptional image quality.',
        icon: '⚡',
        order: 2
      },
      {
        title: 'Collaborative Approach',
        description: 'Working closely with clients to understand their vision and exceed their expectations.',
        icon: '🤝',
        order: 3
      }
    ],
    required: false,
    description: 'Client benefits and value propositions'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientBenefitDto)
  clientBenefits?: ClientBenefitDto[];

  @ApiProperty({ 
    example: 'Hi there! I\'m Saeed Sekka, a passionate photographer based in the vibrant city of Riyadh. With over a decade of experience behind the lens, I specialize in capturing the unique beauty of life\'s fleeting moments, from portraits and breathtaking landscapes to dynamic product shots and lively events.',
    required: false,
    description: 'Detailed biography'
  })
  @IsOptional()
  @IsString()
  detailedBio?: string;

  @ApiProperty({ 
    example: 'My journey into photography began as a curious child with a disposable camera, fascinated by the world\'s colors and light. Over the years, this hobby transformed into a full-blown love affair with visual storytelling. Each click of the shutter is my way of freezing time, preserving emotions, and narrating stories that words alone can\'t convey. I\'ve had the privilege of working with amazing clients and have been honored with several awards for my work.',
    required: false,
    description: 'Photography journey story'
  })
  @IsOptional()
  @IsString()
  photographyJourney?: string;

  @ApiProperty({ 
    example: 'Let\'s create something extraordinary together. Whether you\'re looking to capture a special moment, need stunning visuals for your brand, or simply want to explore the world through my lens, I\'d love to hear from you! Feel free to reach out, and let\'s make magic happen.',
    required: false,
    description: 'Call to action text'
  })
  @IsOptional()
  @IsString()
  callToAction?: string;

  @ApiProperty({
    example: {
      text: 'Book a session',
      url: '/contact',
      enabled: true,
      style: 'primary',
      icon: '📸'
    },
    required: false,
    description: 'Book session button configuration'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BookSessionButtonDto)
  bookSessionButton?: BookSessionButtonDto;

  @ApiProperty({
    example: [
      {
        title: 'Discovery & Planning',
        description: 'Understanding your needs, vision, and goals to create the perfect photography strategy.',
        icon: '🔍',
        order: 1
      },
      {
        title: 'Creative Execution',
        description: 'Applying technical expertise and artistic vision to capture stunning, meaningful images.',
        icon: '📸',
        order: 2
      },
      {
        title: 'Professional Delivery',
        description: 'Careful post-processing and timely delivery of high-quality final images.',
        icon: '🎯',
        order: 3
      }
    ],
    required: false,
    description: 'Work approach methodology'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkApproachDto)
  workApproach?: WorkApproachDto[];
} 