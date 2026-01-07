import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutCategoryRepositoryPort } from '../../application/ports/out/workout-category.repository.port';
import { WorkoutCategory } from '../../domain/entities/workout-category.entity';

@Injectable()
export class TypeOrmWorkoutCategoryRepository implements WorkoutCategoryRepositoryPort {
  constructor(
    @InjectRepository(WorkoutCategory)
    private readonly repository: Repository<WorkoutCategory>,
  ) {}

  async findAll(): Promise<WorkoutCategory[]> {
    return this.repository.find({
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<WorkoutCategory | null> {
    return this.repository.findOne({ where: { id } });
  }
}
