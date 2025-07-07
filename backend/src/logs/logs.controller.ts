import {
  Controller,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { LogModule, LogAction } from '../schemas/log.schema';

@ApiTags('Logs')
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all logs' })
  @ApiResponse({ status: 200, description: 'List of all logs.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of logs to return (default: 100)' })
  findAll(@Query('limit') limit?: number) {
    return this.logsService.findAll(limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get log statistics' })
  @ApiResponse({ status: 200, description: 'Log statistics.' })
  getStats() {
    return this.logsService.getLogStats();
  }

  @Get('module/:module')
  @ApiOperation({ summary: 'Get logs by module' })
  @ApiParam({ name: 'module', enum: LogModule, description: 'Module name' })
  @ApiResponse({ status: 200, description: 'List of logs for the specified module.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of logs to return (default: 100)' })
  findByModule(
    @Param('module') module: LogModule,
    @Query('limit') limit?: number,
  ) {
    return this.logsService.findByModule(module, limit);
  }

  @Get('action/:action')
  @ApiOperation({ summary: 'Get logs by action' })
  @ApiParam({ name: 'action', enum: LogAction, description: 'Action type' })
  @ApiResponse({ status: 200, description: 'List of logs for the specified action.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of logs to return (default: 100)' })
  findByAction(
    @Param('action') action: LogAction,
    @Query('limit') limit?: number,
  ) {
    return this.logsService.findByAction(action, limit);
  }

  @Get('entity/:entityId')
  @ApiOperation({ summary: 'Get logs by entity ID' })
  @ApiParam({ name: 'entityId', description: 'Entity ID' })
  @ApiResponse({ status: 200, description: 'List of logs for the specified entity.' })
  findByEntityId(@Param('entityId') entityId: string) {
    return this.logsService.findByEntityId(entityId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get logs by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of logs for the specified user.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of logs to return (default: 100)' })
  findByUserId(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.logsService.findByUserId(userId, limit);
  }
} 