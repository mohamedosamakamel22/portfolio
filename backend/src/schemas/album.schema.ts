import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema({ timestamps: true })
export class Album {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string; // e.g., "Travel", "Commercial", "Conceptual", "Product", "Wildlife & Nature", "Aerial & Drone"

  @Prop({ required: true })
  projectType: string; // e.g., "Collaboration", "Commercial", "Passion Project"

  @Prop()
  coverImage: string;

  @Prop([Object])
  images: Array<{
    url: string;
    publicId: string;
    caption?: string;
    alt?: string;
  }>;

  @Prop([String])
  tags: string[];

  @Prop()
  client: string;

  @Prop()
  location: string;

  @Prop()
  shootDate: Date;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ type: Object })
  metadata: {
    camera?: string;
    lens?: string;
    settings?: string;
  };

  // Album specifications/contract details with icon, name, and value
  @Prop([Object])
  specifications: Array<{
    icon: string; // Icon name or emoji
    name: string; // e.g., "Category", "Project Type", "Camera", "Lenses"
    value: string; // e.g., "Travel", "Collaboration", "Fujifilm X-T4"
    order?: number;
  }>;

  // Action button with redirect URL (e.g., "Buy Prints")
  @Prop({ type: Object })
  actionButton: {
    text: string; // e.g., "Buy Prints"
    url: string; // Redirect URL
    enabled: boolean;
    style?: string; // e.g., "primary", "secondary"
  };

  // Event/shoot date
  @Prop()
  eventDate: Date;

  // Additional likes counter
  @Prop({ default: 0 })
  likes: number;

  // YouTube video integration for albums
  @Prop({ type: Object })
  youtubeVideo?: {
    videoId: string; // YouTube video ID
    title: string; // Video title
    description: string; // Video description
    thumbnail: string; // Video thumbnail URL
    embedUrl: string; // YouTube embed URL
    duration?: string; // Video duration (optional)
  };

  // Additional project details
  @Prop()
  projectGoal?: string; // Project goal/objective description
}

export const AlbumSchema = SchemaFactory.createForClass(Album); 