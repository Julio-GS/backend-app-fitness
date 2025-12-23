import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Inject,
  UseGuards,
  Put,
} from '@nestjs/common';
import type { CreateWorkoutDto } from '../dto/create-workout.dto';
import type { UpdateWorkoutDto } from '../dto/update-workout.dto';
import {
  CREATE_WORKOUT_USE_CASE,
  type CreateWorkoutUseCase,
} from '../../application/ports/in/create-workout.use-case';
import {
  GET_WORKOUTS_USE_CASE,
  type GetWorkoutsUseCase,
} from '../../application/ports/in/get-workouts.use-case';
import {
  GET_WORKOUT_BY_ID_USE_CASE,
  type GetWorkoutByIdUseCase,
} from '../../application/ports/in/get-workout-by-id.use-case';
import {
  DELETE_WORKOUT_USE_CASE,
  type DeleteWorkoutUseCase,
} from '../../application/ports/in/delete-workout.use-case';
import {
  UPDATE_WORKOUT_USE_CASE,
  type UpdateWorkoutUseCase,
} from '../../application/ports/in/update-workout.use-case';
import {
  GET_WORKOUT_SESSIONS_BY_WORKOUT_ID_USE_CASE,
  type GetWorkoutSessionsByWorkoutIdUseCase,
} from '../../application/ports/in/get-workout-sessions.use-case';
import { SupabaseAuthGuard } from '../../../../shared/guards/supabase-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';

@Controller('workouts')
@UseGuards(SupabaseAuthGuard)
export class WorkoutController {
  constructor(
    @Inject(CREATE_WORKOUT_USE_CASE)
    private readonly createWorkoutUseCase: CreateWorkoutUseCase,
    @Inject(GET_WORKOUTS_USE_CASE)
    private readonly getWorkoutsUseCase: GetWorkoutsUseCase,
    @Inject(GET_WORKOUT_BY_ID_USE_CASE)
    private readonly getWorkoutByIdUseCase: GetWorkoutByIdUseCase,
    @Inject(DELETE_WORKOUT_USE_CASE)
    private readonly deleteWorkoutUseCase: DeleteWorkoutUseCase,
    @Inject(UPDATE_WORKOUT_USE_CASE)
    private readonly updateWorkoutUseCase: UpdateWorkoutUseCase,
    @Inject(GET_WORKOUT_SESSIONS_BY_WORKOUT_ID_USE_CASE)
    private readonly getSessionsByWorkoutIdUseCase: GetWorkoutSessionsByWorkoutIdUseCase,
  ) {}

  @Post()
  async createWorkout(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateWorkoutDto,
  ) {
    return this.createWorkoutUseCase.createWorkout(userId, dto);
  }

  @Get()
  async getWorkouts(
    @CurrentUser('sub') userId: string,
    @Query('isPreset') isPreset?: string,
  ) {
    const isPresetBool =
      isPreset !== undefined ? isPreset === 'true' : undefined;
    return this.getWorkoutsUseCase.getWorkouts(userId, isPresetBool);
  }

  @Get(':id')
  async getWorkoutById(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.getWorkoutByIdUseCase.getWorkoutById(id, userId);
  }

  @Delete(':id')
  async deleteWorkout(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    await this.deleteWorkoutUseCase.deleteWorkout(id, userId);
    return { message: 'Workout deleted successfully' };
  }

  @Put(':id')
  async updateWorkout(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateWorkoutDto,
  ) {
    return this.updateWorkoutUseCase.updateWorkout(id, userId, dto);
  }

  @Get(':id/sessions')
  async getSessionsByWorkoutId(
    @Param('id') workoutId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.getSessionsByWorkoutIdUseCase.getSessionsByWorkoutId(
      userId,
      workoutId,
    );
  }
}

