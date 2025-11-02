import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { AdminGuard } from './guards/admin.guard';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { ProductService } from 'src/product/product.service';
import { ProductResponseDto } from 'src/product/dto/product-response.dto';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/entities/user.entity';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  @Post('users')
  async registerUserAdmin(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto, UserRole.ADMIN);
    return new UserResponseDto(user);
  }

  @Post('products')
  async createProduct(@Body() dto: CreateProductDto) {
    const product = await this.productService.create(dto);
    return new ProductResponseDto(product);
  }
}
