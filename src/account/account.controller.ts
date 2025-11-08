import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateCartItemDto } from 'src/cart/dto/create-cart-item.dto';
import { CartService } from 'src/cart/cart.service';
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CartItemResponseDto } from 'src/cart/dto/cart-item-response.dto';
import { UpdateCartItemDto } from 'src/cart/dto/update-cart-item.dto';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { OrderService } from 'src/order/order.service';
import { OrderResponseDto } from 'src/order/dto/order-response.dto';
import { OrderResponseWithItemsDto } from 'src/order/dto/order-response-with-items.dto';

@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
  constructor(
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
  ) {}

  @Post('cart/items')
  async createCartItem(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCartItemDto,
  ) {
    const cartItem = await this.cartService.create(req.user.id, dto);
    return new CartItemResponseDto(cartItem);
  }

  @Get('cart')
  async readCartItems(@Req() req: AuthenticatedRequest) {
    const cartItems = await this.cartService.read(req.user.id);
    return cartItems.map((item) => new CartItemResponseDto(item));
  }

  @Patch('cart/items/:id')
  async updateCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const cartItem = await this.cartService.update(req.user.id, dto, id);
    return new CartItemResponseDto(cartItem);
  }

  @Delete('cart/items/:id')
  async deleteCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') cartItemId: string,
  ) {
    const cartItem = await this.cartService.delete(req.user.id, cartItemId);
    return new CartItemResponseDto(cartItem);
  }

  @Post('checkout')
  async createOrder(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateOrderDto,
  ) {
    const order = await this.orderService.create(req.user.id, dto);
    return new OrderResponseDto(order);
  }

  @Get('orders')
  async readOrders(@Req() req: AuthenticatedRequest) {
    const orders = await this.orderService.read(req.user.id);
    return orders.map((order) => new OrderResponseWithItemsDto(order));
  }

  @Get('orders/:id')
  async readOrder(
    @Req() req: AuthenticatedRequest,
    @Param('id') orderId: string,
  ) {
    const order = await this.orderService.readOne(req.user.id, orderId);
    return new OrderResponseWithItemsDto(order);
  }
}
