import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tip } from '../../domain/entities/tip.entity';
import { TipRepositoryPort } from '../../application/ports/out/tip.repository.port';

@Injectable()
export class TypeOrmTipRepository implements TipRepositoryPort {
  constructor(
    @InjectRepository(Tip)
    private readonly repo: Repository<Tip>
  ) {}

  async findByCategory(categoryId: string, language?: string): Promise<Tip[]> {
    // Filtra por idioma si es necesario
    const select = this.repo.createQueryBuilder('tip')
      .where('tip.categoryId = :categoryId', { categoryId });
    if (language === 'en') {
      select.addSelect(['tip.titleEn', 'tip.contentEn']);
    } else {
      select.addSelect(['tip.title', 'tip.content']);
    }
    return select.getMany();
  }
}
