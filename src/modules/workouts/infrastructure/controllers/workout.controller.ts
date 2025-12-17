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
} from '@nestjs/common';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { CREATE_WORKOUT_USE_CASE, CreateWorkoutUseCase } from '../../application/ports/in/create-workout.use-case';
import { GET_WORKOUTS_USE_CASE, GetWorkoutsUseCase } from '../../application/ports/in/get-workouts.use-case';
import { GET_WORKOUT_BY_ID_USE_CASE, GetWorkoutByIdUseCase } from '../../application/ports/in/get-workout-by-id.use-case';
import { DELETE_WORKOUT_USE_CASE, DeleteWorkoutUseCase } from '../../application/ports/in/delete-workout.use-case';
import { SupabaseAuthGuard } from '../../../../shared/guards/supabase-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { Public } from '../../../../shared/decorators/public.decorator';

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
  ) {}

  @Post()
  async createWorkout(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateWorkoutDto,
  ) {
    return this.createWorkoutUseCase.execute(userId, dto);
  }

  @Get()
  async getWorkouts(
    @CurrentUser('sub') userId: string,
    @Query('isPreset') isPreset?: string,
  ) {
    const isPresetBool = isPreset !== undefined ? isPreset === 'true' : undefined;
    return this.getWorkoutsUseCase.getWorkouts(userId, isPresetBool);
  }

  @Get(':id')
  async getWorkoutById(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.getWorkoutByIdUseCase.execute(id, userId);
  }

  @Delete(':id')
  async deleteWorkout(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    await this.deleteWorkoutUseCase.execute(id, userId);
    return { message: 'Workout deleted successfully' };
  }
}
