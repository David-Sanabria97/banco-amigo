import { EventType } from '../enums/event-type.enum';

export class ApplicationEvent {
  id: string;
  applicationId: string;
  type: EventType;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
