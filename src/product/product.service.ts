import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async findByIdOrFail(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  async readOne(productId: string) {
    return await this.findByIdOrFail(productId);
  }

  async create(dto: CreateProductDto) {
    const { categoryId, ...productData } = dto;
    const category = await this.categoryService.findByIdOrFail(categoryId);
    const newProduct = this.productRepository.create({
      ...productData,
      category,
    });
    return await this.productRepository.save(newProduct);
  }
}
