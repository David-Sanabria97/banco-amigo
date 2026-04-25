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

export interface AbandonApplicationInput {
  reason: string;
}

@Injectable()
export class AbandonApplicationUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly eventRepository: IApplicationEventRepository,
  ) {}

  async execute(
    id: string,
    input: AbandonApplicationInput,
  ): Promise<Application> {
    const application = await this.applicationRepository.findById(id);

    if (!application) {
      throw new NotFoundException(`Solicitud ${id} no encontrada`);
    }

    if (application.status === ApplicationStatus.FINALIZED) {
      throw new BadRequestException(
        'No se puede abandonar una solicitud ya finalizada',
      );
    }

    const updated: Application = {
      ...application,
      status: ApplicationStatus.ABANDONED,
      updatedAt: new Date().toISOString(),
    };

    await this.applicationRepository.update(updated);

    await this.eventRepository.save({
      id: uuidv4(),
      applicationId: id,
      type: EventType.ABANDONED,
      description: 'Solicitud abandonada',
      metadata: { reason: input.reason },
      createdAt: new Date().toISOString(),
    });

    return updated;
  }
}
