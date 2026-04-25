import { Injectable, NotFoundException } from '@nestjs/common';
import { IApplicationRepository } from '../../domain/repositories/application.repository';
import { IApplicationEventRepository } from '../../domain/repositories/application-event.repository';
import { ApplicationEvent } from '../../domain/entities/application-event.entity';

@Injectable()
export class GetApplicationEventsUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly eventRepository: IApplicationEventRepository,
  ) {}

  async execute(applicationId: string): Promise<ApplicationEvent[]> {
    const application =
      await this.applicationRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundException(`Solicitud ${applicationId} no encontrada`);
    }

    return this.eventRepository.findByApplicationId(applicationId);
  }
}
