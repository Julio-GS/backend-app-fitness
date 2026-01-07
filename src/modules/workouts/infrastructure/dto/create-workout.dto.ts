import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWorkoutExerciseDto {
  @IsString()
  @IsNotEmpty()
  exerciseId: string;

  @IsNumber()
  @IsOptional()
  defaultSets?: number;

  @IsNumber()
  @IsOptional()
  defaultReps?: number;

  @IsNumber()
  @IsOptional()
  orderIndex?: number;

  @IsNumber()
  @IsOptional()
  defaultRestTime?: number;
}


export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkoutExerciseDto)
  exercises: CreateWorkoutExerciseDto[];
}
