import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order, Status } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { UserService } from 'src/user/user.service';
import { CartService } from 'src/cart/cart.service';
import { DataSource } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly cartService: CartService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const cartItems = await this.cartService.read(user.id);

    if (cartItems.length === 0) {
      throw new BadRequestException('Seu carrinho está vazio.');
    }

    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].quantity > cartItems[i].product.stock) {
        throw new BadRequestException(
          `Insufficient stock to ${cartItems[i].product.name}`,
        );
      }
    }

    const total = cartItems
      .map((item) => Number(item.product.price) * item.quantity)
      .reduce((a, b) => {
        return a + b;
      }, 0);

    return this.dataSource.transaction(async (manager) => {
      const order = manager.create(Order, {
        user,
        total: total,
        shippingAddress: dto.shippingAddress,
      });
      const orderSaved = await manager.save(order);

      const orderItems = cartItems.map((item) => {
        return manager.create(OrderItem, {
          order: orderSaved,
          product: item.product,
          quantity: item.quantity,
          priceAtPurchase: item.product.price,
        });
      });
      await manager.save(orderItems);

      for (const item of cartItems) {
        await manager.update(
          Product,
          { id: item.product.id },
          { stock: item.product.stock - item.quantity },
        );
      }

      const cartItemIds = cartItems.map((item) => item.id);
      await manager.delete(CartItem, cartItemIds);

      return orderSaved;
    });
  }

  async read(userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.dataSource.transaction(async (manager) => {
      const orders = await manager.find(Order, {
        where: {
          user: { id: user.id },
        },
        relations: ['orderItems', 'user'],
      });

      if (!orders) {
        throw new NotFoundException('Orders not found.');
      }

      return orders;
    });
  }

  async readOne(userId: string, orderId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: {
          user: { id: user.id },
          id: orderId,
        },
        relations: ['orderItems', 'user'],
      });

      if (!order) {
        throw new NotFoundException('Order not found.');
      }

      return order;
    });
  }

  async readAll() {
    return this.dataSource.transaction(async (manager) => {
      const orders = await manager.find(Order, {
        relations: ['orderItems', 'user'],
      });

      if (!orders) {
        throw new NotFoundException('Orders not found.');
      }

      return orders;
    });
  }

  async readOneAdmin(orderId: string) {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: {
          id: orderId,
        },
        relations: ['orderItems', 'user'],
      });

      if (!order) {
        throw new NotFoundException('Order not found.');
      }

      return order;
    });
  }

  async updateStatus(orderId: string, status: Status) {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: {
          id: orderId,
        },
        relations: ['orderItems', 'user'],
      });

      if (!order) {
        throw new NotFoundException('Order not found.');
      }

      order.status = status;

      const orderSaved = await manager.save(order);

      if (!orderSaved) {
        throw new BadRequestException('Error updating status');
      }

      return orderSaved;
    });
  }
}
