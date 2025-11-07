import { IsNotEmpty, IsObject } from 'class-validator';
import { ShippingAddressDto } from './shipping-address-dto';

export class CreateOrderDto {
  @IsObject()
  @IsNotEmpty()
  shippingAddress: ShippingAddressDto;
}
