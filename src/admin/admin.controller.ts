import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { UpdateProductDto } from 'src/product/dto/update-product.dto';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';
import { OrderService } from 'src/order/order.service';
import { OrderResponseWithItemsDto } from 'src/order/dto/order-response-with-items.dto';
import { Status } from 'src/order/entities/order.entity';
import { AdminOrdersQueryDto } from 'src/order/dto/admin-orders-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly orderService: OrderService,
    private readonly cloudinaryService: CloudinaryService,
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

  @Patch('products/:id')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const product = await this.productService.update(id, dto);
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

  @Patch('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.update(id, dto);
    return new CategoryResponseDto(category);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    const category = await this.categoryService.delete(id);
    return new CategoryResponseDto(category);
  }

  @Get('orders')
  async readOrders(@Query() query: AdminOrdersQueryDto) {
    const orders = await this.orderService.readAll(query);
    return orders;
  }

  @Get('orders/:id')
  async readOneOrder(@Param('id') orderId: string) {
    const order = await this.orderService.readOneAdmin(orderId);
    return new OrderResponseWithItemsDto(order);
  }

  @Put('orders/:id/status')
  async updateStatus(@Param('id') orderId: string) {
    const order = await this.orderService.updateStatus(orderId, Status.SHIPPED);
    return new OrderResponseWithItemsDto(order);
  }

  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({
            fileType: /(image\/jpeg|image\/png|image\/gif|image\/webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const response = await this.cloudinaryService.uploadFile(file);
    return {
      url: response.secure_url,
      public_id: response.public_id,
    };
  }
}
