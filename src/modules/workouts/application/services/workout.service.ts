import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateWorkoutUseCase, CREATE_WORKOUT_USE_CASE } from '../ports/in/create-workout.use-case';
import { GetWorkoutsUseCase, GET_WORKOUTS_USE_CASE } from '../ports/in/get-workouts.use-case';
import { GetWorkoutByIdUseCase, GET_WORKOUT_BY_ID_USE_CASE } from '../ports/in/get-workout-by-id.use-case';
import { DeleteWorkoutUseCase, DELETE_WORKOUT_USE_CASE } from '../ports/in/delete-workout.use-case';
import { WorkoutRepositoryPort, WORKOUT_REPOSITORY_PORT } from '../ports/out/workout.repository.port';
import { WorkoutCategoryRepositoryPort, WORKOUT_CATEGORY_REPOSITORY_PORT } from '../ports/out/workout-category.repository.port';
import { CreateWorkoutDto } from '../../infrastructure/dto/create-workout.dto';
import { Workout } from '../../domain/entities/workout.entity';
import { WorkoutExercise } from '../../domain/entities/workout-exercise.entity';

@Injectable()
export class WorkoutService 
  implements 
    CreateWorkoutUseCase, 
    GetWorkoutsUseCase, 
    GetWorkoutByIdUseCase,
    DeleteWorkoutUseCase {
  
  constructor(
    @Inject(WORKOUT_REPOSITORY_PORT)
    private readonly workoutRepository: WorkoutRepositoryPort,
    @Inject(WORKOUT_CATEGORY_REPOSITORY_PORT)
    private readonly categoryRepository: WorkoutCategoryRepositoryPort,
  ) {}

  async execute(userId: string, dto: CreateWorkoutDto): Promise<Workout> {
    // Verificar que la categoría existe
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) {
      throw new NotFoundException(`Category with id ${dto.categoryId} not found`);
    }

    // Crear la rutina
    const workout = new Workout();
    workout.name = dto.name;
    workout.description = dto.description;
    workout.userId = userId;
    workout.category = category;
    workout.isPreset = false; // Las rutinas creadas por usuarios nunca son preset

    // Crear los ejercicios de la rutina
    workout.exercises = dto.exercises.map((ex, index) => {
      const workoutExercise = new WorkoutExercise();
      workoutExercise.exerciseId = ex.exerciseId;
      workoutExercise.sets = ex.sets;
      workoutExercise.reps = ex.reps;
      workoutExercise.order = ex.order ?? index;
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

    // Si es preset, cualquiera puede verlo
    if (workout.isPreset) {
      return workout;
    }

    // Si no es preset, verificar que pertenece al usuario
    if (workout.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this workout');
    }

    return workout;
  }

  async deleteWorkout(workoutId: string, userId: string): Promise<void> {
    const workout = await this.workoutRepository.findById(workoutId);
    
    if (!workout) {
      throw new NotFoundException(`Workout with id ${workoutId} not found`);
    }

    // No se pueden borrar presets
    if (workout.isPreset) {
      throw new ForbiddenException('Cannot delete preset workouts');
    }

    // Verificar que pertenece al usuario
    if (workout.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this workout');
    }

    await this.workoutRepository.delete(workoutId);
  }
}
