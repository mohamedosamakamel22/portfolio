import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService } from '../contact/contact.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { ContactStatus } from '../schemas/contact.schema';

@ApiTags('CMS - Contact Management')
@Controller('cms/contacts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class CmsContactsController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.contactService.getContactStats();
  }

  @Get('new')
  findNew() {
    return this.contactService.findNew();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ContactStatus; adminNotes?: string },
  ) {
    return this.contactService.updateStatus(id, body.status, body.adminNotes);
  }

  @Patch(':id/notes')
  addNotes(
    @Param('id') id: string,
    @Body() body: { adminNotes: string; respondedBy?: string },
  ) {
    return this.contactService.addAdminNotes(id, body.adminNotes, body.respondedBy);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.contactService.archive(id);
  }

  @Patch(':id/unarchive')
  unarchive(@Param('id') id: string) {
    return this.contactService.unarchive(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
} 