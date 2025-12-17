import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
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

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const authHeader =
      request.headers['authorization'] || request.headers['Authorization'];
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
