import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class SaveExerciseSetDto {
  @IsString()
  @IsNotEmpty()
  exerciseId: string;

  @IsNumber()
  @Min(1)
  setNumber: number;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsNumber()
  @Min(1)
  reps: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
