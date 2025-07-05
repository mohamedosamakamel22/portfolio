import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export interface Feature {
  icon: string;
  title: string;
  value: string;
  order: number;
}

export type AlbumDocument = Album & Document;

@Schema({ timestamps: true })
export class Album {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  coverImage: string;

  @Prop([Object])
  images: Array<{
    url: string;
    alt?: string;
  }>;

  @Prop([String])
  tags: string[];

  // @Prop([Object])
  // features: Feature[];

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
}

export const AlbumSchema = SchemaFactory.createForClass(Album); 