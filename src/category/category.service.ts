import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryQueryDto } from 'src/store/dto/category-query.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findByIdOrFail(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slugExists = await this.categoryRepository.findOneBy({
      slug: dto.slug,
    });

    if (slugExists) {
      throw new BadRequestException('This category already exists.');
    }

    const newCategory = this.categoryRepository.create(dto);

    return await this.categoryRepository.save(newCategory);
  }

  async delete(id: string) {
    const category = await this.findByIdOrFail(id);
    return await this.categoryRepository.remove(category);
  }

  async read(query: CategoryQueryDto) {
    const { page, limit, search } = query;

    const where: FindOptionsWhere<Category> = {};

    if (search) where.name = Like(`%${search}%`);

    const [data, total] = await this.categoryRepository.findAndCount({
      where: where,
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((item) => new CategoryResponseDto(item)),
      totalItems: total,
      itemsPerPage: limit,
      currentPage: page,
      totalPages: totalPages,
    };
  }
}
