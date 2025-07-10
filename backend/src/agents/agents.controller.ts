import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { Agent } from '../schemas/agent.schema';

@ApiTags('Agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Agent created successfully', type: Agent })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentsService.create(createAgentDto);
  }

  @Get()
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of agents per page' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number' })
  @ApiResponse({ status: 200, description: 'Agents retrieved successfully', type: [Agent] })
  findAll(@Query('limit') limit: number = 10, @Query('page') page: number = 1) {
    return this.agentsService.findAll(limit, page);
  }

  @Get('active')
  @ApiResponse({ status: 200, description: 'Active agents retrieved successfully', type: [Agent] })
  findActive() {
    return this.agentsService.findActive();
  }

  @Get('count')
  @ApiResponse({ status: 200, description: 'Total agents count' })
  async getCount() {
    const total = await this.agentsService.count();
    const active = await this.agentsService.countActive();
    return { total, active };
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Agent ID' })
  @ApiResponse({ status: 200, description: 'Agent retrieved successfully', type: Agent })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Agent ID to update' })
  @ApiResponse({ status: 200, description: 'Agent updated successfully', type: Agent })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
    return this.agentsService.update(id, updateAgentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Agent ID to delete' })
  @ApiResponse({ status: 200, description: 'Agent deleted successfully' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async remove(@Param('id') id: string) {
    await this.agentsService.remove(id);
    return { message: 'Agent deleted successfully' };
  }
} 