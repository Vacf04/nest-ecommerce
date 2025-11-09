import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { CategoryModule } from 'src/category/category.module';
import { OrderModule } from 'src/order/order.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    UserModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    CloudinaryModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
