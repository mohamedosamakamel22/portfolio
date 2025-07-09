import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LogDocument = Log & Document;

export enum LogAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum LogModule {
  REPORTS = 'reports',
}

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true, enum: LogModule })
  module: LogModule;

  @Prop({ required: true, enum: LogAction })
  action: LogAction;

  @Prop({ required: true })
  entityId: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  oldData?: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  newData?: any;

  @Prop()
  userId?: string;

  @Prop()
  userEmail?: string;

  @Prop()
  description?: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);

// Add indexes for better query performance
LogSchema.index({ userId: 1 });
LogSchema.index({ module: 1 });
LogSchema.index({ action: 1 });
LogSchema.index({ entityId: 1 });
LogSchema.index({ timestamp: -1 }); 