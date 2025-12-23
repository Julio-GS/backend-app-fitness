import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import type { CreateWorkoutUseCase } from '../ports/in/create-workout.use-case';
import type { GetWorkoutsUseCase } from '../ports/in/get-workouts.use-case';
import type { GetWorkoutByIdUseCase } from '../ports/in/get-workout-by-id.use-case';
import type { DeleteWorkoutUseCase } from '../ports/in/delete-workout.use-case';
import type { UpdateWorkoutUseCase } from '../ports/in/update-workout.use-case';
import type { WorkoutRepositoryPort } from '../ports/out/workout.repository.port';
import { WORKOUT_REPOSITORY_PORT } from '../ports/out/workout.repository.port';
import type { WorkoutCategoryRepositoryPort } from '../ports/out/workout-category.repository.port';
import { WORKOUT_CATEGORY_REPOSITORY_PORT } from '../ports/out/workout-category.repository.port';
import type { CreateWorkoutDto } from '../../infrastructure/dto/create-workout.dto';
import { Workout } from '../../domain/entities/workout.entity';
import { WorkoutExercise } from '../../domain/entities/workout-exercise.entity';
import type { UpdateWorkoutDto } from '../../infrastructure/dto/update-workout.dto';

@Injectable()
export class WorkoutService
  implements
    CreateWorkoutUseCase,
    GetWorkoutsUseCase,
    GetWorkoutByIdUseCase,
    DeleteWorkoutUseCase,
    UpdateWorkoutUseCase
{
  constructor(
    @Inject(WORKOUT_REPOSITORY_PORT)
    private readonly workoutRepository: WorkoutRepositoryPort,
    @Inject(WORKOUT_CATEGORY_REPOSITORY_PORT)
    private readonly categoryRepository: WorkoutCategoryRepositoryPort,
  ) {}

  async createWorkout(
    userId: string,
    dto: CreateWorkoutDto,
  ): Promise<Workout> {
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) {
      throw new NotFoundException(
        `Category with id ${dto.categoryId} not found`,
      );
    }

    const workout = new Workout();
    workout.name = dto.name;
    workout.createdBy = userId;
    workout.category = category;
    workout.isPreset = false;

    workout.exercises = dto.exercises.map((ex, index) => {
      const workoutExercise = new WorkoutExercise();
      workoutExercise.exerciseId = ex.exerciseId;
      workoutExercise.defaultSets = ex.defaultSets;
      workoutExercise.defaultReps = ex.defaultReps;
      workoutExercise.orderIndex = ex.orderIndex ?? index;
      workoutExercise.defaultRestTime = ex.defaultRestTime;
      return workoutExercise;
    });

    return this.workoutRepository.save(workout);
  }

  async getWorkouts(userId: string, isPreset?: boolean): Promise<Workout[]> {
    return this.workoutRepository.findAll(userId, isPreset);
  }

  async getWorkoutById(workoutId: string, userId?: string): Promise<Workout> {
    const workout = await this.workoutRepository.findById(workoutId);

    if (!workout) {
      throw new NotFoundException(`Workout with id ${workoutId} not found`);
    }

    if (workout.isPreset) {
      return workout;
    }

    if (workout.createdBy !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this workout',
      );
    }

    return workout;
  }

  async deleteWorkout(workoutId: string, userId: string): Promise<void> {
    const workout = await this.workoutRepository.findById(workoutId);

    if (!workout) {
      throw new NotFoundException(`Workout with id ${workoutId} not found`);
    }

    if (workout.isPreset) {
      throw new ForbiddenException('Cannot delete preset workouts');
    }

    if (workout.createdBy !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this workout',
      );
    }

    await this.workoutRepository.delete(workoutId);
  }

  async updateWorkout(
    workoutId: string,
    userId: string,
    dto: UpdateWorkoutDto,
  ): Promise<Workout> {
    const workout = await this.workoutRepository.findById(workoutId);

    if (!workout) {
      throw new NotFoundException(`Workout with id ${workoutId} not found`);
    }

    if (workout.createdBy !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this workout',
      );
    }

    // Update properties
    workout.name = dto.name ?? workout.name;

    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category) {
        throw new NotFoundException(
          `Category with id ${dto.categoryId} not found`,
        );
      }
      workout.category = category;
    }

    // Update exercises
    if (dto.exercises) {
      // For simplicity, we'll clear and re-add exercises.
      // A more robust implementation would diff the changes.
      workout.exercises = dto.exercises.map((ex, index) => {
        const workoutExercise = new WorkoutExercise();
        workoutExercise.exerciseId = ex.exerciseId;
        workoutExercise.defaultSets = ex.defaultSets;
        workoutExercise.defaultReps = ex.defaultReps;
        workoutExercise.orderIndex = ex.orderIndex ?? index;
        workoutExercise.defaultRestTime = ex.defaultRestTime;
        return workoutExercise;
      });
    }

    return this.workoutRepository.save(workout);
  }
}
