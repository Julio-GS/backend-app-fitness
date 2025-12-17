import {
  Body,
  Controller,
  Post,
  Get,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service';
import { RegisterCommand } from '../../application/ports/in/register.use-case';
import { LoginCommand } from '../../application/ports/in/login.use-case';
import { SupabaseAuthAdapter } from '../adapters/supabase-auth.adapter';
import { Public } from 'src/shared/decorators/public.decorator';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserSession } from '../../domain/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly supabaseAuth: SupabaseAuthAdapter,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'Password123!' },
        name: { type: 'string', example: 'Juan Pérez' },
      },
      required: ['email', 'password', 'name'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        session: {
          type: 'object',
          properties: {
            access_token: { type: 'string' },
            refresh_token: { type: 'string' },
            expires_in: { type: 'number' },
            token_type: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o email ya registrado',
  })
  async register(
    @Body() body: { email: string; password: string; name: string },
  ): Promise<{ user: User; session: UserSession }> {
    try {
      this.logger.log({
        message: 'Registration request received',
        email: body.email,
      });
      const result = await this.authService.execute(
        new RegisterCommand(body.email, body.password, body.name),
      );
      this.logger.log({
        message: 'Registration successful',
        email: body.email,
      });
      return result;
    } catch (e) {
      this.logger.error({
        message: 'Registration failed in controller',
        email: body.email,
        error: e instanceof Error ? e.message : 'Unknown error',
        stack: e instanceof Error ? e.stack : undefined,
      });
      if (e instanceof Error) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'Password123!' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        session: {
          type: 'object',
          properties: {
            access_token: { type: 'string' },
            refresh_token: { type: 'string' },
            expires_in: { type: 'number' },
            token_type: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ user: User; session: UserSession }> {
    try {
      this.logger.log({ message: 'Login request received', email: body.email });
      const result = await this.authService.execute(
        new LoginCommand(body.email, body.password),
      );
      this.logger.log({ message: 'Login successful', email: body.email });
      return result;
    } catch (e) {
      this.logger.error({
        message: 'Login failed in controller',
        email: body.email,
        error: e instanceof Error ? e.message : 'Unknown error',
        stack: e instanceof Error ? e.stack : undefined,
      });
      if (e instanceof Error) {
        throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('verify')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Verificar token JWT y obtener usuario actual' })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  verify(@CurrentUser() supabaseUser: SupabaseUser | null) {
    if (!supabaseUser) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    // Convertir el usuario de Supabase a nuestra entidad de dominio
    const user = new User(
      supabaseUser.id,
      supabaseUser.email ?? '',
      new Date(supabaseUser.created_at),
      new Date(supabaseUser.updated_at ?? supabaseUser.created_at),
    );

    this.logger.log({
      message: 'Token verified successfully',
      userId: user.id,
      email: user.email,
    });

    return { user };
  }
}
