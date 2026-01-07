import { Tip } from 'src/modules/tips/domain/entities/tip.entity';

export const TIP_REPOSITORY = Symbol('TIP_REPOSITORY');

export interface TipRepositoryPort {
  findByCategory(categoryId: string, language?: string): Promise<Tip[]>;
}
