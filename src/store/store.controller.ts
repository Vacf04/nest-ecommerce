import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductResponseDto } from 'src/product/dto/product-response.dto';
import { ProductService } from 'src/product/product.service';
import { ProductQueryDto } from './dto/product-query.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly productService: ProductService) {}

  @Get('products/:id')
  async readOne(@Param('id') id: string) {
    const product = await this.productService.readOne(id);
    return new ProductResponseDto(product);
  }

  @Get('products')
  async read(@Query() query: ProductQueryDto) {
    return await this.productService.read(query);
  }
}
