import { IsString, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MuscleGroup } from '../../domain/enums/muscle-group.enum';

export class CreateExerciseDto {
  @ApiProperty({
    description: 'Nombre del ejercicio en español',
    example: 'Sentadilla con barra',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Nombre del ejercicio en inglés',
    example: 'Barbell Squat',
  })
  @IsString()
  @MinLength(3)
  nameEn: string;

  @ApiProperty({
    description: 'Descripción del ejercicio en español',
    example: 'Ejercicio compuesto para piernas',
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({
    description: 'Descripción del ejercicio en inglés',
    example: 'Compound exercise for legs',
  })
  @IsString()
  @MinLength(10)
  descriptionEn: string;

  @ApiProperty({
    description: 'Grupo muscular',
    enum: MuscleGroup,
    example: MuscleGroup.PIERNA,
  })
  @IsEnum(MuscleGroup)
  muscleGroup: MuscleGroup;
}
