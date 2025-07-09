import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ContactDocument = Contact & Document;

export enum ContactStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum ContactType {
  GENERAL = 'general',
  BOOKING = 'booking',
  QUOTE = 'quote',
  COMPLAINT = 'complaint',
  COLLABORATION = 'collaboration',
}

@Schema({ timestamps: true })
export class Contact {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  contactingUser?: MongooseSchema.Types.ObjectId; // The photographer being contacted

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  clientUserId?: MongooseSchema.Types.ObjectId; // Optional: if client is registered user

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ enum: ContactType, default: ContactType.GENERAL })
  type: ContactType;

  @Prop({ enum: ContactStatus, default: ContactStatus.NEW })
  status: ContactStatus;

  @Prop()
  preferredContactMethod?: string;

  @Prop()
  eventDate?: Date;

  @Prop()
  eventLocation?: string;

  @Prop()
  budget?: string;

  @Prop()
  serviceType?: string;

  @Prop()
  adminNotes?: string;

  @Prop()
  respondedAt?: Date;

  @Prop()
  respondedBy?: string;

  @Prop({ default: false })
  isArchived: boolean;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

// Add indexes for better query performance
ContactSchema.index({ clientUserId: 1 });
ContactSchema.index({ contactingUser: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ type: 1 });
ContactSchema.index({ createdAt: -1 }); 