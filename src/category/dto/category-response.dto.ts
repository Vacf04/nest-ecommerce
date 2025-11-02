import { Category } from 'src/category/entities/category.entity';

export class CategoryResponseDto {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.slug = category.slug;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}
