import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { HashService } from 'src/common/hash/hash.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(dto: CreateUserDto, role: UserRole) {
    const emailExists = await this.userRepository.exists({
      where: { email: dto.email },
    });

    if (emailExists) {
      throw new BadRequestException('This email already exists.');
    }

    const hashedPassword = await this.hashService.hash(dto.password);

    const user = {
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      role,
    };

    const createdUser = await this.save(user);

    return createdUser;
  }

  async findById(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async save(user: Partial<User>) {
    return await this.userRepository.save(user);
  }
}
