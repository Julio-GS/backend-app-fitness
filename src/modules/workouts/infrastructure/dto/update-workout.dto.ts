import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateWorkoutExerciseDto {
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


export class UpdateWorkoutDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateWorkoutExerciseDto)
  @IsOptional()
  exercises?: UpdateWorkoutExerciseDto[];
}
