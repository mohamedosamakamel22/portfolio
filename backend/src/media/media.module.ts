import { Module } from '@nestjs/common';
import { DigitalOceanSpacesModule } from '../digitalocean-spaces/digitalocean-spaces.module';
import { MediaController } from './media.controller';

@Module({
  imports: [DigitalOceanSpacesModule],
  controllers: [MediaController],
})
export class MediaModule {} 