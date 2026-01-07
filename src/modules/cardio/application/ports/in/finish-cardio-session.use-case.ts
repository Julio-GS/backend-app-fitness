export interface FinishCardioSessionUseCase {
  execute(params: { sessionId: string; finishedAt: Date; distanceMeters?: number; steps?: number; routePolyline?: string }): Promise<any>;
}
