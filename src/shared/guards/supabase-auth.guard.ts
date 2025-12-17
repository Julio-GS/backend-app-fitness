import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  createClient,
  SupabaseClient,
  User as SupabaseUser,
} from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

interface AuthRequest {
  headers: Record<string, string | undefined>;
  user?: SupabaseUser;
  [key: string]: unknown;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseAuthGuard.name);

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    const supabaseUrl: string =
      this.configService.get<string>('SUPABASE_URL') || '';
    const supabaseAnonKey: string =
      this.configService.get<string>('SUPABASE_ANON_KEY') || '';
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase credentials are not set in environment variables',
      );
    }
    this.supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
    ) as SupabaseClient;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verificar si la ruta es pública
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const authHeader =
      request.headers['authorization'] || request.headers['Authorization'];

    this.logger.debug({
      message: 'Guard executing',
      isPublic,
      hasAuthHeader: !!authHeader,
    });

    // Si es ruta pública
    if (isPublic) {
      // Intentar extraer el usuario si hay token (opcional)
      if (authHeader && typeof authHeader === 'string') {
        const token = authHeader.replace('Bearer ', '').trim();
        this.logger.debug({
          message: 'Attempting to extract user from token in public route',
          tokenLength: token.length,
        });

        const { data, error } = await this.supabase.auth.getUser(token);

        // Si el token es válido, adjuntar el usuario al request
        if (!error && data?.user) {
          request.user = data.user;
          this.logger.log({
            message: 'User authenticated in public route',
            userId: data.user.id,
          });
        } else {
          this.logger.warn({
            message: 'Invalid token in public route (ignored)',
            error: error?.message,
          });
        }
      } else {
        this.logger.debug({
          message: 'No authorization header in public route',
        });
      }
      return true;
    }

    // Si es ruta protegida, el token es OBLIGATORIO
    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data?.user) {
      throw new UnauthorizedException(
        error?.message || 'Invalid or expired token',
      );
    }

    request.user = data.user;
    return true;
  }
}
