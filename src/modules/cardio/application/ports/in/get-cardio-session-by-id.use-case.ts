export interface GetCardioSessionByIdUseCase {
  execute(params: { sessionId: string; userId: string }): Promise<any>;
}
