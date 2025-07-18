import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review, ReviewSchema } from '../schemas/review.schema';
import { DigitalOceanSpacesService } from '../digitalocean-spaces/digitalocean-spaces.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
    ]),
    CommonModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, DigitalOceanSpacesService],
  exports: [ReviewsService],
})
export class ReviewsModule {} 