export interface GetTipsByCategoryUseCase {
  execute(params: { categoryId: string; language?: string }): Promise<any[]>;
}
