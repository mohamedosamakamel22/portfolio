import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProfileDocument = Profile & Document;

// Type for icons that can be either string or object with type and value
export type IconType = string | { type: string; value: string };

// Interface for hero section
export interface HeroSection {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
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
    icon: IconType;
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
    icon: IconType;
    url?: string;
    order?: number;
}

// Interface for gear items
export interface GearItem {
    title: string;
    icon: IconType;
    order: number;
    isActive?: boolean;

}

// Interface for gear
export interface Gear {
    title: string;
    order: number;
    subtitle: string;
    gearItems: GearItem[];
    isActive: boolean;
}

// Interface for client benefits
export interface ClientBenefit {
    title: string;
    description: string;
    icon?: IconType;
    order?: number;
}

// Interface for book session button
export interface BookSessionButton {
    text: string;
    url: string;
    enabled: boolean;
    style?: string;
    icon?: IconType;
}

// Interface for work approach
export interface WorkApproach {
    title: string;
    description: string;
    icon?: IconType;
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

export interface IGear {
    title: string;
    subtitle: string;
    gearSection: Gear[];
    isActive: boolean;

}

export interface IAbout {
    title:string;
    subtitle:string
    aboutImage: string;
    description: string;
    journey: string;
    motivation: string;
    endingText: string;
    images: string[];
    isActive: boolean;
    firstName?: string;
    lastName?: string;
    button: {
        text: string;
        url: string;
        enabled: boolean;
    }
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

    // about
    @Prop({ type: Object })
    about: IAbout;


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

    @Prop({ type: Object })
    gear: IGear;

    // Enhanced social media with full URLs
    @Prop({ type: Object })
    socialMedia: ISocialMedia;

    // Call-to-action buttons with text
    @Prop({ type: Object })
    ctaButtons: CTAButtons;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

// Add indexes for better query performance
ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ createdAt: -1 }); 