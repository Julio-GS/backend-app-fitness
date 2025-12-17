import { WorkoutSession } from '../../../domain/entities/workout-session.entity';

export interface StartWorkoutSessionUseCase {
  execute(userId: string, workoutId: string): Promise<WorkoutSession>;
}

export const START_WORKOUT_SESSION_USE_CASE = Symbol('StartWorkoutSessionUseCase');
