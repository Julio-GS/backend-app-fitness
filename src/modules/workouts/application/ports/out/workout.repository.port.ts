import { Workout } from '../../../domain/entities/workout.entity';

export interface WorkoutRepositoryPort {
  findAll(userId: string, isPreset?: boolean): Promise<Workout[]>;
  findById(id: string): Promise<Workout | null>;
  save(workout: Workout): Promise<Workout>;
  delete(id: string): Promise<void>;
}

export const WORKOUT_REPOSITORY_PORT = Symbol('WorkoutRepositoryPort');
