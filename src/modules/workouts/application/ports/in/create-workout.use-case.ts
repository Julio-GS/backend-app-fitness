import { CreateWorkoutDto } from '../../../infrastructure/dto/create-workout.dto';
import { Workout } from '../../../domain/entities/workout.entity';

export interface CreateWorkoutUseCase {
  createWorkout(userId: string, dto: CreateWorkoutDto): Promise<Workout>;
}

export const CREATE_WORKOUT_USE_CASE = Symbol('CreateWorkoutUseCase');
