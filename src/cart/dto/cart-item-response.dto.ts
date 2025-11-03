import { ProductResponseDto } from 'src/product/dto/product-response.dto';
import { CartItem } from '../entities/cart-item.entity';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class CartItemResponseDto {
  readonly id: string;
  readonly quantity: number;
  readonly product: ProductResponseDto;
  readonly user: UserResponseDto;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(cartItem: CartItem) {
    this.id = cartItem.id;
    this.quantity = cartItem.quantity;
    this.product = new ProductResponseDto(cartItem.product);
    this.user = new UserResponseDto(cartItem.user);
    this.createdAt = cartItem.createdAt;
    this.updatedAt = cartItem.updateAt;
  }
}
