import { Module } from '@nestjs/common';
import { DigitalOceanSpacesService } from './digitalocean-spaces.service';

@Module({
  providers: [DigitalOceanSpacesService],
  exports: [DigitalOceanSpacesService],
})
export class DigitalOceanSpacesModule {} 