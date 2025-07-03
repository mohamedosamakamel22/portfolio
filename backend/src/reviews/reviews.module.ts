import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review, ReviewSchema } from '../schemas/review.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
    ]),
    CommonModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, CloudinaryService],
  exports: [ReviewsService],
})
export class ReviewsModule {} 