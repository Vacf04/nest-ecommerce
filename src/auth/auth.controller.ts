import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { AuthenticatedRequest } from './types/authenticated-request.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.authService.register(dto);
    return new UserResponseDto(user);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getOwnUser(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.findById(req.user.id);
    if (!user) throw new NotFoundException('User Not Found.');
    return new UserResponseDto(user);
  }
}
