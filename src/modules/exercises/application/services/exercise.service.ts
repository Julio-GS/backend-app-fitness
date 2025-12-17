import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Exercise } from '../../domain/entities/exercise.entity';
import { CreateCustomExerciseUseCase } from '../ports/in/create-custom-exercise.use-case';
import { GetExercisesUseCase } from '../ports/in/get-exercises.use-case';
import { GetExerciseByIdUseCase } from '../ports/in/get-exercise-by-id.use-case';
import { ExerciseRepositoryPort } from '../ports/out/exercise-repository.port';
/**
 * Servicio de aplicación que implementa los casos de uso de ejercicios
 * Orquesta la lógica de negocio y delega la persistencia al repositorio
 */
@Injectable()
export class ExerciseService
  implements
    CreateCustomExerciseUseCase,
    GetExercisesUseCase,
    GetExerciseByIdUseCase
{
  private readonly logger = new Logger(ExerciseService.name);

  constructor(private readonly exerciseRepository: ExerciseRepositoryPort) {}

  /**
   * Crear ejercicio personalizado
   */
  async createExercise(
    userId: string,
    name: string,
    nameEn: string,
    description: string,
    descriptionEn: string,
    muscleGroup: string,
  ): Promise<Exercise> {
    this.logger.log({
      message: 'Creating custom exercise',
      userId,
      muscleGroup,
    });

    const exercise = new Exercise();
    exercise.name = name;
    exercise.nameEn = nameEn;
    exercise.description = description;
    exercise.descriptionEn = descriptionEn;
    exercise.muscleGroup = muscleGroup;
    exercise.isCustom = true;
    exercise.createdBy = userId;

    const created = await this.exerciseRepository.create(exercise);

    this.logger.log({
      message: 'Custom exercise created successfully',
      exerciseId: created.id,
      userId,
    });

    return created;
  }

  /**
   * Obtener lista de ejercicios
   * - Si se proporciona userId, incluye ejercicios del sistema + ejercicios custom del usuario
   * - Si se proporciona muscleGroup, filtra por grupo muscular
   */
  async getExercises(
    userId?: string,
    muscleGroup?: string,
  ): Promise<Exercise[]> {
    this.logger.log({
      message: 'Fetching exercises',
      userId,
      muscleGroup,
    });

    const exercises = await this.exerciseRepository.findAll(
      userId,
      muscleGroup,
    );

    this.logger.log({
      message: 'Exercises fetched successfully',
      count: exercises.length,
    });

    return exercises;
  }

  /**
   * Obtener ejercicio por ID
   */
  async getExerciseById(id: string): Promise<Exercise> {
    this.logger.log({
      message: 'Fetching exercise by ID',
      exerciseId: id,
    });

    const exercise = await this.exerciseRepository.findById(id);

    if (!exercise) {
      this.logger.warn({
        message: 'Exercise not found',
        exerciseId: id,
      });
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }

    return exercise;
  }
}
