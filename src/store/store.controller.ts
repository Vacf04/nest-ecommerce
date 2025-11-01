import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';

@Controller('store')
export class StoreController {
  constructor(private readonly productService: ProductService) {}

  @Get('products/:id')
  async readOne(@Param('id') id: string) {
    return await this.productService.readOne(id);
  }
}
