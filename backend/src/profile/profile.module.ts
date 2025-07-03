import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ProfileObjectsController } from './profile-objects.controller';
import { ProfileUpdateObjectsController } from './profile-update-objects.controller';
import { Profile, ProfileSchema } from '../schemas/profile.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    CommonModule,
  ],
  controllers: [ProfileController, ProfileObjectsController, ProfileUpdateObjectsController],
  providers: [ProfileService, CloudinaryService],
  exports: [ProfileService],
})
export class ProfileModule {} 