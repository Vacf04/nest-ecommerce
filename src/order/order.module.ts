import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { CartModule } from 'src/cart/cart.module';
import { UserModule } from 'src/user/user.module';
import { Product } from 'src/product/entities/product.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, CartItem]),
    CartModule,
    UserModule,
  ],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
