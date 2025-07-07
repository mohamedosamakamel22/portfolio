import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument, LogModule, LogAction } from '../schemas/log.schema';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log.name) private logModel: Model<LogDocument>,
  ) {}

  async createLog(
    module: LogModule,
    action: LogAction,
    entityId: string,
    oldData?: any,
    newData?: any,
    userId?: string,
    userEmail?: string,
    description?: string,
  ): Promise<Log> {
    const log = new this.logModel({
      module,
      action,
      entityId,
      oldData,
      newData,
      userId,
      userEmail,
      description,
      timestamp: new Date(),
    });

    return log.save();
  }

  async findAll(limit: number = 100): Promise<Log[]> {
    return this.logModel.find().sort({ timestamp: -1 }).limit(limit).exec();
  }

  async findByModule(module: LogModule, limit: number = 100): Promise<Log[]> {
    return this.logModel.find({ module }).sort({ timestamp: -1 }).limit(limit).exec();
  }

  async findByAction(action: LogAction, limit: number = 100): Promise<Log[]> {
    return this.logModel.find({ action }).sort({ timestamp: -1 }).limit(limit).exec();
  }

  async findByEntityId(entityId: string): Promise<Log[]> {
    return this.logModel.find({ entityId }).sort({ timestamp: -1 }).exec();
  }

  async findByUserId(userId: string, limit: number = 100): Promise<Log[]> {
    return this.logModel.find({ userId }).sort({ timestamp: -1 }).limit(limit).exec();
  }

  async getLogStats(): Promise<any> {
    const totalLogs = await this.logModel.countDocuments().exec();
    const logsByModule = await this.logModel.aggregate([
      { $group: { _id: '$module', count: { $sum: 1 } } },
    ]).exec();
    const logsByAction = await this.logModel.aggregate([
      { $group: { _id: '$action', count: { $sum: 1 } } },
    ]).exec();

    return {
      totalLogs,
      logsByModule,
      logsByAction,
    };
  }
} 