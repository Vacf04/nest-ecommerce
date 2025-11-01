import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { AdminGuard } from './guards/admin.guard';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { ProductService } from 'src/product/product.service';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly productService: ProductService,
  ) {}

  @Post('users')
  async registerUserAdmin(@Body() dto: CreateUserDto) {
    const user = await this.adminService.registerUserAdmin(dto);
    return new UserResponseDto(user);
  }

  @Post('products')
  async createProduct(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto);
  }
}
