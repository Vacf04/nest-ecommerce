import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { Order, Status } from '../entities/order.entity';
import { ShippingAddressDto } from './shipping-address-dto';

export class OrderResponseDto {
  readonly id: string;
  readonly user: UserResponseDto;
  readonly total: number;
  readonly status: Status;
  readonly shippingAddress: ShippingAddressDto;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(order: Order) {
    this.id = order.id;
    this.user = new UserResponseDto(order.user);
    this.total = order.total;
    this.status = order.status;
    this.shippingAddress = order.shippingAddress;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
  }
}
