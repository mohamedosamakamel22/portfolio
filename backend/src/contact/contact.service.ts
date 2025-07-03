import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument, ContactStatus } from '../schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UserValidationService } from '../common/validators/user-validation.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    private userValidationService: UserValidationService,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    // Validate user IDs before creating the contact
    const usersToValidate: Array<{id: string, fieldName: string}> = [];
    
    if (createContactDto.contactingUser) {
      usersToValidate.push({ id: createContactDto.contactingUser, fieldName: 'Contacting user' });
    }
    
    if (createContactDto.clientUserId) {
      usersToValidate.push({ id: createContactDto.clientUserId, fieldName: 'Client user' });
    }

    if (usersToValidate.length > 0) {
      await this.userValidationService.validateMultipleUsers(usersToValidate);
    }

    const createdContact = new this.contactModel(createContactDto);
    return createdContact.save();
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByStatus(status: ContactStatus): Promise<Contact[]> {
    return this.contactModel.find({ status }).sort({ createdAt: -1 }).exec();
  }

  async findNew(): Promise<Contact[]> {
    return this.contactModel.find({ status: ContactStatus.NEW }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactModel.findById(id).exec();
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  async updateStatus(id: string, status: ContactStatus, adminNotes?: string): Promise<Contact> {
    const updateData: any = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    if (status !== ContactStatus.NEW) {
      updateData.respondedAt = new Date();
    }

    const updatedContact = await this.contactModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (!updatedContact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return updatedContact;
  }

  async addAdminNotes(id: string, adminNotes: string, respondedBy?: string): Promise<Contact> {
    const updateData: any = { adminNotes };
    if (respondedBy) {
      updateData.respondedBy = respondedBy;
      updateData.respondedAt = new Date();
    }

    const updatedContact = await this.contactModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (!updatedContact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return updatedContact;
  }

  async archive(id: string): Promise<Contact> {
    const updatedContact = await this.contactModel
      .findByIdAndUpdate(id, { isArchived: true }, { new: true })
      .exec();
    
    if (!updatedContact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return updatedContact;
  }

  async unarchive(id: string): Promise<Contact> {
    const updatedContact = await this.contactModel
      .findByIdAndUpdate(id, { isArchived: false }, { new: true })
      .exec();
    
    if (!updatedContact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return updatedContact;
  }

  async remove(id: string): Promise<void> {
    const result = await this.contactModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
  }

  async getContactStats(): Promise<any> {
    const stats = await this.contactModel.aggregate([
      {
        $group: {
          _id: null,
          totalContacts: { $sum: 1 },
          newContacts: { $sum: { $cond: [{ $eq: ['$status', ContactStatus.NEW] }, 1, 0] } },
          inProgressContacts: { $sum: { $cond: [{ $eq: ['$status', ContactStatus.IN_PROGRESS] }, 1, 0] } },
          resolvedContacts: { $sum: { $cond: [{ $eq: ['$status', ContactStatus.RESOLVED] }, 1, 0] } },
          archivedContacts: { $sum: { $cond: ['$isArchived', 1, 0] } },
        },
      },
    ]);

    return stats.length > 0 ? stats[0] : {
      totalContacts: 0,
      newContacts: 0,
      inProgressContacts: 0,
      resolvedContacts: 0,
      archivedContacts: 0,
    };
  }
} 