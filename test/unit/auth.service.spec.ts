import { AuthService } from '../../src/modules/auth/application/services/auth.service';
import { AuthRepositoryPort } from '../../src/modules/auth/application/ports/out/auth.repository.port';
import { RegisterCommand } from '../../src/modules/auth/application/ports/in/register.use-case';
import { LoginCommand } from '../../src/modules/auth/application/ports/in/login.use-case';
import {
  User,
  UserSession,
} from '../../src/modules/auth/domain/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let repo: jest.Mocked<AuthRepositoryPort>;

  beforeEach(() => {
    repo = {
      register: jest.fn(),
      login: jest.fn(),
      verifyToken: jest.fn(),
    } as jest.Mocked<AuthRepositoryPort>;
    service = new AuthService(repo);
  });

  it('should register a user', async () => {
    const user: User = {
      id: '1',
      email: 'a',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const session: UserSession = {
      access_token: 'token',
      refresh_token: 'refresh',
      expires_in: 3600,
      token_type: 'bearer',
    };
    repo.register.mockResolvedValue({ user, session });
    const result = await service.execute(new RegisterCommand('a', 'b', 'c'));
    expect(result.user).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.register).toHaveBeenCalledWith('a', 'b', 'c');
  });

  it('should login a user', async () => {
    const user: User = {
      id: '1',
      email: 'a',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const session: UserSession = {
      access_token: 'token',
      refresh_token: 'refresh',
      expires_in: 3600,
      token_type: 'bearer',
    };
    repo.login.mockResolvedValue({ user, session });
    const result = await service.execute(new LoginCommand('a', 'b'));
    expect(result.user).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.login).toHaveBeenCalledWith('a', 'b');
  });
});
