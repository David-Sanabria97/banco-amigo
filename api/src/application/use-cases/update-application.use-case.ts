import { Injectable, BadRequestException } from '@nestjs/common';
import { IApplicationRepository } from '../../domain/repositories/application.repository';
import { IApplicationEventRepository } from '../../domain/repositories/application-event.repository';
import { Application } from '../../domain/entities/application.entity';
import { ApplicationStatus } from '../../domain/enums/application-status.enum';
import { ApplicationChannel } from '../../domain/enums/application-channel.enum';
import { EventType } from '../../domain/enums/event-type.enum';
import { v4 as uuidv4 } from 'uuid';

export interface UpdateApplicationInput {
  channel?: string;
  documentType?: string;
  documentNumber?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  city?: string;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  requestedAmount?: number;
  termMonths?: number;
  loanPurpose?: string;
  dataConsentAccepted?: boolean;
}

@Injectable()
export class UpdateApplicationUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly eventRepository: IApplicationEventRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateApplicationInput,
  ): Promise<Application> {
    const application = await this.applicationRepository.findById(id);

    if (!application) {
      throw new BadRequestException(`Solicitud ${id} no encontrada`);
    }

    if (
      application.status === ApplicationStatus.FINALIZED ||
      application.status === ApplicationStatus.ABANDONED
    ) {
      throw new BadRequestException(
        'No se puede editar una solicitud finalizada o abandonada',
      );
    }

    const updated: Application = {
      ...application,
      ...(input.channel && { channel: input.channel as ApplicationChannel }),
      ...(input.documentType && { documentType: input.documentType }),
      ...(input.documentNumber && { documentNumber: input.documentNumber }),
      ...(input.fullName && { fullName: input.fullName }),
      ...(input.phone && { phone: input.phone }),
      ...(input.email && { email: input.email }),
      ...(input.city && { city: input.city }),
      ...(input.monthlyIncome !== undefined && {
        monthlyIncome: input.monthlyIncome,
      }),
      ...(input.monthlyExpenses !== undefined && {
        monthlyExpenses: input.monthlyExpenses,
      }),
      ...(input.requestedAmount !== undefined && {
        requestedAmount: input.requestedAmount,
      }),
      ...(input.termMonths !== undefined && { termMonths: input.termMonths }),
      ...(input.loanPurpose && { loanPurpose: input.loanPurpose }),
      ...(input.dataConsentAccepted !== undefined && {
        dataConsentAccepted: input.dataConsentAccepted,
      }),
      updatedAt: new Date().toISOString(),
    };

    await this.applicationRepository.update(updated);

    await this.eventRepository.save({
      id: uuidv4(),
      applicationId: id,
      type: EventType.UPDATED,
      description: 'Datos actualizados',
      metadata: {},
      createdAt: new Date().toISOString(),
    });

    return updated;
  }
}
