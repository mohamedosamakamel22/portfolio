import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId?: MongooseSchema.Types.ObjectId; // The photographer being reviewed


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

}

export const ReviewSchema = SchemaFactory.createForClass(Review); 