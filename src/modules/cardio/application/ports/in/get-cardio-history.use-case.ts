export interface GetCardioHistoryUseCase {
  execute(params: { userId: string; type?: 'running' | 'walking'; from?: Date; limit?: number }): Promise<any[]>;
}
