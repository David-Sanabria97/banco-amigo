import { ApplicationEvent } from '../entities/application-event.entity';

export abstract class IApplicationEventRepository {
  abstract save(event: ApplicationEvent): Promise<ApplicationEvent>;
  abstract findByApplicationId(
    applicationId: string,
  ): Promise<ApplicationEvent[]>;
}
