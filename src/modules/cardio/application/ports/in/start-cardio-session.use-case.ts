export interface StartCardioSessionUseCase {
  execute(params: { userId: string; type: 'running' | 'walking'; startedAt: Date }): Promise<any>;
}
