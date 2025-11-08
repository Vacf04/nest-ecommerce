import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';
import { OrderResponseDto } from './order-response.dto';

export class OrderResponseWithItemsDto extends OrderResponseDto {
  readonly orderItems: OrderItem[];

  constructor(order: Order) {
    super(order);
    this.orderItems = order.orderItems;
  }
}
