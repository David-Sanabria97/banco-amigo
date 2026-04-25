import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IApplicationRepository } from '../../domain/repositories/application.repository';
import { IApplicationEventRepository } from '../../domain/repositories/application-event.repository';
import { Application } from '../../domain/entities/application.entity';
import { ApplicationStatus } from '../../domain/enums/application-status.enum';
import { ApplicationChannel } from '../../domain/enums/application-channel.enum';
import { EventType } from '../../domain/enums/event-type.enum';

export interface CreateApplicationInput {
  channel: ApplicationChannel;
  documentType: string;
  documentNumber: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  advisorId?: string;
}

@Injectable()
export class CreateApplicationUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly eventRepository: IApplicationEventRepository,
  ) {}

  async execute(input: CreateApplicationInput): Promise<Application> {
    const now = new Date().toISOString();
    const id = uuidv4();

    const application: Application = {
      id,
      status: ApplicationStatus.DRAFT,
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    await this.applicationRepository.save(application);

    await this.eventRepository.save({
      id: uuidv4(),
      applicationId: id,
      type: EventType.CREATED,
      description: 'Solicitud creada',
      metadata: { channel: input.channel },
      createdAt: now,
    });

    return application;
  }
}
