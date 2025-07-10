import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AgentDocument = Agent & Document;

@Schema({ timestamps: true })
export class Agent {

    @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
    userId?: mongoose.Types.ObjectId;

    @Prop({ required: true })
    userName: string;

    @Prop({ required: false })
    email?: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: false })
    message?: string;

    @Prop({ default: true })
    isActive: boolean;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);

// Add indexes for better query performance
AgentSchema.index({ userName: 1 });
AgentSchema.index({ email: 1 });
AgentSchema.index({ phone: 1 });
AgentSchema.index({ createdAt: -1 }); 