import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IpAddressDocument = IpAddress & Document;

@Schema({ timestamps: true })
export class IpAddress {
    @Prop({ required: true, unique: true, index: true })
    ip: string;

    @Prop({ required: true, default: 1 })
    visitCount: number;

    @Prop({ required: true, default: Date.now })
    firstVisit: Date;

    @Prop({ required: true, default: Date.now })
    lastVisit: Date;

    @Prop({ default: null })
    userAgent?: string;

    @Prop({ default: null })
    country?: string;

    @Prop({ default: null })
    city?: string;
}

export const IpAddressSchema = SchemaFactory.createForClass(IpAddress);

// Add indexes for better query performance
IpAddressSchema.index({ ip: 1 });
IpAddressSchema.index({ lastVisit: -1 });
IpAddressSchema.index({ visitCount: -1 }); 