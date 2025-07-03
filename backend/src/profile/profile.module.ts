import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile, ProfileSchema } from '../schemas/profile.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    CommonModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, CloudinaryService],
  exports: [ProfileService],
})
export class ProfileModule {} 