import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateApplicationUseCase } from '../../application/use-cases/create-application.use-case';
import { GetApplicationUseCase } from '../../application/use-cases/get-application.use-case';
import { ListApplicationsUseCase } from '../../application/use-cases/list-applications.use-case';
import { UpdateApplicationUseCase } from '../../application/use-cases/update-application.use-case';
import { SimulateOfferUseCase } from '../../application/use-cases/simulate-offer.use-case';
import { FinalizeApplicationUseCase } from '../../application/use-cases/finalize-application.use-case';
import { AbandonApplicationUseCase } from '../../application/use-cases/abandon-application.use-case';
import { GetApplicationEventsUseCase } from '../../application/use-cases/get-application-events.use-case';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { AbandonApplicationDto } from '../dto/abandon-application.dto';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly createApplicationUseCase: CreateApplicationUseCase,
    private readonly getApplicationUseCase: GetApplicationUseCase,
    private readonly listApplicationsUseCase: ListApplicationsUseCase,
    private readonly updateApplicationUseCase: UpdateApplicationUseCase,
    private readonly simulateOfferUseCase: SimulateOfferUseCase,
    private readonly finalizeApplicationUseCase: FinalizeApplicationUseCase,
    private readonly abandonApplicationUseCase: AbandonApplicationUseCase,
    private readonly getApplicationEventsUseCase: GetApplicationEventsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear solicitud' })
  async create(@Body() dto: CreateApplicationDto) {
    return this.createApplicationUseCase.execute({
      channel: dto.channel,
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      fullName: dto.fullName,
      phone: dto.phone,
      email: dto.email,
      city: dto.city,
      advisorId: dto.advisorId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Listar solicitudes' })
  async findAll(
    @Query('status') status?: string,
    @Query('channel') channel?: string,
    @Query('search') search?: string,
  ) {
    return this.listApplicationsUseCase.execute({ status, channel, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle' })
  async findOne(@Param('id') id: string) {
    return this.getApplicationUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos' })
  async update(@Param('id') id: string, @Body() dto: UpdateApplicationDto) {
    return this.updateApplicationUseCase.execute(id, dto);
  }

  @Post(':id/simulate-offer')
  @ApiOperation({ summary: 'Simular oferta' })
  async simulateOffer(@Param('id') id: string) {
    try {
      return await this.simulateOfferUseCase.execute(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { error: 'SERVICE_UNAVAILABLE', message: 'Error técnico temporal' },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Post(':id/finalize')
  @ApiOperation({ summary: 'Finalizar solicitud' })
  async finalize(@Param('id') id: string) {
    return this.finalizeApplicationUseCase.execute(id);
  }

  @Post(':id/abandon')
  @ApiOperation({ summary: 'Abandonar solicitud' })
  async abandon(@Param('id') id: string, @Body() dto: AbandonApplicationDto) {
    return this.abandonApplicationUseCase.execute(id, { reason: dto.reason });
  }

  @Get(':id/events')
  @ApiOperation({ summary: 'Obtener eventos' })
  async getEvents(@Param('id') id: string) {
    return this.getApplicationEventsUseCase.execute(id);
  }
}
