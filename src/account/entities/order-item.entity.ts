import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order, { onDelete: 'CASCADE' })
  order: Order;

  @OneToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'decimal' })
  priceAtPurchase: number;
}
