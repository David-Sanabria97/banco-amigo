import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IApplicationRepository } from '../../domain/repositories/application.repository';
import { IApplicationEventRepository } from '../../domain/repositories/application-event.repository';
import { Application } from '../../domain/entities/application.entity';
import { ApplicationStatus } from '../../domain/enums/application-status.enum';
import { EventType } from '../../domain/enums/event-type.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FinalizeApplicationUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly eventRepository: IApplicationEventRepository,
  ) {}

  async execute(id: string): Promise<Application> {
    const application = await this.applicationRepository.findById(id);

    if (!application) {
      throw new NotFoundException(`Solicitud ${id} no encontrada`);
    }

    if (application.status === ApplicationStatus.ABANDONED) {
      throw new BadRequestException(
        'No se puede finalizar una solicitud abandonada',
      );
    }

    const updated: Application = {
      ...application,
      status: ApplicationStatus.PENDING_VALIDATION,
      updatedAt: new Date().toISOString(),
    };

    await this.applicationRepository.update(updated);

    await this.eventRepository.save({
      id: uuidv4(),
      applicationId: id,
      type: EventType.FINALIZED,
      description: 'Solicitud finalizada y enviada a validación',
      metadata: {},
      createdAt: new Date().toISOString(),
    });

    return updated;
  }
}
