import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { CartModule } from 'src/cart/cart.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [CartModule, OrderModule],
  controllers: [AccountController],
})
export class AccountModule {}
