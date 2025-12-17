import { Workout } from '../../domain/entities/workout.entity';

export interface GetWorkoutsUseCase {
  execute(userId: string, isPreset?: boolean): Promise<Workout[]>;
}

export const GET_WORKOUTS_USE_CASE = Symbol('GetWorkoutsUseCase');
