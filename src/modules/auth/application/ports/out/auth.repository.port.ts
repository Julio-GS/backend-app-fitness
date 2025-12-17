import {
  User,
  UserSession,
} from 'src/modules/auth/domain/entities/user.entity';

export abstract class AuthRepositoryPort {
  abstract register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ user: User; session: UserSession }>;
  abstract login(
    email: string,
    password: string,
  ): Promise<{ user: User; session: UserSession }>;
  abstract verifyToken(token: string): Promise<User | null>;
}
