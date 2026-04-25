import { Injectable } from '@nestjs/common';
import {
  IApplicationRepository,
  ApplicationFilters,
} from '../../domain/repositories/application.repository';
import { Application } from '../../domain/entities/application.entity';

@Injectable()
export class ListApplicationsUseCase {
  constructor(private readonly applicationRepository: IApplicationRepository) {}

  async execute(filters?: ApplicationFilters): Promise<Application[]> {
    return this.applicationRepository.findAll(filters);
  }
}
