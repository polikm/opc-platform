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
import { ContentService } from './content.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('内容')
@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取内容列表（公开）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(@Query() pagination: PaginationDto) {
    return this.contentService.findAll(pagination.page, pagination.pageSize);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '获取内容详情（公开）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '内容不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '创建内容' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(
    @CurrentUser('sub') userId: number,
    @Body() createContentDto: Record<string, unknown>,
  ) {
    return this.contentService.create(userId, createContentDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新内容' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContentDto: Record<string, unknown>,
  ) {
    return this.contentService.update(userId, id, updateContentDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除内容' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.contentService.remove(userId, id);
  }
}
