import { Workout } from '../../../domain/entities/workout.entity';

export interface GetWorkoutByIdUseCase {
  execute(workoutId: string, userId?: string): Promise<Workout>;
}

export const GET_WORKOUT_BY_ID_USE_CASE = Symbol('GetWorkoutByIdUseCase');
