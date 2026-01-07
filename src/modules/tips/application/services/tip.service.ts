import { Inject, Injectable } from '@nestjs/common';
import {
  TIP_CATEGORY_REPOSITORY,
  type TipCategoryRepositoryPort,
} from '../ports/out/tip-category.repository.port';
import {
  TIP_REPOSITORY,
  type TipRepositoryPort,
} from '../ports/out/tip.repository.port';

@Injectable()
export class TipService {
  constructor(
    @Inject(TIP_CATEGORY_REPOSITORY)
    private readonly categoryRepo: TipCategoryRepositoryPort,
    @Inject(TIP_REPOSITORY)
    private readonly tipRepo: TipRepositoryPort,
  ) {}

  async getCategories(): Promise<any[]> {
    return this.categoryRepo.findAll();
  }

  async getTipsByCategory(
    categoryId: string,
    language?: string,
  ): Promise<any[]> {
    return this.tipRepo.findByCategory(categoryId, language);
  }
}
