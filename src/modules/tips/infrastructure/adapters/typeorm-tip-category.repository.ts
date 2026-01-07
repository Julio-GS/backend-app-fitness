import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipCategory } from '../../domain/entities/tip-category.entity';
import { TipCategoryRepositoryPort } from '../../application/ports/out/tip-category.repository.port';

@Injectable()
export class TypeOrmTipCategoryRepository implements TipCategoryRepositoryPort {
  constructor(
    @InjectRepository(TipCategory)
    private readonly repo: Repository<TipCategory>,
  ) {}

  async findAll(): Promise<TipCategory[]> {
    return this.repo.find({ relations: ['tips'] });
  }
}
