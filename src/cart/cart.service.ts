import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  async create(userId: string, dto: CreateCartItemDto) {
    const product = await this.productService.readOne(dto.productId);
    const user = await this.userService.findById(userId);

    if (!user || !product) {
      throw new NotFoundException('User or Product not found.');
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: {
        product,
        user,
      },
    });

    if (cartItem) {
      const quantity = dto.quantity + cartItem.quantity;
      if (quantity > product.stock)
        throw new BadRequestException('Quantity cannot be greater than stock.');
      cartItem.quantity = quantity;
      return await this.cartItemRepository.save(cartItem);
    }

    if (dto.quantity > product.stock)
      throw new BadRequestException('Quantity cannot be greater than stock.');

    const newCartItem = this.cartItemRepository.create({
      product,
      user,
      quantity: dto.quantity,
    });
    return await this.cartItemRepository.save(newCartItem);
  }
}
