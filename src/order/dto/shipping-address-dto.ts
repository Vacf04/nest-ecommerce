import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  street: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  country: string;
}
