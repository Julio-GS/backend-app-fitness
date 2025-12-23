import { WorkoutSession } from '../../../domain/entities/workout-session.entity';

export interface GetWorkoutSessionsUseCase {
  getWorkoutSessions(userId: string, limit?: number): Promise<WorkoutSession[]>;
}
export interface GetWorkoutSessionsByWorkoutIdUseCase {
  getSessionsByWorkoutId(
    userId: string,
    workoutId: string,
  ): Promise<WorkoutSession[]>;
}

export const GET_WORKOUT_SESSIONS_USE_CASE = Symbol(
  'GetWorkoutSessionsUseCase',
);

export const GET_WORKOUT_SESSIONS_BY_WORKOUT_ID_USE_CASE = Symbol(
  'GetWorkoutSessionsByWorkoutIdUseCase',
);
