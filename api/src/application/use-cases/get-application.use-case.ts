import { Injectable, NotFoundException } from '@nestjs/common';
import { IApplicationRepository } from '../../domain/repositories/application.repository';
import { Application } from '../../domain/entities/application.entity';

@Injectable()
export class GetApplicationUseCase {
  constructor(private readonly applicationRepository: IApplicationRepository) {}

  async execute(id: string): Promise<Application> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundException(`Solicitud ${id} no encontrada`);
    }
    return application;
  }
}
