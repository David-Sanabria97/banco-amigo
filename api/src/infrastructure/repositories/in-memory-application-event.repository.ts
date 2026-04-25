import { Injectable } from '@nestjs/common';
import { ApplicationEvent } from '../../domain/entities/application-event.entity';
import { IApplicationEventRepository } from '../../domain/repositories/application-event.repository';

@Injectable()
export class InMemoryApplicationEventRepository implements IApplicationEventRepository {
  private store = new Map<string, ApplicationEvent[]>();

  async save(event: ApplicationEvent): Promise<ApplicationEvent> {
    const existing = this.store.get(event.applicationId) ?? [];
    this.store.set(event.applicationId, [...existing, event]);
    return event;
  }

  async findByApplicationId(
    applicationId: string,
  ): Promise<ApplicationEvent[]> {
    return this.store.get(applicationId) ?? [];
  }
}
