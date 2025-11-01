import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [StoreController],
})
export class StoreModule {}
