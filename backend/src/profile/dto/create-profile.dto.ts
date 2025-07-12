import { IsString, IsEmail, IsOptional, IsBoolean, IsNumber, IsArray, ValidateNested, IsDate, IsMongoId, ValidationOptions, registerDecorator } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Type for icons that can be either string or object with type and value
export type IconType = string | { type: string; value: string };

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

// Hero Section DTO
class HeroSectionDto {
  @ApiProperty({ 
    example: 'Saeed',
    description: 'First name'
  })
  @IsString()
  firstName: string;

  @ApiProperty({ 
    example: 'Sekka',
    description: 'Last name'
  })
  @IsString()
  lastName: string;

  @ApiProperty({ 
    example: '+966-53-868-3923',
    description: 'Phone number'
  })
  @IsString()
  phone: string;

  @ApiProperty({ 
    example: 'saeed@example.com',
    description: 'Email address',
    required: false
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ 
    example: 'Riyadh, Saudi Arabia',
    description: 'Address or location'
  })
  @IsString()
  address: string;

  @ApiProperty({ 
    example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/profile/saeed-main.jpg',
    description: 'Profile image URL'
  })
  @IsString()
  profileImage: string;

  @ApiProperty({ 
    example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/cover/saeed-cover.jpg',
    description: 'Cover image URL'
  })
  @IsString()
  coverImage: string;

  @ApiProperty({ 
    example: 'I am a passionate photographer dedicated to capturing life\'s most precious moments.',
    description: 'About me text'
  })
  @IsString()
  aboutMe: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether the hero section is active'
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ 
    example: ['Photography', 'Photo Editing', 'Designer'],
    description: 'Professional specialties'
  })
  @IsArray()
  @IsString({ each: true })
  specialties: string[];
}

// YouTube Video DTO
class YouTubeVideoDto {
  @ApiProperty({ 
    example: 'dQw4w9WgXcQ',
    description: 'YouTube video ID'
  })
  @IsString()
  videoId: string;

  @ApiProperty({ 
    example: 'My Photography Journey',
    description: 'Video title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'A glimpse into my photography journey and creative process',
    description: 'Video description'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    description: 'Video thumbnail URL'
  })
  @IsString()
  thumbnail: string;

  @ApiProperty({ 
    example: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Video embed URL'
  })
  @IsString()
  embedUrl: string;
}

// Stat DTO
class StatDto {
  @ApiProperty({ 
    example: 'Years of Experience',
    description: 'Statistic title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Professional Journey',
    description: 'Statistic subtitle'
  })
  @IsString()
  subtitle: string;

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

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;
}

// IStats DTO
class IStatsDto {
  @ApiProperty({ 
    example: 'My Achievements',
    description: 'Stats section title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Numbers that tell my story',
    description: 'Stats section subtitle'
  })
  @IsString()
  subtitle: string;

  @ApiProperty({
    example: [
      { title: 'Years of Experience', subtitle: 'Professional Journey', key: 'yearsExperience', value: 14, order: 1 },
      { title: 'Projects Completed', subtitle: 'Success Stories', key: 'projectsCompleted', value: 500, order: 2 },
      { title: 'Happy Clients', subtitle: 'Satisfied Customers', key: 'happyClients', value: 200, order: 3 }
    ],
    description: 'Statistics array'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatDto)
  statsValues: StatDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the stats section is active'
  })
  @IsBoolean()
  isActive: boolean;
}

// BioButton DTO
class BioButtonDto {
  @ApiProperty({ 
    example: 'Read More',
    description: 'Button text'
  })
  @IsString()
  text: string;

  @ApiProperty({ 
    example: '/about',
    description: 'Button URL'
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

// IBio DTO
class IBioDto {
  @ApiProperty({ 
    example: 'About Me',
    description: 'Bio section title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'I am a passionate photographer dedicated to capturing life\'s most precious moments.',
    description: 'Bio description'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether the bio section is active'
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    example: {
      text: 'Read More',
      url: '/about',
      enabled: true
    },
    description: 'Bio button configuration'
  })
  @ValidateNested()
  @Type(() => BioButtonDto)
  button: BioButtonDto;
}

// Brand DTO
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

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;
}

// IBrands DTO
class IBrandsDto {
  @ApiProperty({ 
    example: 'Brands I Work With',
    description: 'Brands section title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Trusted by leading brands',
    description: 'Brands section subtitle'
  })
  @IsString()
  subtitle: string;

  @ApiProperty({
    example: [
      { name: 'Canon', logo: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/brands/canon-logo.jpg', order: 1 },
      { name: 'Adobe', logo: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/brands/adobe-logo.jpg', order: 2 }
    ],
    description: 'Brands array'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BrandDto)
  brands: BrandDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the brands section is active'
  })
  @IsBoolean()
  isActive: boolean;
}

// Experience DTO
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
    example: 'Clavmen inspires creativity and makes learning piano fun.',
    description: 'Job description and responsibilities'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;
}

// IExperience DTO
class IExperienceDto {
  @ApiProperty({ 
    example: 'My Experience',
    description: 'Experience section title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Professional journey and achievements',
    description: 'Experience section subtitle'
  })
  @IsString()
  subtitle: string;

  @ApiProperty({
    example: [
      {
        company: 'Clavmen Studio',
        position: 'Senior UX Designer',
        startDate: '2022-01-01',
        endDate: null,
        isPresent: true,
        description: 'Clavmen inspires creativity and makes learning piano fun.',
        order: 1
      }
    ],
    description: 'Experience array'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experience: ExperienceDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the experience section is active'
  })
  @IsBoolean()
  isActive: boolean;
}

// Service DTO
class ServiceDto {
  @ApiProperty({ 
    example: 'Portrait Photography',
    description: 'Service title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Professional portrait sessions for individuals and families',
    description: 'Service description'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;
}

// IService DTO
class IServiceDto {
  @ApiProperty({ 
    example: 'My Services',
    description: 'Services section title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'What I offer',
    description: 'Services section subtitle'
  })
  @IsString()
  subtitle: string;

  @ApiProperty({
    example: [
      { title: 'Portrait Photography', description: 'Professional portrait sessions', order: 1 },
      { title: 'Event Photography', description: 'Capturing special moments', order: 2 }
    ],
    description: 'Services array'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  services: ServiceDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the services section is active'
  })
  @IsBoolean()
  isActive: boolean;
}

// FAQ DTO
class FaqDto {
  @ApiProperty({ 
    example: 'How do I book a photography session?',
    description: 'FAQ question'
  })
  @IsString()
  question: string;

  @ApiProperty({ 
    example: 'You can book a session by filling out the contact form on my website.',
    description: 'FAQ answer'
  })
  @IsString()
  answer: string;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;
}

// IFaq DTO
class IFaqDto {
  @ApiProperty({ 
    example: 'Frequently Asked Questions',
    description: 'FAQ section title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Common questions answered',
    description: 'FAQ section subtitle'
  })
  @IsString()
  subtitle: string;

  @ApiProperty({
    example: [
      {
        question: 'How do I book a photography session?',
        answer: 'You can book a session by filling out the contact form on my website.',
        order: 1
      }
    ],
    description: 'FAQ array'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqDto)
  faq: FaqDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the FAQ section is active'
  })
  @IsBoolean()
  isActive: boolean;
}

// Gear DTO
class GearItemDto {
  @ApiProperty({ 
    example: 'Canon EOS R5',
    description: 'Gear item title/name'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'fas fa-camera',
    description: 'Gear item icon (FontAwesome class) - can be string or object with type and value'
  })
  @IsOptional()
  icon: IconType;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;

  @ApiProperty({ 
    example: true,
    description: 'Whether the gear item is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

class GearDto {
  @ApiProperty({ 
    example: 'Cameras',
    description: 'Gear category title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;

  @ApiProperty({ 
    example: 'Professional camera equipment',
    description: 'Gear category subtitle'
  })
  @IsString()
  subtitle: string;

  @ApiProperty({
    example: [
      { title: 'Canon EOS R5', icon: 'fas fa-camera', order: 1, isActive: true },
      { title: 'Sony A7S III', icon: 'fas fa-video', order: 2, isActive: true }
    ],
    description: 'Gear items in this category'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GearItemDto)
  gearItems: GearItemDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the gear category is active'
  })
  @IsBoolean()
  isActive: boolean;
}

class IGearDto {
  @ApiProperty({ 
    example: 'My Gear',
    description: 'Gear section title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'Professional equipment I use',
    description: 'Gear section subtitle'
  })
  @IsString()
  subtitle: string;

  @ApiProperty({
    example: [
      {
        title: 'Cameras',
        order: 1,
        subtitle: 'Professional camera equipment',
        isActive: true,
        gearItems: [
          { title: 'Canon EOS R5', icon: 'fas fa-camera', order: 1, isActive: true },
          { title: 'Sony A7S III', icon: 'fas fa-video', order: 2, isActive: true }
        ]
      },
      {
        title: 'Audio',
        order: 2,
        subtitle: 'Professional audio equipment',
        isActive: true,
        gearItems: [
          { title: 'Rode VideoMic Pro', icon: 'fas fa-microphone', order: 1, isActive: true },
          { title: 'Audio-Technica AT4040', icon: 'fas fa-microphone-alt', order: 2, isActive: true }
        ]
      }
    ],
    description: 'Gear categories array'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GearDto)
  gearSection: GearDto[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the gear section is active'
  })
  @IsBoolean()
  isActive: boolean;
}

// About Button DTO
class AboutButtonDto {
  @ApiProperty({ 
    example: 'Learn More',
    description: 'Button text'
  })
  @IsString()
  text: string;

  @ApiProperty({ 
    example: '/about-me',
    description: 'Button URL'
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

class IAboutDto {
  @ApiProperty({ 
    example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/about-me.jpg',
    description: 'About section image URL'
  })
  @IsString()
  aboutImage: string;

  @ApiProperty({ 
    example: 'I am a passionate photographer dedicated to capturing life\'s most precious moments.',
    description: 'About description'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: 'My journey started 15 years ago when I picked up my first camera...',
    description: 'Journey story'
  })
  @IsString()
  journey: string;

  @ApiProperty({ 
    example: 'What motivates me is the ability to freeze time and create lasting memories...',
    description: 'Motivation text'
  })
  @IsString()
  motivation: string;

  @ApiProperty({ 
    example: 'Let\'s work together to create something amazing!',
    description: 'Ending text'
  })
  @IsString()
  endingText: string;

  @ApiProperty({ 
    example: [
      'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/gallery-1.jpg',
      'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/gallery-2.jpg',
      'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/gallery-3.jpg'
    ],
    description: 'Array of image URLs for the about section gallery',
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({ 
    example: true,
    description: 'Whether the about section is active'
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ 
    example: 'John',
    description: 'First name',
    required: false
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ 
    example: 'Doe',
    description: 'Last name',
    required: false
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: {
      text: 'Learn More',
      url: '/about-me',
      enabled: true
    },
    description: 'About button configuration'
  })
  @ValidateNested()
  @Type(() => AboutButtonDto)
  button: AboutButtonDto;
}

// Social Media DTO
class SocialMediaItemDto {
  @ApiProperty({ 
    example: 'fab fa-instagram',
    description: 'Social media icon class or URL - can be string or object with type and value'
  })
  @IsOptional()
  icon: IconType;

  @ApiProperty({ 
    example: 'https://instagram.com/saeedsekka',
    description: 'Social media profile URL'
  })
  @IsString()
  url: string;

  @ApiProperty({ 
    example: 'Instagram',
    description: 'Social media platform title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 1,
    description: 'Display order'
  })
  @IsNumber()
  order: number;
}

class ISocialMediaDto {
  @ApiProperty({ 
    example: true,
    description: 'Whether the social media section is active'
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    example: [
      { icon: 'fab fa-instagram', url: 'https://instagram.com/saeedsekka', title: 'Instagram', order: 1 },
      { icon: 'fab fa-facebook', url: 'https://facebook.com/saeedsekka', title: 'Facebook', order: 2 },
      { icon: 'fab fa-twitter', url: 'https://twitter.com/saeed_sekka', title: 'Twitter', order: 3 },
      { icon: 'fab fa-linkedin', url: 'https://linkedin.com/in/saeed-sekka', title: 'LinkedIn', order: 4 },
      { icon: 'fab fa-youtube', url: 'https://youtube.com/@saeedsekka', title: 'YouTube', order: 5 },
      { icon: 'fab fa-tiktok', url: 'https://tiktok.com/@saeedsekka', title: 'TikTok', order: 6 }
    ],
    description: 'Array of social media platforms'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaItemDto)
  socialMedia: SocialMediaItemDto[];
}

// CTA Button DTO
class CTAButtonDto {
  @ApiProperty({ 
    example: 'Book Now',
    description: 'Button text'
  })
  @IsString()
  text: string;

  @ApiProperty({ 
    example: '/contact',
    description: 'Button URL'
  })
  @IsString()
  url: string;

  @ApiProperty({ 
    example: 'primary',
    description: 'Button type'
  })
  @IsString()
  type: string;
}

// CTA Buttons DTO
class CTAButtonsDto {
  @ApiProperty({ 
    example: { text: 'Book Now', url: '/contact', type: 'primary' },
    required: false,
    description: 'Primary CTA button'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CTAButtonDto)
  primary?: CTAButtonDto;

  @ApiProperty({ 
    example: { text: 'View Portfolio', url: '/portfolio', type: 'secondary' },
    required: false,
    description: 'Secondary CTA button'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CTAButtonDto)
  secondary?: CTAButtonDto;

  @ApiProperty({ 
    example: { text: 'WhatsApp', url: 'https://wa.me/966538683923', type: 'whatsapp' },
    required: false,
    description: 'WhatsApp CTA button'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CTAButtonDto)
  whatsapp?: CTAButtonDto;

  @ApiProperty({ 
    example: { text: 'Call Now', url: 'tel:+966538683923', type: 'call' },
    required: false,
    description: 'Call CTA button'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CTAButtonDto)
  call?: CTAButtonDto;
}

// Main Create Profile DTO
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
    example: {
      firstName: 'Saeed',
      lastName: 'Sekka',
      phone: '+966-53-868-3923',
      email: 'saeed@example.com',
      address: 'Riyadh, Saudi Arabia',
      profileImage: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/profile/saeed-main.jpg',
      coverImage: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/cover/saeed-cover.jpg',
      aboutMe: 'I am a passionate photographer dedicated to capturing life\'s most precious moments.',
      isActive: true,
      specialties: ['Photography', 'Photo Editing', 'Designer']
    },
    description: 'Hero section configuration'
  })
  @ValidateNested()
  @Type(() => HeroSectionDto)
  hero: HeroSectionDto;

  @ApiProperty({ 
    example: {
      aboutImage: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/about-me.jpg',
      description: 'I am a passionate photographer dedicated to capturing life\'s most precious moments.',
      journey: 'My journey started 15 years ago when I picked up my first camera...',
      motivation: 'What motivates me is the ability to freeze time and create lasting memories...',
      endingText: 'Let\'s work together to create something amazing!',
      images: [
        'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/gallery-1.jpg',
        'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/gallery-2.jpg',
        'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/gallery-3.jpg'
      ],
      isActive: true,
      button: {
        text: 'Learn More',
        url: '/about-me',
        enabled: true
      }
    },
    required: false,
    description: 'About section configuration'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => IAboutDto)
  about?: IAboutDto;

  @ApiProperty({ 
    example: {
      videoId: 'dQw4w9WgXcQ',
      title: 'My Photography Journey',
      description: 'A glimpse into my photography journey and creative process',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    required: false,
    description: 'YouTube video configuration'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => YouTubeVideoDto)
  youtubeVideo?: YouTubeVideoDto;

  @ApiProperty({ 
    example: {
      title: 'My Achievements',
      subtitle: 'Numbers that tell my story',
      statsValues: [
        { title: 'Years of Experience', subtitle: 'Professional Journey', key: 'yearsExperience', value: 14, order: 1 },
        { title: 'Projects Completed', subtitle: 'Success Stories', key: 'projectsCompleted', value: 500, order: 2 }
      ],
      isActive: true
    },
    required: false,
    description: 'Statistics section configuration'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => IStatsDto)
  stats?: IStatsDto;

  @ApiProperty({ 
    example: {
      title: 'About Me',
      description: 'I am a passionate photographer dedicated to capturing life\'s most precious moments.',
      isActive: true,
      button: { text: 'Read More', url: '/about', enabled: true }
    },
    required: false,
    description: 'Bio section configuration'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => IBioDto)
  bio?: IBioDto;

  @ApiProperty({ 
    example: {
      title: 'Brands I Work With',
      subtitle: 'Trusted by leading brands',
      brands: [
        { name: 'Canon', logo: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/brands/canon-logo.jpg', order: 1 },
        { name: 'Adobe', logo: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/brands/adobe-logo.jpg', order: 2 }
      ],
      isActive: true
    },
    required: false,
    description: 'Brands section configuration'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => IBrandsDto)
  brands?: IBrandsDto;

  @ApiProperty({ 
    example: {
      title: 'My Experience',
      subtitle: 'Professional journey and achievements',
      experience: [
        {
          company: 'Clavmen Studio',
          position: 'Senior UX Designer',
          startDate: '2022-01-01',
          endDate: null,
          isPresent: true,
          description: 'Clavmen inspires creativity and makes learning piano fun.',
          order: 1
        }
      ],
      isActive: true
    },
    required: false,
    description: 'Experience section configuration'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => IExperienceDto)
  experience?: IExperienceDto;

  @ApiProperty({ 
    example: {
      title: 'My Services',
      subtitle: 'What I offer',
      services: [
        { title: 'Portrait Photography', description: 'Professional portrait sessions', order: 1 },
        { title: 'Event Photography', description: 'Capturing special moments', order: 2 }
      ],
      isActive: true
    },
    required: false,
    description: 'Services section configuration'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => IServiceDto)
  services?: IServiceDto;

  @ApiProperty({ 
    example: {
      title: 'Frequently Asked Questions',
      subtitle: 'Common questions answered',
      faq: [
        {
          question: 'How do I book a photography session?',
          answer: 'You can book a session by filling out the contact form on my website.',
          order: 1
        }
      ],
      isActive: true
    },
    required: false,
    description: 'FAQ section configuration'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => IFaqDto)
  faq?: IFaqDto;

  @ApiProperty({ 
    example: {
      title: 'My Gear',
      subtitle: 'Professional equipment I use',
      gearSection: [
        {
          title: 'Cameras',
          order: 1,
          subtitle: 'Professional camera equipment',
          isActive: true,
          gearItems: [
            { title: 'Canon EOS R5', icon: 'fas fa-camera', order: 1, isActive: true },
            { title: 'Sony A7S III', icon: 'fas fa-video', order: 2, isActive: true }
          ]
        },
        {
          title: 'Audio',
          order: 2,
          subtitle: 'Professional audio equipment',
          isActive: true,
          gearItems: [
            { title: 'Rode VideoMic Pro', icon: 'fas fa-microphone', order: 1, isActive: true },
            { title: 'Audio-Technica AT4040', icon: 'fas fa-microphone-alt', order: 2, isActive: true }
          ]
        }
      ],
      isActive: true
    },
    required: false,
    description: 'Gear section configuration'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => IGearDto)
  gear?: IGearDto;

  @ApiProperty({ 
    example: {
      isActive: true,
      socialMedia: [
        { icon: 'fab fa-instagram', url: 'https://instagram.com/saeedsekka', title: 'Instagram', order: 1 },
        { icon: 'fab fa-facebook', url: 'https://facebook.com/saeedsekka', title: 'Facebook', order: 2 },
        { icon: 'fab fa-twitter', url: 'https://twitter.com/saeed_sekka', title: 'Twitter', order: 3 },
        { icon: 'fab fa-linkedin', url: 'https://linkedin.com/in/saeed-sekka', title: 'LinkedIn', order: 4 },
        { icon: 'fab fa-youtube', url: 'https://youtube.com/@saeedsekka', title: 'YouTube', order: 5 },
        { icon: 'fab fa-tiktok', url: 'https://tiktok.com/@saeedsekka', title: 'TikTok', order: 6 }
      ]
    },
    required: false,
    description: 'Social media configuration'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ISocialMediaDto)
  socialMedia?: ISocialMediaDto;

  @ApiProperty({ 
    example: {
      primary: { text: 'Book Now', url: '/contact', type: 'primary' },
      secondary: { text: 'View Portfolio', url: '/portfolio', type: 'secondary' },
      whatsapp: { text: 'WhatsApp', url: 'https://wa.me/966538683923', type: 'whatsapp' },
      call: { text: 'Call Now', url: 'tel:+966538683923', type: 'call' }
    },
    required: false,
    description: 'Call-to-action buttons configuration'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CTAButtonsDto)
  ctaButtons?: CTAButtonsDto;
}

// Profile Response DTO for API documentation
export class ProfileResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Profile ID'
  })
  _id: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Associated user ID'
  })
  userId: string;

  @ApiProperty({
    description: 'Hero section configuration'
  })
  hero: HeroSectionDto;

  @ApiProperty({
    description: 'About section configuration',
    required: false
  })
  about?: IAboutDto;

  @ApiProperty({
    description: 'YouTube video configuration',
    required: false
  })
  youtubeVideo?: YouTubeVideoDto;

  @ApiProperty({
    description: 'Statistics section configuration',
    required: false
  })
  stats?: IStatsDto;

  @ApiProperty({
    description: 'Bio section configuration',
    required: false
  })
  bio?: IBioDto;

  @ApiProperty({
    description: 'Brands section configuration',
    required: false
  })
  brands?: IBrandsDto;

  @ApiProperty({
    description: 'Experience section configuration',
    required: false
  })
  experience?: IExperienceDto;

  @ApiProperty({
    description: 'Services section configuration',
    required: false
  })
  services?: IServiceDto;

  @ApiProperty({
    description: 'FAQ section configuration',
    required: false
  })
  faq?: IFaqDto;

  @ApiProperty({
    description: 'Gear section configuration',
    required: false
  })
  gear?: IGearDto;

  @ApiProperty({
    description: 'Social media configuration',
    required: false
  })
  socialMedia?: ISocialMediaDto;

  @ApiProperty({
    description: 'Call-to-action buttons configuration',
    required: false
  })
  ctaButtons?: CTAButtonsDto;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation timestamp'
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Last update timestamp'
  })
  updatedAt: string;
} 