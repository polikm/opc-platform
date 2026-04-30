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
import { MarketplaceService } from './marketplace.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('交易市场')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Public()
  @Get('products')
  @ApiOperation({ summary: '获取商品列表（公开）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(@Query() pagination: PaginationDto) {
    return this.marketplaceService.findAll(pagination.page, pagination.pageSize);
  }

  @Public()
  @Get('products/:id')
  @ApiOperation({ summary: '获取商品详情（公开）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '商品不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.marketplaceService.findOne(id);
  }

  @Post('products')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '发布商品' })
  @ApiResponse({ status: 201, description: '发布成功' })
  async create(
    @CurrentUser('sub') userId: number,
    @Body() createProductDto: Record<string, unknown>,
  ) {
    return this.marketplaceService.create(userId, createProductDto);
  }

  @Put('products/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新商品' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: Record<string, unknown>,
  ) {
    return this.marketplaceService.update(userId, id, updateProductDto);
  }

  @Delete('products/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '下架商品' })
  @ApiResponse({ status: 200, description: '下架成功' })
  async remove(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.marketplaceService.remove(userId, id);
  }
}
