import { Workout } from 'src/modules/workouts/domain/entities/workout.entity';
import { UpdateWorkoutDto } from 'src/modules/workouts/infrastructure/dto/update-workout.dto';

export interface UpdateWorkoutUseCase {
  updateWorkout(
    workoutId: string,
    userId: string,
    dto: UpdateWorkoutDto,
  ): Promise<Workout>;
}

export const UPDATE_WORKOUT_USE_CASE = Symbol('UpdateWorkoutUseCase');
