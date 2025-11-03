import { User } from 'src/user/entities/user.entity';

export class AuthenticatedRequest extends Request {
  user: User;
}
