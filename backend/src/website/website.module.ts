import { Module } from '@nestjs/common';
import { WebsiteProfileController } from './website-profile.controller';
import { WebsiteContactController } from './website-contact.controller';
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
    WebsiteAboutController,
    WebsiteProfileController,
    WebsiteContactController,
  ],
})
export class WebsiteModule {} 