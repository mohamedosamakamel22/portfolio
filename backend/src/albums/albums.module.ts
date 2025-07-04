import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { Album, AlbumSchema } from '../schemas/album.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Album.name, schema: AlbumSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    CommonModule,
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService, CloudinaryService],
  exports: [AlbumsService],
})
export class AlbumsModule {} 