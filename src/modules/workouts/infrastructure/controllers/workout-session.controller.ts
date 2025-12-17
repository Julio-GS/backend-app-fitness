import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Inject,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { StartWorkoutSessionDto } from '../dto/start-workout-session.dto';
import { SaveExerciseSetDto } from '../dto/save-exercise-set.dto';
import { START_WORKOUT_SESSION_USE_CASE, StartWorkoutSessionUseCase } from '../../application/ports/in/start-workout-session.use-case';
import { SAVE_EXERCISE_SET_USE_CASE, SaveExerciseSetUseCase } from '../../application/ports/in/save-exercise-set.use-case';
import { FINISH_WORKOUT_SESSION_USE_CASE, FinishWorkoutSessionUseCase } from '../../application/ports/in/finish-workout-session.use-case';
import { GET_WORKOUT_SESSIONS_USE_CASE, GetWorkoutSessionsUseCase } from '../../application/ports/in/get-workout-sessions.use-case';
import { GET_WORKOUT_SESSION_BY_ID_USE_CASE, GetWorkoutSessionByIdUseCase } from '../../application/ports/in/get-workout-session-by-id.use-case';
import { SupabaseAuthGuard } from '../../../../shared/guards/supabase-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';

@Controller('workout-sessions')
@UseGuards(SupabaseAuthGuard)
export class WorkoutSessionController {
  constructor(
    @Inject(START_WORKOUT_SESSION_USE_CASE)
    private readonly startSessionUseCase: StartWorkoutSessionUseCase,
    @Inject(SAVE_EXERCISE_SET_USE_CASE)
    private readonly saveSetUseCase: SaveExerciseSetUseCase,
    @Inject(FINISH_WORKOUT_SESSION_USE_CASE)
    private readonly finishSessionUseCase: FinishWorkoutSessionUseCase,
    @Inject(GET_WORKOUT_SESSIONS_USE_CASE)
    private readonly getSessionsUseCase: GetWorkoutSessionsUseCase,
    @Inject(GET_WORKOUT_SESSION_BY_ID_USE_CASE)
    private readonly getSessionByIdUseCase: GetWorkoutSessionByIdUseCase,
  ) {}

  @Post('start')
  async startSession(
    @CurrentUser('sub') userId: string,
    @Body() dto: StartWorkoutSessionDto,
  ) {
    return this.startSessionUseCase.execute(userId, dto.workoutId);
  }

  @Post(':sessionId/sets')
  async saveSet(
    @CurrentUser('sub') userId: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: SaveExerciseSetDto,
  ) {
    return this.saveSetUseCase.saveSet(userId, sessionId, dto);
  }

  @Post(':sessionId/finish')
  async finishSession(
    @CurrentUser('sub') userId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.finishSessionUseCase.finishSession(userId, sessionId);
  }

  @Get()
  async getSessions(
    @CurrentUser('sub') userId: string,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    return this.getSessionsUseCase.getWorkoutSessions(userId, limit);
  }

  @Get(':sessionId')
  async getSessionById(
    @CurrentUser('sub') userId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.getSessionByIdUseCase.getSessionById(userId, sessionId);
  }
}
