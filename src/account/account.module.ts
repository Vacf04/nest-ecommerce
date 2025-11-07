import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { CartModule } from 'src/cart/cart.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [CartModule, OrderModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
