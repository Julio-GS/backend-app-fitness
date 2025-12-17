import { WorkoutSession } from '../../../domain/entities/workout-session.entity';

export interface GetWorkoutSessionsUseCase {
  getWorkoutSessions(userId: string, limit?: number): Promise<WorkoutSession[]>;
}

export const GET_WORKOUT_SESSIONS_USE_CASE = Symbol('GetWorkoutSessionsUseCase');
