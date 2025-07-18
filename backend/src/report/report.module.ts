import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Report, ReportSchema } from '../schemas/report.schema';
import { CommonModule } from '../common/common.module';
import { LogsModule } from '../logs/logs.module';
import { DigitalOceanSpacesModule } from '../digitalocean-spaces/digitalocean-spaces.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    CommonModule,
    LogsModule,
    DigitalOceanSpacesModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {} 