import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { ShippingAddressDto } from './shipping-address-dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;
}
