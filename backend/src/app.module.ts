import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { useContainer } from 'class-validator';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AlbumsModule } from './albums/albums.module';
import { DigitalOceanSpacesModule } from './digitalocean-spaces/digitalocean-spaces.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ContactModule } from './contact/contact.module';
import { ReportModule } from './report/report.module';
import { CommonModule } from './common/common.module';
import { DatabaseIndexesService } from './database/database-indexes.service';
import { MediaModule } from './media/media.module';
import { LogsModule } from './logs/logs.module';
import { StatisticsModule } from './statistics/statistics.module';
import { AgentsModule } from './agents/agents.module';
import { IpAddressModule } from './ip-address/ip-address.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'),

    AuthModule,
    UsersModule,
    ProfileModule,
    ReviewsModule,
    AlbumsModule,
    ContactModule,
    ReportModule,
    LogsModule,
    DigitalOceanSpacesModule,
    // WebsiteModule,
    CommonModule,
    SeedModule,
    MediaModule,
    StatisticsModule,
    AgentsModule,
    IpAddressModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseIndexesService],
})
export class AppModule {
  constructor() {
    // This enables dependency injection for class-validator
    useContainer(this.constructor as any, { fallbackOnErrors: true });
  }
}
