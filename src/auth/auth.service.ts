import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HashService } from 'src/common/hash/hash.service';
import { LoginDto } from './dto/login-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async register(dto: CreateUserDto) {
    const emailExists = await this.authRepository.exists({
      where: {
        email: dto.email,
      },
    });

    if (emailExists) {
      throw new BadRequestException('This email already exists.');
    }

    const hashedPassword = await this.hashService.hash(dto.password);

    const user: CreateUserDto = {
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
    };

    const createdUser = await this.authRepository.save(user);

    return createdUser;
  }

  async login(dto: LoginDto) {
    const user = await this.authRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isValidPassword = await this.hashService.compare(
      dto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return 'logado';
  }
}
