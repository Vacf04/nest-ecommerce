import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { ProductModule } from 'src/product/product.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [ProductModule, CategoryModule],
  controllers: [StoreController],
})
export class StoreModule {}
