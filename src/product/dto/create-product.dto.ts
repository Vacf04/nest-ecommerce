import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 500)
  description: string;

  @IsString()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
