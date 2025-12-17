import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../../domain/entities/exercise.entity';
import { ExerciseRepositoryPort } from '../../application/ports/out/exercise-repository.port';

/**
 * Adaptador de infraestructura que implementa el port de repositorio
 * usando TypeORM como ORM para persistencia en PostgreSQL
 */
@Injectable()
export class TypeOrmExerciseRepository implements ExerciseRepositoryPort {
  private readonly logger = new Logger(TypeOrmExerciseRepository.name);

  constructor(
    @InjectRepository(Exercise)
    private readonly repository: Repository<Exercise>,
  ) {}

  /**
   * Obtener todos los ejercicios
   * - Si userId es proporcionado: ejercicios del sistema (isCustom = false) + ejercicios custom del usuario
   * - Si muscleGroup es proporcionado: filtrar por grupo muscular
   */
  async findAll(userId?: string, muscleGroup?: string): Promise<Exercise[]> {
    const queryBuilder = this.repository.createQueryBuilder('exercise');

    // Filtro: ejercicios del sistema O ejercicios custom del usuario
    if (userId) {
      queryBuilder.where(
        '(exercise.isCustom = :isCustom OR exercise.createdBy = :userId)',
        { isCustom: false, userId },
      );
    } else {
      // Si no hay userId, solo ejercicios del sistema
      queryBuilder.where('exercise.isCustom = :isCustom', { isCustom: false });
    }

    // Filtro por grupo muscular
    if (muscleGroup) {
      queryBuilder.andWhere('exercise.muscleGroup = :muscleGroup', {
        muscleGroup,
      });
    }

    queryBuilder.orderBy('exercise.name', 'ASC');

    const exercises = await queryBuilder.getMany();

    this.logger.log({
      message: 'Exercises retrieved from database',
      count: exercises.length,
      userId,
      muscleGroup,
    });

    return exercises;
  }

  /**
   * Buscar ejercicio por ID
   */
  async findById(id: string): Promise<Exercise | null> {
    const exercise = await this.repository.findOne({ where: { id } });

    this.logger.log({
      message: 'Exercise retrieved by ID',
      exerciseId: id,
      found: !!exercise,
    });

    return exercise;
  }

  /**
   * Crear un nuevo ejercicio
   */
  async create(exercise: Exercise): Promise<Exercise> {
    const created = this.repository.create(exercise);
    const saved = await this.repository.save(created);

    this.logger.log({
      message: 'Exercise created in database',
      exerciseId: saved.id,
      isCustom: saved.isCustom,
    });

    return saved;
  }

  /**
   * Crear múltiples ejercicios (para seed)
   */
  async bulkCreate(exercises: Exercise[]): Promise<Exercise[]> {
    const created = this.repository.create(exercises);
    const saved = await this.repository.save(created);

    this.logger.log({
      message: 'Exercises bulk created in database',
      count: saved.length,
    });

    return saved;
  }
}
