import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  reviewedBy?: MongooseSchema.Types.ObjectId; // The photographer being reviewed

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  clientUserId?: MongooseSchema.Types.ObjectId; // Optional: if client is also a user

  @Prop({ required: true })
  clientName: string;

  @Prop({ required: true })
  clientTitle: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  review: string;

  @Prop()
  avatar: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ default: Date.now })
  reviewDate: Date;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop()
  projectType: string; // e.g., "Product Photography", "Event Photography", etc.

  @Prop()
  serviceUsed: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review); 