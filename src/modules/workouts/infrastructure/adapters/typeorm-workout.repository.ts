import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutRepositoryPort } from '../../application/ports/out/workout.repository.port';
import { Workout } from '../../domain/entities/workout.entity';

@Injectable()
export class TypeOrmWorkoutRepository implements WorkoutRepositoryPort {
  constructor(
    @InjectRepository(Workout)
    private readonly repository: Repository<Workout>,
  ) {}

  async findAll(userId: string, isPreset?: boolean): Promise<Workout[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('workout')
      .leftJoinAndSelect('workout.category', 'category')
      .leftJoinAndSelect('workout.exercises', 'exercises')
      .leftJoinAndSelect('exercises.exercise', 'exercise')
      .orderBy('workout.createdAt', 'DESC')
      .addOrderBy('exercises.order', 'ASC');

    if (isPreset !== undefined) {
      queryBuilder.andWhere('workout.isPreset = :isPreset', { isPreset });
    } else {
      // Si no se especifica, traer presets o las del usuario
      queryBuilder.andWhere('(workout.isPreset = true OR workout.userId = :userId)', { userId });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<Workout | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['category', 'exercises', 'exercises.exercise'],
      order: {
        exercises: {
          order: 'ASC',
        },
      },
    });
  }

  async save(workout: Workout): Promise<Workout> {
    return this.repository.save(workout);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
