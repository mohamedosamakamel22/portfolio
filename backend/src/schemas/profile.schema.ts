import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  bio: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  profileImage: string;

  @Prop()
  whatsapp: string;

  @Prop()
  website: string;

  @Prop()
  avatar: string;

  @Prop()
  coverImage: string;

  // YouTube video integration
  @Prop({ type: Object })
  youtubeVideo: {
    videoId: string;
    title: string;
    description: string;
    thumbnail: string;
    embedUrl: string;
  };

  @Prop([Object])
  stats: Array<{
    key: string;
    value: string | number;
  }>;

  @Prop([String])
  specialties: string[];

  @Prop([String])
  services: string[];

  @Prop({ type: Object })
  pricing: {
    portraitSessions?: number;
    eventPhotography?: number;
    commercialRates?: string;
    weddingPackage?: any;
    portraitSession?: any;
    eventCoverage?: any;
  };

  // Enhanced social media with full URLs
  @Prop({ type: Object })
  socialMedia: {
    instagram?: {
      handle: string;
      url: string;
      followers?: string;
    };
    facebook?: {
      handle: string;
      url: string;
      followers?: string;
    };
    twitter?: {
      handle: string;
      url: string;
      followers?: string;
    };
    linkedin?: {
      handle: string;
      url: string;
      followers?: string;
    };
    youtube?: {
      handle: string;
      url: string;
      subscribers?: string;
    };
    tiktok?: {
      handle: string;
      url: string;
      followers?: string;
    };
  };

  // Call-to-action buttons with text
  @Prop({ type: Object })
  ctaButtons: {
    primary?: {
      text: string;
      url: string;
      type: string;
    };
    secondary?: {
      text: string;
      url: string;
      type: string;
    };
    whatsapp?: {
      text: string;
      url: string;
      type: string;
    };
    call?: {
      text: string;
      url: string;
      type: string;
    };
  };

  @Prop([Object])
  experience: Array<{
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date; // Optional for current positions
    isPresent?: boolean; // True if still working there
    description: string;
    achievements?: string[];
    location?: string;
    employmentType?: string; // Full-time, Part-time, Contract, Freelance
  }>;

  @Prop([Object])
  brands: Array<{
    name: string;
    logo?: string;
  }>;

  // Enhanced FAQ with rich content support
  @Prop([Object])
  faq: Array<{
    question: string;
    answer?: string; // Simple text answer
    content?: {
      title?: string;
      subtitle?: string;
      description?: string;
      body?: Array<{
        type: 'text' | 'list' | 'highlight' | 'separator';
        content?: string;
        items?: Array<{
          text: string;
          prefix?: string; // '+', '-', '•', numbers, etc.
        }>;
        style?: {
          bold?: boolean;
          italic?: boolean;
          color?: string;
          size?: string;
        };
        html?: string; // For custom HTML styling
      }>;
    };
    icon?: string;
    category?: string;
    order?: number;
    isVisible?: boolean;
  }>;

  @Prop([String])
  languages: string[];

  @Prop({ type: Object })
  availability: {
    weekdays?: boolean;
    weekends?: boolean;
    holidays?: boolean;
    bookingAdvance?: string;
  };

  @Prop()
  location: string;

  @Prop()
  travelRadius: string;

  @Prop({ default: false })
  destinationWeddings: boolean;

  @Prop({ default: true })
  isActive: boolean;

  // Additional intro text for "crafting moments and capturing stories through the lens"
  @Prop()
  introText: string;

  // More About Me button configuration
  @Prop({ type: Object })
  moreAboutMe: {
    text: string;
    url: string;
    enabled: boolean;
  };

  // Brands worked with - array of brand icons/logos
  @Prop([Object])
  brandsWorkedWith: Array<{
    name: string;
    icon: string; // Icon name, URL, or emoji
    url?: string; // Optional brand website
    order?: number;
  }>;

  // Gear and Equipment - matching website structure
  @Prop({ type: Object })
  gear: {
    cameras?: Array<{
      name: string;
      model: string;
      image?: string;
      description?: string;
      order?: number;
    }>;
    lenses?: Array<{
      name: string;
      model: string;
      image?: string;
      description?: string;
      order?: number;
    }>;
    accessories?: Array<{
      name: string;
      model: string;
      image?: string;
      description?: string;
      category?: string; // e.g., "Lighting", "Tripods", "Storage"
      order?: number;
    }>;
    editingTools?: Array<{
      name: string;
      model: string;
      image?: string;
      description?: string;
      category?: string; // e.g., "Software", "Hardware"
      order?: number;
    }>;
  };

  // What clients will find - matching website structure
  @Prop([Object])
  clientBenefits: Array<{
    title: string;
    description: string;
    icon?: string;
    order?: number;
  }>;

  // Detailed About Me sections
  @Prop()
  detailedBio: string; // More comprehensive bio text

  @Prop()
  photographyJourney: string; // Story about how they got into photography

  // Call-to-action text from website
  @Prop()
  callToAction: string;

  // Book a session button configuration
  @Prop({ type: Object })
  bookSessionButton: {
    text: string;
    url: string;
    enabled: boolean;
    style?: string;
    icon?: string;
  };

  @Prop([Object])
  workApproach: Array<{
    title: string;
    description: string;
    icon?: string;
    order?: number;
  }>;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile); 