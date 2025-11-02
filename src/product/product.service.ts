import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoryService } from 'src/category/category.service';
import { ProductQueryDto } from 'src/store/dto/product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';

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

  async read(query: ProductQueryDto) {
    const { page, limit, search, category, sortBy, sortOrder } = query;

    const where: FindOptionsWhere<Product> = {};

    if (search) where.name = Like(`%${search}%`);

    if (category) where.category = { id: category };

    const [data, total] = await this.productRepository.findAndCount({
      where: where,
      order: { [sortBy]: sortOrder },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['category'],
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((item) => new ProductResponseDto(item)),
      totalItems: total,
      itemsPerPage: limit,
      currentPage: page,
      totalPages: totalPages,
    };
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

  async delete(id: string) {
    const product = await this.findByIdOrFail(id);
    return await this.productRepository.remove(product);
  }
}
