import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AgentService } from './agent.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('智能体')
@ApiBearerAuth()
@Controller('agents')
@UseGuards(JwtAuthGuard)
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get()
  @ApiOperation({ summary: '获取智能体列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(
    @CurrentUser('sub') userId: number,
    @Query() pagination: PaginationDto,
  ) {
    return this.agentService.findAll(userId, pagination.page, pagination.pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取智能体详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '智能体不存在' })
  async findOne(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentService.findOne(userId, id);
  }

  @Post()
  @ApiOperation({ summary: '创建智能体' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(
    @CurrentUser('sub') userId: number,
    @Body() createAgentDto: Record<string, unknown>,
  ) {
    return this.agentService.create(userId, createAgentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新智能体' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAgentDto: Record<string, unknown>,
  ) {
    return this.agentService.update(userId, id, updateAgentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除智能体' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentService.remove(userId, id);
  }
}
