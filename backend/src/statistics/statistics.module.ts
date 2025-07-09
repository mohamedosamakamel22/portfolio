import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { Review, ReviewSchema } from '../schemas/review.schema';
import { Album, AlbumSchema } from '../schemas/album.schema';
import { Profile, ProfileSchema } from '../schemas/profile.schema';
import { Report, ReportSchema } from '../schemas/report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Report.name, schema: ReportSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {} 