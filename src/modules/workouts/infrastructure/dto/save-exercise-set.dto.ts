import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class SaveExerciseSetDto {
  @IsString()
  @IsNotEmpty()
  exerciseId: string;

  @IsNumber()
  @Min(1)
  setNumber: number;

  @IsNumber()
  @IsOptional()
  weightKg?: number;

  @IsNumber()
  @IsOptional()
  reps?: number;
}
