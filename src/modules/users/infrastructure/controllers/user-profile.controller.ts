import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Query,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserProfileService } from '../../application/services/user-profile.service';
import { UpdateProfileCommand } from '../../application/ports/in/update-profile.use-case';
import { AddWeightEntryCommand } from '../../application/ports/in/add-weight-entry.use-case';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UserProfileController {
  private readonly logger = new Logger(UserProfileController.name);

  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        age: { type: 'number', nullable: true },
        height: { type: 'number', nullable: true },
        weight: { type: 'number', nullable: true },
        gender: { type: 'string', nullable: true },
        yearsTraining: { type: 'number', nullable: true },
        weightGoal: { type: 'number', nullable: true },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  async getProfile(@CurrentUser() user: { id: string }) {
    this.logger.log({ message: 'Get profile request', userId: user.id });
    const profile = await this.userProfileService.getProfile(user.id);

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return profile;
  }

  @Put('profile')
  @ApiOperation({ summary: 'Actualizar o crear perfil del usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Juan Pérez' },
        age: { type: 'number', example: 28 },
        height: { type: 'number', example: 175 },
        weight: { type: 'number', example: 80 },
        gender: {
          type: 'string',
          example: 'male',
          enum: ['male', 'female', 'other'],
        },
        yearsTraining: { type: 'number', example: 3 },
        weightGoal: { type: 'number', example: 75 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  async updateProfile(
    @CurrentUser() user: { id: string },
    @Body()
    body: {
      name?: string;
      age?: number;
      height?: number;
      weight?: number;
      gender?: string;
      yearsTraining?: number;
      weightGoal?: number;
    },
  ) {
    try {
      this.logger.log({ message: 'Update profile request', userId: user.id });
      const command = new UpdateProfileCommand(
        user.id,
        body.name,
        body.age,
        body.height,
        body.weight,
        body.gender,
        body.yearsTraining,
        body.weightGoal,
      );

      const result = await this.userProfileService.updateProfile(command);
      this.logger.log({
        message: 'Profile updated successfully',
        userId: user.id,
      });
      return result;
    } catch (e) {
      this.logger.error({
        message: 'Failed to update profile',
        userId: user.id,
        error: e instanceof Error ? e.message : 'Unknown error',
      });
      throw new HttpException(
        'Failed to update profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('weight')
  @ApiOperation({ summary: 'Agregar entrada de peso' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        weightKg: { type: 'number', example: 78.5 },
        recordedAt: { type: 'string', format: 'date-time', nullable: true },
      },
      required: ['weightKg'],
    },
  })
  @ApiResponse({ status: 201, description: 'Entrada de peso creada' })
  async addWeight(
    @CurrentUser() user: { id: string },
    @Body() body: { weightKg: number; recordedAt?: string },
  ) {
    try {
      this.logger.log({ message: 'Add weight entry request', userId: user.id });
      const command = new AddWeightEntryCommand(
        user.id,
        body.weightKg,
        body.recordedAt ? new Date(body.recordedAt) : undefined,
      );

      const result = await this.userProfileService.addWeightEntry(command);
      this.logger.log({ message: 'Weight entry added', userId: user.id });
      return result;
    } catch (e) {
      this.logger.error({
        message: 'Failed to add weight entry',
        userId: user.id,
        error: e instanceof Error ? e.message : 'Unknown error',
      });
      throw new HttpException(
        'Failed to add weight entry',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('weight-history')
  @ApiOperation({ summary: 'Obtener historial de peso' })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: 'Fecha inicio (ISO 8601)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: 'Fecha fin (ISO 8601)',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial de peso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              weightKg: { type: 'number' },
              recordedAt: { type: 'string' },
            },
          },
        },
      },
    },
  })
  async getWeightHistory(
    @CurrentUser() user: { id: string },
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    this.logger.log({ message: 'Get weight history request', userId: user.id });
    const history = await this.userProfileService.getWeightHistory(
      user.id,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );

    return { data: history };
  }
}
