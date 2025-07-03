import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactService } from './contact.service';
import { Contact, ContactSchema } from '../schemas/contact.schema';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    CommonModule,
  ],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {} 