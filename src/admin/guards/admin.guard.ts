import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return false;
    }

    const user = await this.userService.findById(request.user.id);

    if (!user) {
      throw new UnauthorizedException('Invalid user.');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    return false;
  }
}
