import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CardioService } from '../../application/services/cardio.service';
import { SupabaseAuthGuard } from 'src/shared/guards/supabase-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('cardio')
@UseGuards(SupabaseAuthGuard)
export class CardioController {
  constructor(private readonly service: CardioService) {}

  @Post()
  async startSession(
    @CurrentUser() user: any,
    @Body() body: { type: 'running' | 'walking'; startedAt: Date },
  ) {
    return this.service.startSession(
      user.id,
      body.type,
      new Date(body.startedAt),
    );
  }

  @Patch(':id/finish')
  async finishSession(
    @Param('id') id: string,
    @Body()
    body: {
      finishedAt: Date;
      distanceMeters?: number;
      steps?: number;
      routePolyline?: string;
    },
  ) {
    return this.service.finishSession(
      id,
      new Date(body.finishedAt),
      body.distanceMeters,
      body.steps,
      body.routePolyline,
    );
  }

  @Get('history')
  async getHistory(
    @CurrentUser() user: any,
    @Query('type') type?: 'running' | 'walking',
    @Query('from') from?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.getHistory(
      user.id,
      type,
      from ? new Date(from) : undefined,
      limit ? parseInt(limit) : undefined,
    );
  }

  @Get(':id')
  async getSessionById(@CurrentUser() user: any, @Param('id') id: string) {
    return this.service.getSessionById(id, user.id);
  }
}
