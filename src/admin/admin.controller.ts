import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { AdminGuard } from './guards/admin.guard';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { ProductService } from 'src/product/product.service';
import { ProductResponseDto } from 'src/product/dto/product-response.dto';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/entities/user.entity';
import { CategoryService } from 'src/category/category.service';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { CategoryResponseDto } from 'src/category/dto/category-response.dto';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
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

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.delete(id);
    return new ProductResponseDto(product);
  }

  @Post('categories')
  async createCategory(@Body() dto: CreateCategoryDto) {
    const category = await this.categoryService.create(dto);
    return new CategoryResponseDto(category);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    const category = await this.categoryService.delete(id);
    return new CategoryResponseDto(category);
  }
}
