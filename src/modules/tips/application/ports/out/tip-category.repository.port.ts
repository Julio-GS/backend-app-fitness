import { TipCategory } from 'src/modules/tips/domain/entities/tip-category.entity';
export const TIP_CATEGORY_REPOSITORY = Symbol('TIP_CATEGORY_REPOSITORY');
export interface TipCategoryRepositoryPort {
  findAll(): Promise<TipCategory[]>;
}
