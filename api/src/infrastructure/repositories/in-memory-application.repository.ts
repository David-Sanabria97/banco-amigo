import { Injectable } from '@nestjs/common';
import { Application } from '../../domain/entities/application.entity';
import {
  IApplicationRepository,
  ApplicationFilters,
} from '../../domain/repositories/application.repository';

@Injectable()
export class InMemoryApplicationRepository implements IApplicationRepository {
  private store = new Map<string, Application>();

  async save(application: Application): Promise<Application> {
    this.store.set(application.id, application);
    return application;
  }

  async findById(id: string): Promise<Application | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(filters?: ApplicationFilters): Promise<Application[]> {
    let result = Array.from(this.store.values());

    if (filters?.status) {
      result = result.filter((a) => a.status === filters.status);
    }
    if (filters?.channel) {
      result = result.filter((a) => a.channel === filters.channel);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) || a.documentNumber.includes(q),
      );
    }

    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async update(application: Application): Promise<Application> {
    this.store.set(application.id, application);
    return application;
  }
}
