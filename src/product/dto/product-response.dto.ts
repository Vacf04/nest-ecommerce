import { Category } from 'src/category/entities/category.entity';
import { Product } from '../entities/product.entity';

export class ProductResponseDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly stock: number;
  readonly imageUrl: string;
  readonly category: Category;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.stock = product.stock;
    this.imageUrl = product.imageUrl;
    this.category = product.category;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}
