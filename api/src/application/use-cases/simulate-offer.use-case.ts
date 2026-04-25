import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { IApplicationRepository } from '../../domain/repositories/application.repository';
import { IApplicationEventRepository } from '../../domain/repositories/application-event.repository';
import { EventType } from '../../domain/enums/event-type.enum';
import { v4 as uuidv4 } from 'uuid';

export interface SimulationResult {
  viable: boolean;
  monthlyPayment?: number;
  monthlyRate?: number;
  totalAmount?: number;
  message?: string;
}

@Injectable()
export class SimulateOfferUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly eventRepository: IApplicationEventRepository,
  ) {}

  async execute(id: string): Promise<SimulationResult> {
    const application = await this.applicationRepository.findById(id);

    if (!application) {
      throw new NotFoundException(`Solicitud ${id} no encontrada`);
    }

    const income = application.monthlyIncome ?? 0;
    const expenses = application.monthlyExpenses ?? 0;
    const amount = application.requestedAmount ?? 0;
    const term = application.termMonths ?? 36;
    const capacity = income - expenses;
    const monthlyRate = 0.018;
    const now = new Date().toISOString();

    // Fórmula de amortización francesa
    const monthlyPayment = Math.round(
      (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
        (Math.pow(1 + monthlyRate, term) - 1),
    );

    const totalAmount = Math.round(monthlyPayment * term);

    // Error técnico simulado — 10% de probabilidad
    if (Math.random() < 0.1) {
      await this.eventRepository.save({
        id: uuidv4(),
        applicationId: id,
        type: EventType.SIMULATION_ERROR,
        description: 'Error técnico en simulación',
        metadata: {},
        createdAt: now,
      });
      throw new ServiceUnavailableException('SERVICE_UNAVAILABLE');
    }

    // No viable si capacidad < cuota estimada
    if (capacity < monthlyPayment || capacity <= 0) {
      await this.eventRepository.save({
        id: uuidv4(),
        applicationId: id,
        type: EventType.SIMULATION_FAILED,
        description: 'Simulación no viable',
        metadata: { capacity, monthlyPayment },
        createdAt: now,
      });
      return {
        viable: false,
        message:
          'La capacidad de pago no es suficiente para el monto y plazo solicitados.',
      };
    }

    await this.eventRepository.save({
      id: uuidv4(),
      applicationId: id,
      type: EventType.SIMULATION_SUCCESS,
      description: 'Simulación exitosa',
      metadata: { monthlyPayment, monthlyRate, totalAmount },
      createdAt: now,
    });

    return { viable: true, monthlyPayment, monthlyRate, totalAmount };
  }
}
