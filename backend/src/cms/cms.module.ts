import { Module } from '@nestjs/common';
import { CmsProfileController } from './cms-profile.controller';
import { CmsAlbumsController } from './cms-albums.controller';
import { CmsReviewsController } from './cms-reviews.controller';
import { CmsContactsController } from './cms-contacts.controller';
import { CmsUsersController } from './cms-users.controller';
import { ProfileModule } from '../profile/profile.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { AlbumsModule } from '../albums/albums.module';
import { ContactModule } from '../contact/contact.module';
import { CommonModule } from '../common/common.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ProfileModule,
    ReviewsModule,
    AlbumsModule,
    ContactModule,
    CloudinaryModule,
    UsersModule,
    CommonModule,
  ],
  controllers: [
    CmsProfileController,
    CmsAlbumsController,
    CmsReviewsController,
    CmsContactsController,
    CmsUsersController,
  ],
})
export class CmsModule {} 