import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) {}

  async registerUserAdmin(dto: CreateUserDto) {
    return await this.userService.create(dto, UserRole.ADMIN);
  }
}
