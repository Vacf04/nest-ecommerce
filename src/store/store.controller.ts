import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductResponseDto } from 'src/product/dto/product-response.dto';
import { ProductService } from 'src/product/product.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { CategoryService } from 'src/category/category.service';
import { CategoryQueryDto } from './dto/category-query.dto';

@Controller('store')
export class StoreController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get('products/:id')
  async readOneProduct(@Param('id') id: string) {
    const product = await this.productService.readOne(id);
    return new ProductResponseDto(product);
  }

  @Get('products')
  async readProducts(@Query() query: ProductQueryDto) {
    return await this.productService.read(query);
  }

  @Get('categories')
  async readCategories(@Query() query: CategoryQueryDto) {
    return await this.categoryService.read(query);
  }
}
