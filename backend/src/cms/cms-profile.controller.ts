import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProfileService } from '../profile/profile.service';
import { CreateProfileDto, ProfileResponseDto } from '../profile/dto/create-profile.dto';
import { UpdateProfileDto } from '../profile/dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@ApiTags('CMS - Profile Management')
@Controller('cms/profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class CmsProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new profile (CMS)',
    description: 'Create a new profile through CMS interface'
  })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
    type: ProfileResponseDto
  })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all profiles (CMS)',
    description: 'Retrieve all profiles for CMS management'
  })
  @ApiResponse({
    status: 200,
    description: 'Profiles retrieved successfully',
    type: [ProfileResponseDto]
  })
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get profile by ID (CMS)',
    description: 'Retrieve a specific profile by ID for CMS management'
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: ProfileResponseDto
  })
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update profile (CMS)',
    description: 'Update an existing profile through CMS interface'
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: ProfileResponseDto
  })
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete profile (CMS)',
    description: 'Delete a profile through CMS interface'
  })
  @ApiResponse({
    status: 200,
    description: 'Profile deleted successfully'
  })
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
} 