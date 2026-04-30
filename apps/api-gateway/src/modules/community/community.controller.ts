import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('社区')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Public()
  @Get('posts')
  @ApiOperation({ summary: '获取帖子列表（公开）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findPosts(@Query() pagination: PaginationDto) {
    return this.communityService.findPosts(pagination.page, pagination.pageSize);
  }

  @Public()
  @Get('posts/:id')
  @ApiOperation({ summary: '获取帖子详情（公开）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '帖子不存在' })
  async findPost(@Param('id', ParseIntPipe) id: number) {
    return this.communityService.findPost(id);
  }

  @Public()
  @Get('posts/:id/comments')
  @ApiOperation({ summary: '获取帖子评论（公开）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findComments(
    @Param('id', ParseIntPipe) id: number,
    @Query() pagination: PaginationDto,
  ) {
    return this.communityService.findComments(id, pagination.page, pagination.pageSize);
  }

  @Post('posts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '发布帖子' })
  @ApiResponse({ status: 201, description: '发布成功' })
  async createPost(
    @CurrentUser('sub') userId: number,
    @Body() createPostDto: Record<string, unknown>,
  ) {
    return this.communityService.createPost(userId, createPostDto);
  }

  @Delete('posts/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除帖子' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async removePost(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.communityService.removePost(userId, id);
  }

  @Post('posts/:id/comments')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '发表评论' })
  @ApiResponse({ status: 201, description: '评论成功' })
  async createComment(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: Record<string, unknown>,
  ) {
    return this.communityService.createComment(userId, id, createCommentDto);
  }

  @Post('posts/:id/like')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '点赞帖子' })
  @ApiResponse({ status: 200, description: '点赞成功' })
  async likePost(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.communityService.likePost(userId, id);
  }

  @Delete('posts/:id/like')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '取消点赞' })
  @ApiResponse({ status: 200, description: '取消成功' })
  async unlikePost(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.communityService.unlikePost(userId, id);
  }
}
