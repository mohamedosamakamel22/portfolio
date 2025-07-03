import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';

import { ProfileModule } from '../profile/profile.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { AlbumsModule } from '../albums/albums.module';
import { ContactModule } from '../contact/contact.module';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ProfileModule,
    ReviewsModule,
    AlbumsModule,
    ContactModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {} 