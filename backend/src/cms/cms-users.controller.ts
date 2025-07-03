import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { UserRole } from '../schemas/user.schema';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/cms-user.dto';

@ApiTags('CMS - Users (Admin Only)')
@ApiBearerAuth()
@Controller('cms/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class CmsUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      // Check if user already exists
      const existingUser = await this.usersService.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      const user = await this.usersService.create(createUserDto);
      return {
        success: true,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create user: ' + error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    try {
      const users = await this.usersService.findAll();
      
      let filteredUsers = users;

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = filteredUsers.filter(
          user =>
            user.email.toLowerCase().includes(searchLower) ||
            user.firstName?.toLowerCase().includes(searchLower) ||
            user.lastName?.toLowerCase().includes(searchLower)
        );
      }

      // Apply role filter
      if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role);
      }

      // Apply pagination
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: paginatedUsers,
        meta: {
          total: filteredUsers.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(filteredUsers.length / limitNum),
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve users: ' + error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findById(id);
      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve user: ' + error.message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      // If email is being updated, check if it's already taken by another user
      if (updateUserDto.email) {
        const existingUser = await this.usersService.findByEmail(updateUserDto.email);
        if (existingUser && (existingUser as any)._id.toString() !== id) {
          throw new BadRequestException('Email is already taken by another user');
        }
      }

      const user = await this.usersService.update(id, updateUserDto);
      return {
        success: true,
        message: 'User updated successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user: ' + error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(id);
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException('Failed to delete user: ' + error.message);
    }
  }

  @Get('stats/summary')
  @ApiOperation({ summary: 'Get user statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
  })
  async getUserStats() {
    try {
      const users = await this.usersService.findAll();
      
      const stats = {
        total: users.length,
        admins: users.filter(user => user.role === UserRole.ADMIN).length,
        customers: users.filter(user => user.role === UserRole.CUSTOMER).length,
        active: users.filter(user => user.isActive === true).length,
        inactive: users.filter(user => user.isActive === false).length,
        recentRegistrations: users.filter(
          user => new Date((user as any).createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
      };

      return {
        success: true,
        message: 'User statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve user statistics: ' + error.message);
    }
  }
} 