import { Module } from '@nestjs/common';
import { WebsiteProfileController } from './website-profile.controller';
import { WebsiteAlbumsController } from './website-albums.controller';
import { WebsiteReviewsController } from './website-reviews.controller';
import { WebsiteContactController } from './website-contact.controller';
import { WebsiteHomeController } from './website-home.controller';
import { WebsiteAboutController } from './website-about.controller';
import { ProfileModule } from '../profile/profile.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { AlbumsModule } from '../albums/albums.module';
import { ContactModule } from '../contact/contact.module';

@Module({
  imports: [
    ProfileModule,
    ReviewsModule,
    AlbumsModule,
    ContactModule,
  ],
  controllers: [
    WebsiteHomeController,
    WebsiteAboutController,
    WebsiteProfileController,
    WebsiteAlbumsController,
    WebsiteReviewsController,
    WebsiteContactController,
  ],
})
export class WebsiteModule {} 