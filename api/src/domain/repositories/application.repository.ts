import { Application } from '../entities/application.entity';

export interface ApplicationFilters {
  status?: string;
  channel?: string;
  search?: string;
}

export abstract class IApplicationRepository {
  abstract save(application: Application): Promise<Application>;
  abstract findById(id: string): Promise<Application | null>;
  abstract findAll(filters?: ApplicationFilters): Promise<Application[]>;
  abstract update(application: Application): Promise<Application>;
}
