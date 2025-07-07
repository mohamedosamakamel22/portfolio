import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from '../schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UserValidationService } from '../common/validators/user-validation.service';
import { LogsService } from '../logs/logs.service';
import { LogModule, LogAction } from '../schemas/log.schema';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    private userValidationService: UserValidationService,
    private logsService: LogsService,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const createdReport = new this.reportModel(createReportDto);
    const savedReport = await createdReport.save();

    // Log the creation
    await this.logsService.createLog(
      LogModule.REPORTS,
      LogAction.CREATE,
      savedReport._id?.toString() || '',
      null,
      savedReport.toObject(),
      savedReport.userId?.toString(),
      savedReport.email,
      `Report created: ${savedReport.name}`,
    );

    return savedReport;
  }

  async findAll(): Promise<Report[]> {
    return this.reportModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByUserId(userId: string): Promise<Report[]> {
    return this.reportModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportModel.findById(id).exec();
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    // Get the old data before updating
    const oldReport = await this.reportModel.findById(id).exec();
    if (!oldReport) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    const updatedReport = await this.reportModel
      .findByIdAndUpdate(id, updateReportDto, { new: true })
      .exec();
    
    if (!updatedReport) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    // Log the update
    await this.logsService.createLog(
      LogModule.REPORTS,
      LogAction.UPDATE,
      id,
      oldReport.toObject(),
      updatedReport.toObject(),
      updatedReport.userId?.toString(),
      updatedReport.email,
      `Report updated: ${updatedReport.name}`,
    );

    return updatedReport;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reportModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    // Log the deletion
    await this.logsService.createLog(
      LogModule.REPORTS,
      LogAction.DELETE,
      id,
      result.toObject(),
      null,
      result.userId?.toString(),
      result.email,
      `Report deleted: ${result.name}`,
    );
  }

  async getReportStats(): Promise<any> {
    const totalReports = await this.reportModel.countDocuments().exec();
    const reportsWithUser = await this.reportModel.countDocuments({ userId: { $exists: true, $ne: null } }).exec();
    const reportsWithoutUser = totalReports - reportsWithUser;

    return {
      totalReports,
      reportsWithUser,
      reportsWithoutUser,
    };
  }
} 