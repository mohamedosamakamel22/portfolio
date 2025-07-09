import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReportDocument = Report & Document;

export enum ReportStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum ReportType {
  GENERAL = 'general',
  BUG = 'bug',
  FEATURE_REQUEST = 'feature_request',
  COMPLAINT = 'complaint',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  message: string;

}

export const ReportSchema = SchemaFactory.createForClass(Report);

// Add indexes for better query performance
ReportSchema.index({ userId: 1 });
ReportSchema.index({ createdAt: -1 }); 