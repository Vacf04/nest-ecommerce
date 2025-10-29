import { User } from 'src/auth/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @OneToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @Column()
  quantity: number;
}
