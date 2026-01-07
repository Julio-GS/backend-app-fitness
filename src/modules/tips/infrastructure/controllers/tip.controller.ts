import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TipService } from '../../application/services/tip.service';
import { SupabaseAuthGuard } from 'src/shared/guards/supabase-auth.guard';

@Controller('tips')
@UseGuards(SupabaseAuthGuard)
export class TipController {
  constructor(private readonly service: TipService) {}

  @Get('categories')
  async getCategories() {
    return this.service.getCategories();
  }

  @Get()
  async getTipsByCategory(
    @Query('categoryId') categoryId: string,
    @Query('language') language?: string,
  ) {
    return this.service.getTipsByCategory(categoryId, language);
  }
}
