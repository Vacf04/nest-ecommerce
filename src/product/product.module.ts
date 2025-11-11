import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { CategoryModule } from 'src/category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    CategoryModule,
    TypeOrmModule.forFeature([Product]),
    CloudinaryModule,
  ],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
