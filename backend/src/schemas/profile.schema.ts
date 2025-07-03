import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProfileDocument = Profile & Document;

// Interface for hero section
export interface HeroSection {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    profileImage: string;
    coverImage: string;
    aboutMe: string;
    isActive: boolean;
    specialties: string[];
}

// Interface for YouTube video
export interface YouTubeVideo {
    videoId: string;
    title: string;
    description: string;
    thumbnail: string;
    embedUrl: string;
}

// Interface for stats
export interface Stat {
    title: string;
    subtitle: string;
    key: string;
    value: string | number;
    order: number;
}


export interface ISocialMedia {
    isActive: boolean;
    socialMedia: SocialMedia[];
}
export interface SocialMedia {
    icon: string;
    url: string;
    title: string;
    order: number;
}

// Interface for CTA buttons
export interface CTAButton {
    text: string;
    url: string;
    type: string;
}

export interface CTAButtons {
    primary?: CTAButton;
    secondary?: CTAButton;
    whatsapp?: CTAButton;
    call?: CTAButton;
}

// Interface for experience
export interface Experience {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    isPresent?: boolean;
    description: string;
    order: number;
}

// Interface for brands
export interface Brand {
    name: string;
    logo?: string;
    order: number;
}


export interface FAQ {
    question: string;
    answer: string;
    order: number;
}

// Interface for availability
export interface Availability {
    weekdays?: boolean;
    weekends?: boolean;
    holidays?: boolean;
    bookingAdvance?: string;
}

// Interface for more about me
export interface MoreAboutMe {
    text: string;
    url: string;
    enabled: boolean;
}

// Interface for brands worked with
export interface BrandWorkedWith {
    name: string;
    icon: string;
    url?: string;
    order?: number;
}

// Interface for gear items
export interface GearItem {
    name: string;
    model: string;
    image?: string;
    description?: string;
    category?: string;
    order?: number;
}

// Interface for gear
export interface Gear {
    cameras?: GearItem[];
    lenses?: GearItem[];
    accessories?: GearItem[];
    editingTools?: GearItem[];
}

// Interface for client benefits
export interface ClientBenefit {
    title: string;
    description: string;
    icon?: string;
    order?: number;
}

// Interface for book session button
export interface BookSessionButton {
    text: string;
    url: string;
    enabled: boolean;
    style?: string;
    icon?: string;
}

// Interface for work approach
export interface WorkApproach {
    title: string;
    description: string;
    icon?: string;
    order?: number;
}

export interface IStats {
    title: string;
    subtitle: string;
    statsValues: Stat[];
    isActive: boolean;
}

export interface IBio {
    title: string;
    description: string;
    isActive: boolean;
    button: {
        text: string;
        url: string;
        enabled: boolean;
    }
}

export interface IBrands {
    title: string;
    subtitle: string;
    brands: Brand[];
    isActive: boolean;
}

export interface IExperience {
    title: string;
    subtitle: string;
    experience: Experience[];
    isActive: boolean;
}

export interface IService {
    title: string;
    subtitle: string;
    services: Service[];
    isActive: boolean;
}

export interface Service {
    title: string;
    description: string;
    order: number;
}

export interface IFaq {
    title: string;
    subtitle: string;
    faq: FAQ[];
    isActive: boolean;
}

@Schema({ timestamps: true })
export class Profile {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: MongooseSchema.Types.ObjectId;
    // YouTube video integration
    @Prop({ type: Object })
    youtubeVideo: YouTubeVideo;

    @Prop({ type: Object, required: true })
    hero: HeroSection;


    @Prop({ type: Object })
    stats: IStats;

    @Prop({ type: Object })
    bio: IBio;

    @Prop({ type: Object })
    brands: IBrands;

    @Prop({ type: Object })
    experience: IExperience;

    @Prop({ type: Object })
    services: IService;

    @Prop({ type: Object })
    faq: IFaq;

    // Enhanced social media with full URLs
    @Prop({ type: Object })
    socialMedia: ISocialMedia;

    // Call-to-action buttons with text
    @Prop({ type: Object })
    ctaButtons: CTAButtons;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile); 