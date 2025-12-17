import { IsString, IsNotEmpty } from 'class-validator';

export class StartWorkoutSessionDto {
  @IsString()
  @IsNotEmpty()
  workoutId: string;
}
