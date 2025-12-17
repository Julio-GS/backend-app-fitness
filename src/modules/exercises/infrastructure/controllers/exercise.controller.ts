import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ExerciseService } from '../../application/services/exercise.service';
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { Public } from '../../../../shared/decorators/public.decorator';
import { MuscleGroup } from '../../domain/enums/muscle-group.enum';

/**
 * Controller de infraestructura para endpoints de ejercicios
 */
@ApiTags('exercises')
@Controller('exercises')
export class ExerciseController {
  private readonly logger = new Logger(ExerciseController.name);

  constructor(private readonly exerciseService: ExerciseService) {}

  /**
   * GET /exercises - Listar ejercicios (público)
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar ejercicios disponibles' })
  @ApiQuery({
    name: 'muscleGroup',
    required: false,
    enum: MuscleGroup,
    description: 'Filtrar por grupo muscular',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ejercicios',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid' },
          name: { type: 'string', example: 'Sentadilla con barra' },
          nameEn: { type: 'string', example: 'Barbell Squat' },
          description: { type: 'string' },
          descriptionEn: { type: 'string' },
          muscleGroup: { type: 'string', example: 'piernas' },
          imageUrl: { type: 'string', nullable: true },
          isCustom: { type: 'boolean', example: false },
          createdBy: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getExercises(
    @Query('muscleGroup') muscleGroup?: MuscleGroup,
    @CurrentUser() user?: { id: string },
  ) {
    this.logger.log({
      message: 'GET /exercises',
      muscleGroup,
      userId: user?.id,
    });

    return this.exerciseService.getExercises(user?.id, muscleGroup);
  }

  /**
   * GET /exercises/:id - Obtener ejercicio por ID (público)
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener ejercicio por ID' })
  @ApiResponse({
    status: 200,
    description: 'Ejercicio encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Ejercicio no encontrado',
  })
  async getExerciseById(@Param('id') id: string) {
    this.logger.log({
      message: 'GET /exercises/:id',
      exerciseId: id,
    });

    return this.exerciseService.getExerciseById(id);
  }

  /**
   * POST /exercises - Crear ejercicio personalizado (autenticado)
   */
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Crear ejercicio personalizado' })
  @ApiResponse({
    status: 201,
    description: 'Ejercicio creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async createCustomExercise(
    @Body() dto: CreateExerciseDto,
    @CurrentUser() user: { id: string },
  ) {
    this.logger.log({
      message: 'POST /exercises',
      userId: user.id,
      muscleGroup: dto.muscleGroup,
    });

    return this.exerciseService.createExercise(
      user.id,
      dto.name,
      dto.nameEn,
      dto.description,
      dto.descriptionEn,
      dto.muscleGroup,
    );
  }
}
